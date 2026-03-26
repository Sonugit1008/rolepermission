import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RolePermission = sequelize.define("role_permissions", {
  role_id: DataTypes.INTEGER,
  permission_id: DataTypes.INTEGER,
  status: DataTypes.BOOLEAN
}, { timestamps: true });

export default RolePermission;