import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";

import authRoutes from "./routes/auth.js";
import roleRoutes from "./routes/roles.js";
import permissionRoutes from "./routes/permissions.js";
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import menuRoutes from "./routes/menu.js";
import rolePermissionRoutes from "./routes/role_permissions.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Server running"));
});
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});
export default app;