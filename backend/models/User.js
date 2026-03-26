import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("users", {
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role_id: DataTypes.INTEGER
});

export default User;