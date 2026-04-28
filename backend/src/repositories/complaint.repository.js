import pool from "../config/db.js";
import crypto from "crypto";

const generateComplaintNumber = async (client) => {
  const year = new Date().getFullYear();
  const result = await client.query(
    "SELECT COUNT(*) FROM complaints WHERE EXTRACT(YEAR FROM created_at) = $1",
    [year]
  );
  const seq = parseInt(result.rows[0].count) + 1;
  return `CMP-${year}-${String(seq).padStart(5, "0")}`;
};

export const createComplaint = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { title, description, category, department_id, citizen_id, priority, location, latitude, longitude, is_anonymous, image_urls } = data;

    const deptResult = await client.query(
      "SELECT sla_days FROM departments WHERE id = $1 AND is_active = true",
      [department_id]
    );
    if (!deptResult.rows.length) throw { status: 400, message: "Department not found or inactive" };

    const slaDays = deptResult.rows[0].sla_days;
    const slaDeadline = new Date(Date.now() + slaDays * 24 * 60 * 60 * 1000);
    const complaintNumber = await generateComplaintNumber(client);

    const result = await client.query(
      `INSERT INTO complaints
         (complaint_number, title, description, category, department_id, citizen_id,
          priority, location, latitude, longitude, is_anonymous, image_urls, sla_deadline)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        complaintNumber, title.trim(), description.trim(),
        category || null, department_id, citizen_id,
        priority || "medium", location || null,
        latitude || null, longitude || null,
        is_anonymous || false, image_urls || [],
        slaDeadline
      ]
    );

    await client.query(
      `INSERT INTO complaint_timeline (complaint_id, status, note, updated_by)
       VALUES ($1, 'pending', 'Complaint submitted successfully', $2)`,
      [result.rows[0].id, citizen_id]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const findComplaintById = async (id) => {
  const result = await pool.query(
    `SELECT
       c.*,
       d.name AS department_name, d.icon AS department_icon, d.sla_days,
       u.name AS citizen_name, u.phone AS citizen_phone, u.email AS citizen_email,
       o.id AS officer_row_id, o.employee_id AS officer_employee_id,
       ou.name AS officer_name, ou.email AS officer_email, ou.phone AS officer_phone,
       CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected')
            THEN true ELSE false END AS is_sla_breached,
       EXTRACT(EPOCH FROM (c.sla_deadline - NOW()))/3600 AS sla_hours_remaining
     FROM complaints c
     LEFT JOIN departments d ON c.department_id = d.id
     LEFT JOIN users u ON c.citizen_id = u.id
     LEFT JOIN officers o ON c.officer_id = o.id
     LEFT JOIN users ou ON o.user_id = ou.id
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const findComplaintByNumber = async (number) => {
  const result = await pool.query(
    `SELECT
       c.*,
       d.name AS department_name, d.icon AS department_icon,
       CASE WHEN c.is_anonymous THEN 'Anonymous' ELSE u.name END AS citizen_name,
       ou.name AS officer_name,
       CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected')
            THEN true ELSE false END AS is_sla_breached
     FROM complaints c
     LEFT JOIN departments d ON c.department_id = d.id
     LEFT JOIN users u ON c.citizen_id = u.id
     LEFT JOIN officers o ON c.officer_id = o.id
     LEFT JOIN users ou ON o.user_id = ou.id
     WHERE UPPER(c.complaint_number) = UPPER($1)`,
    [number.trim()]
  );
  return result.rows[0] || null;
};

export const getComplaintTimeline = async (complaintId) => {
  const result = await pool.query(
    `SELECT ct.id, ct.status, ct.note, ct.created_at,
            u.name AS updated_by_name, u.role AS updated_by_role
     FROM complaint_timeline ct
     LEFT JOIN users u ON ct.updated_by = u.id
     WHERE ct.complaint_id = $1
     ORDER BY ct.created_at ASC`,
    [complaintId]
  );
  return result.rows;
};

export const getComplaints = async ({ page = 1, limit = 20, status, priority, department_id, citizen_id, officer_id, search, date_from, date_to, is_sla_breached }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];
  let idx = 1;

  if (status) {
    const statuses = status.split(",").map(s => s.trim()).filter(Boolean);
    if (statuses.length === 1) {
      conditions.push(`c.status = $${idx++}`); values.push(statuses[0]);
    } else {
      conditions.push(`c.status = ANY($${idx++}::text[])`);
      values.push(statuses);
    }
  }
  if (priority) { conditions.push(`c.priority = $${idx++}`); values.push(priority); }
  if (department_id) { conditions.push(`c.department_id = $${idx++}`); values.push(department_id); }
  if (citizen_id) { conditions.push(`c.citizen_id = $${idx++}`); values.push(citizen_id); }
  if (officer_id) { conditions.push(`c.officer_id = $${idx++}`); values.push(officer_id); }
  if (date_from) { conditions.push(`c.created_at >= $${idx++}`); values.push(date_from); }
  if (date_to) { conditions.push(`c.created_at <= $${idx++}`); values.push(date_to); }
  if (is_sla_breached === true) {
    conditions.push(`(c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected'))`);
  }
  if (search) {
    conditions.push(`(c.title ILIKE $${idx} OR c.complaint_number ILIKE $${idx} OR c.description ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT
         c.id, c.complaint_number, c.title, c.description, c.status, c.priority,
         c.location, c.is_anonymous, c.image_urls, c.rating, c.sla_deadline,
         c.created_at, c.updated_at, c.resolved_at,
         d.name AS department_name, d.icon AS department_icon,
         CASE WHEN c.is_anonymous THEN 'Anonymous' ELSE u.name END AS citizen_name,
         ou.name AS officer_name,
         CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed','rejected')
              THEN true ELSE false END AS is_sla_breached
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN users u ON c.citizen_id = u.id
       LEFT JOIN officers o ON c.officer_id = o.id
       LEFT JOIN users ou ON o.user_id = ou.id
       ${where}
       ORDER BY c.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM complaints c ${where}`, values),
  ]);

  return {
    complaints: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    total_pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};

