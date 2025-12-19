// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeTasks: 0,
    totalDisputes: 0,
    openDisputes: 0,
    resolvedDisputes: 0,
  });

  const [statusStats, setStatusStats] = useState({
    available: 0,
    busy: 0,
    dnd: 0,
    invisible: 0,
  });

  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        /* ================= ADMIN PROFILE ================= */
        const profileRes = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminProfile(profileRes.data.user);

        /* ================= USERS ================= */
        const usersRes = await api.get("admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = usersRes.data.users || [];
        setUsers(usersData);

        const totalUsers = usersData.length;
        const pendingApprovals = usersData.filter(u => !u.approved).length;

        // ✅ USER STATUS COUNT
        const statusCount = {
          available: 0,
          busy: 0,
          dnd: 0,
          invisible: 0,
        };

        usersData.forEach(u => {
          if (u.status && statusCount[u.status] !== undefined) {
            statusCount[u.status]++;
          }
        });

        setStatusStats(statusCount);

        /* ================= TASKS ================= */
        const tasksRes = await api.get("/admin/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = tasksRes.data.tasks || [];
        const activeTasks = tasks.filter(
          t => t.status === "todo" || t.status === "in_progress"
        ).length;

        /* ================= DISPUTES ================= */
        const disputesRes = await api.get("/disputes/stats/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const {
          totalDisputes = 0,
          openDisputes = 0,
          resolvedDisputes = 0,
        } = disputesRes.data || {};

        setStats({
          totalUsers,
          pendingApprovals,
          activeTasks,
          totalDisputes,
          openDisputes,
          resolvedDisputes,
        });

      } catch (err) {
        console.error("❌ Admin dashboard error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-lime-900 p-8 text-white">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-lime-300">Admin Dashboard</h1>
          <p className="text-teal-200 mt-1">Overview & team monitoring</p>
        </div>

        {adminProfile && (
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <img
              src={adminProfile.profilePhoto || "/default.jpg"}
              alt="Admin"
              className="w-14 h-14 rounded-full border-2 border-lime-400 object-cover"
            />
            <div>
              <p className="font-semibold text-lime-300">{adminProfile.name}</p>
              <p className="text-teal-200 text-sm">{adminProfile.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.totalUsers} />
        
        <StatCard title="Active Tasks" value={stats.activeTasks} />
        <StatCard title="Total Disputes" value={stats.totalDisputes} />
        <StatCard title="Open Disputes" value={stats.openDisputes} />
        <StatCard title="Resolved Disputes" value={stats.resolvedDisputes} />
      </div>

      {/* ================= USER STATUS ================= */}
      <h2 className="text-2xl font-bold text-lime-300 mb-4">User Status</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatusCard title="Available" value={statusStats.available} color="text-green-400" />
        <StatusCard title="Busy" value={statusStats.busy} color="text-red-400" />
        <StatusCard title="DND" value={statusStats.dnd} color="text-orange-400" />
        <StatusCard title="Invisible" value={statusStats.invisible} color="text-gray-400" />
      </div>

      {/* ================= TEAM STATUS TABLE ================= */}
      <div className="bg-gray-800/60 rounded-xl p-6 mb-10">
        <h3 className="text-xl font-semibold text-lime-300 mb-4">
          Team Live Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 6).map(u => (
                <tr key={u._id} className="border-b border-white/10">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.role}</td>
                  <td className={`p-2 font-semibold ${statusColor(u.status)}`}>
                    {u.status || "unknown"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: "Manage Users", route: "/admin/users" },
          { label: "Manage Tasks", route: "/admin/tasks" },
          { label: "View Reports", route: "/admin/reports" },
          { label: "Disputes", route: "/admin/disputes" },
          
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => navigate(btn.route)}
            className="bg-lime-600 hover:bg-lime-700 px-6 py-4 rounded-xl shadow-lg transition font-semibold"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */
const StatCard = ({ title, value }) => (
  <div className="bg-gray-800/60 p-6 rounded-xl shadow-md">
    <p className="text-teal-200 text-sm">{title}</p>
    <h2 className="text-3xl font-bold text-lime-300 mt-2">{value}</h2>
  </div>
);

const StatusCard = ({ title, value, color }) => (
  <div className="bg-gray-800/60 p-4 rounded-xl text-center">
    <p className="text-sm text-teal-200">{title}</p>
    <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
  </div>
);

const statusColor = (status) => {
  switch (status) {
    case "available": return "text-green-400";
    case "busy": return "text-red-400";
    case "dnd": return "text-orange-400";
    case "invisible": return "text-gray-400";
    default: return "text-gray-300";
  }
};

export default AdminDashboard;

