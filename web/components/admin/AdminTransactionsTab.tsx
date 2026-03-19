"use client";
import { useNotification } from "@/context/NotificationContext";
import {
    AlertTriangle,
    ArrowUp,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    LayoutGrid,
    List,
    Printer,
    Send,
    Share2,
    TrendingUp,
    X,
    XCircle,
} from "lucide-react";
import { useState } from "react";

// ============================================
// ADMIN TRANSACTIONS TAB
// ============================================
export default function AdminTransactionsTab() {
  const { addToast } = useNotification();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [actionType, setActionType] = useState<"refund" | "chargeback" | null>(
    null,
  );
  const [actionReason, setActionReason] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendTarget, setSendTarget] = useState("finance");

  const transactions = [
    {
      id: "at1",
      title: "Payment — Deep Cleaning",
      from: "Golden Amadi",
      to: "CleanPro Services",
      date: "Feb 22, 2026",
      amount: "₦15,000",
      type: "payment",
      status: "completed",
      ref: "PAY_hnd_8f2k4j9x1a",
      gateway: "Paystack",
      channel: "card",
    },
    {
      id: "at2",
      title: "Provider Withdrawal",
      from: "CleanPro Services",
      to: "GTBank ****1234",
      date: "Feb 21, 2026",
      amount: "₦12,750",
      type: "withdrawal",
      status: "completed",
      ref: "WDR_hnd_3m7p2r5t8v",
      gateway: "Paystack",
      channel: "bank_transfer",
    },
    {
      id: "at3",
      title: "Refund — Interior Painting",
      from: "System",
      to: "Fatima Bello",
      date: "Feb 20, 2026",
      amount: "₦40,000",
      type: "refund",
      status: "completed",
      ref: "REF_hnd_6n1s4u7w0y",
      gateway: "Paystack",
      channel: "card",
    },
    {
      id: "at4",
      title: "Platform Commission",
      from: "Auto",
      to: "HANDI Revenue",
      date: "Feb 20, 2026",
      amount: "₦2,250",
      type: "commission",
      status: "completed",
      ref: "COM_hnd_9q3v5x8z1b",
      gateway: "Internal",
      channel: "auto",
    },
    {
      id: "at5",
      title: "Payment — Plumbing Repair",
      from: "Adaobi Chen",
      to: "handi Plumbing",
      date: "Feb 19, 2026",
      amount: "₦12,000",
      type: "payment",
      status: "pending",
      ref: "PAY_hnd_2d4f6h8j0l",
      gateway: "Paystack",
      channel: "bank_transfer",
    },
    {
      id: "at6",
      title: "Subscription — Pro Plan",
      from: "Chinedu Okonkwo",
      to: "HANDI",
      date: "Feb 18, 2026",
      amount: "₦5,000",
      type: "subscription",
      status: "completed",
      ref: "SUB_hnd_5g7i9k1m3o",
      gateway: "Paystack",
      channel: "card",
    },
    {
      id: "at7",
      title: "Chargeback — Bridal Makeup",
      from: "Dispute Resolution",
      to: "Amara Chukwu",
      date: "Feb 17, 2026",
      amount: "₦18,000",
      type: "chargeback",
      status: "completed",
      ref: "CHB_hnd_8p0r2t4v6x",
      gateway: "Paystack",
      channel: "card",
    },
  ];

  const typeColors: Record<string, string> = {
    payment: "bg-green-100 text-green-700",
    withdrawal: "bg-blue-100 text-blue-700",
    refund: "bg-red-100 text-red-700",
    commission: "bg-purple-100 text-purple-700",
    subscription: "bg-yellow-100 text-yellow-700",
    chargeback: "bg-orange-100 text-orange-700",
  };

  const handleAction = () => {
    if (!selectedTxn || !actionType) return;
    addToast({
      type: actionType === "refund" ? "success" : "warning",
      title:
        actionType === "refund" ? "💸 Refund Initiated" : "⚠️ Chargeback Filed",
      message: `${actionType === "refund" ? "Refund" : "Chargeback"} of ${selectedTxn.amount} for ${selectedTxn.title} has been initiated. Ref: ${selectedTxn.ref}`,
    });
    setActionType(null);
    setActionReason("");
    setSelectedTxn(null);
  };

  const handlePrint = () => {
    if (!selectedTxn) return;
    const receiptHtml = `
      <html><head><title>HANDI Receipt — ${selectedTxn.ref}</title>
      <style>body{font-family:system-ui;max-width:400px;margin:40px auto;padding:20px}
      .logo{font-size:24px;font-weight:bold;color:#059669;margin-bottom:20px}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0}
      .label{color:#6b7280;font-size:14px}.value{font-weight:600;font-size:14px}
      .amount{font-size:24px;font-weight:bold;text-align:center;margin:20px 0}
      .footer{text-align:center;margin-top:30px;color:#9ca3af;font-size:12px}
      @media print{body{margin:0}}</style></head>
      <body>
      <div class="logo">HANDI</div>
      <p style="font-size:12px;color:#6b7280">Transaction Receipt</p>
      <div class="amount">${selectedTxn.amount}</div>
      <div class="row"><span class="label">Title</span><span class="value">${selectedTxn.title}</span></div>
      <div class="row"><span class="label">From</span><span class="value">${selectedTxn.from}</span></div>
      <div class="row"><span class="label">To</span><span class="value">${selectedTxn.to}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${selectedTxn.date}</span></div>
      <div class="row"><span class="label">Reference</span><span class="value" style="font-family:monospace;font-size:11px">${selectedTxn.ref}</span></div>
      <div class="row"><span class="label">Gateway</span><span class="value">${selectedTxn.gateway}</span></div>
      <div class="row"><span class="label">Channel</span><span class="value" style="text-transform:capitalize">${selectedTxn.channel?.replace("_", " ")}</span></div>
      <div class="row"><span class="label">Status</span><span class="value">${selectedTxn.status}</span></div>
      <div class="footer">HANDI — Nigeria's #1 Service Marketplace<br/>support@handi.ng</div>
      </body></html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (!selectedTxn) return;
    const shareText = `HANDI Receipt\n${selectedTxn.title}\nAmount: ${selectedTxn.amount}\nFrom: ${selectedTxn.from}\nTo: ${selectedTxn.to}\nDate: ${selectedTxn.date}\nRef: ${selectedTxn.ref}\nStatus: ${selectedTxn.status}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `HANDI Receipt — ${selectedTxn.ref}`, text: shareText });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      addToast({ type: "success", title: "📋 Copied", message: "Receipt details copied to clipboard." });
    }
  };

  const handleSendToDept = () => {
    if (!selectedTxn) return;
    const deptLabels: Record<string, string> = {
      finance: "Finance Team",
      legal: "Legal Department",
      support: "Customer Support",
      super_admin: "Super Admin",
    };
    addToast({
      type: "success",
      title: "📨 Sent",
      message: `Transaction ${selectedTxn.ref} details sent to ${deptLabels[sendTarget] || sendTarget}.`,
    });
    setShowSendModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-500">
            Financial overview • Powered by Paystack
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List size={16} />
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-semibold hover:bg-purple-700 cursor-pointer">
            <Download size={12} /> Export Report
          </button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Revenue",
            value: "₦24.5M",
            change: "+12.5%",
            gradient: "from-green-500 to-emerald-600",
            icon: DollarSign,
          },
          {
            label: "Commissions",
            value: "₦3.2M",
            change: "+8.3%",
            gradient: "from-purple-500 to-indigo-600",
            icon: TrendingUp,
          },
          {
            label: "Refunds",
            value: "₦890K",
            change: "-2.1%",
            gradient: "from-red-500 to-rose-600",
            icon: XCircle,
          },
          {
            label: "Pending",
            value: "₦156K",
            change: "5 txns",
            gradient: "from-orange-500 to-amber-600",
            icon: Clock,
          },
        ].map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl bg-linear-to-br ${c.gradient} p-4 text-white relative overflow-hidden`}
          >
            <div className="absolute top-2 right-2 opacity-15">
              <c.icon size={32} />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              {c.label}
            </p>
            <p className="text-xl font-extrabold mt-1">{c.value}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{c.change}</p>
          </div>
        ))}
      </div>

      {/* Transaction List / Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTxn(t)}
              className="flex flex-col justify-between bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-2">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${typeColors[t.type]} flex items-center justify-center shrink-0`}
                >
                  {t.type === "payment" && <DollarSign size={16} />}
                  {t.type === "withdrawal" && <ArrowUp size={16} />}
                  {t.type === "refund" && <XCircle size={16} />}
                  {t.type === "commission" && <TrendingUp size={16} />}
                  {t.type === "subscription" && <CreditCard size={16} />}
                  {t.type === "chargeback" && <AlertTriangle size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {t.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {t.from} → {t.to}
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono mb-0.5">
                    {t.ref}
                  </p>
                  <span
                    className={`inline-block text-[9px] font-medium px-1.5 py-0.5 rounded-full ${t.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                    {t.amount}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400">
                    {t.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">From → To</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => (
                  <tr key={t.id} onClick={() => setSelectedTxn(t)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${typeColors[t.type]} flex items-center justify-center shrink-0`}>
                          {t.type === "payment" && <DollarSign size={14} />}
                          {t.type === "withdrawal" && <ArrowUp size={14} />}
                          {t.type === "refund" && <XCircle size={14} />}
                          {t.type === "commission" && <TrendingUp size={14} />}
                          {t.type === "subscription" && <CreditCard size={14} />}
                          {t.type === "chargeback" && <AlertTriangle size={14} />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{t.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{t.ref}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-xs text-gray-600">{t.from} → {t.to}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900">{t.amount}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-500">{t.date}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${t.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Detail / Action Modal */}
      {selectedTxn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setSelectedTxn(null);
            setActionType(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Transaction Details
              </h3>
              <button
                onClick={() => {
                  setSelectedTxn(null);
                  setActionType(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Title</span>
                <span className="font-semibold">{selectedTxn.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-lg">{selectedTxn.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">From</span>
                <span>{selectedTxn.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">To</span>
                <span>{selectedTxn.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paystack Ref</span>
                <span className="font-mono text-xs">{selectedTxn.ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gateway</span>
                <span>{selectedTxn.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Channel</span>
                <span className="capitalize">
                  {selectedTxn.channel?.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedTxn.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {selectedTxn.status}
                </span>
              </div>
            </div>

            {/* Receipt Actions: Print, Share, Send */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 cursor-pointer">
                <Printer size={14} /> Print
              </button>
              <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 cursor-pointer">
                <Share2 size={14} /> Share
              </button>
              <button onClick={() => setShowSendModal(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-200 cursor-pointer">
                <Send size={14} /> Send
              </button>
            </div>

            {/* Actions */}
            {selectedTxn.type === "payment" &&
              selectedTxn.status === "completed" &&
              !actionType && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setActionType("refund")}
                    className="flex-1 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <XCircle size={14} /> Refund
                  </button>
                  <button
                    onClick={() => setActionType("chargeback")}
                    className="flex-1 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-100 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle size={14} /> Chargeback
                  </button>
                </div>
              )}

            {actionType && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-3">
                <p className="text-sm font-semibold text-gray-900">
                  {actionType === "refund"
                    ? "🔄 Initiate Refund"
                    : "⚠️ File Chargeback"}
                </p>
                <textarea
                  placeholder="Reason for this action..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm resize-none h-20 outline-none focus:ring-2 focus:ring-purple-200"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setActionType(null)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={!actionReason.trim()}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send to Department Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50" onClick={() => setShowSendModal(false)}>
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Transaction Details</h3>
            <p className="text-sm text-gray-500 mb-4">
              Send details of <b>{selectedTxn?.ref}</b> to a department for review.
            </p>
            <select
              value={sendTarget}
              onChange={(e) => setSendTarget(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer mb-4"
            >
              <option value="finance">Finance Team</option>
              <option value="legal">Legal Department</option>
              <option value="support">Customer Support</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowSendModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleSendToDept} className="flex-1 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 cursor-pointer">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
