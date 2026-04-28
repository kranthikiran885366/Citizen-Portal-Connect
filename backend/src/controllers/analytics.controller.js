import { getDashboardStats, getAnalytics } from "../services/analytics.service.js";
import {
  getSystemStats, getComplaintsByDepartment, getComplaintTrends, getTopOfficers
} from "../repositories/analytics.repository.js";

export const dashboard = async (req, res, next) => {
  try {
    const data = await getDashboardStats();
    const stats = data.stats || {};
    // Flatten for frontend overview endpoint
    res.json({
      success: true,
      data: {
        total_complaints: stats.total_complaints || 0,
        resolved_complaints: stats.resolved_complaints || 0,
        pending_complaints: stats.pending_complaints || 0,
        in_progress_complaints: stats.inprogress_complaints || 0,
        rejected_complaints: stats.rejected_complaints || 0,
        closed_complaints: stats.closed_complaints || 0,
        total_officers: stats.active_officers || 0,
        total_departments: stats.total_departments || 0,
        sla_violations: stats.active_sla_breaches || 0,
        avg_resolution_days: stats.avg_resolution_days || null,
        avg_satisfaction: stats.avg_satisfaction || null,
        overall_resolution_rate: stats.overall_resolution_rate || 0,
        complaints_last_24h: stats.complaints_last_24h || 0,
        complaints_last_7d: stats.complaints_last_7d || 0,
        complaints_last_30d: stats.complaints_last_30d || 0,
      }
    });
  } catch (err) { next(err); }
};

export const departmentStats = async (req, res, next) => {
  try {
    const depts = await getComplaintsByDepartment();
    res.json({
      success: true,
      data: {
        departments: depts.map((d) => ({
          id: d.id,
          name: d.name,
          icon: d.icon,
          color: d.color,
          sla_days: d.sla_days,
          total_complaints: d.total || 0,
          resolved_complaints: d.resolved || 0,
          pending_complaints: d.pending || 0,
          in_progress_complaints: d.in_progress || 0,
          sla_breaches: d.sla_breaches || 0,
          avg_rating: d.avg_rating,
          resolution_rate: d.resolution_rate || 0,
        }))
      }
    });
  } catch (err) { next(err); }
};

export const complaintTrends = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const trends = await getComplaintTrends(days);
    res.json({
      success: true,
      data: {
        trends: trends.map((t) => ({
          month: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          period: t.date,
          total: t.total || 0,
          resolved: t.resolved || 0,
          pending: t.pending || 0,
          urgent: t.urgent || 0,
        }))
      }
    });
  } catch (err) { next(err); }
};

export const officerPerformance = async (req, res, next) => {
  try {
    const officers = await getTopOfficers(20);
    res.json({
      success: true,
      data: {
        officers: officers.map((o) => ({
          id: o.officer_id,
          name: o.name,
          department_name: o.department,
          employee_id: o.employee_id,
          total_assigned: o.assigned || 0,
          resolved_count: o.resolved || 0,
          pending_count: o.pending || 0,
          avg_rating: o.avg_rating,
          resolution_rate: o.efficiency_pct || 0,
          avg_resolution_days: o.avg_resolution_days,
        }))
      }
    });
  } catch (err) { next(err); }
};

export const analytics = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await getAnalytics(days);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
