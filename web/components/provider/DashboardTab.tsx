"use client";
import {
    AlertCircle,
    Briefcase,
    Calendar,
    CalendarCheck,
    Check,
    ChevronRight,
    CreditCard,
    Plus,
    Settings,
    Star,
    TrendingUp,
    X,
} from "lucide-react";
import { useState } from "react";
import { MOCK_BOOKINGS } from "./data";
import type { TabId } from "./types";

// ============================================
// DASHBOARD TAB
// ============================================
export default function DashboardTab({
  user,
  setActiveTab,
}: {
  user: any;
  setActiveTab: (t: TabId) => void;
}) {
  const stats = [
    {
      label: "Total Jobs",
      value: "45",
      icon: Briefcase,
      gradient: "from-emerald-600 to-emerald-700",
    },
    {
      label: "Rating",
      value: "4.8",
      icon: Star,
      gradient: "from-yellow-600 to-yellow-700",
    },
    {
      label: "This Month",
      value: "₦125,000",
      icon: TrendingUp,
      gradient: "from-blue-600 to-blue-700",
    },
    {
      label: "Pending",
      value: "2",
      icon: Calendar,
      gradient: "from-red-600 to-red-700",
    },
  ];

  const pendingBookings = MOCK_BOOKINGS.filter((b) => b.status === "pending");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const statusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome back, {user.firstName}! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Here&apos;s what&apos;s happening with your services today.
        </p>
      </div>

      {/* Profile Incomplete Warning */}
      {user.profileComplete === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">
              Complete your profile to start receiving bookings
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Add your skills, bio, and location so clients can find you.
            </p>
            <button
              onClick={() => setActiveTab("profile")}
              className="mt-2 text-sm font-medium text-yellow-800 underline"
            >
              Complete Profile →
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="  p-6 text-white relative overflow-hidden grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl bg-linear-to-br ${stat.gradient} p-5 text-white relative overflow-hidden`}
          >
            <div className="absolute -top-3 -right-3 opacity-10">
              <stat.icon size={56} />
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-[11px] opacity-80 mt-0.5">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Performance Insights</h3>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            Top 15% this week
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Response Rate</span>
              <span className="font-bold text-gray-900">98%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: "98%" }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Completion Rate</span>
              <span className="font-bold text-gray-900">95%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: "95%" }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">On-Time Arrival</span>
              <span className="font-bold text-gray-900">90%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "90%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Add Service",
              icon: Plus,
              action: () => setActiveTab("services"), //onClick show add service form
            },
            {
              label: "My Earnings",
              icon: CreditCard,
              action: () => setActiveTab("earnings"),
            },
            {
              label: "View Bookings",
              icon: CalendarCheck,
              action: () => setActiveTab("bookings"),
            },
            {
              label: "Edit Profile",
              icon: Settings,
              action: () => setActiveTab("profile"),
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors group cursor-pointer"
            >
              <action.icon
                size={22}
                className="text-gray-400 group-hover:text-(--color-primary) transition-colors"
              />
              <span className="text-xs font-medium text-gray-600 group-hover:text-(--color-primary) text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pending Booking Requests */}
      {pendingBookings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              New Booking Requests
            </h3>
            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {pendingBookings.length} pending
            </span>
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-2 md:grid md:grid-cols-2">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="w-[280px] max-w-[85vw] md:w-auto md:min-w-0 shrink-0 snap-start flex flex-col p-3 sm:p-4 rounded-xl bg-orange-50/50 border border-orange-100"
              >
                <div className="flex-1">
                  <p className="text-[11px] sm:text-sm font-semibold text-gray-900 line-clamp-1">
                    {booking.service}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {booking.client}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {booking.date} at {booking.time}
                  </p>
                  <p className="text-[11px] sm:text-sm font-bold text-gray-900 mt-2">
                    {booking.amount}
                  </p>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-orange-100/50">
                  <button
                    className="flex-1 p-2 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Decline"
                  >
                    <X size={16} />
                  </button>
                  <button
                    className="flex-1 p-2 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                    title="Accept"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
          <button
            onClick={() => setActiveTab("bookings")}
            className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-2 md:grid md:grid-cols-2">
          {MOCK_BOOKINGS.slice(0, 4).map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="w-[280px] max-w-[85vw] md:w-auto md:min-w-0 shrink-0 snap-start flex flex-col p-3 sm:p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border border-transparent"
            >
              <div className="flex-1 mb-2">
                <p className="text-[11px] sm:text-sm font-semibold text-gray-900 line-clamp-1">
                  {booking.service}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                  {booking.client}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {booking.date}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200/60">
                <p className="text-[11px] sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                  {booking.amount}
                </p>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${statusStyle(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Service</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedBooking.service}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Client</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedBooking.client}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.date}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.time}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-sm font-bold text-(--color-primary)">
                    {selectedBooking.amount}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(selectedBooking.status)}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setActiveTab("bookings");
                }}
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-(--color-primary) text-white text-xs sm:text-sm font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                View Bookings
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full hover:bg-gray-200 whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
