import { useEffect, useState } from "react";
import axios from "../api/axios";
import { getRole, getRoleName,getUserType } from "../auth/auth";

export default function Sidebar({children}) {
  const [menu, setMenu] = useState([]);
  const [roleName, setRoleName] = useState(getRoleName() || "");
  const [userType, setUserType] = useState(getUserType() || "");


  useEffect(() => {
    axios.get(`/menu/${getRole()}`)
      .then(res => setMenu(res.data));

    if (!roleName) {
      axios.get("/auth/me")
        .then(res => {
          setRoleName(res.data.role_name);
          localStorage.setItem("role_name", res.data.role_name);
          setUserType(res.data.user_type)
        })
        .catch(() => setRoleName(""));
    }
  }, [roleName]);

  const can = (method) => {
    return menu.some(m => m.method === method);
  };
  
  const isSuperAdmin = roleName === "Super Admin";
  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 fixed h-full">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <ul className="space-y-2">
          {can("dashboard") && (
            <li>
              <a href="/" className="block px-3 py-2 rounded hover:bg-slate-100">
                Dashboard
              </a>
            </li>
          )}
          {can("getAllData") && (
            <li>
              <a href="/orders" className="block px-3 py-2 rounded hover:bg-slate-100">
                Orders
              </a>
            </li>
          )}
          {(can("getAllUsers") || (userType==='1')) && (
            <li>
              <a href="/users" className="block px-3 py-2 rounded hover:bg-slate-100">
                Users
              </a>
            </li>
          )}
          <li>
            <a href="/roles" className="block px-3 py-2 rounded hover:bg-slate-100">
              Roles
            </a>
          </li>
          {(isSuperAdmin && userType==='1') && (
            <li>
              <a href="/permissions" className="block px-3 py-2 rounded hover:bg-slate-100">
                Permissions
              </a>
            </li>
          )}
        </ul>

        <button
          className="mt-6 w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Dashboard Content */}
      { children }
    </div>
  );
}