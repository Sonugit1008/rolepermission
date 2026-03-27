import express from "express";
import {
  getAllPermissions,
  getControllers,
  createPermission,
  updatePermission,
  deletePermission,
  getControllerPermissions 
} from "../controllers/PermissionController.js";
// Routes

const router = express.Router();

router.get("/", getAllPermissions);
router.get("/controllers", getControllers);
router.get("/controllers/:controller", getControllerPermissions);

router.post("/", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;