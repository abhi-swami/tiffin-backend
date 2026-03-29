import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

const dbURL = process.env.DATABASE_URL as string

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbURL,
  },
});
