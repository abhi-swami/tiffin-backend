import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { db } from "./db";

const app = express();

async function testDB() {
  try {
    const result = await db.execute("SELECT 1");
    console.log("DB Connected ✅", result);
  } catch (err) {
    console.error("DB Error ❌", err);
  }
}

testDB();


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

export default app;