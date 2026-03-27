import { Role, Permission, RolePermission } from "../models/index.js";

const checkPermission = (controller, method) => {
  return async (req, res, next) => {
    const role = await Role.findByPk(req.user.role_id);
    // ✅ Super Admin
    // if (role.role_name === "Super Admin") return next();
    const permission = await Permission.findOne({
      where: { controller, method, status: 1 }
    });

    if (!permission) return res.status(403).json({ msg: "No permission" });

    const allowed = await RolePermission.findOne({
      where: {
        role_id: role.id,
        permission_id: permission.id,
        status: 1
      }
    });

    if (!allowed) return res.status(403).json({ msg: "Access Denied" });

    next();
  };
};

export default checkPermission;