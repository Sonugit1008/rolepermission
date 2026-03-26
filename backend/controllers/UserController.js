import bcrypt from "bcryptjs";
import { User, Role } from "../models/index.js";

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: Role });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Role });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user", error: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
      role_id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error creating user", error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { email, password, role_id } = req.body;

    const updateData = {
      email,
      role_id,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error updating user", error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.destroy();

    res.json({ msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting user", error: error.message });
  }
};

// ✅ Final export
export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};