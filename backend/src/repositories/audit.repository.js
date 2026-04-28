import pool from "../config/db.js";

export const createAuditLog = async ({ action, entityType, entityId, performedBy, role, ipAddress, userAgent, metadata }) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, performed_by, role, ip_address, user_agent, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        action,
        entityType || null,
        entityId || null,
        performedBy || null,
        role || null,
        ipAddress || null,
        userAgent || null,
        metadata ? JSON.stringify(metadata) : "{}" ,
      ]
    );
  } catch (err) {
    console.error("Audit log write failed:", err.message);
  }
};

export const getAuditLogs = async ({ page = 1, limit = 20, role, search, entity_type, date_from, date_to }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];
  let idx = 1;

  if (role) { conditions.push(`al.role = $${idx++}`); values.push(role); }
  if (entity_type) { conditions.push(`al.entity_type = $${idx++}`); values.push(entity_type); }
  if (date_from) { conditions.push(`al.created_at >= $${idx++}`); values.push(date_from); }
  if (date_to) { conditions.push(`al.created_at <= $${idx++}`); values.push(date_to); }
  if (search) {
    conditions.push(`(al.action ILIKE $${idx} OR u.name ILIKE $${idx} OR u.email ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT al.id, al.action, al.entity_type, al.entity_id, al.role,
              al.ip_address, al.created_at,
              u.name AS user_name, u.email AS user_email
       FROM audit_logs al
       LEFT JOIN users u ON al.performed_by = u.id
       ${where}
       ORDER BY al.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*) FROM audit_logs al LEFT JOIN users u ON al.performed_by = u.id ${where}`,
      values
    ),
  ]);

  return {
    logs: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    total_pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};
