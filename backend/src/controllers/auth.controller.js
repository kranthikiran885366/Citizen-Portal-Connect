import {
  registerUser, loginUser, getProfile, refreshAccessToken,
  logoutUser, logoutAllDevices, updatePassword
} from "../services/auth.service.js";
import { updateUser, getAllSettings, updateSetting } from "../repositories/user.repository.js";
import { createAuditLog } from "../repositories/audit.repository.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body, req.ip, req.headers["user-agent"]);
    res.status(201).json({ success: true, message: "Registration successful", data: result });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Login successful", data: result });
  } catch (err) { next(err); }
};

export const refresh = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ success: false, message: "refresh_token is required" });
    const tokens = await refreshAccessToken(refresh_token, req.ip, req.headers["user-agent"]);
    res.json({ success: true, data: tokens });
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    await logoutUser(refresh_token, req.user.id, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) { next(err); }
};

export const logoutAll = async (req, res, next) => {
  try {
    await logoutAllDevices(req.user.id, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Logged out from all devices" });
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const profile = await getProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, aadhaar } = req.body;
    const allowed = {};
    if (name) allowed.name = name.trim();
    if (phone) allowed.phone = phone.trim();
    if (address) allowed.address = address.trim();
    if (aadhaar) allowed.aadhaar = aadhaar.trim();
    if (!Object.keys(allowed).length) return res.status(400).json({ success: false, message: "No valid fields to update" });
    const updated = await updateUser(req.user.id, allowed);
    res.json({ success: true, message: "Profile updated successfully", data: updated });
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ success: false, message: "current_password and new_password are required" });
    if (new_password.length < 8) return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
    await updatePassword(req.user.id, current_password, new_password, req.ip, req.headers["user-agent"]);
    res.json({ success: true, message: "Password changed successfully. Please log in again." });
  } catch (err) { next(err); }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await getAllSettings();
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

export const saveSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ success: false, message: "key and value are required" });
    const setting = await updateSetting(key, String(value), req.user.id);
    await createAuditLog({
      action: `System setting updated: ${key} = ${value}`,
      entityType: "setting",
      entityId: null,
      performedBy: req.user.id,
      role: "admin",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    res.json({ success: true, message: "Setting updated", data: setting });
  } catch (err) { next(err); }
};
