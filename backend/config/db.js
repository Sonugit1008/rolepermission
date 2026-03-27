import { Sequelize } from "sequelize";

const sequelize = new Sequelize("site_tracker", "root", "qwaszx", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

export default sequelize;