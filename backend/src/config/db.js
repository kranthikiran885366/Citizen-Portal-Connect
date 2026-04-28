import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isRemote = process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("localhost") &&
  !process.env.DATABASE_URL.includes("127.0.0.1");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL client error:", err.message);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

export const healthCheck = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT NOW() AS now, version() AS version");
    return { connected: true, timestamp: result.rows[0].now, version: result.rows[0].version };
  } finally {
    client.release();
  }
};

process.on("SIGINT", async () => { await pool.end(); process.exit(0); });
process.on("SIGTERM", async () => { await pool.end(); process.exit(0); });

export default pool;
