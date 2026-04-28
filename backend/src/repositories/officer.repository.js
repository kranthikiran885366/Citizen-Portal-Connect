import pool from "../config/db.js";

export const getAllOfficers = async ({ page = 1, limit = 20, search = "", department_id, is_active = true }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];
  let idx = 1;

  if (is_active !== undefined) { conditions.push(`o.is_active = $${idx++}`); values.push(is_active); }
  if (search) {
    conditions.push(`(u.name ILIKE $${idx} OR u.email ILIKE $${idx} OR d.name ILIKE $${idx} OR o.employee_id ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }
  if (department_id) { conditions.push(`o.department_id = $${idx++}`); values.push(department_id); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT
         o.id, o.employee_id, o.designation, o.is_active, o.joined_at, o.created_at,
         u.id AS user_id, u.name, u.email, u.phone, u.last_login_at,
         d.id AS department_id, d.name AS department_name, d.icon AS department_icon,
         COUNT(c.id)::int AS assigned_complaints,
         COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::int AS resolved_complaints,
         COUNT(CASE WHEN c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS pending_complaints,
         COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS sla_breaches,
         ROUND(AVG(c.rating), 1) AS avg_rating,
         ROUND(
           COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::numeric /
           NULLIF(COUNT(c.id), 0) * 100, 1
         ) AS efficiency_pct
       FROM officers o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN departments d ON o.department_id = d.id
       LEFT JOIN complaints c ON o.id = c.officer_id
       ${where}
       GROUP BY o.id, u.id, d.id
       ORDER BY u.name ASC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(DISTINCT o.id) FROM officers o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN departments d ON o.department_id = d.id
       ${where}`,
      values
    ),
  ]);

  return {
    officers: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    total_pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};

export const getOfficerById = async (id) => {
  const result = await pool.query(
    `SELECT
       o.id, o.employee_id, o.designation, o.is_active, o.joined_at,
       u.id AS user_id, u.name, u.email, u.phone, u.last_login_at,
       d.id AS department_id, d.name AS department_name, d.icon AS department_icon,
       COUNT(c.id)::int AS assigned_complaints,
       COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::int AS resolved_complaints,
       COUNT(CASE WHEN c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS pending_complaints,
       ROUND(AVG(c.rating), 1) AS avg_rating,
       COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS sla_breaches
     FROM officers o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN departments d ON o.department_id = d.id
     LEFT JOIN complaints c ON o.id = c.officer_id
     WHERE o.id = $1
     GROUP BY o.id, u.id, d.id`,
    [id]
  );
  return result.rows[0] || null;
};

export const getOfficerByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT o.*, d.name AS department_name, d.icon AS department_icon, d.sla_days
     FROM officers o
     LEFT JOIN departments d ON o.department_id = d.id
     WHERE o.user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

export const createOfficer = async ({ userId, departmentId, designation }) => {
  const year = new Date().getFullYear();
  const countResult = await pool.query(
    "SELECT COUNT(*) FROM officers WHERE EXTRACT(YEAR FROM created_at) = $1", [year]
  );
  const seq = parseInt(countResult.rows[0].count) + 1;
  const empId = `EMP-${year}-${String(seq).padStart(4, "0")}`;

  const result = await pool.query(
    `INSERT INTO officers (user_id, department_id, employee_id, designation)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, departmentId || null, empId, designation || "Field Officer"]
  );
  return result.rows[0];
};

export const updateOfficer = async (id, fields) => {
  const allowed = ["department_id", "designation", "is_active", "joined_at"];
  const filtered = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(filtered).length) return getOfficerById(id);
  const keys = Object.keys(filtered);
  const values = Object.values(filtered);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE officers SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
};

export const getOfficerPerformance = async (officerId) => {
  const [perf, monthly, recent] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(c.id)::int AS total_assigned,
         COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::int AS total_resolved,
         COUNT(CASE WHEN c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS total_pending,
         COUNT(CASE WHEN c.status = 'rejected' THEN 1 END)::int AS total_rejected,
         COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected') THEN 1 END)::int AS active_sla_breaches,
         COUNT(CASE WHEN c.sla_deadline < c.resolved_at THEN 1 END)::int AS resolved_after_sla,
         ROUND(AVG(c.rating) FILTER (WHERE c.rating IS NOT NULL), 2) AS avg_rating,
         COUNT(c.rating)::int AS total_ratings,
         ROUND(AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/86400) FILTER (WHERE c.resolved_at IS NOT NULL), 1) AS avg_resolution_days,
         ROUND(COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::numeric / NULLIF(COUNT(c.id), 0) * 100, 1) AS resolution_rate
       FROM complaints c WHERE c.officer_id = $1`,
      [officerId]
    ),
    pool.query(
      `SELECT
         DATE_TRUNC('month', c.created_at) AS month,
         COUNT(c.id)::int AS assigned,
         COUNT(CASE WHEN c.status = 'resolved' THEN 1 END)::int AS resolved,
         ROUND(AVG(c.rating) FILTER (WHERE c.rating IS NOT NULL), 1) AS avg_rating
       FROM complaints c
       WHERE c.officer_id = $1 AND c.created_at >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', c.created_at)
       ORDER BY month ASC`,
      [officerId]
    ),
    pool.query(
      `SELECT c.id, c.complaint_number, c.title, c.status, c.priority, c.created_at, c.sla_deadline,
              d.name AS department_name
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.id
       WHERE c.officer_id = $1
       ORDER BY c.created_at DESC LIMIT 5`,
      [officerId]
    ),
  ]);

  return {
    ...perf.rows[0],
    monthly_trend: monthly.rows,
    recent_complaints: recent.rows,
  };
};
