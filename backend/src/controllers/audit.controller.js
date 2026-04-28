import { getAuditLogs } from "../repositories/audit.repository.js";

export const getLogs = async (req, res, next) => {
  try {
    const { page, limit, role, search, entity_type, date_from, date_to } = req.query;
    const result = await getAuditLogs({
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(100, parseInt(limit) || 20),
      role: role || undefined,
      search: search || undefined,
      entity_type: entity_type || undefined,
      date_from: date_from || undefined,
      date_to: date_to || undefined,
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
