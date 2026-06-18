import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected error on idle client", err);
});

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("[DB] Query executed", {
    text: text.substring(0, 50),
    duration: `${duration}ms`,
    rows: result.rowCount,
  });
  return result.rows as T[];
}

export async function queryOne<T>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function getClient() {
  return pool.connect();
}

export async function closePool() {
  await pool.end();
}
