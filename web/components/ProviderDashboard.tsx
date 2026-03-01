"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { generateReceipt } from "@/lib/generateReceipt";
import {
    ArrowDown,
    ArrowUp,
    Bell,
    CalendarCheck,
    ChevronDown,
    CreditCard,
    ExternalLink,
    HelpCircle,
    LayoutDashboard,
    Menu,
    Moon,
    Package,
    Plus,
    Power,
    Sun,
    User,
    Wallet,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryPills from "./ui/CategoryPills";

// Shared types & data
import { MOCK_TRANSACTIONS } from "./provider/data";
import type { TabId } from "./provider/types";

// Extracted tab components
import BookingsTab from "./provider/BookingsTab";
import DashboardTab from "./provider/DashboardTab";
import EarningsTab from "./provider/EarningsTab";
import ProfileTab from "./provider/ProfileTab";
import ServicesTab from "./provider/ServicesTab";

// ============================================
// TAB CONFIGURATION
// ============================================
const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: Package },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "profile", label: "Profile", icon: User },
];

// ============================================
// APP SHELL
// ============================================
export default function ProviderHome() {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1);

  const handleConfirmedLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ===== TOP BAR ===== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-0">
              {/* Logo */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className="shrink-0 cursor-pointer"
              >
                <Image
                  src="/images/handi-logo-light.png"
                  alt="HANDI"
                  width={110}
                  height={36}
                  className="h-8 w-auto"
                  priority
                />
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex flex-row-reverse sm:flex-row items-center gap-1.5 sm:gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-1.5 sm:gap-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title={isDark ? "Light Mode" : "Dark Mode"}
                >
                  {isDark ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <Moon size={20} className="text-gray-600" />
                  )}
                </button>

                {/* Quick Add Service */}
                <button className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  <Plus size={14} /> Add Service
                </button>

                {/* Notifications */}
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    5
                  </span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <Power
                    size={20}
                    className="text-gray-600 hover:text-red-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== QUICK-NAV BREADCRUMBS ===== */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Nav - Hidden on mobile */}
          <div className="hidden sm:block mt-2 mb-2 w-full">
            <CategoryPills>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                      activeTab === tab.id
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                    {tab.id === "bookings" && (
                      <span className="ml-1 text-[9px] font-bold bg-(--color-primary) text-white px-1.5 py-0.5 rounded-full">
                        4
                      </span>
                    )}
                  </button>
                );
              })}
            </CategoryPills>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute inset-y-0 right-0 w-64 bg-white shadow-xl flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-(--color-primary-light) text-(--color-primary)"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                    {tab.id === "bookings" && (
                      <span className="ml-auto text-[10px] font-bold bg-(--color-primary) text-white px-2 py-0.5 rounded-full">
                        4
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer"
              >
                <Power size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB CONTENT ===== */}
      <main className="flex-1 pb-20">
        {activeTab === "dashboard" && (
          <DashboardTab user={user} setActiveTab={setActiveTab} />
        )}
        {activeTab === "services" && <ServicesTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "earnings" && (
          <EarningsTab
            setShowWithdrawModal={setShowWithdrawModal}
            setShowBankModal={setShowBankModal}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            updateUser={updateUser}
            onLogout={() => setShowLogoutConfirm(true)}
            setShowNotifications={setShowNotifications}
            setShowSupport={setShowSupport}
            setShowTransactions={setShowTransactions}
          />
        )}
      </main>

      {/* ===== LOGOUT CONFIRM ===== */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedLogout}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== NOTIFICATIONS PANEL ===== */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-60 flex justify-end"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                {
                  title: "New Booking Request",
                  body: "Adaobi Chen requested Home Fumigation for Feb 26.",
                  time: "5 min ago",
                  read: false,
                },
                {
                  title: "Payment Received",
                  body: "₦15,000 payment for Deep Cleaning has been credited.",
                  time: "2 hours ago",
                  read: false,
                },
                {
                  title: "5-Star Review",
                  body: "Grace Obi rated your Fumigation service 5 stars!",
                  time: "1 day ago",
                  read: true,
                },
                {
                  title: "Commission Deducted",
                  body: "₦2,000 platform commission deducted from last payment.",
                  time: "2 days ago",
                  read: true,
                },
              ].map((n, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${n.read ? "bg-white border-gray-100" : "bg-emerald-50 border-emerald-100"}`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{n.body}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== SUPPORT PANEL ===== */}
      {showSupport && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowSupport(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Help & Support
              </h3>
              <button
                onClick={() => setShowSupport(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors"
              >
                <ExternalLink
                  size={20}
                  className="text-green-600 mx-auto mb-1"
                />
                <span className="text-xs font-medium text-gray-900">
                  WhatsApp
                </span>
              </a>
              <button className="p-3 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
                <HelpCircle size={20} className="text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-900">
                  Knowledge Base
                </span>
              </button>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 mb-3">FAQs</h4>
            <div className="space-y-2 mb-5">
              {[
                {
                  q: "How do I get more bookings?",
                  a: "Complete your profile, add quality photos, keep your services up-to-date, and maintain high ratings.",
                },
                {
                  q: "When do I get paid?",
                  a: "Payments are processed within 24 hours of job completion. You can withdraw to your bank account anytime.",
                },
                {
                  q: "How do I handle a dispute?",
                  a: "Go to your booking, tap 'Report Issue'. Our support team will mediate within 48 hours.",
                },
                {
                  q: "Can I set my own prices?",
                  a: "Yes! Go to Services tab, tap Edit on any service to update pricing.",
                },
                {
                  q: "How does the rating system work?",
                  a: "Clients rate you after each job. Your overall rating is an average of all reviews. Maintain 4.0+ to stay featured.",
                },
                {
                  q: "What happens if I cancel a booking?",
                  a: "Provider-initiated cancellations affect your reliability score. Avoid cancelling within 2 hours of the scheduled time.",
                },
              ].map((faq, i) => (
                <details key={i} className="bg-gray-50 rounded-xl p-3 group">
                  <summary className="text-xs font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <ChevronDown
                      size={14}
                      className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2"
                    />
                  </summary>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Contact Us
              </h4>
              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <p className="text-gray-600">
                  Email: <strong>providers@handi.ng</strong>
                </p>
                <p className="text-gray-600 mt-1">
                  Phone: <strong>+234 800 000 0000</strong>
                </p>
                <p className="text-gray-600 mt-1">
                  Hours: <strong>Mon–Fri, 8AM – 6PM WAT</strong>
                </p>
              </div>
              <textarea
                rows={3}
                placeholder="Describe your issue..."
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              <button className="w-full py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:opacity-90">
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TRANSACTION HISTORY PANEL ===== */}
      {showTransactions && (
        <div
          className="fixed inset-0 z-60 flex justify-end"
          onClick={() => setShowTransactions(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Transaction History</h3>
              <button
                onClick={() => setShowTransactions(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDown size={14} className="text-emerald-600" />
                      ) : (
                        <ArrowUp size={14} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.title}
                      </p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {tx.amount}
                    </span>
                    <button
                      onClick={() =>
                        generateReceipt({
                          id: tx.id,
                          title: tx.title,
                          date: tx.date,
                          amount: tx.amount,
                          type: tx.type,
                          status: "Success",
                          userName: user.firstName + " " + user.lastName,
                        })
                      }
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      title="Download receipt"
                    >
                      <CreditCard size={12} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== WITHDRAW MODAL ===== */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowWithdrawModal(false);
            setWithdrawStep(1);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {withdrawStep === 1 ? "Withdraw Funds" : "Confirm Withdrawal"}
              </h3>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawStep(1);
                }}
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {withdrawStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <div className="flex gap-2 flex-wrap items-center mt-2">
                    {[
                      "100",
                      "200",
                      "500",
                      "1,000",
                      "2,000",
                      "5,000",
                      "10,000",
                    ].map((amt) => (
                      <button
                        key={amt}
                        className="px-3 py-1.5 bg-gray-50 rounded-full text-xs border border-gray-200 hover:border-(--color-primary) hover:bg-emerald-50 cursor-pointer transition-colors"
                      >
                        ₦{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Bank Account
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700">
                    <option>GTBank **** 4521</option>
                    <option>First Bank **** 7832</option>
                    <option>Access Bank **** 1234</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Account Name (must match profile)
                  </label>
                  <input
                    type="text"
                    defaultValue={`${user.firstName} ${user.lastName}`}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
                    disabled
                  />
                  <p className="text-[10px] text-emerald-600 mt-1">
                    ✓ Account name validated from profile
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Available balance: ₦380,000
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setWithdrawStep(1);
                    }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setWithdrawStep(2)}
                    className="flex-1 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">You are withdrawing</p>
                  <p className="text-2xl font-bold text-(--color-primary)">
                    ₦50,000
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    to GTBank **** 4521
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Enter your 2-step password to confirm
                  </label>
                  <input
                    type="password"
                    placeholder="Enter security password"
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setWithdrawStep(1)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setWithdrawStep(1);
                      alert("Withdrawal successful!");
                    }}
                    className="flex-1 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors cursor-pointer"
                  >
                    Confirm Withdraw
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== BANK DETAILS MODAL ===== */}
      {showBankModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowBankModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Bank Details</h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  defaultValue="Guaranty Trust Bank"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  defaultValue="0123456789"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  defaultValue={user.firstName + " " + user.lastName}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
