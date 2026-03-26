import Role from "./Role.js";
import Permission from "./Permission.js";
import RolePermission from "./RolePermission.js";
import User from "./User.js";
import Order from "./Order.js";

// Relations
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id"
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id"
});

User.belongsTo(Role, { foreignKey: "role_id" });
Order.belongsTo(Role, { foreignKey: "role_id" });

export { Role, Permission, RolePermission, User, Order };