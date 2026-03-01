"use client";
import { useNotification } from "@/context/NotificationContext";
import { Download, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";

// ============================================
// ADMIN REPORTS TAB
// ============================================
export default function AdminReportsTab() {
  const { addToast } = useNotification();
  const [reportTab, setReportTab] = useState<
    "platform" | "users" | "financial"
  >("platform");

  const kpis = [
    {
      label: "User Growth",
      value: "12,450",
      change: "+18.2%",
      period: "vs last month",
      direction: "up",
    },
    {
      label: "Booking Rate",
      value: "78.5%",
      change: "+5.3%",
      period: "conversion",
      direction: "up",
    },
    {
      label: "Avg. Rating",
      value: "4.6 ★",
      change: "+0.2",
      period: "platform wide",
      direction: "up",
    },
    {
      label: "Churn Rate",
      value: "3.2%",
      change: "-1.1%",
      period: "vs last month",
      direction: "down",
    },
    {
      label: "Avg. Booking Value",
      value: "₦18,500",
      change: "+₦2,300",
      period: "vs last month",
      direction: "up",
    },
    {
      label: "Resolution Time",
      value: "4.2 hrs",
      change: "-1.8 hrs",
      period: "avg dispute",
      direction: "down",
    },
  ];

  const topServices = [
    { name: "Home Cleaning", bookings: 1250, revenue: "₦15M", growth: "+22%" },
    {
      name: "Plumbing Repair",
      bookings: 890,
      revenue: "₦13.4M",
      growth: "+15%",
    },
    {
      name: "Electrical Work",
      bookings: 720,
      revenue: "₦12.9M",
      growth: "+18%",
    },
    { name: "Beauty & Spa", bookings: 650, revenue: "₦5.2M", growth: "+30%" },
    { name: "Painting", bookings: 480, revenue: "₦12M", growth: "+10%" },
  ];

  const userGrowth = [
    { month: "Sep", clients: 580, providers: 42 },
    { month: "Oct", clients: 720, providers: 65 },
    { month: "Nov", clients: 890, providers: 78 },
    { month: "Dec", clients: 1050, providers: 95 },
    { month: "Jan", clients: 1380, providers: 120 },
    { month: "Feb", clients: 1650, providers: 145 },
  ];

  const userBreakdown = [
    { label: "Clients", count: 10200, pct: 82, color: "bg-blue-500" },
    { label: "Providers", count: 1890, pct: 15, color: "bg-emerald-500" },
    { label: "Admins", count: 360, pct: 3, color: "bg-purple-500" },
  ];

  const userStatus = [
    { label: "Active", count: 10850, color: "text-emerald-600 bg-emerald-50" },
    { label: "Suspended", count: 420, color: "text-yellow-600 bg-yellow-50" },
    { label: "Banned", count: 85, color: "text-red-600 bg-red-50" },
    { label: "Deactivated", count: 195, color: "text-gray-600 bg-gray-100" },
  ];

  const topLocations = [
    { area: "Lekki", users: 1850 },
    { area: "Ikeja", users: 1420 },
    { area: "Victoria Island", users: 1280 },
    { area: "Surulere", users: 980 },
    { area: "Yaba", users: 870 },
    { area: "Ajah", users: 760 },
  ];

  const topUsers = [
    { name: "Golden Amadi", bookings: 48, spent: "₦1.2M" },
    { name: "Adaobi Okonkwo", bookings: 42, spent: "₦980K" },
    { name: "Tunde Balogun", bookings: 38, spent: "₦850K" },
    { name: "Ngozi Eze", bookings: 35, spent: "₦720K" },
    { name: "Emeka Nwosu", bookings: 31, spent: "₦680K" },
  ];

  const financialSummary = [
    { label: "Total Revenue", value: "₦24.5M", change: "+22%", icon: "💰" },
    { label: "Total Payouts", value: "₦19.8M", change: "+18%", icon: "💸" },
    { label: "Platform Fees", value: "₦4.7M", change: "+30%", icon: "🏦" },
    { label: "Refunds Issued", value: "₦680K", change: "-15%", icon: "↩️" },
  ];

  const paymentMethods = [
    { method: "Card (Visa/MC)", count: 4200, volume: "₦12.5M", pct: 52 },
    { method: "Bank Transfer", count: 3100, volume: "₦8.2M", pct: 34 },
    { method: "USSD", count: 850, volume: "₦2.1M", pct: 9 },
    { method: "Wallet", count: 520, volume: "₦1.4M", pct: 5 },
  ];

  const monthlyRevenue = [
    { month: "Sep", revenue: 2800000 },
    { month: "Oct", revenue: 3200000 },
    { month: "Nov", revenue: 3600000 },
    { month: "Dec", revenue: 4100000 },
    { month: "Jan", revenue: 4800000 },
    { month: "Feb", revenue: 5200000 },
  ];
  const maxRev = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500">Platform performance insights</p>
        </div>
        <button
          onClick={() => {
            let csv = "";
            let fn = "";
            if (reportTab === "platform") {
              csv = "Metric,Value,Change,Period\n";
              kpis.forEach((k) => {
                csv += `${k.label},${k.value},${k.change},${k.period}\n`;
              });
              csv += "\nService,Bookings,Revenue,Growth\n";
              topServices.forEach((s) => {
                csv += `${s.name},${s.bookings},${s.revenue},${s.growth}\n`;
              });
              fn = "platform_report.csv";
            } else if (reportTab === "users") {
              csv = "Month,Clients,Providers\n";
              userGrowth.forEach((u) => {
                csv += `${u.month},${u.clients},${u.providers}\n`;
              });
              csv += "\nTop Client,Bookings,Spent\n";
              topUsers.forEach(
                (c: { name: string; bookings: number; spent: string }) => {
                  csv += `${c.name},${c.bookings},${c.spent}\n`;
                },
              );
              fn = "user_report.csv";
            } else {
              csv = "Category,Value,Change\n";
              financialSummary.forEach((f) => {
                csv += `${f.label},${f.value},${f.change}\n`;
              });
              csv += "\nMonth,Revenue\n";
              monthlyRevenue.forEach((m) => {
                csv += `${m.month},₦${(m.revenue / 1000000).toFixed(1)}M\n`;
              });
              csv += "\nPayment Method,Count,Volume,Percentage\n";
              paymentMethods.forEach((p) => {
                csv += `${p.method},${p.count},${p.volume},${p.pct}%\n`;
              });
              fn = "financial_report.csv";
            }
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fn;
            a.click();
            URL.revokeObjectURL(url);
            addToast({
              type: "success",
              title: "✅ Report Downloaded",
              message: `${fn} has been downloaded.`,
            });
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 flex items-center gap-1.5"
        >
          <Download size={14} /> Download Report
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "platform" as const, label: "📊 Platform Overview" },
          { id: "users" as const, label: "👥 User Report" },
          { id: "financial" as const, label: "💰 Financial Report" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportTab(tab.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              reportTab === tab.id
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== PLATFORM OVERVIEW ===== */}
      {reportTab === "platform" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                <p className="text-xl font-bold text-gray-900">{k.value}</p>
                <p
                  className={`text-xs mt-0.5 ${k.direction === "up" ? "text-green-600" : "text-red-500"}`}
                >
                  {k.change} <span className="text-gray-400">{k.period}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Top Performing Services
            </h2>
            <div className="space-y-3">
              {topServices.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {s.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {s.bookings} bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {s.revenue}
                    </p>
                    <p className="text-[10px] text-green-600">{s.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== USER REPORT ===== */}
      {reportTab === "users" && (
        <>
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              User Growth (6 months)
            </h2>
            <div className="grid grid-cols-6 gap-2">
              {userGrowth.map((m) => (
                <div key={m.month} className="text-center">
                  <div className="relative h-32 bg-gray-50 rounded-lg flex flex-col justify-end p-1 gap-0.5">
                    <div
                      className="bg-blue-400 rounded-sm"
                      style={{ height: `${(m.clients / 1700) * 100}%` }}
                    />
                    <div
                      className="bg-emerald-400 rounded-sm"
                      style={{ height: `${(m.providers / 200) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">
                    {m.month}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {m.clients + m.providers}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 bg-blue-400 rounded-sm" />
                Clients
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-sm" />
                Providers
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                User Type Breakdown
              </h3>
              <div className="flex h-3 rounded-full overflow-hidden mb-3">
                {userBreakdown.map((u) => (
                  <div
                    key={u.label}
                    className={`${u.color}`}
                    style={{ width: `${u.pct}%` }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                {userBreakdown.map((u) => (
                  <div
                    key={u.label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${u.color}`} />
                      {u.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {u.count.toLocaleString()} ({u.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                User Status
              </h3>
              <div className="space-y-2">
                {userStatus.map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between p-2.5 rounded-xl ${s.color}`}
                  >
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-sm font-bold">
                      {s.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic & Top Users */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Top Locations
              </h3>
              <div className="space-y-2">
                {topLocations.map((loc, i) => (
                  <div key={loc.area} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm text-gray-700">
                          {loc.area}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {loc.users.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-purple-400 rounded-full"
                          style={{ width: `${(loc.users / 1850) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Top Users by Bookings
              </h3>
              <div className="space-y-2">
                {topUsers.map((u, i) => (
                  <div key={u.name} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {u.bookings} bookings • {u.spent} spent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== FINANCIAL REPORT ===== */}
      {reportTab === "financial" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {financialSummary.map((f) => (
              <div
                key={f.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{f.icon}</span>
                  <p className="text-xs text-gray-500">{f.label}</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{f.value}</p>
                <p className="text-xs text-green-600 mt-0.5">
                  {f.change} vs last month
                </p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Monthly Revenue Trend
            </h2>
            <div className="grid grid-cols-6 gap-3">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="text-center">
                  <div className="relative h-32 bg-gray-50 rounded-lg flex flex-col justify-end p-1">
                    <div
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm"
                      style={{ height: `${(m.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">
                    {m.month}
                  </p>
                  <p className="text-[10px] font-bold text-gray-700">
                    ₦{(m.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Payment Method Breakdown
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{pm.method}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {pm.volume}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${pm.pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {pm.count.toLocaleString()} transactions ({pm.pct}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
