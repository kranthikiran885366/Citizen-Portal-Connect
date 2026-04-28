import {
  fileComplaint, getComplaintDetails, trackComplaintByNumber,
  listComplaints, changeComplaintStatus, assignComplaintToOfficer,
  submitRating, getSLAViolations, bulkUpdateStatus, rejectComplaintById
} from "../services/complaint.service.js";
import { getOfficerByUserId } from "../repositories/officer.repository.js";

export const createComplaint = async (req, res, next) => {
  try {
    const complaint = await fileComplaint(req.body, req.user.id, req.ip, req.headers["user-agent"]);
    res.status(201).json({ success: true, message: "Complaint filed successfully", data: complaint });
  } catch (err) { next(err); }
};

export const getComplaint = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    const complaint = await getComplaintDetails(id, req.user);
    res.json({ success: true, data: complaint });
  } catch (err) { next(err); }
};

export const trackComplaint = async (req, res, next) => {
  try {
    const complaint = await trackComplaintByNumber(req.params.number);
    res.json({ success: true, data: complaint });
  } catch (err) { next(err); }
};

export const getComplaints = async (req, res, next) => {
  try {
    const { page, limit, status, priority, department_id, search, date_from, date_to, is_sla_breached } = req.query;
    const filters = {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(100, parseInt(limit) || 20),
      status: status || undefined,
      priority: priority || undefined,
      department_id: parseInt(department_id) || undefined,
      search: search || undefined,
      date_from: date_from || undefined,
      date_to: date_to || undefined,
      is_sla_breached: is_sla_breached === "true" ? true : undefined,
    };

    if (req.user.role === "citizen") {
      filters.citizen_id = req.user.id;
    } else if (req.user.role === "officer") {
      const officer = await getOfficerByUserId(req.user.id);
      if (!officer) return res.status(404).json({ success: false, message: "Officer profile not found" });
      filters.officer_id = officer.id;
    }

    const result = await listComplaints(filters);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "status is required" });
    const updated = await changeComplaintStatus(id, status, note, req.user.id, req.user.role, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Status updated successfully", data: updated });
  } catch (err) { next(err); }
};

export const assignOfficer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    const { officer_id } = req.body;
    if (!officer_id) return res.status(400).json({ success: false, message: "officer_id is required" });
    const updated = await assignComplaintToOfficer(id, parseInt(officer_id), req.user.id, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Officer assigned successfully", data: updated });
  } catch (err) { next(err); }
};

export const rejectComplaint = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: "reason is required" });
    const updated = await rejectComplaintById(id, reason, req.user.id, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Complaint rejected", data: updated });
  } catch (err) { next(err); }
};

export const rateComplaint = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid complaint ID" });
    const { rating, feedback } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: "rating is required" });
    const updated = await submitRating(id, req.user.id, parseInt(rating), feedback);
    res.json({ success: true, message: "Rating submitted successfully", data: updated });
  } catch (err) { next(err); }
};

export const getSLABreaches = async (req, res, next) => {
  try {
    const { department_id, priority } = req.query;
    const breaches = await getSLAViolations({
      department_id: parseInt(department_id) || undefined,
      priority: priority || undefined,
    });
    res.json({ success: true, data: breaches, count: breaches.length });
  } catch (err) { next(err); }
};

export const bulkUpdate = async (req, res, next) => {
  try {
    const { complaint_ids, status, note } = req.body;
    if (!complaint_ids || !status) return res.status(400).json({ success: false, message: "complaint_ids and status are required" });
    const results = await bulkUpdateStatus(complaint_ids, status, note, req.user.id, req.user.role, req.ip, req.headers["user-agent"]);
    res.json({ success: true, data: results });
  } catch (err) { next(err); }
};