export const updateComplaintStatus = async (id, status, note, updatedBy) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const timestampField = {
      acknowledged: ", acknowledged_at = NOW()",
      resolved: ", resolved_at = NOW()",
      closed: ", closed_at = NOW()",
    }[status] || "";

    const result = await client.query(
      `UPDATE complaints
       SET status = $1, updated_at = NOW() ${timestampField}
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (!result.rows.length) throw { status: 404, message: "Complaint not found" };

    await client.query(
      `INSERT INTO complaint_timeline (complaint_id, status, note, updated_by)
       VALUES ($1, $2, $3, $4)`,
      [id, status, note || `Status updated to ${status}`, updatedBy]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const assignOfficer = async (complaintId, officerId, updatedBy) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE complaints
       SET officer_id = $1, status = 'acknowledged', acknowledged_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND status = 'pending'
       RETURNING *`,
      [officerId, complaintId]
    );

    if (!result.rows.length) {
      const existing = await client.query("SELECT status FROM complaints WHERE id = $1", [complaintId]);
      if (!existing.rows.length) throw { status: 404, message: "Complaint not found" };
      const updateResult = await client.query(
        `UPDATE complaints SET officer_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [officerId, complaintId]
      );
      await client.query(
        `INSERT INTO complaint_timeline (complaint_id, status, note, updated_by)
         VALUES ($1, $2, 'Officer reassigned to complaint', $3)`,
        [complaintId, existing.rows[0].status, updatedBy]
      );
      await client.query("COMMIT");
      return updateResult.rows[0];
    }

    await client.query(
      `INSERT INTO complaint_timeline (complaint_id, status, note, updated_by)
       VALUES ($1, 'acknowledged', 'Officer assigned and complaint acknowledged', $2)`,
      [complaintId, updatedBy]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const rateComplaint = async (complaintId, rating, feedback) => {
  const result = await pool.query(
    `UPDATE complaints
     SET rating = $1, feedback = $2, updated_at = NOW()
     WHERE id = $3 AND status IN ('resolved', 'closed')
     RETURNING *`,
    [rating, feedback || null, complaintId]
  );
  if (!result.rows.length) throw { status: 400, message: "Complaint must be resolved before rating" };
  return result.rows[0];
};

export const rejectComplaint = async (complaintId, reason, updatedBy) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE complaints
       SET status = 'rejected', rejection_reason = $1, updated_at = NOW()
       WHERE id = $2 AND status IN ('pending','acknowledged')
       RETURNING *`,
      [reason, complaintId]
    );
    if (!result.rows.length) throw { status: 400, message: "Only pending or acknowledged complaints can be rejected" };
    await client.query(
      `INSERT INTO complaint_timeline (complaint_id, status, note, updated_by)
       VALUES ($1, 'rejected', $2, $3)`,
      [complaintId, `Complaint rejected: ${reason}`, updatedBy]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getSLABreaches = async ({ department_id, priority } = {}) => {
  const conditions = ["c.sla_deadline < NOW()", "c.status NOT IN ('resolved','closed','rejected')"];
  const values = [];
  let idx = 1;
  if (department_id) { conditions.push(`c.department_id = $${idx++}`); values.push(department_id); }
  if (priority) { conditions.push(`c.priority = $${idx++}`); values.push(priority); }

  const result = await pool.query(
    `SELECT
       c.id, c.complaint_number, c.title, c.status, c.priority,
       c.sla_deadline, c.created_at,
       d.name AS department_name,
       CASE WHEN c.is_anonymous THEN 'Anonymous' ELSE u.name END AS citizen_name,
       ou.name AS officer_name,
       ROUND(EXTRACT(EPOCH FROM (NOW() - c.sla_deadline))/3600, 1) AS hours_overdue,
       ROUND(EXTRACT(EPOCH FROM (NOW() - c.created_at))/86400, 1) AS days_open
     FROM complaints c
     LEFT JOIN departments d ON c.department_id = d.id
     LEFT JOIN users u ON c.citizen_id = u.id
     LEFT JOIN officers o ON c.officer_id = o.id
     LEFT JOIN users ou ON o.user_id = ou.id
     WHERE ${conditions.join(" AND ")}
     ORDER BY c.sla_deadline ASC`,
    values
  );
  return result.rows;
};

export const getComplaintCountByDateRange = async (citizenId, fromDate) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM complaints WHERE citizen_id = $1 AND created_at >= $2",
    [citizenId, fromDate]
  );
  return parseInt(result.rows[0].count);
};
