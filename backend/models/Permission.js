import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Permission = sequelize.define("permissions", {
  module: DataTypes.STRING,
  controller: DataTypes.STRING,
  method: DataTypes.STRING,
  method_title: DataTypes.STRING,
  parent_method: DataTypes.STRING,
  status: DataTypes.BOOLEAN,
  for_admin: DataTypes.BOOLEAN,
  for_customer: DataTypes.BOOLEAN
}, { timestamps: true });

export default Permission;