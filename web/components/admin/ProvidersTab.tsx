"use client";
import { useNotification } from "@/context/NotificationContext";
import {
    Ban,
    Check,
    CheckCircle,
    ChevronRight,
    LayoutGrid,
    List,
    Mail,
    MessageSquare,
    Search,
    X,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { MOCK_PROVIDERS_LIST } from "./data";
import type { AdminRole } from "./types";

// ============================================
// PROVIDERS TAB
// ============================================
export default function ProvidersTab({ adminRole }: { adminRole: AdminRole }) {
  const isSuperAdmin = adminRole === "super_admin";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "verified" | "pending" | "suspended"
  >("all");
  const [providers, setProviders] = useState(MOCK_PROVIDERS_LIST);
  const [selectedProvider, setSelectedProvider] = useState<
    (typeof MOCK_PROVIDERS_LIST)[0] | null
  >(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { addToast } = useNotification();

  const toggleBulkSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkApprove = () => {
    setProviders((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) ? { ...p, status: "verified" as const } : p,
      ),
    );
    addToast({
      type: "success",
      title: "✅ Bulk Approved",
      message: `${selectedIds.size} providers approved.`,
    });
    setSelectedIds(new Set());
  };

  const handleBulkSuspend = () => {
    setProviders((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) ? { ...p, status: "suspended" as const } : p,
      ),
    );
    addToast({
      type: "warning",
      title: "⚠️ Bulk Suspended",
      message: `${selectedIds.size} providers suspended.`,
    });
    setSelectedIds(new Set());
  };

  const filtered = providers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleApprove = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "verified" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "success",
        title: "✅ Provider Approved",
        message: `${prov.name} has been verified and can now receive bookings.`,
      });
    setSelectedProvider(null);
  };

  const handleReject = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "suspended" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "error",
        title: "❌ Provider Rejected",
        message: `${prov.name}'s application has been rejected.`,
      });
    setSelectedProvider(null);
  };

  const handleSuspend = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "suspended" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "warning",
        title: "⚠️ Provider Suspended",
        message: `${prov.name} has been suspended from the platform.`,
      });
    setSelectedProvider(null);
  };

  const handleReinstate = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "verified" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "success",
        title: "✅ Provider Reinstated",
        message: `${prov.name}'s account has been reinstated.`,
      });
    setSelectedProvider(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedProvider) return;
    addToast({
      type: "info",
      title: "📨 Message Sent",
      message: `Message sent to ${selectedProvider.name}: "${messageText.slice(0, 50)}..."`,
    });
    setMessageText("");
    setShowMessageForm(false);
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Provider Management</h2>

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
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "verified", "pending", "suspended"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 opacity-60">
                ({providers.filter((p) => f === "all" || p.status === f).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {bulkMode && (
        <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={
                selectedIds.size === filtered.length && filtered.length > 0
              }
              onChange={() => {
                if (selectedIds.size === filtered.length)
                  setSelectedIds(new Set());
                else setSelectedIds(new Set(filtered.map((p) => p.id)));
              }}
              className="accent-purple-600"
            />
            Select All ({selectedIds.size}/{filtered.length})
          </label>
          <div className="flex-1" />
          <button
            onClick={handleBulkApprove}
            disabled={selectedIds.size === 0}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
          >
            Approve ({selectedIds.size})
          </button>
          <button
            onClick={handleBulkSuspend}
            disabled={selectedIds.size === 0}
            className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            Suspend ({selectedIds.size})
          </button>
        </div>
      )}

      {/* Provider Cards */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 gap-3 sm:gap-4"
            : "flex flex-col gap-3"
        }
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              if (bulkMode) {
                toggleBulkSelect(p.id);
                return;
              }
              setSelectedProvider(p);
              setShowMessageForm(false);
              setMessageSent(false);
            }}
            className={`bg-white rounded-2xl shadow-sm p-3 sm:p-5 hover:shadow-md transition-shadow cursor-pointer ${
              p.status === "pending"
                ? "border-t-4 border-t-yellow-400 border-x border-b border-transparent"
                : "border border-transparent"
            } ${bulkMode && selectedIds.has(p.id) ? "ring-2 ring-purple-400" : ""} ${
              viewMode === "grid"
                ? "flex flex-col"
                : "flex flex-col sm:flex-row sm:items-center gap-4"
            }`}
          >
            <div
              className={
                viewMode === "grid"
                  ? "flex items-start gap-2 mb-3"
                  : "flex items-center gap-3 sm:w-1/3 shrink-0"
              }
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  p.status === "verified"
                    ? "bg-emerald-50 text-emerald-700"
                    : p.status === "pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                }`}
              >
                {p.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1">
                  {p.name}
                </h3>
                {viewMode === "grid" && (
                  <span
                    className={`inline-block mt-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full capitalize ${
                      p.status === "verified"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                )}
                {viewMode === "list" && (
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                    {p.email}
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
                {viewMode === "list" && (
                  <span className="text-gray-400 mb-0.5">Category</span>
                )}
                <p
                  className={`text-[10px] sm:text-xs ${viewMode === "grid" ? "text-gray-500 line-clamp-1" : "text-gray-900 font-medium"}`}
                >
                  {p.category}
                </p>
                {viewMode === "grid" && (
                  <p className="text-[9px] sm:text-[10px] text-gray-400 truncate mt-0.5">
                    {p.email}
                  </p>
                )}
              </div>

              <div className={viewMode === "grid" ? "" : "flex flex-col"}>
                {viewMode === "list" && (
                  <span className="text-gray-400 mb-0.5">Stats</span>
                )}
                {p.rating > 0 && (
                  <div
                    className={`flex items-center gap-1.5 text-[9px] sm:text-[10px] ${viewMode === "grid" ? "text-gray-500 mt-1.5" : "text-gray-900"}`}
                  >
                    <span className="font-bold text-gray-700">
                      ★ {p.rating}
                    </span>
                    <span>•</span>
                    <span>{p.jobs} jobs</span>
                  </div>
                )}
              </div>

              {viewMode === "list" && (
                <div className="flex flex-col">
                  <span className="text-gray-400 mb-0.5">Status</span>
                  <span
                    className={`inline-block w-fit text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      p.status === "verified"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              )}
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "flex items-center gap-1.5 pt-2 border-t border-gray-50 mt-auto"
                  : "flex items-center gap-1.5 justify-end shrink-0"
              }
            >
              <a
                href={`tel:+234000000000`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                title="Call provider"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
              <a
                href={`mailto:${p.email}`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                title="Email provider"
              >
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
              </a>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 ml-auto" />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No providers found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* ===== PROVIDER DETAIL MODAL ===== */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Provider Details
              </h3>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Avatar & Name */}
            <div className="text-center mb-5">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xl ${
                  selectedProvider.status === "verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedProvider.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {selectedProvider.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                {selectedProvider.name}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedProvider.category}
              </p>
              <span
                className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  selectedProvider.status === "verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedProvider.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {selectedProvider.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.rating > 0
                    ? `${selectedProvider.rating} ★`
                    : "N/A"}
                </p>
                <p className="text-[10px] text-gray-500">Rating</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.jobs}
                </p>
                <p className="text-[10px] text-gray-500">Jobs</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.joined.split(",")[0]}
                </p>
                <p className="text-[10px] text-gray-500">Joined</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Mail size={14} className="text-gray-400" />
                <p className="text-sm text-gray-700">
                  {selectedProvider.email}
                </p>
              </div>
            </div>

            {/* Message Form */}
            {showMessageForm && (
              <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 mb-2">
                  Send Message to {selectedProvider.name}
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

            {messageSent && (
              <div className="mb-4 p-3 bg-green-50 rounded-xl text-center">
                <p className="text-xs text-green-700 font-medium">
                  ✅ Message sent successfully
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowMessageForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700"
              >
                <MessageSquare size={16} /> Contact Provider
              </button>

              {selectedProvider.status === "pending" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(selectedProvider.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() =>
                      isSuperAdmin && handleReject(selectedProvider.id)
                    }
                    disabled={!isSuperAdmin}
                    title={
                      !isSuperAdmin
                        ? "Requires Super Admin privileges"
                        : "Reject this provider"
                    }
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-full ${isSuperAdmin ? "hover:bg-red-700 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}

              {selectedProvider.status === "verified" && (
                <button
                  onClick={() =>
                    isSuperAdmin && handleSuspend(selectedProvider.id)
                  }
                  disabled={!isSuperAdmin}
                  title={
                    !isSuperAdmin
                      ? "Requires Super Admin privileges"
                      : "Suspend this provider"
                  }
                  className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-200 ${isSuperAdmin ? "hover:bg-red-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  <Ban size={16} /> Suspend Provider
                </button>
              )}

              {selectedProvider.status === "suspended" && (
                <button
                  onClick={() => handleReinstate(selectedProvider.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 border border-emerald-200"
                >
                  <CheckCircle size={16} /> Reinstate Provider
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
