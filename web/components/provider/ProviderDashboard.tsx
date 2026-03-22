"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNotification } from "@/context/NotificationContext";
import { generateReceipt } from "@/lib/generateReceipt";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Calendar,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  ExternalLink,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Moon,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Power,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Sun,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Shared types & data
import { MOCK_TRANSACTIONS } from "./data";
import type { TabId } from "./types";

// Extracted tab components
import AnalyticsTab from "./AnalyticsTab";
import BookingsTab from "./BookingsTab";
import CalendarTab from "./CalendarTab";
import DashboardTab from "./DashboardTab";
import EarningsTab from "./EarningsTab";
import MessagesTab from "./MessagesTab";
import ProfileTab from "./ProfileTab";
import ReviewsTab from "./ReviewsTab";
import ServicesTab from "./ServicesTab";
import SettingsTab from "./SettingsTab";
import VendorProductsTab from "./VendorProductsTab";
import UnverifiedEmailBanner from "@/components/shared/UnverifiedEmailBanner";

// ============================================
// ============================================
const TABS: {
  id: TabId;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarCheck, badge: 4 },
  { id: "services", label: "Services", icon: Package },
  { id: "messages", label: "Messages", icon: MessageCircle, badge: 3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "vendor-products", label: "My Products", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

// ============================================
// APP SHELL
// ============================================
export default function ProviderHome() {
  const { user, logout, updateUser } = useAuth();
  const { addToast } = useNotification();
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleConfirmedLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-100 sticky top-0 h-screen transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} px-4 h-16 border-b border-gray-100`}
        >
          {!sidebarCollapsed && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className="shrink-0 cursor-pointer"
            >
              <Image
                src="/images/handi-logo-light.webp"
                alt="HANDI"
                width={110}
                height={36}
                className="h-8 w-auto"
                priority
              />
            </button>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-gray-500"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        {/* Provider Mini Profile */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-primary font-medium">
                  ● Online
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "help") {
                    setShowSupport(true);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-3 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-emerald-50 text-primary border-r-3 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={sidebarCollapsed ? tab.label : undefined}
              >
                <Icon size={18} className={isActive ? "text-primary" : ""} />
                {!sidebarCollapsed && (
                  <>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="ml-auto text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <Power size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ===== TOP BAR ===== */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Logo + Hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
                >
                  <Menu size={20} />
                </button>
                <Image
                  src="/images/handi-logo-light.webp"
                  alt="HANDI"
                  width={90}
                  height={28}
                  className="h-6 w-auto"
                />
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search bookings, services..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-md text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Actions */}
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
                <button
                  onClick={() => setActiveTab("services")}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add Service
                </button>

                {/* Messages */}
                <button
                  onClick={() => setActiveTab("messages")}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Messages"
                >
                  <MessageCircle size={20} className="text-gray-600" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1">
                    3
                  </span>
                </button>

                {/* Notifications */}
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    5
                  </span>
                </button>

                {/* Profile Avatar */}
                <button
                  onClick={() => setActiveTab("profile")}
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-primary-light transition-all"
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </button>
              </div>
            </div>
          </div>
        </header>

        <UnverifiedEmailBanner />

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Image
                  src="/images/handi-logo-light.png"
                  alt="HANDI"
                  width={90}
                  height={28}
                  className="h-7 w-auto"
                />
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Mini Profile */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-primary font-medium">
                      ● Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === "help") {
                          setShowSupport(true);
                        } else {
                          setActiveTab(tab.id);
                        }
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                      {tab.badge && (
                        <span className="ml-auto text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          {tab.badge}
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
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "vendor-products" && <VendorProductsTab />}
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
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

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
              <button
                onClick={() => addToast({ type: "info", title: "Knowledge Base", message: "Redirecting to help center..." })}
                className="p-3 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer"
              >
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
              <textarea maxLength={500}
                rows={3}
                placeholder="Describe your issue..."
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              <button
                onClick={() => {
                  addToast({ type: "success", title: "Ticket Submitted", message: "Our support team will respond shortly." });
                  setShowSupport(false);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:opacity-90 cursor-pointer"
              >
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
                        className="px-3 py-1.5 bg-gray-50 rounded-full text-xs border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-colors"
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
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">You are withdrawing</p>
                  <p className="text-2xl font-bold text-emerald-700">₦50,000</p>
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
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
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
