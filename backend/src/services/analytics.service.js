import {
  getSystemStats, getComplaintsByDepartment, getComplaintTrends,
  getComplaintsByStatus, getComplaintsByPriority, getTopOfficers,
  getHourlyDistribution, getResolutionTimeByDepartment
} from "../repositories/analytics.repository.js";

export const getDashboardStats = async () => {
  const [stats, byDept, byStatus, byPriority, topOfficers] = await Promise.all([
    getSystemStats(),
    getComplaintsByDepartment(),
    getComplaintsByStatus(),
    getComplaintsByPriority(),
    getTopOfficers(5),
  ]);
  return { stats, byDepartment: byDept, byStatus, byPriority, topOfficers };
};

export const getAnalytics = async (days = 30) => {
  const [stats, trends, byDept, byStatus, byPriority, topOfficers, hourly, resolutionByDept] = await Promise.all([
    getSystemStats(),
    getComplaintTrends(days),
    getComplaintsByDepartment(),
    getComplaintsByStatus(),
    getComplaintsByPriority(),
    getTopOfficers(10),
    getHourlyDistribution(),
    getResolutionTimeByDepartment(),
  ]);
  return {
    stats,
    trends,
    byDepartment: byDept,
    byStatus,
    byPriority,
    topOfficers,
    hourlyDistribution: hourly,
    resolutionByDepartment: resolutionByDept,
  };
};
