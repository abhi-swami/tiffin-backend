import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { databaseUrl } from '../utils/envVariables';

if (!databaseUrl) {
  throw new Error(`Database URL is required`);
}

const pool = new Pool({ connectionString: databaseUrl });

pool.on("error", (err) => {
  console.error("Unexpected postgres pool error", err);
  throw new Error("Unexpected postgres pool error");
})


const db = drizzle(pool);

async function connectToDB() {
  try {
    await pool.query("SELECT 1");
    console.log("Db connected is established")
  } catch (err) {
    throw new Error(`Unable to establish new DB Connection: ${err}`);

  }
}


async function closeDBConnection() {
  try {
    await pool.end()

  } catch (err) {
    throw new Error(`unable to disconnect DB: ${err}`)
  }
}

export { pool, db, connectToDB, closeDBConnection }
