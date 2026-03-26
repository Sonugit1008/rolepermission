// import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
export default function Dashboard() {


  return (
    <Sidebar>
      <main className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="font-bold text-lg mb-2">Welcome</h3>
            <p>Welcome to the role-permission app!</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="font-bold text-lg mb-2">Navigation</h3>
            <p>Use the sidebar to access pages based on your permissions.</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="font-bold text-lg mb-2">Access</h3>
            <p>Current user can access the pages according to assigned permissions.</p>
          </div>
        </div>
      </main>
    </Sidebar>

  );
}