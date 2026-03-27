import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, Role } from "../models/index.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).json({ msg: "Invalid" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid" });
  const role = await Role.findByPk(user.role_id);
  const token = jwt.sign({
    id: user.id,
    role_id: user.role_id,
    user_type:user.user_type,
  }, process.env.JWT_SECRET);

  res.json({ token,user_type:user.user_type, role_id: user.role_id, role_name: role?.role_name || "" });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findByPk(req.user.id, { include: Role });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ id: user.id, email: user.email, role_id: user.role_id,user_type:user.user_type, role_name: user.Role?.role_name || null });
});

export default router;