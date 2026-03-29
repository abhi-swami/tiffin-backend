import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { db } from "./db";
import { errorHandler } from "./routes/errorhandle";
import { users } from "./db/schema";

const app = express();

async function testDB() {
  try {
    const result = await db.select().from(users);
    console.log("DB Connected ✅", result);
  } catch (err) {
    console.error("DB Error ❌", err);
  }
}

testDB();


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/", errorHandler);

export default app;