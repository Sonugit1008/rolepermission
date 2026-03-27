import { RolePermission, Role, Permission } from "../models/index.js";

// Get all role permissions
const getAllRolePermissions = async (req, res) => {
  try {
    const rolePermissions = await RolePermission.findAll({
      include: [Role, Permission]
    });
    res.json(rolePermissions);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching role permissions", error: error.message });
  }
};

// Get role permissions by role ID
const getRolePermissionsByRole = async (req, res) => {
  try {
    const { role_id } = req.params;

    const rolePermissions = await RolePermission.findAll({
      where: { role_id },
      include: [Permission]
    });

    res.json(rolePermissions);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching role permissions", error: error.message });
  }
};


// // Create role permission
// const createRolePermission = async (req, res) => {
//   try {
//     const { role_id, permission_id, status } = req.body;

//     const rolePermission = await RolePermission.create({
//       role_id,
//       permission_id,
//       status
//     });

//     res.status(201).json(rolePermission);
//   } catch (error) {
//     res.status(500).json({ msg: "Error creating role permission", error: error.message });
//   }
// };

// // Update role permission
// const updateRolePermission = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const rolePermission = await RolePermission.findByPk(id);
//     if (!rolePermission) {
//       return res.status(404).json({ msg: "Role permission not found" });
//     }

//     await rolePermission.update(req.body);
//     res.json(rolePermission);
//   } catch (error) {
//     res.status(500).json({ msg: "Error updating role permission", error: error.message });
//   }
// };

// // Delete role permission
// const deleteRolePermission = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const rolePermission = await RolePermission.findByPk(id);
//     if (!rolePermission) {
//       return res.status(404).json({ msg: "Role permission not found" });
//     }

//     await rolePermission.destroy();
//     res.json({ msg: "Role permission deleted" });
//   } catch (error) {
//     res.status(500).json({ msg: "Error deleting role permission", error: error.message });
//   }
// };

// // Bulk assign permissions to role
// const bulkAssignPermissions = async (req, res) => {
//   try {
//     const { role_id, permission_ids } = req.body;

//     // Remove existing permissions
//     await RolePermission.destroy({ where: { role_id } });

//     // Create new permissions
//     const rolePermissions = permission_ids.map((permission_id) => ({
//       role_id,
//       permission_id,
//       status: true
//     }));

//     await RolePermission.bulkCreate(rolePermissions);

//     res.json({ msg: "Permissions assigned successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "Error assigning permissions", error: error.message });
//   }
// };

// ✅ Final export
export {
  getAllRolePermissions,
  getRolePermissionsByRole,
  // createRolePermission,
  // updateRolePermission,
  // deleteRolePermission,
  // bulkAssignPermissions,
};