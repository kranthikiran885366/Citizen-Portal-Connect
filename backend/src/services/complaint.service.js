import {
  createComplaint, findComplaintById, findComplaintByNumber,
  getComplaintTimeline, getComplaints, updateComplaintStatus,
  assignOfficer, rateComplaint, getSLABreaches, rejectComplaint,
  getComplaintCountByDateRange
} from "../repositories/complaint.repository.js";
import { createNotification } from "../repositories/notification.repository.js";
import { createAuditLog } from "../repositories/audit.repository.js";
import { getOfficerById, getOfficerByUserId } from "../repositories/officer.repository.js";
import { getSystemSetting } from "../repositories/user.repository.js";

const VALID_STATUS_TRANSITIONS = {
  pending: ["acknowledged", "rejected"],
  acknowledged: ["in-progress", "rejected"],
  "in-progress": ["resolved", "rejected"],
  resolved: ["closed"],
  closed: [],
  rejected: [],
};

export const fileComplaint = async (data, citizenId, ipAddress, userAgent) => {
  const maxPerDay = parseInt(await getSystemSetting("max_complaints_per_day") || "10");
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = await getComplaintCountByDateRange(citizenId, todayStart);
  if (todayCount >= maxPerDay) {
    throw { status: 429, message: `You can file a maximum of ${maxPerDay} complaints per day` };
  }

  const complaint = await createComplaint({ ...data, citizen_id: citizenId });

  await createNotification({
    userId: citizenId,
    title: "Complaint Submitted Successfully",
    message: `Your complaint "${complaint.title}" has been registered as ${complaint.complaint_number}. You will receive updates as it progresses.`,
    type: "success",
    complaintId: complaint.id,
  });

  await createAuditLog({
    action: `Complaint ${complaint.complaint_number} filed by citizen ID ${citizenId}`,
    entityType: "complaint",
    entityId: complaint.id,
    performedBy: citizenId,
    role: "citizen",
    ipAddress,
    userAgent,
  });

  return complaint;
};

export const getComplaintDetails = async (id, requestingUser) => {
  const complaint = await findComplaintById(id);
  if (!complaint) throw { status: 404, message: "Complaint not found" };

  if (requestingUser.role === "citizen" && complaint.citizen_id !== requestingUser.id) {
    throw { status: 403, message: "Access denied" };
  }
  if (requestingUser.role === "officer") {
    const officer = await getOfficerByUserId(requestingUser.id);
    if (!officer || complaint.officer_id !== officer.id) {
      throw { status: 403, message: "This complaint is not assigned to you" };
    }
  }

  const timeline = await getComplaintTimeline(id);
  return { ...complaint, timeline };
};

export const trackComplaintByNumber = async (number) => {
  const complaint = await findComplaintByNumber(number);
  if (!complaint) throw { status: 404, message: "No complaint found with this ID. Please verify and try again." };
  const timeline = await getComplaintTimeline(complaint.id);
  return { ...complaint, timeline };
};

export const listComplaints = async (filters) => {
  return await getComplaints(filters);
};

