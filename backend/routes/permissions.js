import express from "express";
import {
  getAllPermissions,
  getControllers,
  createPermission,
  updatePermission,
  deletePermission,
  getControllerPermissions 
} from "../controllers/PermissionController.js";

import auth from "../middleware/auth.js";
import { Role } from "../models/index.js";

const router = express.Router();
const superAdminOnly = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.user.role_id);
    if (!role || role.role_name !== "Super Admin") {
      return res.status(403).json({ msg: "Only Super Admin allowed" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ msg: "Role check failed", error: error.message });
  }
};
router.use(auth, superAdminOnly);

// Routes
router.get("/", getAllPermissions);
router.get("/controllers", getControllers);
router.get("/controllers/:controller", getControllerPermissions);

router.post("/", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;