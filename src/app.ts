import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import menuItemsRoutes from "./routes/menuItems.routes";
import tiffinItems from "./routes/tiffinItems.rotues";
import menuRoutes from "./routes/menu.routes";
import { errorHandler } from "./routes/errorhandle";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/menu-items", menuItemsRoutes);

app.use("/api/tiffin-items", tiffinItems);


app.use("/", errorHandler);

export default app;