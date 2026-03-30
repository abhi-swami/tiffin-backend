import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import menuRoutes from "./routes/menu.routes";
import { errorHandler } from "./routes/errorhandle";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/menu-items", menuRoutes);

app.use("/", errorHandler);

export default app;