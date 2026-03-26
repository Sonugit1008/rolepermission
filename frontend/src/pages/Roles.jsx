import { useEffect, useState } from "react";
import axios from "../api/axios";
import RoleModal from "../components/RoleModal";
import Sidebar from "../components/Sidebar";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [newRole, setNewRole] = useState("");

  const loadRoles = async () => {
    const res = await axios.get("/roles");
    setRoles(res.data);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const createRole = async () => {
    if (!newRole.trim()) return;
    await axios.post("/roles", { role_name: newRole });
    setNewRole("");
    loadRoles();
  };

  const deleteRole = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    await axios.delete(`/roles/${id}`);
    loadRoles();
  };

  return (
   <Sidebar>
  <main className="flex-1 p-6 ml-64 bg-gray-50 min-h-screen">
    {/* Header */}
    <h2 className="text-2xl font-bold mb-6">Roles Management</h2>

    {/* Add Role Form */}
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Role</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter role name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={createRole}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Role
        </button>
      </div>
    </div>

    {/* Roles List */}
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">All Roles</h3>
      {roles.length === 0 ? (
        <p className="text-gray-500">No roles found.</p>
      ) : (
        <ul className="space-y-3">
          {roles.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between border rounded p-3 hover:bg-gray-50 transition"
            >
              <span className="font-medium">{r.role_name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setRoleId(r.id)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  Assign
                </button>
                <button
                  onClick={() => deleteRole(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Role Modal */}
    {roleId && (
      <RoleModal
        roleId={roleId}
        onSaved={() => {
          loadRoles();
          setRoleId(null);
        }}
        onClose={() => setRoleId(null)}
      />
    )}
  </main>
</Sidebar>
  );
}