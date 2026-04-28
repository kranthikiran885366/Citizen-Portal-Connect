import pool from "../config/db.js";

export const auditLog = (action, entityType) => async (req, res, next) => {
  res.on("finish", async () => {
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      try {
        await pool.query(
          `INSERT INTO audit_logs (action, entity_type, entity_id, performed_by, role, ip_address, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            action,
            entityType,
            req.params.id || null,
            req.user.id,
            req.user.role,
            req.ip,
            JSON.stringify({ method: req.method, url: req.originalUrl }),
          ]
        );
      } catch (err) {
        console.error("Audit log error:", err.message);
      }
    }
  });
  next();
};
