"use client";
import {
    Calendar,
    CalendarCheck,
    LayoutGrid,
    List,
    Search,
} from "lucide-react";
import { useState } from "react";
import { MOCK_BOOKINGS } from "./data";

// ============================================
// BOOKINGS TAB
// ============================================
export default function BookingsTab() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price-high" | "price-low"
  >("newest");
  const filters = [
    "all",
    "pending",
    "upcoming",
    "completed",
    "cancelled",
  ] as const;

  const filtered = (
    filter === "all"
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === filter)
  )
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.service.toLowerCase().includes(q) ||
        b.client.toLowerCase().includes(q) ||
        b.amount.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "price-high":
          return (
            parseInt(b.amount.replace(/[^0-9]/g, "")) -
            parseInt(a.amount.replace(/[^0-9]/g, ""))
          );
        case "price-low":
          return (
            parseInt(a.amount.replace(/[^0-9]/g, "")) -
            parseInt(b.amount.replace(/[^0-9]/g, ""))
          );
        default:
          return 0;
      }
    });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-full bg-white outline-none focus:ring-2 focus:ring-(--color-primary)/30 w-48"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 hover:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High → Low</option>
            <option value="price-low">Price: Low → High</option>
          </select>
          <div className="hidden sm:flex flex-row items-center bg-gray-100 rounded-lg p-1 ml-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                {MOCK_BOOKINGS.filter((b) => b.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 gap-3 sm:gap-4"
            : "flex flex-col gap-3"
        }
      >
        {filtered.map((booking) => (
          <div
            key={booking.id}
            onClick={() =>
              setExpandedBooking(
                expandedBooking === booking.id ? null : booking.id,
              )
            }
            className={`bg-white rounded-2xl shadow-sm p-3 sm:p-5 hover:shadow-md transition-all cursor-pointer ${
              booking.status === "pending"
                ? "border-l-4 sm:border-t-4 sm:border-l-0 border-orange-400"
                : ""
            } ${
              expandedBooking === booking.id
                ? "ring-2 ring-(--color-primary)/20"
                : ""
            } ${viewMode === "grid" ? "flex flex-col" : "flex flex-col sm:flex-row gap-4"}`}
          >
            <div
              className={
                viewMode === "grid"
                  ? "flex-1 mb-3"
                  : "flex-1 flex flex-col sm:flex-row gap-4 sm:items-center"
              }
            >
              <div
                className={
                  viewMode === "grid"
                    ? "flex flex-col gap-1.5 mb-1.5"
                    : "flex-1 sm:w-1/3 shrink-0"
                }
              >
                <span
                  className={`text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full capitalize w-fit ${statusStyle(booking.status)} ${viewMode === "list" ? "mb-1.5 block" : ""}`}
                >
                  {booking.status}
                </span>
                <h3 className="font-semibold text-xs sm:text-base text-gray-900 line-clamp-1">
                  {booking.service}
                </h3>
              </div>

              <div className={viewMode === "grid" ? "" : "flex-1 sm:w-1/3"}>
                {viewMode === "list" && (
                  <p className="text-[10px] font-medium text-gray-400 mb-0.5">
                    Client
                  </p>
                )}
                <p
                  className={`text-[10px] sm:text-sm ${viewMode === "grid" ? "text-gray-500 line-clamp-1" : "text-gray-900 font-medium"}`}
                >
                  {booking.client}
                </p>
                <p className="text-[9px] sm:text-xs text-gray-400 mt-1">
                  <Calendar size={10} className="inline mr-1" />
                  {booking.date} at {booking.time}
                </p>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "mt-2"
                    : "flex-1 sm:w-1/3 flex items-center sm:justify-end"
                }
              >
                <p
                  className={`font-bold text-gray-900 ${viewMode === "grid" ? "text-sm sm:text-lg" : "text-base sm:text-xl"}`}
                >
                  {booking.amount}
                </p>
              </div>
            </div>

            {booking.status === "pending" && (
              <div
                className={`flex gap-1.5 sm:gap-2 ${viewMode === "grid" ? "mt-auto pt-3 border-t border-gray-100" : "flex-col sm:flex-row sm:items-center sm:w-48 shrink-0 justify-end"}`}
              >
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`flex justify-center items-center cursor-pointer px-1.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 whitespace-nowrap ${viewMode === "grid" ? "flex-1" : "w-full"}`}
                >
                  Decline
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`flex justify-center items-center cursor-pointer px-1.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 whitespace-nowrap ${viewMode === "grid" ? "flex-1" : "w-full"}`}
                >
                  Accept
                </button>
              </div>
            )}

            {/* Expanded Details */}
            {expandedBooking === booking.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-slideDown">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Address
                    </p>
                    <p className="text-xs text-gray-700">
                      12 Main Street, Lagos
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Duration
                    </p>
                    <p className="text-xs text-gray-700">2 hours estimated</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Payment Status
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      Pre-paid
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Contact
                    </p>
                    <p className="text-xs text-gray-700">+234 801 234 5678</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase">
                    Notes
                  </p>
                  <p className="text-xs text-gray-600">
                    Please arrive 10 minutes early. Building has parking.
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <a
                    href="https://wa.me/2348000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-full hover:bg-green-50 cursor-pointer text-center text-green-700"
                  >
                    WhatsApp Client
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const bookingId = booking.id;
                      setJobStatuses((prev) => ({
                        ...prev,
                        [bookingId]:
                          prev[bookingId] === "in-progress"
                            ? "completed"
                            : "in-progress",
                      }));
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-full cursor-pointer ${jobStatuses[booking.id] === "in-progress" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-(--color-primary) text-white hover:opacity-90"}`}
                  >
                    {jobStatuses[booking.id] === "in-progress"
                      ? "Complete Job"
                      : "Start Job"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <CalendarCheck size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No {filter} bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
