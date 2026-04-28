import pool from "../config/db.js";

export const getAllDepartments = async () => {
  const result = await pool.query(
    `SELECT d.*,
            COUNT(c.id) AS total_complaints,
            COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) AS resolved_complaints,
            COUNT(CASE WHEN c.status NOT IN ('resolved','closed','rejected') THEN 1 END) AS pending_complaints,
            COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected') THEN 1 END) AS sla_breaches
     FROM departments d
     LEFT JOIN complaints c ON d.id = c.department_id
     WHERE d.is_active = true
     GROUP BY d.id
     ORDER BY d.name ASC`
  );
  return result.rows;
};

export const getDepartmentById = async (id) => {
  const result = await pool.query(
    `SELECT d.*,
            COUNT(c.id) AS total_complaints,
            COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) AS resolved_complaints,
            COUNT(CASE WHEN c.status NOT IN ('resolved','closed','rejected') THEN 1 END) AS pending_complaints
     FROM departments d
     LEFT JOIN complaints c ON d.id = c.department_id
     WHERE d.id = $1
     GROUP BY d.id`,
    [id]
  );
  return result.rows[0] || null;
};

export const createDepartment = async (data) => {
  const { name, icon, color, description, head_name, contact_email, contact_phone, sla_days } = data;
  const result = await pool.query(
    `INSERT INTO departments (name, icon, color, description, head_name, contact_email, contact_phone, sla_days)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [name, icon || null, color || null, description || null, head_name || null, contact_email || null, contact_phone || null, sla_days || 7]
  );
  return result.rows[0];
};

export const updateDepartment = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE departments SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
};

export const deleteDepartment = async (id) => {
  await pool.query(`UPDATE departments SET is_active = false WHERE id = $1`, [id]);
};

export const getDepartmentOfficers = async (departmentId) => {
  const result = await pool.query(
    `SELECT o.id, o.employee_id, o.designation, u.name, u.email, u.phone,
            COUNT(c.id) AS assigned_complaints,
            COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) AS resolved_complaints,
            ROUND(AVG(c.rating), 1) AS avg_rating
     FROM officers o
     JOIN users u ON o.user_id = u.id
     LEFT JOIN complaints c ON o.id = c.officer_id
     WHERE o.department_id = $1 AND o.is_active = true
     GROUP BY o.id, u.id
     ORDER BY u.name ASC`,
    [departmentId]
  );
  return result.rows;
};
