"use client";
import {
    AlertTriangle,
    ArrowUp,
    Briefcase,
    Calendar,
    Clock,
    LayoutGrid,
    Shield,
    TrendingUp,
    User,
    Users
} from "lucide-react";
import { MOCK_ACTIVITY, MOCK_PLATFORM_STATS } from "./data";
import type { TabId } from "./types";

// ============================================
// OVERVIEW TAB
// ============================================
export default function OverviewTab({
  setActiveTab,
}: {
  setActiveTab: (t: TabId) => void;
}) {
  const stats = [
    {
      label: "Total Users",
      value: MOCK_PLATFORM_STATS.totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-purple-600 to-indigo-700",
      change: "+12%",
    },
    {
      label: "Providers",
      value: MOCK_PLATFORM_STATS.totalProviders.toLocaleString(),
      icon: Briefcase,
      gradient: "from-emerald-500 to-teal-600",
      change: "+8%",
    },
    {
      label: "Bookings",
      value: MOCK_PLATFORM_STATS.totalBookings.toLocaleString(),
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-600",
      change: "+15%",
    },
    {
      label: "Revenue",
      value: MOCK_PLATFORM_STATS.revenue,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      change: "+22%",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Platform overview and management
        </p>
      </div>

      {/* Stats – Individual Gradient Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl bg-linear-to-br ${stat.gradient} p-5 text-white relative overflow-hidden`}
          >
            <div className="absolute -top-3 -right-3 opacity-10">
              <stat.icon size={56} />
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUp size={10} /> {stat.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold">{stat.value}</p>
            <p className="text-[11px] opacity-80 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveTab("disputes")}
          className="flex flex-col bg-red-50 border border-red-100 rounded-2xl p-3 sm:p-5 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="font-semibold text-xs sm:text-base text-red-800 leading-tight">
              Active Disputes
            </h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-700">
            {MOCK_PLATFORM_STATS.activeDisputes}
          </p>
          <p className="text-[10px] sm:text-xs text-red-600 mt-1 sm:mt-auto leading-tight">
            Requires attention
          </p>
        </button>
        <button
          onClick={() => setActiveTab("providers")}
          className="flex flex-col bg-yellow-50 border border-yellow-100 rounded-2xl p-3 sm:p-5 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-2">
            <Clock size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-xs sm:text-base text-yellow-800 leading-tight">
              Pending Providers
            </h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-yellow-700">
            {MOCK_PLATFORM_STATS.pendingProviders}
          </p>
          <p className="text-[10px] sm:text-xs text-yellow-600 mt-1 sm:mt-auto leading-tight">
            Awaiting verification
          </p>
        </button>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <LayoutGrid size={16} className="text-emerald-600" /> System Health
          </h3>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>{" "}
            All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-500 mb-1">Server Status</p>
            <p className="text-sm font-bold text-emerald-600">Online</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-500 mb-1">Database Ping</p>
            <p className="text-sm font-bold text-gray-900">12ms</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-500 mb-1">Active Sessions</p>
            <p className="text-sm font-bold text-gray-900">1,402</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-500 mb-1">Error Rate (1h)</p>
            <p className="text-sm font-bold text-gray-900">0.02%</p>
          </div>
        </div>
      </div>

      {/* Admin Decision Log / Audit Trail */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield size={16} className="text-purple-600" /> Admin Decision Log
          </h3>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            Last 5 actions
          </span>
        </div>
        <div className="space-y-2.5">
          {[
            {
              action: "Approved provider",
              target: "CleanPro Services",
              by: "Super Admin",
              time: "2 min ago",
              type: "approve",
              icon: "✅",
            },
            {
              action: "Resolved dispute",
              target: "#DSP-1089",
              by: "Super Admin",
              time: "28 min ago",
              type: "resolve",
              icon: "🔧",
            },
            {
              action: "Issued refund",
              target: "₦40,000 to Fatima Bello",
              by: "Super Admin",
              time: "1 hr ago",
              type: "refund",
              icon: "💸",
            },
            {
              action: "Suspended user",
              target: "bad_actor_99",
              by: "Moderator",
              time: "3 hrs ago",
              type: "suspend",
              icon: "🚫",
            },
            {
              action: "Rejected provider",
              target: "Sketchy Services Ltd",
              by: "Support Agent",
              time: "5 hrs ago",
              type: "reject",
              icon: "❌",
            },
          ].map((log, i) => (
            <div
              //onClick open the decison log card.
              key={i}
              className="flex items-center gap-3 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm">{log.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{log.action}</span> —{" "}
                  <span className="text-gray-600">{log.target}</span>
                </p>
                <p className="text-[10px] text-gray-400">
                  by {log.by} • {log.time}
                </p>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  log.type === "approve"
                    ? "bg-emerald-100 text-emerald-700"
                    : log.type === "resolve"
                      ? "bg-blue-100 text-blue-700"
                      : log.type === "refund"
                        ? "bg-purple-100 text-purple-700"
                        : log.type === "suspend"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                }`}
              >
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {MOCK_ACTIVITY.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  a.type === "dispute"
                    ? "bg-red-100"
                    : a.type === "provider"
                      ? "bg-emerald-100"
                      : "bg-blue-100"
                }`}
              >
                {a.type === "dispute" ? (
                  <AlertTriangle size={14} className="text-red-600" />
                ) : a.type === "provider" ? (
                  <Briefcase size={14} className="text-emerald-600" />
                ) : (
                  <User size={14} className="text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{a.text}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
