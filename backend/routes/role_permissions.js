import express from "express";
import {
  getAllRolePermissions,
  getRolePermissionsByRole,
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
  bulkAssignPermissions,
} from "../controllers/RolePermissionController.js";

const router = express.Router();

router.get("/", getAllRolePermissions);
router.get("/role/:role_id", getRolePermissionsByRole);
router.post("/", createRolePermission);
router.put("/:id", updateRolePermission);
router.delete("/:id", deleteRolePermission);
router.post("/bulk-assign", bulkAssignPermissions);

export default router;