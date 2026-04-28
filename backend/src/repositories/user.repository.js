import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, aadhaar, address, avatar_url,
            is_active, last_login_at, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const createUser = async ({ name, email, password, phone, role, aadhaar, address }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role, aadhaar, address)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, phone, role, aadhaar, address, is_active, created_at`,
    [name.trim(), email.toLowerCase().trim(), password, phone || null, role || "citizen", aadhaar || null, address || null]
  );
  return result.rows[0];
};

export const updateUser = async (id, fields) => {
  if (!Object.keys(fields).length) return findUserById(id);
  const allowed = ["name", "phone", "address", "aadhaar", "avatar_url", "is_active", "last_login_at", "password", "password_changed_at"];
  const filtered = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(filtered).length) return findUserById(id);
  const keys = Object.keys(filtered);
  const values = Object.values(filtered);
  const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE users SET ${setClause}, updated_at = NOW()
     WHERE id = $${keys.length + 1}
     RETURNING id, name, email, phone, role, aadhaar, address, avatar_url, is_active, last_login_at, created_at, updated_at`,
    [...values, id]
  );
  return result.rows[0];
};

export const updateLastLogin = async (id) => {
  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [id]);
};

export const changePassword = async (id, hashedPassword) => {
  await pool.query(
    "UPDATE users SET password = $1, password_changed_at = NOW(), updated_at = NOW() WHERE id = $2",
    [hashedPassword, id]
  );
};

export const getAllCitizens = async ({ page = 1, limit = 20, search = "", is_active }) => {
  const offset = (page - 1) * limit;
  const conditions = ["role = 'citizen'"];
  const values = [];
  let idx = 1;

  if (search) {
    conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }
  if (is_active !== undefined) {
    conditions.push(`is_active = $${idx++}`);
    values.push(is_active);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const result = await pool.query(
    `SELECT id, name, email, phone, role, aadhaar, is_active, last_login_at, created_at
     FROM users ${where}
     ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );
  const count = await pool.query(`SELECT COUNT(*) FROM users ${where}`, values);
  return { users: result.rows, total: parseInt(count.rows[0].count) };
};

export const storeRefreshToken = async ({ userId, token, expiresAt, ipAddress, userAgent }) => {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, token, expiresAt, ipAddress || null, userAgent || null]
  );
};

export const findRefreshToken = async (token) => {
  const result = await pool.query(
    `SELECT rt.*, u.id AS uid, u.role, u.name, u.email, u.is_active
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = $1 AND rt.is_revoked = false AND rt.expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
};

export const revokeRefreshToken = async (token) => {
  await pool.query("UPDATE refresh_tokens SET is_revoked = true WHERE token = $1", [token]);
};

export const revokeAllUserTokens = async (userId) => {
  await pool.query("UPDATE refresh_tokens SET is_revoked = true WHERE user_id = $1", [userId]);
};

export const getSystemSetting = async (key) => {
  const result = await pool.query("SELECT value FROM system_settings WHERE key = $1", [key]);
  return result.rows[0]?.value || null;
};

export const getAllSettings = async () => {
  const result = await pool.query("SELECT key, value, description, updated_at FROM system_settings ORDER BY key");
  return result.rows;
};

export const updateSetting = async (key, value, updatedBy) => {
  const result = await pool.query(
    `INSERT INTO system_settings (key, value, updated_by, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3, updated_at = NOW()
     RETURNING *`,
    [key, value, updatedBy]
  );
  return result.rows[0];
};
