"use client";
import { useNotification } from "@/context/NotificationContext";
import {
    Ban,
    CheckCircle,
    Clock,
    LayoutGrid,
    List,
    MessageSquare,
    Search,
    X,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { MOCK_USERS_LIST } from "./data";
import type { AdminRole } from "./types";

// ============================================
// USERS TAB
// ============================================
export default function UsersTab({ adminRole }: { adminRole: AdminRole }) {
  const isSuperAdmin = adminRole === "super_admin";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    | "all"
    | "active"
    | "suspended"
    | "banned"
    | "pending"
    | "rejected"
    | "appealed"
  >("all");
  const [users, setUsers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      type: string;
      status: string;
      joined: string;
      bookings: number;
      totalSpent?: string;
      lastActive?: string;
      verified?: boolean;
      location?: string;
      appealReason?: string;
    }>
  >([
    ...MOCK_USERS_LIST,
    {
      id: "u108",
      name: "Ngozi Eze",
      email: "ngozi@example.com",
      phone: "+234 810 444 5555",
      type: "client" as const,
      status: "pending" as const,
      joined: "Feb 22, 2026",
      bookings: 0,
      totalSpent: "₦0",
      lastActive: "Just now",
      verified: false,
      location: "Wuse, Abuja",
    },
    {
      id: "u109",
      name: "Emeka Nwosu",
      email: "emeka@example.com",
      phone: "+234 903 666 7777",
      type: "provider" as const,
      status: "rejected" as const,
      joined: "Feb 18, 2026",
      bookings: 0,
      totalSpent: "₦0",
      lastActive: "5 days ago",
      verified: false,
      location: "Ajah, Lagos",
    },
    {
      id: "u110",
      name: "Tolu Bello",
      email: "tolu@example.com",
      phone: "+234 708 888 9999",
      type: "client" as const,
      status: "appealed" as const,
      joined: "Nov 20, 2025",
      bookings: 5,
      totalSpent: "₦89,000",
      lastActive: "3 days ago",
      verified: true,
      location: "Lekki, Lagos",
      appealReason:
        "Account was suspended due to misunderstanding. I have provided additional verification documents.",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");

  const { addToast } = useNotification();

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const updateUserStatus = (id: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );
  };

  const handleSuspend = (user: (typeof users)[0]) => {
    updateUserStatus(user.id, "suspended");
    addToast({
      type: "warning",
      title: "⚠️ User Suspended",
      message: `${user.name} has been suspended from the platform.`,
    });
    setSelectedUser(null);
  };

  const handleBan = (user: (typeof users)[0]) => {
    updateUserStatus(user.id, "banned");
    addToast({
      type: "error",
      title: "🚫 User Banned",
      message: `${user.name} has been permanently banned.`,
    });
    setSelectedUser(null);
  };

  const handleActivate = (user: (typeof users)[0]) => {
    updateUserStatus(user.id, "active");
    addToast({
      type: "success",
      title: "✅ User Activated",
      message: `${user.name}'s account has been reactivated.`,
    });
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;
    addToast({
      type: "info",
      title: "📨 Message Sent",
      message: `Message sent to ${selectedUser.name}`,
    });
    setMessageText("");
    setShowMessageForm(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "suspended":
        return "bg-yellow-100 text-yellow-700";
      case "banned":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-gray-100 text-gray-700";
      case "appealed":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">{users.length} total users</p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              "all",
              "active",
              "suspended",
              "banned",
              "pending",
              "rejected",
              "appealed",
            ] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? f === "appealed"
                    ? "bg-orange-500 text-white"
                    : "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f === "appealed"
                ? "Appeals"
                : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 opacity-60">
                ({users.filter((u) => f === "all" || u.status === f).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            : "flex flex-col gap-3"
        }
      >
        {filtered.map((u) => (
          <div
            key={u.id}
            onClick={() => {
              setSelectedUser(u);
              setShowMessageForm(false);
            }}
            className={`bg-white rounded-2xl shadow-sm p-3 sm:p-5 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-purple-100 ${
              viewMode === "grid"
                ? "flex flex-col"
                : "flex flex-col sm:flex-row sm:items-center gap-4"
            }`}
          >
            <div
              className={
                viewMode === "grid"
                  ? "flex items-start gap-2 mb-3"
                  : "flex items-center gap-3 sm:w-1/3"
              }
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  u.type === "provider"
                    ? "bg-emerald-50 text-emerald-700"
                    : u.type === "admin"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-blue-50 text-blue-700"
                }`}
              >
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1">
                  {u.name}
                  {u.verified && (
                    <span className="inline-flex items-center justify-center w-3 h-3 bg-purple-100 rounded-full ml-1 align-middle">
                      <CheckCircle size={8} className="text-purple-600" />
                    </span>
                  )}
                </h3>
                {viewMode === "grid" && (
                  <span
                    className={`inline-block mt-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full capitalize ${statusBadge(u.status)}`}
                  >
                    {u.status}
                  </span>
                )}
                {viewMode === "list" && (
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                    {u.email}
                  </p>
                )}
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "mt-auto mb-3"
                  : "flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] sm:text-xs text-gray-500 sm:border-l sm:pl-4 border-gray-100"
              }
            >
              <div className={viewMode === "grid" ? "" : "flex flex-col"}>
                {viewMode === "grid" ? (
                  <span
                    className={`inline-block mb-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full capitalize ${
                      u.type === "provider"
                        ? "bg-emerald-50 text-emerald-700"
                        : u.type === "admin"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {u.type}
                  </span>
                ) : (
                  <>
                    <span className="text-gray-400 mb-0.5">Type</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {u.type}
                    </span>
                  </>
                )}
                {viewMode === "grid" && (
                  <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                    {u.email}
                  </p>
                )}
              </div>

              {viewMode === "list" && (
                <div className="flex flex-col">
                  <span className="text-gray-400 mb-0.5">Joined</span>
                  <span className="font-medium text-gray-900">{u.joined}</span>
                </div>
              )}

              <div
                className={
                  viewMode === "grid"
                    ? "flex items-center justify-between text-[9px] sm:text-[10px] text-gray-500 mt-1"
                    : "flex flex-col"
                }
              >
                {viewMode === "grid" ? (
                  <>
                    <span>{u.bookings} bkgs</span>
                    <span className="font-semibold text-gray-700">
                      {u.totalSpent || "—"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-400 mb-0.5">Bookings</span>
                    <span className="font-medium text-gray-900">
                      {u.bookings}
                    </span>
                  </>
                )}
              </div>

              {viewMode === "list" && (
                <div className="flex flex-col">
                  <span className="text-gray-400 mb-0.5">Spent</span>
                  <span className="font-medium text-gray-900">
                    {u.totalSpent || "—"}
                  </span>
                </div>
              )}
            </div>

            {viewMode === "grid" && (
              <div className="pt-2 border-t border-gray-50 text-[9px] sm:text-[10px] text-gray-400">
                Joined {u.joined}
              </div>
            )}

            {viewMode === "list" && (
              <div className="flex items-center justify-end sm:w-24 shrink-0 mt-2 sm:mt-0">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold capitalize whitespace-nowrap ${statusBadge(u.status)}`}
                >
                  {u.status}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-gray-500">No users matching your search.</p>
        </div>
      )}

      {/* ===== USER DETAIL MODAL ===== */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Avatar & Identity */}
            <div className="text-center mb-5">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xl ${
                  selectedUser.type === "provider"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedUser.type === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {selectedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                {selectedUser.name}
              </h4>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    selectedUser.type === "provider"
                      ? "bg-emerald-50 text-emerald-700"
                      : selectedUser.type === "admin"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {selectedUser.type}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusBadge(selectedUser.status)}`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Email
                </p>
                <p className="text-sm text-gray-900 truncate">
                  {selectedUser.email}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Phone
                </p>
                <p className="text-sm text-gray-900">
                  {selectedUser.phone || "Not provided"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Joined
                </p>
                <p className="text-sm text-gray-900">{selectedUser.joined}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Location
                </p>
                <p className="text-sm text-gray-900">
                  {selectedUser.location || "Lagos"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-lg font-bold text-blue-700">
                  {selectedUser.bookings}
                </p>
                <p className="text-[10px] text-blue-500">Bookings</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <p className="text-lg font-bold text-emerald-700">
                  {selectedUser.totalSpent || "₦0"}
                </p>
                <p className="text-[10px] text-emerald-500">Total Spent</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-center">
                <p className="text-lg font-bold text-purple-700">
                  {selectedUser.lastActive || "—"}
                </p>
                <p className="text-[10px] text-purple-500">Last Active</p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-5">
              {selectedUser.verified ? (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <p className="text-sm text-emerald-700 font-medium">
                    Verified Account
                  </p>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-500">Not Verified</p>
                </>
              )}
            </div>

            {/* Message Form */}
            {showMessageForm && (
              <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 mb-2">
                  Send Message to {selectedUser.name}
                </p>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm border border-blue-200 outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setShowMessageForm(false)}
                    className="px-4 py-2 bg-white text-gray-600 text-xs font-semibold rounded-full border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowMessageForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700"
              >
                <MessageSquare size={16} /> Send Message
              </button>

              {selectedUser.status === "active" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => isSuperAdmin && handleSuspend(selectedUser)}
                    disabled={!isSuperAdmin}
                    title={
                      !isSuperAdmin
                        ? "Requires Super Admin privileges"
                        : "Suspend this user"
                    }
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 bg-yellow-50 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-200 ${isSuperAdmin ? "hover:bg-yellow-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Clock size={16} /> Suspend
                  </button>
                  <button
                    onClick={() => isSuperAdmin && handleBan(selectedUser)}
                    disabled={!isSuperAdmin}
                    title={
                      !isSuperAdmin
                        ? "Requires Super Admin privileges"
                        : "Ban this user"
                    }
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-200 ${isSuperAdmin ? "hover:bg-red-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Ban size={16} /> Ban User
                  </button>
                  {!isSuperAdmin && (
                    <p className="col-span-2 text-[10px] text-gray-400 text-center">
                      🔒 Super Admin required for these actions
                    </p>
                  )}
                </div>
              )}

              {(selectedUser.status === "suspended" ||
                selectedUser.status === "banned") && (
                <button
                  onClick={() => handleActivate(selectedUser)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 border border-emerald-200"
                >
                  <CheckCircle size={16} /> Reactivate Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
