import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import menuItemsRoutes from "./routes/menuItems.routes";
import tiffinItems from "./routes/tiffinItems.rotues";
import menuRoutes from "./routes/menu.routes";
import orderRoutes from "./routes/order.routes";
import currentUserRoute from "./routes/currentuser.routes";
import newOrderRoutes from "./routes/newOrder.routes";
import profileRoutes from "./routes/profile.routes";
import { errorHandler } from "./routes/errorhandle";
import { sessionMiddleware } from './middleware/session.middlware';
import { authMiddleware } from "./middleware/auth.middleware";
import { roleMiddleware } from "./middleware/role.middleware";
import { allowedOrigins, isProduction } from "./utils/envVariables";

const app = express();

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    credentials: true,
  })
);

app.use(sessionMiddleware);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/menu-items", menuItemsRoutes, roleMiddleware([1, 2]));

app.use("/api/tiffin-items", authMiddleware, roleMiddleware([1, 2]), tiffinItems);

app.use("/api/profile", authMiddleware, profileRoutes);

app.use("/api/orders", authMiddleware, orderRoutes);

app.use("/api/new-order", authMiddleware, newOrderRoutes);

app.use("/api/current-user", authMiddleware, currentUserRoute);


app.use("/", errorHandler);

export default app;
