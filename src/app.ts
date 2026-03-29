import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./routes/errorhandle";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/", errorHandler);

export default app;