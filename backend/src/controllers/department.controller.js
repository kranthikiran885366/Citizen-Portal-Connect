import { listDepartments, getDepartment, addDepartment, editDepartment, removeDepartment } from "../services/department.service.js";

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await listDepartments();
    res.json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await getDepartment(parseInt(req.params.id));
    res.json({ success: true, data: dept });
  } catch (err) {
    next(err);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    if (!req.body.name) return res.status(400).json({ success: false, message: "Department name is required" });
    const dept = await addDepartment(req.body, req.user.id, req.ip);
    res.status(201).json({ success: true, message: "Department created", data: dept });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await editDepartment(parseInt(req.params.id), req.body, req.user.id, req.ip);
    res.json({ success: true, message: "Department updated", data: dept });
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    await removeDepartment(parseInt(req.params.id), req.user.id, req.ip);
    res.json({ success: true, message: "Department deleted" });
  } catch (err) { next(err); }
};
