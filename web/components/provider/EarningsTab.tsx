"use client";
import { ArrowDown, ArrowUp, CreditCard, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { MOCK_TRANSACTIONS } from "./data";

// ============================================
// EARNINGS TAB
// ============================================
export default function EarningsTab({
  setShowWithdrawModal,
  setShowBankModal,
}: {
  setShowWithdrawModal: (v: boolean) => void;
  setShowBankModal: (v: boolean) => void;
}) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Earnings</h2>

      {/* Earnings Card */}
      <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-emerald-100">Total Earnings</p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-white/10 rounded-full"
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <p className="text-3xl font-bold mb-4">
            {showBalance ? "₦380,000" : "₦•••,•••"}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-emerald-200">This Month</p>
              <p className="text-lg font-semibold">
                {showBalance ? "₦125,000" : "•••"}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-200">Pending</p>
              <p className="text-lg font-semibold">
                {showBalance ? "₦35,000" : "•••"}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-200">Withdrawn</p>
              <p className="text-lg font-semibold">
                {showBalance ? "₦220,000" : "•••"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <ArrowDown size={18} className="text-emerald-600" />
          <span className="text-sm font-semibold text-gray-900">Withdraw</span>
        </button>
        <button
          onClick={() => setShowBankModal(true)}
          className="flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <CreditCard size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">
            Bank Details
          </span>
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Transaction History
        </h3>
        <div className="flex flex-col gap-3 sm:gap-4 md:grid md:grid-cols-2">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    tx.type === "credit" ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDown size={16} className="text-emerald-600" />
                  ) : (
                    <ArrowUp size={16} className="text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {tx.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                </div>
              </div>
              <span
                className={`text-sm sm:text-base font-bold whitespace-nowrap ${tx.type === "credit" ? "text-emerald-600" : "text-red-500"}`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
