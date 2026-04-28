import { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, getDepartmentOfficers } from "../repositories/department.repository.js";
import { createAuditLog } from "../repositories/audit.repository.js";

export const listDepartments = async () => {
  return await getAllDepartments();
};

export const getDepartment = async (id) => {
  const dept = await getDepartmentById(id);
  if (!dept) throw { status: 404, message: "Department not found" };
  const officers = await getDepartmentOfficers(id);
  return { ...dept, officers };
};

export const addDepartment = async (data, adminId, ipAddress) => {
  const dept = await createDepartment(data);
  await createAuditLog({
    action: `Department created: ${dept.name}`,
    entityType: "department",
    entityId: dept.id,
    performedBy: adminId,
    role: "admin",
    ipAddress,
  });
  return dept;
};

export const editDepartment = async (id, data, adminId, ipAddress) => {
  const dept = await getDepartmentById(id);
  if (!dept) throw { status: 404, message: "Department not found" };
  const updated = await updateDepartment(id, data);
  await createAuditLog({
    action: `Department updated: ${dept.name}`,
    entityType: "department",
    entityId: id,
    performedBy: adminId,
    role: "admin",
    ipAddress,
  });
  return updated;
};

export const removeDepartment = async (id, adminId, ipAddress) => {
  const dept = await getDepartmentById(id);
  if (!dept) throw { status: 404, message: "Department not found" };
  await deleteDepartment(id);
  await createAuditLog({
    action: `Department deleted: ${dept.name}`,
    entityType: "department",
    entityId: id,
    performedBy: adminId,
    role: "admin",
    ipAddress,
  });
};
