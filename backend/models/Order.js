import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define("orders", {
  customer_name: DataTypes.STRING,
  product: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  amount: DataTypes.FLOAT,
  status: DataTypes.STRING,
  role_id: DataTypes.INTEGER
}, { timestamps: true });

export default Order;