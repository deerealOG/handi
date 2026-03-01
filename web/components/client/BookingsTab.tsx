"use client";

import { Clock, X } from "lucide-react";
import { useState } from "react";

const MOCK_ACTIVE_BOOKINGS = [
  {
    id: "b1",
    service: "AC Servicing & Repair",
    provider: "CoolAir Solutions",
    date: "Today, 2:00 PM",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    icon: "🔧",
  },
  {
    id: "b2",
    service: "Deep House Cleaning",
    provider: "SparkleClean NG",
    date: "Tomorrow, 9:00 AM",
    status: "Confirmed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🧹",
  },
  {
    id: "b3",
    service: "Electrical Wiring",
    provider: "PowerFix Pro",
    date: "Feb 24, 10:00 AM",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    icon: "⚡",
  },
];

const MOCK_COMPLETED_BOOKINGS = [
  {
    id: "c1",
    service: "Plumbing Repair",
    provider: "AquaFix NG",
    date: "Feb 15, 2026",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🔧",
    amount: "₦8,500",
  },
  {
    id: "c2",
    service: "House Painting",
    provider: "PaintMaster Pro",
    date: "Feb 10, 2026",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🎨",
    amount: "₦45,000",
  },
];

export default function BookingsTab() {
  const [filter, setFilter] = useState<"active" | "completed">("active");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancelledBookings, setCancelledBookings] = useState<Set<string>>(
    new Set(),
  );

  const bookings =
    filter === "active" ? MOCK_ACTIVE_BOOKINGS : MOCK_COMPLETED_BOOKINGS;

  const canCancel = (booking: any) => {
    return !cancelledBookings.has(booking.id) && filter === "active";
  };

  const handleCancel = (bookingId: string) => {
    setCancelledBookings((prev) => new Set([...prev, bookingId]));
    setSelectedBooking(null);
  };

  const TRACKING_STEPS = [
    { label: "Booking Placed", done: true },
    { label: "Provider Accepted", done: true },
    { label: "Provider En Route", done: false },
    { label: "Service In Progress", done: false },
    { label: "Completed", done: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      {/* Toggle */}
      <div className="flex bg-gray-100 rounded-full p-1">
        <button
          onClick={() => setFilter("active")}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            filter === "active"
              ? "bg-white text-(--color-primary) shadow-sm"
              : "text-gray-500"
          }`}
        >
          Active ({MOCK_ACTIVE_BOOKINGS.length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            filter === "completed"
              ? "bg-white text-(--color-primary) shadow-sm"
              : "text-gray-500"
          }`}
        >
          Completed ({MOCK_COMPLETED_BOOKINGS.length})
        </button>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBooking(b)}
            className={`bg-white rounded-2xl p-3 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 cursor-pointer hover:shadow-md transition-shadow flex-1 ${cancelledBookings.has(b.id) ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                {b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-sm font-semibold text-gray-900">
                  {b.service}
                </p>
                <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">
                  {b.provider}
                </p>
                <p className="text-[9px] sm:text-xs text-gray-400 mt-0.5 hidden sm:block">
                  {b.date}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto mt-auto pt-2 sm:pt-0 sm:mt-0 border-t sm:border-0 border-gray-50 flex items-end justify-between sm:block">
              <div className="sm:hidden text-[9px] text-gray-400 leading-tight">
                {b.date?.split(",")[0]}
                <br />
                {b.date?.split(",")[1]}
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold ${cancelledBookings.has(b.id) ? "bg-red-100 text-red-700" : b.statusColor}`}
                >
                  {cancelledBookings.has(b.id) ? "Cancelled" : b.status}
                </span>
                {"amount" in b && (
                  <p className="text-[11px] sm:text-sm font-bold text-gray-900 mt-1 sm:mt-2">
                    {(b as any).amount}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Booking Details
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                  {selectedBooking.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedBooking.service}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.provider}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedBooking.date}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cancelledBookings.has(selectedBooking.id) ? "bg-red-100 text-red-700" : selectedBooking.statusColor}`}
                  >
                    {cancelledBookings.has(selectedBooking.id)
                      ? "Cancelled"
                      : selectedBooking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-medium text-gray-900">
                    #{selectedBooking.id}
                  </span>
                </div>
                {"amount" in selectedBooking && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-(--color-primary)">
                      {(selectedBooking as any).amount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium text-gray-900">
                    Card ending •••4832
                  </span>
                </div>
              </div>

              {/* Tracking Timeline — only for active */}
              {filter === "active" &&
                !cancelledBookings.has(selectedBooking.id) && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      Booking Tracking
                    </h5>
                    <div className="space-y-3">
                      {TRACKING_STEPS.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${step.done ? "bg-(--color-primary)" : "bg-gray-300"}`}
                          >
                            {step.done ? "✓" : i + 1}
                          </div>
                          <span
                            className={`text-xs ${step.done ? "text-gray-900 font-medium" : "text-gray-400"}`}
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex gap-2">
                {canCancel(selectedBooking) && (
                  <button
                    onClick={() => handleCancel(selectedBooking.id)}
                    className="flex-1 py-2.5 text-sm font-semibold border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 text-sm font-semibold bg-(--color-primary) text-white rounded-full hover:opacity-90 transition-colors"
                >
                  {filter === "active" ? "Track Provider" : "Book Again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
