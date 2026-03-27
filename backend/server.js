import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";

import sequelize from "./config/db.js";

import authRoutes from "./routes/auth.js";
import roleRoutes from "./routes/roles.js";
import permissionRoutes from "./routes/permissions.js";
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import menuRoutes from "./routes/menu.js";
import rolePermissionRoutes from "./routes/role_permissions.js";
import auth from "./middleware/auth.js";
import isAdmin from "./middleware/IsAdmin.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles",auth, roleRoutes);
app.use("/api/permissions",isAdmin,permissionRoutes);
app.use("/api/users",auth, userRoutes);
app.use("/api/orders",auth, orderRoutes);
app.use("/api/menu",auth, menuRoutes);
app.use("/api/role-permissions",auth, rolePermissionRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => console.log(`Server running Port ${process.env.PORT}` ));
});
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});
export default app;