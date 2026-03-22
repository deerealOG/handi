"use client";
import { useNotification } from "@/context/NotificationContext";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CalendarCheck,
  Check,
  ChevronRight,
  CreditCard,
  Plus,
  Settings,
  Star,
  TrendingUp,
  X,
  ArrowUpRight,
  Clock,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { MOCK_BOOKINGS } from "./data";
import type { TabId } from "./types";

// ============================================
// DASHBOARD TAB - PREMIUM REDESIGN
// ============================================
export default function DashboardTab({
  user,
  setActiveTab,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  setActiveTab: (t: TabId) => void;
}) {
  const { addToast } = useNotification();
  
  // Withdrawal modal state
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("GTBank - ****5678");
  const [withdrawStep, setWithdrawStep] = useState<"amount" | "pin">("amount");
  const [withdrawPin, setWithdrawPin] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const walletBalance = 125000;
  const pendingBalance = 18500;
  const totalEarned = 342000;

  const handleWithdraw = () => {
    if (withdrawStep === "amount") {
      const amt = Number(withdrawAmount);
      if (!amt || amt < 1000) {
        addToast({ type: "error", title: "Invalid Amount", message: "Minimum withdrawal is ₦1,000." });
        return;
      }
      if (amt > walletBalance) {
        addToast({ type: "error", title: "Insufficient Balance", message: "You don't have enough funds." });
        return;
      }
      setWithdrawStep("pin");
      return;
    }
    // Pin verification step
    if (withdrawPin.length < 4) {
      addToast({ type: "error", title: "Invalid PIN", message: "Enter your 4-digit security PIN." });
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setShowWithdraw(false);
      setWithdrawStep("amount");
      setWithdrawAmount("");
      setWithdrawPin("");
      addToast({ type: "success", title: "✅ Withdrawal Submitted", message: `₦${Number(withdrawAmount).toLocaleString()} will be sent to ${withdrawBank} within 1-3 business days.` });
    }, 1500);
  };

  const pendingBookings = MOCK_BOOKINGS.filter((b) => b.status === "pending");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const statusStyle = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "pending": return "bg-orange-50 text-orange-700 ring-orange-600/20";
      case "confirmed": return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "cancelled": return "bg-red-50 text-red-700 ring-red-600/20";
      default: return "bg-gray-50 text-gray-700 ring-gray-500/20";
    }
  };

  const chartData = [
    { day: "Mon", value: 30 }, { day: "Tue", value: 45 }, { day: "Wed", value: 25 },
    { day: "Thu", value: 65 }, { day: "Fri", value: 85 }, { day: "Sat", value: 55 },
    { day: "Sun", value: 40 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's an overview of your business performance today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("services")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Service
          </button>
        </div>
      </div>

      {/* Profile Incomplete Warning */}
      {user.profileComplete === false && (
        <div className="bg-orange-50/50 border border-orange-200/50 p-5 flex items-start gap-4">
          <div className="p-2 bg-orange-100 rounded-full text-orange-600 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900">
              Your profile is almost complete
            </h3>
            <p className="text-sm text-orange-700 mt-1 max-w-2xl">
              Clients are 80% more likely to book providers with complete profiles. Add your skills, bio, and a profile picture to stand out.
            </p>
            <button
              onClick={() => setActiveTab("profile")}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-800 hover:text-orange-900 transition-colors"
            >
              Complete Profile <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wallet + Chart) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Card */}
          <div className="bg-linear-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={20} />
                <span className="text-sm font-semibold text-white/80">Wallet Balance</span>
              </div>
              <button
                onClick={() => setActiveTab("settings")}
                className="text-xs text-white/60 hover:text-white/90 flex items-center gap-1 transition-colors"
              >
                <Settings size={12} /> Set 2FA PIN
              </button>
            </div>
            <h3 className="text-3xl font-bold mb-1">₦{walletBalance.toLocaleString()}</h3>
            <p className="text-sm text-white/70 mb-5">Available for withdrawal</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white/10 backdrop-blur-sm p-3">
                <p className="text-xs text-white/60">Pending</p>
                <p className="text-lg font-bold">₦{pendingBalance.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3">
                <p className="text-xs text-white/60">Total Earned</p>
                <p className="text-lg font-bold">₦{totalEarned.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWithdraw(true); setWithdrawStep("amount"); }}
                className="flex-1 py-2.5 bg-white text-emerald-700 text-sm font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Withdraw Funds
              </button>
              <button
                onClick={() => setActiveTab("earnings")}
                className="px-4 py-2.5 border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
              >
                View History
              </button>
            </div>
          </div>

          {/* Small stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Completed Jobs", value: "45", trend: "+5.2%", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Avg Rating", value: "4.8", trend: "+0.2", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Pending Requests", value: String(pendingBookings.length), trend: "", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={18} /></div>
                  {stat.trend && <span className={`text-[10px] font-semibold px-2 py-0.5 ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{stat.trend}</span>}
                </div>
                <p className="text-xs font-medium text-gray-500 mb-0.5">{stat.label}</p>
                <h4 className="text-xl font-bold text-gray-900">{stat.value}</h4>
              </div>
            ))}
          </div>

          {/* Activity Chart (CSS Mock) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Activity Overview</h3>
                <p className="text-sm text-gray-500">Bookings over the last 7 days</p>
              </div>
              <select className="bg-gray-50 border-none text-sm font-medium text-gray-700 rounded-lg px-3 py-2 cursor-pointer outline-none ring-1 ring-gray-200">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-2 px-2">
              {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className="w-full relative flex justify-center group">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-10">
                      {d.value} Bookings
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-(--color-primary)/20 rounded-t-lg group-hover:bg-(--color-primary) transition-colors duration-300 relative overflow-hidden"
                      style={{ height: `${d.value}%` }}
                    >
                      <div className="absolute bottom-0 w-full bg-linear-to-t from-(--color-primary)/40 to-transparent h-full" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-wider">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Pending Requests & Insights) */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[calc(100%-24px)] min-h-[400px]">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Action Required
                {pendingBookings.length > 0 && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                )}
              </h3>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {pendingBookings.length}
              </span>
            </div>
            
            <div className="p-2 flex-1 overflow-y-auto no-scrollbar bg-gray-50/30">
              {pendingBookings.length > 0 ? (
                <div className="space-y-2">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl bg-white border border-gray-100 hover:border-orange-200 transition-colors shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.service}</p>
                          <p className="text-sm text-gray-500">{booking.client}</p>
                        </div>
                        <p className="font-bold text-(--color-primary)">{booking.amount}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-lg">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> {booking.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {booking.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToast({ type: "success", title: "Accepted", message: `Booking accepted!` })}
                          className="flex-1 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => addToast({ type: "error", title: "Declined", message: `Booking declined.` })}
                          className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <Check size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">You're all caught up!</p>
                  <p className="text-sm text-gray-400 mt-1">No pending requests right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Appointments</h3>
          <button
            onClick={() => setActiveTab("bookings")}
            className="text-sm font-semibold text-(--color-primary) hover:text-(--color-primary-dark) transition-colors cursor-pointer"
          >
            View Full History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500">Service & Client</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Schedule</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_BOOKINGS.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{booking.service}</p>
                    <p className="text-gray-500">{booking.client}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5"><Calendar size={14}/> {booking.date}</div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400"><Clock size={12}/> {booking.time}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5"><MapPin size={14}/> Lagos, NG</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset capitalize ${statusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-xs hover:bg-gray-50 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-all cursor-pointer shadow-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="mb-6 mt-2">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ring-1 ring-inset capitalize mb-3 ${statusStyle(selectedBooking.status)}`}>
                {selectedBooking.status} Booking
              </span>
              <h3 className="text-xl font-bold text-gray-900">{selectedBooking.service}</h3>
              <p className="text-gray-500 mt-1">with {selectedBooking.client}</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium space-x-1">Schedule</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedBooking.date} • {selectedBooking.time}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium space-x-1">Amount</p>
                    <p className="text-lg font-bold text-(--color-primary)">{selectedBooking.amount}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBooking(null);
                setActiveTab("bookings");
              }}
              className="w-full flex items-center justify-center px-4 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] cursor-pointer"
            >
              Open Booking Manager
            </button>
          </div>
        </div>
      )}

      {/* ===== Withdrawal Modal ===== */}
      {showWithdraw && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => { setShowWithdraw(false); setWithdrawStep("amount"); }}>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {withdrawStep === "amount" ? "Withdraw Funds" : "🔒 Verify 2FA PIN"}
              </h3>
              <button onClick={() => { setShowWithdraw(false); setWithdrawStep("amount"); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {withdrawStep === "amount" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min. ₦1,000"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Available: ₦{walletBalance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bank Account</label>
                  <select
                    value={withdrawBank}
                    onChange={(e) => setWithdrawBank(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-(--color-primary) cursor-pointer"
                  >
                    <option>GTBank - ****5678</option>
                    <option>First Bank - ****1234</option>
                    <option>UBA - ****9012</option>
                  </select>
                </div>
                <button onClick={handleWithdraw} className="w-full py-3 bg-(--color-primary) text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer">
                  Continue to Verification
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your 4-digit security PIN to confirm withdrawal of <strong>₦{Number(withdrawAmount).toLocaleString()}</strong> to <strong>{withdrawBank}</strong>.</p>
                <input
                  type="password"
                  maxLength={4}
                  value={withdrawPin}
                  onChange={(e) => setWithdrawPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="****"
                  className="w-full text-center tracking-[0.5em] text-2xl py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-(--color-primary) font-mono"
                />
                <p className="text-[10px] text-gray-400 text-center">Set your PIN in <button onClick={() => { setShowWithdraw(false); setActiveTab("settings"); }} className="text-(--color-primary) font-semibold hover:underline cursor-pointer">Settings → Security</button></p>
                <div className="flex gap-3">
                  <button onClick={() => setWithdrawStep("amount")} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    Back
                  </button>
                  <button onClick={handleWithdraw} disabled={withdrawing} className="flex-1 py-3 bg-(--color-primary) text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer">
                    {withdrawing ? "Processing..." : "Confirm Withdrawal"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

