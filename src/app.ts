import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import menuRoutes from "./routes/menuItems.routes";
import tiffinItems from "./routes/tiffinItems.rotues";
import { errorHandler } from "./routes/errorhandle";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/menu-items", menuRoutes);

app.use("/api/tiffin-items", tiffinItems);

app.use("/", errorHandler);

export default app;