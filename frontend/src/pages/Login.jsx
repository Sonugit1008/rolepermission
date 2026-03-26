import { useState } from "react";
import axios from "../api/axios";
import { setAuth } from "../auth/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", form);
      setAuth(res.data);
      window.location.href = "/";
    } catch (e) {
      setError(e.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Sign in to your account</h2>

        {error && <p className="mb-4 text-sm text-red-600 text-center">{error}</p>}

        <label className="block mb-3">
          <span className="text-slate-700">Email</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-6">
          <span className="text-slate-700">Password</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            placeholder="********"
          />
        </label>

        <button
          onClick={login}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          For demo: admin@example.com, 123456
        </p>
      </div>
    </div>
  );
}