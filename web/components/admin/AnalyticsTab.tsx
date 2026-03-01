"use client";
import { useNotification } from "@/context/NotificationContext";
import {
    ArrowUp,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Package,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

// ============================================
// ANALYTICS TAB (Data Analyst)
// ============================================
export default function AnalyticsTab() {
  const { addToast } = useNotification();
  const [dateRange, setDateRange] = useState({
    from: "2025-12-01",
    to: "2026-02-22",
  });

  const KEY_METRICS = [
    {
      label: "Conversion Rate",
      value: "12.4%",
      trend: "+2.1%",
      gradient: "from-purple-500 to-indigo-600",
      icon: TrendingUp,
    },
    {
      label: "Avg. Booking Value",
      value: "₦18,500",
      trend: "+₦1,200",
      gradient: "from-emerald-500 to-teal-600",
      icon: DollarSign,
    },
    {
      label: "Avg. Response Time",
      value: "18min",
      trend: "-3min",
      gradient: "from-blue-500 to-cyan-600",
      icon: Clock,
    },
    {
      label: "Retention Rate",
      value: "68%",
      trend: "+5%",
      gradient: "from-amber-500 to-orange-600",
      icon: Users,
    },
  ];

  const FUNNEL = [
    { stage: "Page Visit", count: 45200, color: "bg-purple-500" },
    { stage: "Sign Up", count: 12450, color: "bg-indigo-500" },
    { stage: "First Booking", count: 8300, color: "bg-blue-500" },
    { stage: "Payment", count: 7100, color: "bg-teal-500" },
    { stage: "Review Left", count: 3200, color: "bg-emerald-500" },
  ];
  const maxFunnel = FUNNEL[0].count;

  const COHORTS = [
    { month: "Sep 2025", users: 820, w1: 78, w2: 62, w4: 48, w8: 35, w12: 28 },
    { month: "Oct 2025", users: 950, w1: 82, w2: 68, w4: 52, w8: 40, w12: 32 },
    { month: "Nov 2025", users: 1100, w1: 85, w2: 71, w4: 55, w8: 42, w12: 0 },
    { month: "Dec 2025", users: 1350, w1: 80, w2: 65, w4: 50, w8: 0, w12: 0 },
    { month: "Jan 2026", users: 1480, w1: 88, w2: 72, w4: 0, w8: 0, w12: 0 },
    { month: "Feb 2026", users: 890, w1: 90, w2: 0, w4: 0, w8: 0, w12: 0 },
  ];

  const EXPORTS = [
    {
      label: "Users",
      desc: "All user accounts with profile data",
      icon: Users,
    },
    {
      label: "Bookings",
      desc: "Booking records with status & amounts",
      icon: Calendar,
    },
    {
      label: "Transactions",
      desc: "Payment history with Paystack refs",
      icon: CreditCard,
    },
    {
      label: "Services",
      desc: "Service catalog with ratings & bookings",
      icon: Package,
    },
  ];

  const handleExport = (type: string) => {
    let csvContent = "";
    let filename = "";

    switch (type) {
      case "Revenue":
        csvContent = "Month,Revenue,Transactions,Average\n";
        csvContent += "January 2026,₦2450000,1200,₦2041\n";
        csvContent += "February 2026,₦3200000,1580,₦2025\n";
        csvContent += "March 2026,₦2890000,1350,₦2141\n";
        filename = "revenue_report.csv";
        break;
      case "Users":
        csvContent = "Name,Email,Type,Status,Joined,Bookings\n";
        csvContent +=
          "Golden Amadi,golden@example.com,client,active,Jan 15 2026,12\n";
        csvContent +=
          "Amina Yusuf,amina@example.com,provider,active,Dec 3 2025,28\n";
        csvContent +=
          "Emeka Obi,emeka@example.com,client,active,Jan 28 2026,8\n";
        filename = "users_report.csv";
        break;
      case "Bookings":
        csvContent = "ID,Service,Client,Provider,Amount,Status,Date\n";
        csvContent +=
          "B001,Plumbing Repair,Golden Amadi,Chinedu Eze,₦12000,completed,Feb 20 2026\n";
        csvContent +=
          "B002,Electrical Work,Amina Yusuf,Emeka Obi,₦15000,pending,Feb 21 2026\n";
        filename = "bookings_report.csv";
        break;
      case "Providers":
        csvContent = "Name,Email,Category,Status,Rating,Jobs,Joined\n";
        csvContent +=
          "Chinedu Okonkwo,chinedu@example.com,Electrical,verified,4.8,45,Nov 5 2025\n";
        csvContent +=
          "Sarah Beauty Hub,sarah@beauty.com,Beauty & Spa,verified,4.6,32,Dec 10 2025\n";
        filename = "providers_report.csv";
        break;
      case "Transactions":
        csvContent = "ID,Amount,Type,Status,Date,Reference\n";
        csvContent += "T001,₦12000,payment,completed,Feb 20 2026,PAY-ABC123\n";
        csvContent += "T002,₦5000,refund,completed,Feb 18 2026,REF-DEF456\n";
        filename = "transactions_report.csv";
        break;
      case "Services":
        csvContent = "Name,Category,Price,Rating,Bookings,Status\n";
        csvContent += "Plumbing Repair,Plumbing,₦12000,4.5,120,active\n";
        csvContent += "Electrical Wiring,Electrical,₦15000,4.7,89,active\n";
        filename = "services_report.csv";
        break;
      default:
        csvContent =
          "Category,Value\nTotal Users,12450\nTotal Providers,890\nTotal Bookings,34200\n";
        filename = "analytics_export.csv";
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    addToast({
      type: "success",
      title: `✅ ${type} Export Complete`,
      message: `${filename} has been downloaded.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-xs text-gray-500">
            Deep insights into platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange((p) => ({ ...p, from: e.target.value }))
            }
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange((p) => ({ ...p, to: e.target.value }))
            }
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
          />
        </div>
      </div>

      {/* Key Metrics – Gradient Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KEY_METRICS.map((m) => (
          <div
            key={m.label}
            className={`rounded-2xl bg-linear-to-br ${m.gradient} p-4 text-white relative overflow-hidden`}
          >
            <div className="absolute top-3 right-3 opacity-20">
              <m.icon size={32} />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              {m.label}
            </p>
            <p className="text-2xl font-extrabold mt-1">{m.value}</p>
            <p className="text-xs mt-1 flex items-center gap-1 opacity-90">
              <ArrowUp size={12} /> {m.trend}{" "}
              <span className="opacity-60">vs last period</span>
            </p>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          📊 Conversion Funnel
        </h3>
        <div className="space-y-3">
          {FUNNEL.map((step, i) => (
            <div key={step.stage} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 shrink-0">
                {step.stage}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                <div
                  className={`h-full ${step.color} rounded-full flex items-center justify-end pr-2 transition-all duration-700`}
                  style={{ width: `${(step.count / maxFunnel) * 100}%` }}
                >
                  <span className="text-[10px] font-bold text-white">
                    {step.count.toLocaleString()}
                  </span>
                </div>
              </div>
              {i > 0 && (
                <span className="text-[10px] font-semibold text-gray-400 w-12 text-right">
                  {((step.count / FUNNEL[i - 1].count) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Retention */}
      <div className="bg-white rounded-2xl shadow-sm p-5 overflow-x-auto no-scrollbar">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          📈 User Cohort Retention
        </h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-3 font-semibold text-gray-500">
                Cohort
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Users
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 1
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 2
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 4
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 8
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 12
              </th>
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((c) => (
              <tr key={c.month} className="border-b border-gray-50">
                <td className="py-2 pr-3 font-medium text-gray-700 whitespace-nowrap">
                  {c.month}
                </td>
                <td className="text-center py-2 px-2 font-semibold text-gray-900">
                  {c.users.toLocaleString()}
                </td>
                {[c.w1, c.w2, c.w4, c.w8, c.w12].map((val, i) => {
                  const bg =
                    val > 0
                      ? val >= 70
                        ? "bg-emerald-100 text-emerald-700"
                        : val >= 50
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      : "bg-gray-50 text-gray-300";
                  return (
                    <td key={i} className="text-center py-2 px-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${bg}`}
                      >
                        {val > 0 ? `${val}%` : "—"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">💾 Data Export</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {EXPORTS.map((exp) => (
            <div
              key={exp.label}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <exp.icon size={18} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {exp.label}
                </p>
                <p className="text-[10px] text-gray-400">{exp.desc}</p>
              </div>
              <button
                onClick={() => handleExport(exp.label)}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700"
              >
                <Download size={12} /> CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
