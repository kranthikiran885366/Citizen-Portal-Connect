import pool from "../config/db.js";
import { Parser } from "json2csv";

// ============================================
// EXPORT & REPORTING FEATURES
// ============================================

export const exportComplaints = async (req, res) => {
  try {
    const { format = "csv", filters = {} } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    let query = `
      SELECT c.id, c.complaint_number, c.title, c.description,
             c.priority, c.status, c.rating, c.feedback,
             d.name as department_name,
             u.name as citizen_name, u.email as citizen_email,
             c.location, c.created_at, c.updated_at,
             CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed') 
              THEN true ELSE false END as sla_breached
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN users u ON c.citizen_id = u.id
      WHERE 1=1
    `;

    // Role-based filtering
    if (userRole === "citizen") {
      query += ` AND c.citizen_id = $1`;
    } else if (userRole === "officer") {
      query += ` AND c.officer_id = (SELECT id FROM officers WHERE user_id = $1)`;
    }

    // Apply additional filters
    if (filters.department_id) query += ` AND c.department_id = ${filters.department_id}`;
    if (filters.status) query += ` AND c.status = '${filters.status}'`;
    if (filters.priority) query += ` AND c.priority = '${filters.priority}'`;
    if (filters.date_from) query += ` AND c.created_at >= '${filters.date_from}'`;
    if (filters.date_to) query += ` AND c.created_at <= '${filters.date_to}'`;

    query += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(query, userRole === "citizen" ? [userId] : [userId]);
    const complaints = result.rows;

    if (format === "csv") {
      try {
        const csv = new Parser({
          fields: ["complaint_number", "title", "department_name", "priority", "status", 
                   "citizen_name", "location", "rating", "sla_breached", "created_at"]
        }).parse(complaints);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="complaints-${Date.now()}.csv"`);
        res.send(csv);
      } catch (e) {
        throw new Error("CSV generation failed: " + e.message);
      }
    } else if (format === "json") {
      res.json({ success: true, data: complaints, count: complaints.length });
    } else {
      throw new Error("Unsupported export format");
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// ADVANCED SEARCH & FILTERING
// ============================================

export const advancedSearch = async (req, res) => {
  try {
    const { query, filters = {}, page = 1, limit = 20 } = req.body;
    const userId = req.user?.id;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT c.*, d.name as department_name, u.name as citizen_name
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN users u ON c.citizen_id = u.id
      WHERE 1=1
    `;

    const params = [];

    // Text search (add parameter dynamically)
    if (query) {
      params.push(`%${query}%`);
      const idx = params.length;
      sql += ` AND (c.title ILIKE $${idx} OR c.description ILIKE $${idx} OR c.complaint_number::text = $${idx}::text)`;
    }

    // Filters (safe interpolation for numbers/ids)
    if (filters.department_id) sql += ` AND c.department_id = ${parseInt(filters.department_id)}`;
    if (filters.status) sql += ` AND c.status = '${String(filters.status)}'`;
    if (filters.priority) sql += ` AND c.priority = '${String(filters.priority)}'`;
    if (filters.rating) sql += ` AND c.rating >= ${parseFloat(filters.rating)}`;
    if (filters.date_from) sql += ` AND c.created_at >= '${String(filters.date_from)}'`;
    if (filters.date_to) sql += ` AND c.created_at <= '${String(filters.date_to)}'`;
    if (filters.sla_breach) sql += ` AND (c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed'))`;

    // Add pagination params
    params.push(limit);
    params.push(offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    sql += ` ORDER BY c.created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`;

    const result = await pool.query(sql, params);

    // Build count query with same filters (without pagination)
    let countSql = `SELECT COUNT(*) FROM complaints c WHERE 1=1`;
    if (filters.department_id) countSql += ` AND c.department_id = ${parseInt(filters.department_id)}`;
    if (filters.status) countSql += ` AND c.status = '${String(filters.status)}'`;
    if (filters.priority) countSql += ` AND c.priority = '${String(filters.priority)}'`;
    if (filters.rating) countSql += ` AND c.rating >= ${parseFloat(filters.rating)}`;
    if (filters.date_from) countSql += ` AND c.created_at >= '${String(filters.date_from)}'`;
    if (filters.date_to) countSql += ` AND c.created_at <= '${String(filters.date_to)}'`;
    if (filters.sla_breach) countSql += ` AND (c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed'))`;

    // If query present, use parameterized count
    let total = 0;
    if (query) {
      const countResult = await pool.query(countSql + ` AND (c.title ILIKE $1 OR c.description ILIKE $1 OR c.complaint_number::text = $1::text)`, [`%${query}%`]);
      total = parseInt(countResult.rows[0].count);
    } else {
      const countResult = await pool.query(countSql);
      total = parseInt(countResult.rows[0].count);
    }

    res.json({
      success: true,
      data: result.rows,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// ESCALATION MANAGEMENT
// ============================================

export const escalateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { reason, targetDepartmentId } = req.body;
    const userId = req.user?.id;

    // Get officer info
    const officer = await pool.query("SELECT id FROM officers WHERE user_id = $1", [userId]);
    if (!officer.rows.length) {
      return res.status(403).json({ success: false, message: "Only officers can escalate" });
    }

    // Create escalation record
    const escalation = await pool.query(
      `INSERT INTO complaint_escalations (complaint_id, escalated_from, escalated_to_department_id, escalation_reason)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [complaintId, officer.rows[0].id, targetDepartmentId, reason]
    );

    // Update complaint escalation count
    await pool.query(
      "UPDATE complaints SET escalation_count = escalation_count + 1 WHERE id = $1",
      [complaintId]
    );

    res.json({
      success: true,
      message: "Complaint escalated successfully",
      data: escalation.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// COMMENTS & DISCUSSION THREADS
// ============================================

export const addComment = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { content, isInternal = false } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Comment must be at least 5 characters" });
    }

    const comment = await pool.query(
      `INSERT INTO complaint_comments (complaint_id, user_id, content, is_internal)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [complaintId, userId, content, isInternal]
    );

    res.json({
      success: true,
      message: "Comment added",
      data: comment.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getComplaintComments = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userRole = req.user?.role;

    let query = `
      SELECT cc.id, cc.content, cc.is_internal, cc.created_at,
             u.name as author_name, u.role as author_role
      FROM complaint_comments cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.complaint_id = $1
    `;

    // Citizens can't see internal comments
    if (userRole === "citizen") {
      query += ` AND cc.is_internal = false`;
    }

    query += ` ORDER BY cc.created_at ASC`;

    const result = await pool.query(query, [complaintId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// SURVEYS & FEEDBACK
// ============================================

export const submitSurvey = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { satisfactionScore, feedback, suggestions } = req.body;

    if (!satisfactionScore || satisfactionScore < 1 || satisfactionScore > 5) {
      return res.status(400).json({ success: false, message: "Invalid satisfaction score" });
    }

    const survey = await pool.query(
      `INSERT INTO complaint_surveys (complaint_id, satisfaction_score, process_feedback, suggestions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [complaintId, satisfactionScore, feedback, suggestions]
    );

    // Update department metrics
    await updateDepartmentMetrics(complaintId);

    res.json({
      success: true,
      message: "Survey submitted",
      data: survey.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// PUBLIC STATISTICS
// ============================================

export const getPublicStatistics = async (req, res) => {
  try {
    // Total complaints
    const total = await pool.query("SELECT COUNT(*) FROM complaints");
    const resolved = await pool.query("SELECT COUNT(*) FROM complaints WHERE status = 'resolved'");
    const pending = await pool.query("SELECT COUNT(*) FROM complaints WHERE status = 'pending'");
    const inProgress = await pool.query("SELECT COUNT(*) FROM complaints WHERE status = 'in-progress'");

    // Department stats
    const deptStats = await pool.query(`
      SELECT d.name, COUNT(c.id) as count, 
             COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved
      FROM departments d
      LEFT JOIN complaints c ON d.id = c.department_id
      GROUP BY d.id, d.name
      ORDER BY count DESC
    `);

    // Average resolution time
    const avgTime = await pool.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_hours
      FROM complaints
      WHERE resolved_at IS NOT NULL
    `);

    // Citizen satisfaction
    const satisfaction = await pool.query(`
      SELECT AVG(satisfaction_score) as avg_satisfaction
      FROM complaint_surveys
    `);

    res.json({
      success: true,
      data: {
        total_complaints: parseInt(total.rows[0].count),
        resolved: parseInt(resolved.rows[0].count),
        pending: parseInt(pending.rows[0].count),
        in_progress: parseInt(inProgress.rows[0].count),
        resolution_rate: parseInt(total.rows[0].count) > 0 
          ? Math.round((parseInt(resolved.rows[0].count) / parseInt(total.rows[0].count)) * 100)
          : 0,
        average_resolution_time: avgTime.rows[0].avg_hours ? Math.round(avgTime.rows[0].avg_hours) : 0,
        citizen_satisfaction: satisfaction.rows[0].avg_satisfaction 
          ? parseFloat(satisfaction.rows[0].avg_satisfaction).toFixed(2)
          : 0,
        department_breakdown: deptStats.rows
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// OFFICER WORKLOAD METRICS
// ============================================

export const getOfficerWorkload = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, u.name, u.email,
             COUNT(c.id) as total_assigned,
             COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending,
             COUNT(CASE WHEN c.status = 'in-progress' THEN 1 END) as in_progress,
             COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved','closed') THEN 1 END) as overdue,
             ROUND(AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/3600)::numeric, 2) as avg_resolution_hours,
             AVG(c.rating) as avg_rating
      FROM officers o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN complaints c ON o.id = c.officer_id
      WHERE o.is_active = true
      GROUP BY o.id, u.name, u.email
      ORDER BY total_assigned DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const updateDepartmentMetrics = async (complaintId) => {
  try {
    const complaint = await pool.query("SELECT department_id FROM complaints WHERE id = $1", [complaintId]);
    if (!complaint.rows.length) return;

    const deptId = complaint.rows[0].department_id;

    const stats = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
             ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)::numeric, 2) as avg_hours,
             AVG(rating) as satisfaction
      FROM complaints
      WHERE department_id = $1
    `, [deptId]);

    const row = stats.rows[0];
    const resolutionRate = row.total > 0 ? Math.round((row.resolved / row.total) * 100) : 0;

    await pool.query(`
      INSERT INTO department_metrics (department_id, total_complaints, resolved_count, resolution_rate, avg_resolution_time, citizen_satisfaction)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (department_id) DO UPDATE SET
        total_complaints = $2,
        resolved_count = $3,
        resolution_rate = $4,
        avg_resolution_time = $5,
        citizen_satisfaction = $6,
        last_updated = NOW()
    `, [deptId, row.total, row.resolved, resolutionRate, row.avg_hours, row.satisfaction]);
  } catch (err) {
    console.error("Error updating department metrics:", err);
  }
};

export default {
  exportComplaints,
  advancedSearch,
  escalateComplaint,
  addComment,
  getComplaintComments,
  submitSurvey,
  getPublicStatistics,
  getOfficerWorkload
};
