import { Role, Permission, RolePermission } from "../models/index.js";

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching roles", error: error.message });
  }
};


// Get role by ID with permissions
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: {
        model: Permission,
        through: { where: { status: 1 }, attributes: ["status"] }
      }
    });

    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    res.json(role);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching role", error: error.message });
  }
};

// Create role
const createRole = async (req, res) => {
  try {
    const role = await Role.create({ role_name: req.body.role_name });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ msg: "Error creating role", error: error.message });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    role.role_name = req.body.role_name || role.role_name;
    await role.save();

    res.json(role);
  } catch (error) {
    res.status(500).json({ msg: "Error updating role", error: error.message });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    await RolePermission.destroy({ where: { role_id: role.id } });
    await role.destroy();

    res.json({ msg: "Role deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting role", error: error.message });
  }
};

// Assign permissions to role
const assignPermissions = async (req, res) => {
  try {
    const { role_id, permissions } = req.body;
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    // Remove existing permissions
    await RolePermission.destroy({ where: { role_id } });

    // Add new permissions
    const rolePermissions = permissions.map((permission_id) => ({
      role_id,
      permission_id,
      status: true
    }));

    await RolePermission.bulkCreate(rolePermissions);

    res.json({ msg: "Permissions assigned successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error assigning permissions", error: error.message });
  }
};

// ✅ Final export
export {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
};