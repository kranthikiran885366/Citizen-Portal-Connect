import { getAllOfficers, getOfficerById, createOfficer, updateOfficer, getOfficerPerformance } from "../repositories/officer.repository.js";
import { findUserByEmail, createUser, updateUser } from "../repositories/user.repository.js";
import { createAuditLog } from "../repositories/audit.repository.js";
import bcrypt from "bcryptjs";

export const listOfficers = async (filters) => {
  return await getAllOfficers(filters);
};

export const getOfficerDetails = async (id) => {
  const officer = await getOfficerById(id);
  if (!officer) throw { status: 404, message: "Officer not found" };
  const performance = await getOfficerPerformance(id);
  return { ...officer, performance };
};

export const addOfficer = async (data, adminId, ipAddress, userAgent) => {
  const { name, email, phone, department_id, designation, password } = data;
  if (!name || !email) throw { status: 400, message: "Name and email are required" };
  if (!department_id) throw { status: 400, message: "Department is required" };

  const existing = await findUserByEmail(email);
  if (existing) throw { status: 409, message: "An account with this email already exists" };

  const rawPassword = password || "Officer@123";
  const hashedPassword = await bcrypt.hash(rawPassword, 12);
  const user = await createUser({ name, email, password: hashedPassword, phone, role: "officer" });
  const officer = await createOfficer({ userId: user.id, departmentId: department_id, designation });

  await createAuditLog({
    action: `Officer created: ${name} (${email}), Dept ID: ${department_id}`,
    entityType: "officer",
    entityId: officer.id,
    performedBy: adminId,
    role: "admin",
    ipAddress,
    userAgent,
  });

  const { password: _, ...safeUser } = user;
  return { ...officer, user: safeUser, temporary_password: !password ? rawPassword : undefined };
};

export const editOfficer = async (id, data, adminId, ipAddress, userAgent) => {
  const officer = await getOfficerById(id);
  if (!officer) throw { status: 404, message: "Officer not found" };

  const { name, phone, department_id, designation, is_active } = data;

  const userUpdates = {};
  if (name) userUpdates.name = name;
  if (phone) userUpdates.phone = phone;
  if (Object.keys(userUpdates).length) await updateUser(officer.user_id, userUpdates);

  const officerUpdates = {};
  if (department_id !== undefined) officerUpdates.department_id = department_id;
  if (designation) officerUpdates.designation = designation;
  if (is_active !== undefined) officerUpdates.is_active = is_active;

  if (Object.keys(officerUpdates).length) await updateOfficer(id, officerUpdates);

  await createAuditLog({
    action: `Officer updated: ${officer.name} (ID: ${id}). Changes: ${JSON.stringify(data)}`,
    entityType: "officer",
    entityId: id,
    performedBy: adminId,
    role: "admin",
    ipAddress,
    userAgent,
  });

  return await getOfficerById(id);
};

export const removeOfficer = async (id, adminId, ipAddress, userAgent) => {
  const officer = await getOfficerById(id);
  if (!officer) throw { status: 404, message: "Officer not found" };
  if (officer.pending_complaints > 0) {
    throw { status: 400, message: `Cannot deactivate officer with ${officer.pending_complaints} pending complaints. Reassign them first.` };
  }

  await updateOfficer(id, { is_active: false });
  await updateUser(officer.user_id, { is_active: false });

  await createAuditLog({
    action: `Officer deactivated: ${officer.name} (ID: ${id})`,
    entityType: "officer",
    entityId: id,
    performedBy: adminId,
    role: "admin",
    ipAddress,
    userAgent,
  });
};

export const getPerformanceReport = async (officerId) => {
  const officer = await getOfficerById(officerId);
  if (!officer) throw { status: 404, message: "Officer not found" };
  const performance = await getOfficerPerformance(officerId);
  return { officer, performance };
};
