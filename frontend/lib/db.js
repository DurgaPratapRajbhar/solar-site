// ─── MySQL connection (shared dev DB, database "solar_site") ───
// Settings come from the project root .env (loaded by next.config.mjs).
import mysql from "mysql2/promise";

function makePool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "solar_site",
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 5,
  });
}

// Reuse the pool across hot-reloads in dev
const pool = globalThis.__solarPool || (globalThis.__solarPool = makePool());

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Non-prepared query — DDL (CREATE TABLE) prepared-statement protocol me
// reliably nahi chalta, isliye table banane ke liye ye use karo.
export async function exec(sql) {
  const [rows] = await pool.query(sql);
  return rows;
}
