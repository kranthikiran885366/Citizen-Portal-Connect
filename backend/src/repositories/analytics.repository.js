import pool from "../config/db.js";

export const getSystemStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM complaints)::int AS total_complaints,
      (SELECT COUNT(*) FROM complaints WHERE status = 'resolved')::int AS resolved_complaints,
      (SELECT COUNT(*) FROM complaints WHERE status = 'pending')::int AS pending_complaints,
      (SELECT COUNT(*) FROM complaints WHERE status = 'acknowledged')::int AS acknowledged_complaints,
      (SELECT COUNT(*) FROM complaints WHERE status = 'in-progress')::int AS inprogress_complaints,
      (SELECT COUNT(*) FROM complaints WHERE status = 'rejected')::int AS rejected_complaints,
      (SELECT COUNT(*) FROM complaints WHERE status = 'closed')::int AS closed_complaints,
      (SELECT COUNT(*) FROM complaints
       WHERE sla_deadline < NOW() AND status NOT IN ('resolved','closed','rejected'))::int AS active_sla_breaches,
      (SELECT COUNT(*) FROM users WHERE role = 'citizen' AND is_active = true)::int AS total_citizens,
      (SELECT COUNT(*) FROM officers WHERE is_active = true)::int AS active_officers,
      (SELECT COUNT(*) FROM departments WHERE is_active = true)::int AS total_departments,
      (SELECT ROUND(AVG(rating), 2) FROM complaints WHERE rating IS NOT NULL) AS avg_satisfaction,
      (SELECT ROUND(
         AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/86400), 1
       ) FROM complaints WHERE resolved_at IS NOT NULL) AS avg_resolution_days,
      (SELECT ROUND(
         COUNT(CASE WHEN status = 'resolved' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 1
       ) FROM complaints) AS overall_resolution_rate,
      (SELECT COUNT(*) FROM complaints WHERE created_at >= NOW() - INTERVAL '24 hours')::int AS complaints_last_24h,
      (SELECT COUNT(*) FROM complaints WHERE created_at >= NOW() - INTERVAL '7 days')::int AS complaints_last_7d,
      (SELECT COUNT(*) FROM complaints WHERE created_at >= NOW() - INTERVAL '30 days')::int AS complaints_last_30d
  `);
  return result.rows[0];
};

export const getComplaintsByDepartment = async () => {
  const result = await pool.query(`
    SELECT
      d.id, d.name, d.icon, d.color, d.sla_days,
      COUNT(c.id)::int AS total,
      COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::int AS resolved,
      COUNT(CASE WHEN c.status = 'pending' THEN 1 END)::int AS pending,
      COUNT(CASE WHEN c.status = 'in-progress' THEN 1 END)::int AS in_progress,
      COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS sla_breaches,
      ROUND(AVG(c.rating) FILTER (WHERE c.rating IS NOT NULL), 1) AS avg_rating,
      ROUND(
        COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::numeric / NULLIF(COUNT(c.id), 0) * 100, 1
      ) AS resolution_rate
    FROM departments d
    LEFT JOIN complaints c ON d.id = c.department_id
    WHERE d.is_active = true
    GROUP BY d.id
    ORDER BY total DESC
  `);
  return result.rows;
};

export const getComplaintTrends = async (days = 30) => {
  const result = await pool.query(
    `SELECT
       DATE(created_at) AS date,
       COUNT(*)::int AS total,
       COUNT(CASE WHEN status = 'resolved' THEN 1 END)::int AS resolved,
       COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pending,
       COUNT(CASE WHEN priority = 'urgent' THEN 1 END)::int AS urgent
     FROM complaints
     WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [days]
  );
  return result.rows;
};

export const getComplaintsByStatus = async () => {
  const result = await pool.query(`
    SELECT status, COUNT(*)::int AS count,
           ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM complaints), 0) * 100, 1) AS percentage
    FROM complaints
    GROUP BY status
    ORDER BY count DESC
  `);
  return result.rows;
};

export const getComplaintsByPriority = async () => {
  const result = await pool.query(`
    SELECT priority, COUNT(*)::int AS count,
           ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM complaints), 0) * 100, 1) AS percentage
    FROM complaints
    GROUP BY priority
    ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END
  `);
  return result.rows;
};

export const getTopOfficers = async (limit = 10) => {
  const result = await pool.query(
    `SELECT
       u.name, d.name AS department, o.employee_id, o.id AS officer_id,
       COUNT(c.id)::int AS assigned,
       COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::int AS resolved,
       COUNT(CASE WHEN c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS pending,
       ROUND(AVG(c.rating) FILTER (WHERE c.rating IS NOT NULL), 1) AS avg_rating,
       ROUND(
         COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::numeric / NULLIF(COUNT(c.id), 0) * 100, 1
       ) AS efficiency_pct,
       ROUND(AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/86400) FILTER (WHERE c.resolved_at IS NOT NULL), 1) AS avg_resolution_days
     FROM officers o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN departments d ON o.department_id = d.id
     LEFT JOIN complaints c ON o.id = c.officer_id
     WHERE o.is_active = true
     GROUP BY o.id, u.id, d.id
     ORDER BY avg_rating DESC NULLS LAST, resolved DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getHourlyDistribution = async () => {
  const result = await pool.query(`
    SELECT
      EXTRACT(HOUR FROM created_at)::int AS hour,
      COUNT(*)::int AS count
    FROM complaints
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY EXTRACT(HOUR FROM created_at)
    ORDER BY hour
  `);
  return result.rows;
};

export const getResolutionTimeByDepartment = async () => {
  const result = await pool.query(`
    SELECT
      d.name AS department,
      d.sla_days,
      COUNT(c.id)::int AS total,
      ROUND(AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/86400) FILTER (WHERE c.resolved_at IS NOT NULL), 1) AS avg_days,
      COUNT(CASE WHEN c.resolved_at <= c.sla_deadline THEN 1 END)::int AS resolved_within_sla,
      ROUND(
        COUNT(CASE WHEN c.resolved_at <= c.sla_deadline THEN 1 END)::numeric /
        NULLIF(COUNT(CASE WHEN c.resolved_at IS NOT NULL THEN 1 END), 0) * 100, 1
      ) AS sla_compliance_rate
    FROM departments d
    LEFT JOIN complaints c ON d.id = c.department_id
    WHERE d.is_active = true
    GROUP BY d.id
    ORDER BY avg_days ASC NULLS LAST
  `);
  return result.rows;
};
