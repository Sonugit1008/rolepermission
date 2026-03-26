import express from "express";
import { Permission, RolePermission } from "../models/index.js";

const router = express.Router();

router.get("/:role_id", async (req, res) => {
  const perms = await RolePermission.findAll({
    where: { role_id: req.params.role_id, status: 1 }
  });

  const ids = perms.map(p => p.permission_id);

  const menu = await Permission.findAll({ where: { id: ids } });

  res.json(menu);
});

export default router;