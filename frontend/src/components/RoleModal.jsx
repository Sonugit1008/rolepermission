import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function RoleModal({ roleId, onSaved, onClose }) {
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState([]);

  const loadPermissions = async () => {
    const res = await axios.get("/permissions");
    setPermissions(res.data);
  };

  const loadRole = async () => {
    const res = await axios.get(`/roles/${roleId}`);
    const ids = res.data.permissions ? res.data.permissions.map(p => p.id) : [];
    setSelected(ids);
  };
  
  useEffect(() => {
    loadPermissions();
    loadRole();
  }, [roleId]);


  const grouped = permissions.reduce((acc, p) => {
    acc[p.module] = acc[p.module] || [];
    acc[p.module].push(p);
    return acc;
  }, {});

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = (module) => {
    const ids = permissions
      .filter(p => p.module === module)
      .map(p => p.id);

    setSelected(prev => [...new Set([...prev, ...ids])]);
  };

  const save = async () => {
    await axios.post("/roles/assign-permissions", {
      role_id: roleId,
      permissions: selected
    });

    alert("Saved");
    if (onSaved) onSaved();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Edit Role Permissions</h3>
        <button className="text-slate-500 hover:text-slate-700" onClick={() => onClose?.()}>Close</button>
      </div>

      <div className="space-y-4">
        {Object.keys(grouped).map(module => (
          <div key={module} className="border rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <input className="h-4 w-4" type="checkbox" onChange={() => selectAll(module)} />
              <span className="font-semibold">{module}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {grouped[module].map(p => (
                <label key={p.id} className="inline-flex items-center gap-2 p-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                  {p.method_title}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={save}>Save</button>
    </div>
  );
}