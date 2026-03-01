"use client";
import {
    AlertTriangle,
    ChevronRight,
    Download,
    LayoutGrid,
    List,
    Search,
    X,
} from "lucide-react";
import { useState } from "react";

// ============================================
// ADMIN BOOKINGS TAB
// ============================================
export default function AdminBookingsTab() {
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "amount-high" | "amount-low"
  >("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const bookings = [
    {
      id: "ab1",
      service: "Deep Cleaning",
      client: "Golden Amadi",
      provider: "CleanPro Services",
      date: "Feb 22, 2026",
      time: "10:00 AM",
      status: "confirmed",
      amount: "₦15,000",
    },
    {
      id: "ab2",
      service: "Plumbing Repair",
      client: "Adaobi Chen",
      provider: "handi Plumbing",
      date: "Feb 21, 2026",
      time: "2:00 PM",
      status: "pending",
      amount: "₦12,000",
    },
    {
      id: "ab3",
      service: "Electrical Wiring",
      client: "James Nwachukwu",
      provider: "Chinedu Okonkwo",
      date: "Feb 20, 2026",
      time: "9:00 AM",
      status: "completed",
      amount: "₦25,000",
    },
    {
      id: "ab4",
      service: "Interior Painting",
      client: "Fatima Bello",
      provider: "ArtSpace Interiors",
      date: "Feb 19, 2026",
      time: "11:30 AM",
      status: "cancelled",
      amount: "₦40,000",
    },
    {
      id: "ab5",
      service: "AC Maintenance",
      client: "Emeka Udo",
      provider: "AutoCare Mechanics",
      date: "Feb 18, 2026",
      time: "3:00 PM",
      status: "in_progress",
      amount: "₦8,000",
    },
    {
      id: "ab6",
      service: "Home Fumigation",
      client: "Grace Obi",
      provider: "PestGuard NG",
      date: "Feb 17, 2026",
      time: "8:00 AM",
      status: "completed",
      amount: "₦20,000",
    },
    {
      id: "ab7",
      service: "Bridal Makeup",
      client: "Aisha Mohammed",
      provider: "Sarah Beauty Hub",
      date: "Feb 16, 2026",
      time: "6:00 AM",
      status: "disputed",
      amount: "₦35,000",
      disputeReason:
        "Provider arrived 2 hours late and delivered substandard service. Client requesting full refund.",
      disputeFiledBy: "Aisha Mohammed (Client)",
      disputeDate: "Feb 17, 2026",
      disputePriority: "high",
    },
  ];

  const filtered = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.client.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-high":
          return (
            parseInt(b.amount.replace(/[^0-9]/g, "")) -
            parseInt(a.amount.replace(/[^0-9]/g, ""))
          );
        case "amount-low":
          return (
            parseInt(a.amount.replace(/[^0-9]/g, "")) -
            parseInt(b.amount.replace(/[^0-9]/g, ""))
          );
        default:
          return 0;
      }
    });
  const statusColor: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    in_progress: "bg-purple-100 text-purple-700",
    disputed: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-xs text-gray-500">
            {bookings.length} total bookings on the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-purple-600"
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
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search client or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white w-44 outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 hover:border-purple-400 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount-high">Amount ↓</option>
            <option value="amount-low">Amount ↑</option>
          </select>
          <button className="px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-semibold hover:bg-purple-700 flex items-center gap-1">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          "all",
          "pending",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "disputed",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize ${filter === s ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            {s.replace("_", " ")}
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
        {filtered.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBooking(b)}
            className={`bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex justify-between ${
              b.status === "pending" ? "border-t-4 border-t-yellow-400" : ""
            } ${viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row items-start sm:items-center gap-4"}`}
          >
            <div
              className={viewMode === "grid" ? "flex-1 mb-2" : "flex-1 min-w-0"}
            >
              <span
                className={`inline-block text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium capitalize mb-1.5 ${statusColor[b.status] || "bg-gray-100"}`}
              >
                {b.status.replace("_", " ")}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                {b.service}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                {b.client} → {b.provider}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                {b.date} at {b.time}
              </p>
            </div>
            <div
              className={
                viewMode === "grid"
                  ? "flex items-center justify-between mt-auto pt-2 border-t border-gray-50"
                  : "flex items-center mt-2 sm:mt-0 justify-between sm:justify-end gap-6 sm:w-32 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50"
              }
            >
              <p className="text-sm sm:text-base font-bold text-gray-900">
                {b.amount}
              </p>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedBooking.service}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">{selectedBooking.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium">{selectedBooking.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">{selectedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-(--color-primary)">
                  {selectedBooking.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[selectedBooking.status]}`}
                >
                  {selectedBooking.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Dispute Details — only for disputed bookings */}
            {selectedBooking.status === "disputed" && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-red-700 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Dispute Details
                </h4>
                {selectedBooking.disputeReason && (
                  <p className="text-xs text-red-600">
                    <span className="font-semibold">Reason:</span>{" "}
                    {selectedBooking.disputeReason}
                  </p>
                )}
                {selectedBooking.disputeFiledBy && (
                  <p className="text-xs text-red-600">
                    <span className="font-semibold">Filed by:</span>{" "}
                    {selectedBooking.disputeFiledBy}
                  </p>
                )}
                {selectedBooking.disputeDate && (
                  <p className="text-xs text-red-600">
                    <span className="font-semibold">Filed on:</span>{" "}
                    {selectedBooking.disputeDate}
                  </p>
                )}
                {selectedBooking.disputePriority && (
                  <p className="text-xs text-red-600">
                    <span className="font-semibold">Priority:</span>{" "}
                    <span className="uppercase font-bold">
                      {selectedBooking.disputePriority}
                    </span>
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-full hover:bg-red-700">
                    View Dispute
                  </button>
                  <button className="flex-1 py-1.5 text-xs font-semibold bg-yellow-500 text-white rounded-full hover:bg-yellow-600">
                    Refund Client
                  </button>
                  <button className="flex-1 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    Contact Parties
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  alert("Booking cancelled");
                  setSelectedBooking(null);
                }}
                className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700"
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
