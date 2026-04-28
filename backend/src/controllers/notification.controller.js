import { getUserNotifications, markNotificationsRead, markOneNotificationRead } from "../repositories/notification.repository.js";

export const getNotifications = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getUserNotifications(req.user.id, {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(50, parseInt(limit) || 20),
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const markRead = async (req, res, next) => {
  try {
    const count = await markNotificationsRead(req.user.id);
    res.json({ success: true, message: `${count} notifications marked as read` });
  } catch (err) { next(err); }
};

export const markOneRead = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid notification ID" });
    const notification = await markOneNotificationRead(id, req.user.id);
    res.json({ success: true, data: notification });
  } catch (err) { next(err); }
};
