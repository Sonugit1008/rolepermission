import sequelize from "./config/db.js";
import bcrypt from "bcryptjs";
import { Role, Permission, RolePermission, User, Order } from "./models/index.js";

const run = async () => {
  await sequelize.sync({ force: true });

  const superAdmin = await Role.create({ role_name: "Super Admin" });
  const userRole = await Role.create({ role_name: "User" });

  const permissions = await Permission.bulkCreate([
    { module: "dashboard", controller: "dashboard", method: "dashboard", method_title: "View Dashboard", status: 1, for_admin: true, for_customer: true },
    { module: "orders", controller: "order", method: "order_list", method_title: "View Orders", status: 1, for_admin: true, for_customer: false },
    { module: "users", controller: "user", method: "user_list", method_title: "View Users", status: 1, for_admin: true, for_customer: false }
  ]);

  await RolePermission.bulkCreate([
    { role_id: superAdmin.id, permission_id: permissions[0].id, status: 1 },
    { role_id: superAdmin.id, permission_id: permissions[1].id, status: 1 },
    { role_id: superAdmin.id, permission_id: permissions[2].id, status: 1 },
    { role_id: userRole.id, permission_id: permissions[0].id, status: 1 }
  ]);

  const admin = await User.create({
    email: "  ",
    password: await bcrypt.hash("123456", 10),
    role_id: superAdmin.id
  });

  const normalUser = await User.create({
    email: "user@example.com",
    password: await bcrypt.hash("123456", 10),
    role_id: userRole.id
  });

  await Order.create({
    customer_name: "John Doe",
    product: "Keyboard",
    quantity: 2,
    amount: 120.0,
    status: "pending",
    role_id: userRole.id
  });

  console.log("Seed completed", { admin, normalUser });
  process.exit(0);
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});