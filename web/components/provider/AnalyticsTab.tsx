"use client";
import {
  BarChart3,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { MOCK_ANALYTICS } from "./data";

export default function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState("7d");
  const data = MOCK_ANALYTICS;

  const metrics = [
    { label: "Bookings Completed", value: data.bookingsCompleted, icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Total Revenue", value: `₦${data.revenue.toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
    { label: "Conversion Rate", value: `${data.conversionRate}%`, icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { label: "Response Time", value: data.responseTime, icon: Clock, color: "from-orange-500 to-orange-600" },
    { label: "Customer Satisfaction", value: data.satisfaction, icon: Star, color: "from-yellow-500 to-yellow-600" },
  ];

  const maxBookings = Math.max(...data.bookingsTrend);
  const maxRevenue = Math.max(...data.revenueTrend);
  const maxServiceBookings = Math.max(...data.popularServices.map((s) => s.bookings));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-full p-1">
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "12m", label: "12 Months" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === opt.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`rounded-2xl bg-linear-to-br ${m.color} p-5 text-white relative overflow-hidden`}>
            <div className="absolute -top-3 -right-3 opacity-10">
              <m.icon size={48} />
            </div>
            <p className="text-2xl font-extrabold">{m.value}</p>
            <p className="text-xs opacity-80 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" />
              Bookings Trend
            </h3>
          </div>
          <div className="flex items-end gap-2 h-40">
            {data.bookingsTrend.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-gray-600">{val}</span>
                <div
                  className="w-full bg-linear-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${(val / maxBookings) * 100}%`, minHeight: 8 }}
                />
                <span className="text-[10px] text-gray-400">{data.trendLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Revenue Trend
            </h3>
          </div>
          <div className="flex items-end gap-2 h-40">
            {data.revenueTrend.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-gray-600">₦{(val / 1000).toFixed(0)}k</span>
                <div
                  className="w-full bg-linear-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500"
                  style={{ height: `${(val / maxRevenue) * 100}%`, minHeight: 8 }}
                />
                <span className="text-[10px] text-gray-400">{data.trendLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Popularity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Service Popularity</h3>
        <div className="space-y-4">
          {data.popularServices.map((service, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-40 truncate">{service.name}</span>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-linear-to-r from-emerald-500 to-blue-500 transition-all"
                    style={{ width: `${(service.bookings / maxServiceBookings) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">{service.bookings} bookings</p>
                <p className="text-xs text-gray-500">₦{service.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
