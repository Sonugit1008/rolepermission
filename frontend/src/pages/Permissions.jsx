import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [selectedController, setSelectedController] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rowMessages, setRowMessages] = useState({});

  // Load Controllers
  const loadControllers = async () => {
    const res = await axios.get("/permissions/controllers");
    setControllers(res.data);
  };
  console.log(controllers);

  // Load Permissions
  const loadPermissions = async (controller = "") => {
    setLoading(true);
    setPermissions([])
    try {
      const res = await axios.get(`/permissions/controllers/${controller}`);
      setPermissions(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadControllers();
  }, []);

  // Validation
  const validatePermission = (p) => {
    const err = {};
    if (!p.module || p.module.trim() === "") {
      err.module = "Module name is required";
    }

    if (!p.method_title || p.method_title.trim() === "") {
      err.method_title = "Method title is required";
    }

    return err;
  };

  // Handle input change
  const handleChange = (index, field, value) => {
    setPermissions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );

    // Clear error instantly
    setErrors((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: null,
      },
    }));
  };

  // Create / Update
  const handleUpdate = async (p, index) => {
    const validationErrors = validatePermission(p);

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [index]: validationErrors }));
      return;
    }

    setErrors((prev) => ({ ...prev, [index]: {} }));

    try {
      const payload = {
        ...p,
        module: p.module?.trim(),
        method_title: p.method_title?.trim(),
        parent_method: p.parent_method?.trim(),
      };

      let message = "";

      if (p.id) {
        await axios.put(`/permissions/${p.id}`, payload);
        message = "✨ Updated successfully!";
      } else {
        await axios.post("/permissions", payload);
        message = "🎉 Created successfully!";
      }

      setRowMessages((prev) => ({ ...prev, [index]: message }));

      // loadPermissions(selectedController);

      setTimeout(() => {
        setRowMessages((prev) => ({ ...prev, [index]: "" }));
      }, 2500);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
      alert(err.response.data.errors);
      console.log(err.response.data.errors);
    } 
    }
  };

  // Delete
  const deletePermission = async (id, index) => {
    if (!window.confirm("Delete this permission?")) return;

    try {
      await axios.delete(`/permissions/${id}`);

      setRowMessages((prev) => ({
        ...prev,
        [index]: "🗑️ Deleted successfully!",
      }));

      loadPermissions(selectedController);

      setTimeout(() => {
        setRowMessages((prev) => ({ ...prev, [index]: "" }));
      }, 2500);

    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  return (
    
    <Sidebar>
       <main className="flex-1 p-6 ml-64">

      {/* Controller Select */}
      <div className="mb-6 flex justify-center">
        <div className="bg-white shadow-md rounded-xl px-6 py-4 flex items-center gap-4">
          <span className="font-semibold text-gray-700">
            Select Controller:
          </span>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={selectedController}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedController(val);
              loadPermissions(val);
            }}
          >
            <option value="">-- Choose Controller --</option>
            {controllers.map((ctrl) => (
              <option key={ctrl} value={ctrl}>
                {ctrl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border">
        <table className="w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Parent Method</th>
              <th className="p-3 text-left">Module</th>
              <th className="p-3 text-left">Method Title</th>
              <th className="p-3 text-left">Permission</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && permissions.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No permissions found.
                </td>
              </tr>
            )}

            {permissions.map((p, index) => (
              <tr key={p.id ?? index} className="border-b">

                {/* Method */}
                <td className="p-3">{p.method}</td>

                {/* Parent Method */}
                <td className="p-3">
                  <input
                    className="border p-2 w-full rounded"
                    value={p.parent_method || ""}
                    onChange={(e) =>
                      handleChange(index, "parent_method", e.target.value)
                    }
                  />
                </td>

                {/* Module */}
                <td className="p-3">
                  <input
                    className={`border p-2 w-full rounded ${
                      errors[index]?.module ? "border-red-500" : ""
                    }`}
                    value={p.module || ""}
                    onChange={(e) =>
                      handleChange(index, "module", e.target.value)
                    }
                  />
                  {errors[index]?.module && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].module}
                    </p>
                  )}
                </td>

                {/* Method Title */}
                <td className="p-3">
                  <input
                    className={`border p-2 w-full rounded ${
                      errors[index]?.method_title ? "border-red-500" : ""
                    }`}
                    value={p.method_title || ""}
                    onChange={(e) =>
                      handleChange(index, "method_title", e.target.value)
                    }
                  />
                  {errors[index]?.method_title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].method_title}
                    </p>
                  )}
                </td>

                {/* Permissions */}
                <td className="p-3">
                  {
                    !p.parent_method && (
                         <div className="flex gap-3">
                    <label>
                      <input
                        type="checkbox"
                        checked={p.status === true}
                        onChange={(e) =>
                          handleChange(index, "status", e.target.checked)
                        }
                      />{" "}
                      Status
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={p.for_admin === true}
                        onChange={(e) =>
                          handleChange(index, "for_admin", e.target.checked)
                        }
                      />{" "}
                      Admin
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={p.for_customer === true}
                        onChange={(e) =>
                          handleChange(index, "for_customer", e.target.checked)
                        }
                      />{" "}
                      Customer
                    </label>
                  </div>
                    ) 
                  }
                 
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(p, index)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>

                    {p.id && (
                      <button
                        onClick={() => deletePermission(p.id, index)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Message below buttons */}
                  {rowMessages[index] && (
                    <div className="mt-2">
                      <span className="text-green-600 text-sm">
                        {rowMessages[index]}
                      </span>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
    </Sidebar>
   
  );
}