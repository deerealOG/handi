"use client";

import { webFeatureService } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Shield,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function GuaranteeTab() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    const res = await webFeatureService.getGuaranteeClaims();
    if (res.success && res.data) setClaims(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const handleResolve = async (claimId: string, resolution: string, refundAmount?: number) => {
    const res = await fetch(`/api/features/guarantee/${claimId}/resolve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({ resolution, refundAmount }),
    }).then(r => r.json()).catch(() => ({ success: false }));
    setMessage(res.success ? "✅ Claim resolved" : res.error || "Failed");
    fetchClaims();
  };

  const statusIcons: Record<string, any> = {
    SUBMITTED: { icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    UNDER_REVIEW: { icon: AlertTriangle, color: "bg-orange-100 text-orange-700" },
    RESOLVED: { icon: CheckCircle, color: "bg-green-100 text-green-700" },
    REJECTED: { icon: XCircle, color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Service Guarantee</h2>
          <p className="text-sm text-gray-500">Manage guarantee claims within the 30-day window.</p>
        </div>
        <button onClick={fetchClaims} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* Policy Card */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Shield size={24} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">30-Day Service Guarantee</h3>
          <p className="text-sm text-gray-500 mt-1">
            Clients can submit claims within 30 days of service completion. Claims include evidence review and admin resolution with optional refund processing.
          </p>
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Shield size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">No guarantee claims submitted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim: any) => {
            const statusInfo = statusIcons[claim.status] || statusIcons.SUBMITTED;
            const StatusIcon = statusInfo.icon;
            return (
              <div key={claim.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusInfo.color}`}>
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{claim.issue}</h4>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{claim.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                        <span>Booking: {claim.bookingId?.slice(0, 8)}...</span>
                        <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                    {claim.status?.replace("_", " ")}
                  </span>
                </div>

                {claim.evidence?.length > 0 && (
                  <div className="flex gap-2 mt-2 mb-3">
                    {claim.evidence.map((e: string, i: number) => (
                      <div key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">📎 Evidence {i + 1}</div>
                    ))}
                  </div>
                )}

                {claim.resolution && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs mt-2">
                    <p className="font-semibold text-green-800">Resolution:</p>
                    <p className="text-green-700 mt-0.5">{claim.resolution}</p>
                    {claim.refundAmount && <p className="font-bold text-green-800 mt-1">Refund: ₦{claim.refundAmount.toLocaleString()}</p>}
                  </div>
                )}

                {(claim.status === "SUBMITTED" || claim.status === "UNDER_REVIEW") && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleResolve(claim.id, "REFUND_FULL", 0)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={12} /> Full Refund
                    </button>
                    <button
                      onClick={() => handleResolve(claim.id, "REDO_SERVICE")}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 flex items-center justify-center gap-1"
                    >
                      <RefreshCw size={12} /> Redo Service
                    </button>
                    <button
                      onClick={() => handleResolve(claim.id, "REJECTED")}
                      className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
