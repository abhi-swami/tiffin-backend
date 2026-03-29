import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});

export const db = drizzle(pool);

export async function connectToDatabase() {
  await pool.query("select 1");
  console.log("Database connection established");
}

export async function closeDatabaseConnection() {
  await pool.end();
}
