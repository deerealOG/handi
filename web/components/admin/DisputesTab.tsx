"use client";
import { useNotification } from "@/context/NotificationContext";
import {
    ArrowUp,
    Ban,
    Check,
    CheckCircle,
    ChevronRight,
    Eye,
    MessageSquare,
    Search,
    X
} from "lucide-react";
import { useState } from "react";
import { MOCK_DISPUTES } from "./data";
import type { Dispute, DisputeStatus } from "./types";

// ============================================
// DISPUTES TAB
// ============================================
export default function DisputesTab() {
  const { addToast } = useNotification();
  const [filter, setFilter] = useState<
    "all" | "open" | "in-review" | "resolved" | "escalated"
  >("all");
  const [disputes, setDisputes] = useState<Dispute[]>(
    MOCK_DISPUTES.map((d) => ({ ...d })),
  );
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEscalateForm, setShowEscalateForm] = useState(false);
  const [escalateTarget, setEscalateTarget] = useState("super_admin");
  const [escalateNote, setEscalateNote] = useState("");

  const filtered = disputes.filter((d) => {
    const matchFilter = filter === "all" || d.status === filter;
    const matchSearch =
      !searchQuery ||
      d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateDisputeStatus = (
    id: string,
    newStatus: DisputeStatus,
    resolution?: string,
  ) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              ...(resolution ? { resolution } : {}),
            }
          : d,
      ),
    );
    // Also update selected dispute if viewing it
    setSelectedDispute((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: newStatus,
            ...(resolution ? { resolution } : {}),
          }
        : prev,
    );
  };

  const handleMarkInReview = () => {
    if (!selectedDispute) return;
    updateDisputeStatus(selectedDispute.id, "in-review");
    addToast({
      type: "info",
      title: "🔍 Dispute In Review",
      message: `Dispute #${selectedDispute.id.slice(1)} is now under review.`,
    });
  };

  const handleResolve = () => {
    if (!selectedDispute) return;
    const note = resolutionNote.trim() || "Resolved by admin.";
    updateDisputeStatus(selectedDispute.id, "resolved", note);
    addToast({
      type: "success",
      title: "✅ Dispute Resolved",
      message: `Dispute #${selectedDispute.id.slice(1)} resolved. Refund of ${selectedDispute.amount} issued.`,
    });
    setResolutionNote("");
  };

  const handleRequestInfo = () => {
    if (!selectedDispute) return;
    addToast({
      type: "info",
      title: "📨 Info Requested",
      message: `Request for more information sent to ${selectedDispute.client} and ${selectedDispute.provider}.`,
    });
  };

  const handleSuspendProvider = () => {
    if (!selectedDispute) return;
    addToast({
      type: "error",
      title: "🚫 Provider Suspended",
      message: `${selectedDispute.provider} has been suspended pending investigation.`,
    });
  };

  const handleEscalate = () => {
    if (!selectedDispute) return;
    updateDisputeStatus(selectedDispute.id, "escalated");
    const targetLabels: Record<string, string> = {
      super_admin: "Super Admin",
      legal: "Legal Department",
      finance: "Finance Team",
    };
    addToast({
      type: "warning",
      title: "⬆️ Dispute Escalated",
      message: `Dispute #${selectedDispute.id.slice(1)} escalated to ${targetLabels[escalateTarget] || escalateTarget}.`,
    });
    setShowEscalateForm(false);
    setEscalateNote("");
  };

  const statusStyle = (s: string) => {
    switch (s) {
      case "open":
        return "bg-red-100 text-red-700";
      case "in-review":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-emerald-100 text-emerald-700";
      case "escalated":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const priorityStyle = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-50 text-red-600 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "low":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // Detail view
  if (selectedDispute) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <button
          onClick={() => {
            setSelectedDispute(null);
            setResolutionNote("");
            setShowEscalateForm(false);
          }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Disputes
        </button>

        {/* Dispute Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  Dispute #{selectedDispute.id.slice(1)}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyle(selectedDispute.status)}`}
                >
                  {selectedDispute.status.replace("-", " ")}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${priorityStyle(selectedDispute.priority)}`}
                >
                  {selectedDispute.priority} priority
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {selectedDispute.category} • {selectedDispute.date}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid sm:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">Service</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedDispute.service}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-sm font-bold text-gray-900">
                {selectedDispute.amount}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedDispute.date}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedDispute.category}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Dispute Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Dispute Opened
                </p>
                <p className="text-xs text-gray-500">
                  {selectedDispute.date} • Submitted by {selectedDispute.client}
                </p>
              </div>
            </div>
            {selectedDispute.providerResponse && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Provider Responded
                  </p>
                  <p className="text-xs text-gray-500">
                    Provider submitted their response
                  </p>
                </div>
              </div>
            )}
            {selectedDispute.status === "in-review" && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Under Admin Review
                  </p>
                  <p className="text-xs text-gray-500">
                    An admin is currently reviewing this dispute
                  </p>
                </div>
              </div>
            )}
            {selectedDispute.status === "escalated" && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Escalated</p>
                  <p className="text-xs text-gray-500">
                    This dispute has been escalated for higher review
                  </p>
                </div>
              </div>
            )}
            {selectedDispute.status === "resolved" && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Resolved</p>
                  <p className="text-xs text-gray-500">
                    Dispute has been resolved
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Client Statement */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
              {selectedDispute.client
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {selectedDispute.client}
              </p>
              <p className="text-xs text-gray-500">Client</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              {selectedDispute.description}
            </p>
          </div>
        </div>

        {/* Provider Response */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
              {selectedDispute.provider
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {selectedDispute.provider}
              </p>
              <p className="text-xs text-gray-500">Provider</p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4">
            {selectedDispute.providerResponse ? (
              <p className="text-sm text-gray-700">
                {selectedDispute.providerResponse}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No response from provider yet
              </p>
            )}
          </div>
        </div>

        {/* Resolution (if resolved) */}
        {"resolution" in selectedDispute && selectedDispute.resolution && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">Resolution</h3>
            </div>
            <p className="text-sm text-emerald-700">
              {selectedDispute.resolution}
            </p>
          </div>
        )}

        {/* Admin Actions */}
        {selectedDispute.status !== "resolved" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Admin Actions</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Resolution Note
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Describe the resolution..."
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedDispute.status === "open" && (
                  <button
                    onClick={handleMarkInReview}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    <Eye size={14} /> Mark In Review
                  </button>
                )}
                <button
                  onClick={handleResolve}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  <Check size={14} /> Resolve — Issue Refund
                </button>
                <button
                  onClick={handleRequestInfo}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-600 text-white rounded-full text-xs font-semibold hover:bg-yellow-700 transition"
                >
                  <MessageSquare size={14} /> Request More Info
                </button>
                <button
                  onClick={handleSuspendProvider}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition"
                >
                  <Ban size={14} /> Suspend Provider
                </button>
                <button
                  onClick={() => setShowEscalateForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 text-white rounded-full text-xs font-semibold hover:bg-purple-700 transition"
                >
                  <ArrowUp size={14} /> Escalate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Escalation Form Modal */}
        {showEscalateForm && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
            onClick={() => setShowEscalateForm(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Escalate Dispute
                </h3>
                <button
                  onClick={() => setShowEscalateForm(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Escalate To
                  </label>
                  <select
                    value={escalateTarget}
                    onChange={(e) => setEscalateTarget(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="legal">Legal Department</option>
                    <option value="finance">Finance Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={escalateNote}
                    onChange={(e) => setEscalateNote(e.target.value)}
                    placeholder="Reason for escalation..."
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEscalateForm(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEscalate}
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition"
                  >
                    Escalate Dispute
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Dispute Resolution</h2>
        <p className="text-sm text-gray-500">
          {disputes.filter((d) => d.status === "open").length} open disputes
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search disputes by client, provider, service..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {(["all", "open", "in-review", "resolved", "escalated"] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f === "in-review"
                ? "In Review"
                : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 opacity-60">
                ({disputes.filter((d) => f === "all" || d.status === f).length})
              </span>
            </button>
          ),
        )}
      </div>

      {/* Dispute Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDispute(d)}
            className={`flex flex-col w-full bg-white rounded-2xl shadow-sm p-3 sm:p-5 text-left hover:shadow-md transition-shadow ${
              d.status === "open"
                ? "border-t-4 border-t-red-400 border-x border-b border-transparent"
                : d.status === "in-review"
                  ? "border-t-4 border-t-yellow-400 border-x border-b border-transparent"
                  : d.status === "escalated"
                    ? "border-t-4 border-t-purple-400 border-x border-b border-transparent"
                    : "border border-transparent"
            }`}
          >
            <div className="flex items-start justify-between w-full mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  #{d.id.slice(1)}
                </span>
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full capitalize ${statusStyle(d.status)}`}
                >
                  {d.status.replace("-", " ")}
                </span>
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${priorityStyle(d.priority)}`}
                >
                  {d.priority}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0 mt-0.5" />
            </div>

            <div className="flex-1 min-w-0 w-full mb-3">
              <p className="text-[11px] sm:text-sm text-gray-900 font-medium line-clamp-1">
                {d.category}: {d.service}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                {d.client} v. {d.provider}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1 line-clamp-2">
                {d.description}
              </p>
            </div>

            <div className="w-full pt-2 border-t border-gray-50 mt-auto flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400">
              <span className="truncate pr-2">{d.date}</span>
              <span className="font-bold text-gray-900 shrink-0">
                {d.amount}
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <CheckCircle size={48} className="text-emerald-300 mx-auto mb-3" />
            <p className="text-gray-500">No {filter} disputes. All clear! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
