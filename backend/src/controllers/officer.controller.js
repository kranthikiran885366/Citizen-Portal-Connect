import { listOfficers, getOfficerDetails, addOfficer, editOfficer, removeOfficer, getPerformanceReport } from "../services/officer.service.js";
import { getOfficerByUserId } from "../repositories/officer.repository.js";

export const getOfficers = async (req, res, next) => {
  try {
    const { page, limit, search, department_id, is_active } = req.query;
    const result = await listOfficers({
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(100, parseInt(limit) || 20),
      search: search || "",
      department_id: parseInt(department_id) || undefined,
      is_active: is_active === "false" ? false : true,
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getOfficer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid officer ID" });
    const officer = await getOfficerDetails(id);
    res.json({ success: true, data: officer });
  } catch (err) { next(err); }
};

export const createOfficer = async (req, res, next) => {
  try {
    const officer = await addOfficer(req.body, req.user.id, req.ip, req.headers["user-agent"]);
    res.status(201).json({ success: true, message: "Officer created successfully", data: officer });
  } catch (err) { next(err); }
};

export const updateOfficer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid officer ID" });
    const officer = await editOfficer(id, req.body, req.user.id, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Officer updated successfully", data: officer });
  } catch (err) { next(err); }
};

export const deleteOfficer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid officer ID" });
    await removeOfficer(id, req.user.id, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Officer deactivated successfully" });
  } catch (err) { next(err); }
};

export const getMyPerformance = async (req, res, next) => {
  try {
    const officer = await getOfficerByUserId(req.user.id);
    if (!officer) return res.status(404).json({ success: false, message: "Officer profile not found" });
    const report = await getPerformanceReport(officer.id);
    const perf = report.performance || {};
    // Flatten for frontend
    res.json({
      success: true,
      data: {
        officer_id: officer.id,
        department_name: officer.department_name,
        employee_id: officer.employee_id,
        designation: officer.designation,
        total_assigned: perf.total_assigned || 0,
        resolved_count: perf.total_resolved || 0,
        pending_count: perf.total_pending || 0,
        sla_breaches: perf.active_sla_breaches || 0,
        avg_rating: perf.avg_rating || null,
        avg_resolution_days: perf.avg_resolution_days || null,
        resolution_rate: perf.resolution_rate || 0,
        sla_compliance_rate: perf.total_assigned > 0
          ? Math.round(((perf.total_assigned - (perf.active_sla_breaches || 0)) / perf.total_assigned) * 100)
          : 100,
        monthly_trend: perf.monthly_trend || [],
        recent_complaints: perf.recent_complaints || [],
      }
    });
  } catch (err) { next(err); }
};
