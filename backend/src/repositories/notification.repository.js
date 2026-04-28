import pool from "../config/db.js";

export const createNotification = async ({ userId, title, message, type, complaintId }) => {
  try {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, complaint_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, title, message, type || "info", complaintId || null]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Notification create failed:", err.message);
    return null;
  }
};

export const getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const [dataResult, unreadResult] = await Promise.all([
    pool.query(
      `SELECT n.*, c.complaint_number
       FROM notifications n
       LEFT JOIN complaints c ON n.complaint_id = c.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ),
    pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    ),
  ]);
  return {
    notifications: dataResult.rows,
    unread_count: parseInt(unreadResult.rows[0].count),
    page,
    limit,
  };
};

export const markNotificationsRead = async (userId) => {
  const result = await pool.query(
    "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false RETURNING id",
    [userId]
  );
  return result.rowCount;
};

export const markOneNotificationRead = async (notificationId, userId) => {
  const result = await pool.query(
    "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *",
    [notificationId, userId]
  );
  if (!result.rows.length) throw { status: 404, message: "Notification not found" };
  return result.rows[0];
};
