import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", role_id: "" });
  const [roles, setRoles] = useState([]);

  const loadUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data);
  };

  const loadRoles = async () => {
    const res = await axios.get("/roles");
    setRoles(res.data);
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const create = async () => {
    if (!form.email || !form.password || !form.role_id) return;
    await axios.post("/users", form);
    setForm({ email: "", password: "", role_id: "" });
    loadUsers();
  };

  return (
    <Sidebar>
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Users</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <input className="border rounded p-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" className="border rounded p-2" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <select className="border rounded p-2" value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })}>
              <option value="">Select role</option>
              {roles.map(role => <option key={role.id} value={role.id}>{role.role_name}</option>)}
            </select>
            <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={create}>Create user</button>
          </div>

          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.Role?.role_name || user.role_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Sidebar>

  );
}
