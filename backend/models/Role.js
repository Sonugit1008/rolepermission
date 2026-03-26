import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Role = sequelize.define("roles", {
  role_name: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER
}, { timestamps: true });

export default Role;