export const changeComplaintStatus = async (complaintId, status, note, updatedBy, role, ipAddress, userAgent) => {
  const complaint = await findComplaintById(complaintId);
  if (!complaint) throw { status: 404, message: "Complaint not found" };

  const allowed = VALID_STATUS_TRANSITIONS[complaint.status];
  if (!allowed.includes(status)) {
    throw { status: 400, message: `Cannot transition from '${complaint.status}' to '${status}'. Allowed: ${allowed.join(", ") || "none"}` };
  }

  if (role === "officer") {
    const officer = await getOfficerByUserId(updatedBy);
    if (!officer || complaint.officer_id !== officer.id) {
      throw { status: 403, message: "You can only update complaints assigned to you" };
    }
    if (status === "rejected") throw { status: 403, message: "Officers cannot reject complaints" };
  }

  const updated = await updateComplaintStatus(complaintId, status, note, updatedBy);

  const notifType = status === "resolved" ? "success" : status === "rejected" ? "error" : "info";
  await createNotification({
    userId: complaint.citizen_id,
    title: `Complaint ${complaint.complaint_number} — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: note || `Your complaint status has been updated to "${status}".`,
    type: notifType,
    complaintId: complaintId,
  });

  if (complaint.officer_id && status === "resolved") {
    const officer = await getOfficerById(complaint.officer_id);
    if (officer) {
      await createNotification({
        userId: officer.user_id,
        title: "Complaint Resolved",
        message: `Complaint ${complaint.complaint_number} has been marked as resolved.`,
        type: "success",
        complaintId: complaintId,
      });
    }
  }

  await createAuditLog({
    action: `Complaint ${complaint.complaint_number} status changed: ${complaint.status} → ${status}`,
    entityType: "complaint",
    entityId: complaintId,
    performedBy: updatedBy,
    role,
    ipAddress,
    userAgent,
  });

  return updated;
};

export const assignComplaintToOfficer = async (complaintId, officerId, adminId, ipAddress, userAgent) => {
  const complaint = await findComplaintById(complaintId);
  if (!complaint) throw { status: 404, message: "Complaint not found" };
  if (["resolved", "closed", "rejected"].includes(complaint.status)) {
    throw { status: 400, message: `Cannot assign officer to a ${complaint.status} complaint` };
  }

  const officer = await getOfficerById(officerId);
  if (!officer) throw { status: 404, message: "Officer not found" };
  if (!officer.is_active) throw { status: 400, message: "Cannot assign to an inactive officer" };

  if (officer.department_id && complaint.department_id && officer.department_id !== complaint.department_id) {
    throw { status: 400, message: "Officer does not belong to the complaint's department" };
  }

  const updated = await assignOfficer(complaintId, officerId, adminId);

  await createNotification({
    userId: officer.user_id,
    title: "New Complaint Assigned",
    message: `Complaint ${complaint.complaint_number} — "${complaint.title}" has been assigned to you. Priority: ${complaint.priority}.`,
    type: "info",
    complaintId: complaintId,
  });

  await createNotification({
    userId: complaint.citizen_id,
    title: "Officer Assigned to Your Complaint",
    message: `An officer has been assigned to your complaint ${complaint.complaint_number} and it is now being reviewed.`,
    type: "info",
    complaintId: complaintId,
  });

  await createAuditLog({
    action: `Officer ${officer.name} (ID: ${officerId}) assigned to complaint ${complaint.complaint_number}`,
    entityType: "complaint",
    entityId: complaintId,
    performedBy: adminId,
    role: "admin",
    ipAddress,
    userAgent,
  });

  return updated;
};

export const rejectComplaintById = async (complaintId, reason, adminId, ipAddress, userAgent) => {
  if (!reason || reason.trim().length < 10) {
    throw { status: 400, message: "Rejection reason must be at least 10 characters" };
  }
  const complaint = await findComplaintById(complaintId);
  if (!complaint) throw { status: 404, message: "Complaint not found" };

  const updated = await rejectComplaint(complaintId, reason.trim(), adminId);

  await createNotification({
    userId: complaint.citizen_id,
    title: `Complaint ${complaint.complaint_number} Rejected`,
    message: `Your complaint has been rejected. Reason: ${reason}`,
    type: "error",
    complaintId: complaintId,
  });

  await createAuditLog({
    action: `Complaint ${complaint.complaint_number} rejected. Reason: ${reason}`,
    entityType: "complaint",
    entityId: complaintId,
    performedBy: adminId,
    role: "admin",
    ipAddress,
    userAgent,
  });

  return updated;
};

export const submitRating = async (complaintId, citizenId, rating, feedback) => {
  const complaint = await findComplaintById(complaintId);
  if (!complaint) throw { status: 404, message: "Complaint not found" };
  if (complaint.citizen_id !== citizenId) throw { status: 403, message: "You can only rate your own complaints" };
  if (![ "resolved", "closed"].includes(complaint.status)) throw { status: 400, message: "You can only rate resolved or closed complaints" };
  if (complaint.rating) throw { status: 409, message: "You have already submitted a rating for this complaint" };
  if (rating < 1 || rating > 5) throw { status: 400, message: "Rating must be between 1 and 5" };
  return await rateComplaint(complaintId, rating, feedback);
};

export const getSLAViolations = async (filters) => {
  return await getSLABreaches(filters);
};

export const bulkUpdateStatus = async (complaintIds, status, note, updatedBy, role, ipAddress, userAgent) => {
  if (!Array.isArray(complaintIds) || complaintIds.length === 0) {
    throw { status: 400, message: "complaint_ids must be a non-empty array" };
  }
  if (complaintIds.length > 50) {
    throw { status: 400, message: "Cannot bulk update more than 50 complaints at once" };
  }
  const results = [];
  for (const id of complaintIds) {
    try {
      const updated = await changeComplaintStatus(parseInt(id), status, note, updatedBy, role, ipAddress, userAgent);
      results.push({ id, success: true, complaint_number: updated.complaint_number });
    } catch (err) {
      results.push({ id, success: false, error: err.message });
    }
  }
  return {
    total: results.length,
    succeeded: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
};
