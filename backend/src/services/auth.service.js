import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail, createUser, findUserById, updateLastLogin,
  changePassword, storeRefreshToken, findRefreshToken,
  revokeRefreshToken, revokeAllUserTokens
} from "../repositories/user.repository.js";
import { createOfficer, getOfficerByUserId } from "../repositories/officer.repository.js";
import { createAuditLog } from "../repositories/audit.repository.js";

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "7");

export const registerUser = async (data, ipAddress, userAgent) => {
  const { name, email, password, phone, role, aadhaar, address, department_id, designation } = data;

  if (role === "admin") throw { status: 403, message: "Admin accounts cannot be self-registered" };

  const existing = await findUserByEmail(email);
  if (existing) throw { status: 409, message: "An account with this email already exists" };

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, password: hashedPassword, phone, role: role || "citizen", aadhaar, address });

  if (user.role === "officer" && department_id) {
    await createOfficer({ userId: user.id, departmentId: department_id, designation });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt, ipAddress, userAgent });

  await createAuditLog({
    action: `New ${user.role} registered: ${user.name} (${user.email})`,
    entityType: "user",
    entityId: user.id,
    performedBy: user.id,
    role: user.role,
    ipAddress,
    userAgent,
  });

  const { password: _, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }, ipAddress, userAgent) => {
  const user = await findUserByEmail(email);
  if (!user) throw { status: 401, message: "Invalid email or password" };
  if (!user.is_active) throw { status: 403, message: "Your account has been deactivated. Please contact the administrator." };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await createAuditLog({
      action: `Failed login attempt for: ${email}`,
      entityType: "user",
      entityId: user.id,
      performedBy: null,
      role: null,
      ipAddress,
      userAgent,
    });
    throw { status: 401, message: "Invalid email or password" };
  }

  await updateLastLogin(user.id);

  let officerInfo = null;
  if (user.role === "officer") {
    officerInfo = await getOfficerByUserId(user.id);
    if (officerInfo && !officerInfo.is_active) {
      throw { status: 403, message: "Your officer account has been deactivated." };
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt, ipAddress, userAgent });

  await createAuditLog({
    action: `User logged in: ${user.name} (${user.email})`,
    entityType: "user",
    entityId: user.id,
    performedBy: user.id,
    role: user.role,
    ipAddress,
    userAgent,
  });

  const { password: _, ...safeUser } = user;
  return { user: { ...safeUser, officer: officerInfo }, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken, ipAddress, userAgent) => {
  const stored = await findRefreshToken(refreshToken);
  if (!stored) throw { status: 401, message: "Invalid or expired refresh token" };
  if (!stored.is_active) throw { status: 403, message: "Account is deactivated" };

  await revokeRefreshToken(refreshToken);

  const user = { id: stored.uid, email: stored.email, role: stored.role, name: stored.name };
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await storeRefreshToken({ userId: stored.uid, token: newRefreshToken, expiresAt, ipAddress, userAgent });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken, userId, ipAddress, userAgent) => {
  if (refreshToken) await revokeRefreshToken(refreshToken);
  await createAuditLog({
    action: `User logged out`,
    entityType: "user",
    entityId: userId,
    performedBy: userId,
    role: null,
    ipAddress,
    userAgent,
  });
};

export const logoutAllDevices = async (userId, ipAddress, userAgent) => {
  await revokeAllUserTokens(userId);
  await createAuditLog({
    action: `User logged out from all devices`,
    entityType: "user",
    entityId: userId,
    performedBy: userId,
    role: null,
    ipAddress,
    userAgent,
  });
};

export const getProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw { status: 404, message: "User not found" };
  let officerInfo = null;
  if (user.role === "officer") officerInfo = await getOfficerByUserId(userId);
  return { ...user, officer: officerInfo };
};

export const updatePassword = async (userId, currentPassword, newPassword, ipAddress, userAgent) => {
  const user = await findUserByEmail(
    (await findUserById(userId)).email
  );
  const fullUser = await findUserByEmail(user.email);
  const isMatch = await bcrypt.compare(currentPassword, fullUser.password);
  if (!isMatch) throw { status: 400, message: "Current password is incorrect" };
  if (currentPassword === newPassword) throw { status: 400, message: "New password must differ from current password" };
  const hashed = await bcrypt.hash(newPassword, 12);
  await changePassword(userId, hashed);
  await revokeAllUserTokens(userId);
  await createAuditLog({
    action: `Password changed for user ID ${userId}`,
    entityType: "user",
    entityId: userId,
    performedBy: userId,
    role: null,
    ipAddress,
    userAgent,
  });
};
