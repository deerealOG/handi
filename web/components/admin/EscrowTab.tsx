"use client";

import { webEscrowService } from "@/lib/api";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  RefreshCw,
  Shield,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function EscrowTab() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    const res = await webEscrowService.getRefunds();
    if (res.success && res.data) setRefunds(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRefunds(); }, [fetchRefunds]);

  const handleProcess = async (id: string, action: "APPROVED" | "REJECTED") => {
    setProcessing(id);
    const res = await fetch(`/api/escrow/refunds/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({ status: action, adminNote: `${action} by admin` }),
    }).then(r => r.json()).catch(() => ({ success: false }));
    setMessage(res.success ? `✅ Refund ${action.toLowerCase()}` : res.error || "Failed");
    setProcessing(null);
    fetchRefunds();
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    PROCESSED: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Escrow & Refunds</h2>
          <p className="text-sm text-gray-500">Manage escrow holds and refund requests.</p>
        </div>
        <button onClick={fetchRefunds} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* Policy Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3 text-gray-900">
          <Shield size={18} className="text-primary" />
          <h3 className="font-semibold">Refund Policy Tiers</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: "24h+ before", rate: "100%", color: "text-green-600" },
            { label: "12-24h before", rate: "85%", color: "text-yellow-600" },
            { label: "After arrival", rate: "50%", color: "text-orange-600" },
            { label: "Pro no-show", rate: "100% + 10% credit", color: "text-blue-600" },
          ].map((t) => (
            <div key={t.label} className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500">{t.label}</p>
              <p className={`font-bold text-sm mt-0.5 ${t.color}`}>{t.rate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Requests */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : refunds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <DollarSign size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">No refund requests at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {refunds.map((r: any) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Refund #{r.id?.slice(0, 8)}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[r.status] || "bg-gray-100 text-gray-500"}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{r.type} — {r.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₦{(r.amount || r.calculatedAmount || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {r.status === "PENDING" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleProcess(r.id, "APPROVED")}
                    disabled={processing === r.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleProcess(r.id, "REJECTED")}
                    disabled={processing === r.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
                  >
                    <AlertCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
