"use client";

import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { generateReceipt } from "@/lib/generateReceipt";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Award,
  Ban,
  Bell,
  Briefcase,
  Calendar,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  HelpCircle,
  Image as ImageIcon,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  Package,
  PanelLeft,
  PanelLeftClose,
  Paperclip,
  Plus,
  Send,
  Settings,
  Shield,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

// ============================================
// TYPES
// ============================================
type TabId = "dashboard" | "services" | "bookings" | "earnings" | "profile";

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: Package },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "earnings", label: "Earnings", icon: Wallet },
  { id: "profile", label: "Profile", icon: User },
];

// ============================================
// MOCK DATA
// ============================================
const MOCK_SERVICES = [
  {
    id: "ps1",
    name: "Home Fumigation",
    category: "Pest Control",
    price: "₦20,000",
    status: "active" as const,
    bookings: 12,
    rating: 4.8,
  },
  {
    id: "ps2",
    name: "Deep Cleaning",
    category: "Cleaning",
    price: "₦15,000",
    status: "active" as const,
    bookings: 28,
    rating: 4.9,
  },
  {
    id: "ps3",
    name: "Kitchen Renovation",
    category: "Construction",
    price: "₦120,000",
    status: "paused" as const,
    bookings: 5,
    rating: 4.7,
  },
];

const MOCK_BOOKINGS = [
  {
    id: "pb1",
    service: "Home Fumigation",
    client: "Adaobi Chen",
    date: "2026-02-26",
    time: "10:00 AM",
    status: "pending" as const,
    amount: "₦20,000",
    avatar: null,
  },
  {
    id: "pb2",
    service: "Deep Cleaning",
    client: "Emeka Johnson",
    date: "2026-02-22",
    time: "2:00 PM",
    status: "upcoming" as const,
    amount: "₦15,000",
    avatar: null,
  },
  {
    id: "pb3",
    service: "Kitchen Renovation",
    client: "Sarah Williams",
    date: "2026-02-15",
    time: "9:00 AM",
    status: "completed" as const,
    amount: "₦45,000",
    avatar: null,
  },
  {
    id: "pb4",
    service: "Deep Cleaning",
    client: "Tunde Bakare",
    date: "2026-02-28",
    time: "11:00 AM",
    status: "pending" as const,
    amount: "₦15,000",
    avatar: null,
  },
  {
    id: "pb5",
    service: "Home Fumigation",
    client: "Grace Obi",
    date: "2026-02-10",
    time: "3:00 PM",
    status: "completed" as const,
    amount: "₦20,000",
    avatar: null,
  },
  {
    id: "pb6",
    service: "Kitchen Renovation",
    client: "James Nwachukwu",
    date: "2026-01-30",
    time: "8:00 AM",
    status: "cancelled" as const,
    amount: "₦120,000",
    avatar: null,
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "pt1",
    title: "Payment — Deep Cleaning",
    date: "Today, 2:30 PM",
    amount: "+ ₦15,000",
    type: "credit" as const,
  },
  {
    id: "pt2",
    title: "Withdrawal to GTBank",
    date: "Feb 19, 2026",
    amount: "- ₦50,000",
    type: "debit" as const,
  },
  {
    id: "pt3",
    title: "Payment — Fumigation",
    date: "Feb 18, 2026",
    amount: "+ ₦20,000",
    type: "credit" as const,
  },
  {
    id: "pt4",
    title: "Commission Fee",
    date: "Feb 18, 2026",
    amount: "- ₦2,000",
    type: "debit" as const,
  },
  {
    id: "pt5",
    title: "Payment — Kitchen Reno",
    date: "Feb 15, 2026",
    amount: "+ ₦45,000",
    type: "credit" as const,
  },
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
  const [showChat, setShowChat] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024)
                    setShowMobileSidebar(!showMobileSidebar);
                  else setSidebarOpen(!sidebarOpen);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <PanelLeftClose
                    size={20}
                    className="text-gray-600 hidden lg:block"
                  />
                ) : (
                  <PanelLeft
                    size={20}
                    className="text-gray-600 hidden lg:block"
                  />
                )}
                <Menu size={20} className="text-gray-600 lg:hidden" />
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="shrink-0"
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
            <div className="flex items-center gap-2 sm:gap-3">
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

              {/* Earnings Quick */}
              {/* Quick Add Service */}
              <button
                onClick={() => {
                  setActiveTab("services");
                }}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus size={14} /> Add Service
              </button>

              <button
                onClick={() => setShowChat(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Messages"
              >
                <MessageSquare size={20} className="text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-blue-500 text-white text-[10px] font-bold rounded-full px-1">
                  3
                </span>
              </button>

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

              {/* Profile Avatar */}
              <button
                onClick={() => setActiveTab("profile")}
                className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm uppercase overflow-hidden ring-2 ring-emerald-200"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  `${user.firstName?.[0]}${user.lastName?.[0]}`
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== DESKTOP SIDEBAR + TAB CONTENT ===== */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 transition-all duration-300 z-30 ${sidebarOpen ? "w-56" : "w-16"}`}
        >
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={!sidebarOpen ? tab.label : undefined}
                  className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 ${
                    sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
                  } ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-l-3 border-emerald-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-emerald-600" : ""}
                  />
                  {sidebarOpen && <span className="text-sm">{tab.label}</span>}
                  {sidebarOpen && tab.id === "bookings" && (
                    <span className="ml-auto text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                      4
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <LogOut size={18} />
              {sidebarOpen && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl animate-[slideRight_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <Image
                    src="/images/handi-logo-light.png"
                    alt="HANDI"
                    width={100}
                    height={32}
                    className="h-7 w-auto"
                  />
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Service Provider
                    </p>
                  </div>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold border-l-3 border-emerald-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                      {tab.id === "bookings" && (
                        <span className="ml-auto text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                          4
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              <div className="absolute bottom-4 left-0 right-0 px-3">
                <button
                  onClick={() => {
                    setShowMobileSidebar(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB CONTENT ===== */}
        <main className="flex-1 pb-20 min-w-0">
          {activeTab === "dashboard" && (
            <DashboardTab user={user} setActiveTab={setActiveTab} />
          )}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "bookings" && (
            <BookingsTab onOpenChat={() => setShowChat(true)} />
          )}
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
              setShowChat={setShowChat}
              setShowSupport={setShowSupport}
              setShowTransactions={setShowTransactions}
            />
          )}
        </main>
      </div>

      {/* ===== BOTTOM TAB BAR (≤5 tabs: show on mobile) ===== */}
      <nav className="flex sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
        <div className="max-w-7xl mx-auto flex items-center justify-around px-2 sm:px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 sm:py-3 px-2 sm:px-5 rounded-full transition-colors ${
                activeTab === tab.id
                  ? "text-primary bg-emerald-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon
                size={20}
                className={activeTab === tab.id ? "stroke-[2.5px]" : ""}
              />
              <span
                className={`text-[10px] sm:text-xs font-medium ${activeTab === tab.id ? "font-bold" : ""}`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

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

      {/* ===== CHAT PANEL ===== */}
      {showChat && (
        <div
          className="fixed inset-0 z-60 flex justify-end"
          onClick={() => setShowChat(false)}
        >
          <div
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Messages</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                {
                  name: "Adaobi Chen",
                  msg: "What time will you arrive tomorrow?",
                  time: "10 min ago",
                  unread: true,
                },
                {
                  name: "Emeka Johnson",
                  msg: "Thank you for the great service!",
                  time: "2 hours ago",
                  unread: false,
                },
                {
                  name: "Sarah Williams",
                  msg: "Can I reschedule to next week?",
                  time: "1 day ago",
                  unread: false,
                },
              ].map((c, i) => (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${c.unread ? "bg-emerald-50" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {c.name}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{c.msg}</p>
                  </div>
                  {c.unread && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <button
                  className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="p-2.5 bg-emerald-600 text-white rounded-full hover:opacity-90">
                  <Send size={18} />
                </button>
              </div>
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
              <button className="p-3 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 transition-colors">
                <MessageSquare
                  size={20}
                  className="text-emerald-600 mx-auto mb-1"
                />
                <span className="text-xs font-medium text-gray-900">
                  Live Chat
                </span>
              </button>
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

// ============================================
// DASHBOARD TAB
// ============================================
function DashboardTab({
  user,
  setActiveTab,
}: {
  user: any;
  setActiveTab: (t: TabId) => void;
}) {
  const stats = [
    {
      label: "Total Jobs",
      value: "45",
      icon: Briefcase,
      color: "text-(--color-primary) bg-(--color-gray-50)",
    },
    {
      label: "Rating",
      value: "4.8",
      icon: Star,
      color: "text-(--color-primary) bg-(--color-gray-50)",
    },
    {
      label: "This Month",
      value: "₦125,000",
      icon: TrendingUp,
      color: "text-(--color-primary) bg-(--color-gray-50)",
    },
    {
      label: "Pending",
      value: "2",
      icon: Calendar,
      color: "text-(--color-primary) bg-(--color-gray-50)",
    },
  ];

  const pendingBookings = MOCK_BOOKINGS.filter((b) => b.status === "pending");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome back, {user.firstName}! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Here&apos;s what&apos;s happening with your services today.
        </p>
      </div>

      {/* Profile Incomplete Warning */}
      {user.profileComplete === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">
              Complete your profile to start receiving bookings
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Add your skills, bio, and location so clients can find you.
            </p>
            <button
              onClick={() => setActiveTab("profile")}
              className="mt-2 text-sm font-medium text-yellow-800 underline"
            >
              Complete Profile →
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className=" bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className=" rounded-2xl p-5 flex gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Add Service",
              icon: Plus,
              action: () => setActiveTab("services"),
            },
            {
              label: "My Earnings",
              icon: CreditCard,
              action: () => setActiveTab("earnings"),
            },
            {
              label: "View Bookings",
              icon: CalendarCheck,
              action: () => setActiveTab("bookings"),
            },
            {
              label: "Edit Profile",
              icon: Settings,
              action: () => setActiveTab("profile"),
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors group cursor-pointer"
            >
              <action.icon
                size={22}
                className="text-gray-400 group-hover:text-(--color-primary) transition-colors"
              />
              <span className="text-xs font-medium text-gray-600 group-hover:text-(--color-primary) text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pending Booking Requests */}
      {pendingBookings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              New Booking Requests
            </h3>
            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {pendingBookings.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-xl bg-orange-50/50 border border-orange-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.service}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.client} • {booking.date} at {booking.time}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {booking.amount}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Decline"
                  >
                    <X size={16} />
                  </button>
                  <button
                    className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                    title="Accept"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
          <button
            onClick={() => setActiveTab("bookings")}
            className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {MOCK_BOOKINGS.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {booking.service}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.client} • {booking.date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {booking.amount}
                </p>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Service</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedBooking.service}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Client</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedBooking.client}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.date}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.time}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-sm font-bold text-(--color-primary)">
                    {selectedBooking.amount}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(selectedBooking.status)}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setActiveTab("bookings");
                }}
                className="px-4 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                View in Bookings
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SERVICES TAB
// ============================================
function ServicesTab() {
  const [services, setServices] = useState(
    MOCK_SERVICES.map((s) => ({ ...s, status: s.status || "active" })),
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);

  const { addToast } = useNotification();

  const handleDelete = (id: string) => {
    const svc = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    addToast({
      type: "error",
      title: "🗑️ Service Deleted",
      message: `"${svc?.name || "Service"}" has been removed.`,
    });
  };

  const handlePauseResume = (id: string) => {
    const svc = services.find((s) => s.id === id);
    const isPausing = svc?.status === "active";
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s,
      ),
    );
    addToast({
      type: isPausing ? "warning" : "success",
      title: isPausing ? "⏸️ Service Paused" : "▶️ Service Resumed",
      message: `"${svc?.name}" is now ${isPausing ? "paused" : "active"}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Services</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {services.length} services listed
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-(--color-primary) text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-dashed border-emerald-700">
          <h3 className="font-semibold text-gray-900 mb-4">New Service</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Service Name
              </label>
              <input
                type="text"
                placeholder="e.g. House Painting"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Category
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700">
                <option value="">Select category</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Construction">Construction</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Price (₦)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[5000, 10000, 15000, 20000, 30000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-full hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    ₦{amt / 1000}k
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom"
                  className="w-20 px-3 py-2 bg-gray-50 rounded-full text-xs border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 2-3 hours"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe your service..."
              className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-emerald-600 cursor-pointer transition-colors">
              Create Service
            </button>
          </div>
        </div>
      )}

      {/* Service Cards */}
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      service.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{service.category}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-lg font-bold text-gray-900">
                    {service.price}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500"
                    />{" "}
                    {service.rating}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {service.bookings} bookings
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() =>
                    setEditingService(
                      editingService === service.id ? null : service.id,
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer transition-colors ${
                    editingService === service.id
                      ? "bg-(--color-primary) text-white border-(--color-primary)"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {editingService === service.id ? "Close" : "Edit"}
                </button>
                <button
                  onClick={() => handlePauseResume(service.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                    service.status === "active"
                      ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                      : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                  }`}
                >
                  {service.status === "active" ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Edit Form (inline) */}
            {editingService === service.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-slideDown">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      defaultValue={service.name}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Price
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[5000, 10000, 15000, 20000, 30000, 50000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className="px-2.5 py-1.5 text-[10px] font-medium border border-gray-200 rounded-full hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-primary-light) transition-colors"
                        >
                          ₦{amt / 1000}k
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="Custom"
                        defaultValue={
                          parseInt(service.price.replace(/[^0-9]/g, "")) || ""
                        }
                        className="w-16 px-2 py-1.5 bg-gray-50 rounded-full text-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    defaultValue={service.category}
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Construction">Construction</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Painting">Painting</option>
                    <option value="Moving">Moving</option>
                    <option value="Gardening">Gardening</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      addToast({
                        type: "success",
                        title: "✅ Changes Saved",
                        message: `Service "${service.name}" has been updated.`,
                      });
                      setEditingService(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-(--color-primary) text-white rounded-full hover:opacity-90 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {services.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No services listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// BOOKINGS TAB
// ============================================
function BookingsTab({ onOpenChat }: { onOpenChat: () => void }) {
  const [filter, setFilter] = useState<
    "all" | "pending" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price-high" | "price-low"
  >("newest");
  const filters = [
    "all",
    "pending",
    "upcoming",
    "completed",
    "cancelled",
  ] as const;

  const filtered = (
    filter === "all"
      ? MOCK_BOOKINGS
      : MOCK_BOOKINGS.filter((b) => b.status === filter)
  ).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "price-high":
        return (
          parseInt(b.amount.replace(/[^0-9]/g, "")) -
          parseInt(a.amount.replace(/[^0-9]/g, ""))
        );
      case "price-low":
        return (
          parseInt(a.amount.replace(/[^0-9]/g, "")) -
          parseInt(b.amount.replace(/[^0-9]/g, ""))
        );
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 hover:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High → Low</option>
          <option value="price-low">Price: Low → High</option>
        </select>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                {MOCK_BOOKINGS.filter((b) => b.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div className="space-y-3">
        {filtered.map((booking) => (
          <div
            key={booking.id}
            onClick={() =>
              setExpandedBooking(
                expandedBooking === booking.id ? null : booking.id,
              )
            }
            className={`bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all cursor-pointer ${
              booking.status === "pending" ? "border-l-4 border-orange-400" : ""
            } ${
              expandedBooking === booking.id
                ? "ring-2 ring-(--color-primary)/20"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {booking.service}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{booking.client}</p>
                <p className="text-xs text-gray-400 mt-1">
                  <Calendar size={12} className="inline mr-1" />
                  {booking.date} at {booking.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {booking.amount}
                </p>
                {booking.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Decline
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedBooking === booking.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-slideDown">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Address
                    </p>
                    <p className="text-xs text-gray-700">
                      12 Main Street, Lagos
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Duration
                    </p>
                    <p className="text-xs text-gray-700">2 hours estimated</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Payment Status
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      Pre-paid
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Contact
                    </p>
                    <p className="text-xs text-gray-700">+234 801 234 5678</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase">
                    Notes
                  </p>
                  <p className="text-xs text-gray-600">
                    Please arrive 10 minutes early. Building has parking.
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat();
                    }}
                    className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer"
                  >
                    Message Client
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const bookingId = booking.id;
                      setJobStatuses((prev) => ({
                        ...prev,
                        [bookingId]:
                          prev[bookingId] === "in-progress"
                            ? "completed"
                            : "in-progress",
                      }));
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-full cursor-pointer ${jobStatuses[booking.id] === "in-progress" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-(--color-primary) text-white hover:opacity-90"}`}
                  >
                    {jobStatuses[booking.id] === "in-progress"
                      ? "Complete Job"
                      : "Start Job"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <CalendarCheck size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No {filter} bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EARNINGS TAB
// ============================================
function EarningsTab({
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
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden">
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
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Transaction History
        </h3>
        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === "credit" ? "bg-emerald-100" : "bg-red-100"
                  }`}
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
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-600" : "text-red-500"}`}
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

// ============================================
// PROFILE TAB
// ============================================
function ProfileTab({
  user,
  updateUser,
  onLogout,
  setShowNotifications,
  setShowChat,
  setShowSupport,
  setShowTransactions,
}: {
  user: any;
  updateUser: (u: any) => void;
  onLogout: () => void;
  setShowNotifications: (v: boolean) => void;
  setShowChat: (v: boolean) => void;
  setShowSupport: (v: boolean) => void;
  setShowTransactions: (v: boolean) => void;
}) {
  const { isDark, toggleDarkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deactivateConfirmText, setDeactivateConfirmText] = useState("");
  const [deactivateDuration, setDeactivateDuration] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [certifications, setCertifications] = useState([
    { name: "NABTEB Certificate", status: "verified" as const },
    { name: "Safety Training", status: "pending" as const },
  ]);
  const [pastWork, setPastWork] = useState([
    "/images/placeholder-work-1.jpg",
    "/images/placeholder-work-2.jpg",
    "/images/placeholder-work-3.jpg",
  ]);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateUser({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleWorkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setPastWork((prev) => [...prev, reader.result as string]);
    reader.readAsDataURL(file);
  };

  const handleUseLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            );
            const data = await res.json();
            updateUser({
              address:
                data.display_name ||
                `${pos.coords.latitude}, ${pos.coords.longitude}`,
            });
          } catch {
            updateUser({
              address: `${pos.coords.latitude}, ${pos.coords.longitude}`,
            });
          }
          setLocationLoading(false);
        },
        () => {
          alert("Location access denied.");
          setLocationLoading(false);
        },
      );
    } else {
      alert("Geolocation not supported.");
      setLocationLoading(false);
    }
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      console.log("API: DELETE /api/providers/me");
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
    }
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  const handleDeactivateAccount = async () => {
    try {
      console.log(
        `API: POST /api/providers/me/deactivate { duration: "${deactivateDuration}" }`,
      );
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
    }
    setShowDeactivateConfirm(false);
    setDeactivateConfirmText("");
    setDeactivateDuration("");
    alert("Your provider account has been deactivated.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Cover Photo */}
      <div className="relative w-full h-40 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl overflow-hidden group">
        {coverPhoto && (
          <Image src={coverPhoto} alt="Cover" fill className="object-cover" />
        )}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/40 text-white text-xs font-medium rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
        >
          <Camera size={14} /> Change Cover
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-sm p-6 text-center -mt-12 relative z-10">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt=""
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700 border-4 border-white shadow-lg">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-(--color-primary) text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          {/* Verified Badge */}
          <div
            className="absolute top-1 right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
            title="Verified Provider"
          >
            <CheckCircle size={12} className="text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-gray-500">
          {user.providerSubType === "business"
            ? "Business Provider"
            : "Individual Provider"}
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">4.8</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-500">Jobs</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">98%</p>
            <p className="text-xs text-gray-500">Response</p>
          </div>
        </div>
        <button
          onClick={() => setShowProfilePreview(true)}
          className="mt-4 px-6 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
        >
          <Eye size={16} /> Preview Profile
        </button>
      </div>

      {/* Certifications & Verification */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Award size={18} className="text-emerald-600" /> Certifications
          </h3>
          <button
            onClick={() => certInputRef.current?.click()}
            className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1  cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
          <input
            ref={certInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={() => {
              setCertifications((prev) => [
                ...prev,
                { name: "New Certificate", status: "pending" as const },
              ]);
            }}
            className="hidden"
          />
        </div>
        {certifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No certifications added yet
          </p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${cert.status === "verified" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                  >
                    {cert.status === "verified" ? (
                      <Check size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cert.name}
                    </p>
                    <p
                      className={`text-xs ${cert.status === "verified" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {cert.status === "verified"
                        ? "✓ Verified"
                        : "⏳ Pending Review"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setCertifications((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    )
                  }
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Work Gallery */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon size={18} className="text-emerald-600" /> Past Work
            Gallery
          </h3>
          <button
            onClick={() => workInputRef.current?.click()}
            className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Photo
          </button>
          <input
            ref={workInputRef}
            type="file"
            accept="image/*"
            onChange={handleWorkUpload}
            className="hidden"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {pastWork.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
            >
              <Image
                src={img}
                alt={`Work ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() =>
                  setPastWork((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => workInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
          >
            <Plus size={20} />
            <span className="text-[10px]">Add</span>
          </button>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-600" /> Work Experience
          </h3>
          <button
            onClick={() => {
              const newExp = {
                id: `exp_${Date.now()}`,
                title: "New Role",
                company: "Company Name",
                duration: "2024 - Present",
                description: "Describe your role and responsibilities",
              };
              updateUser({ experience: [...(user.experience || []), newExp] });
            }}
            className="text-xs font-medium text-(--color-primary) hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {!user.experience || user.experience.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No work experience added yet. Add your professional history.
          </p>
        ) : (
          <div className="space-y-3">
            {user.experience.map((exp: any, i: number) => (
              <div
                key={exp.id || i}
                className="p-4 bg-gray-50 rounded-xl relative group"
              >
                <div className="space-y-2">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = { ...updated[i], title: e.target.value };
                      updateUser({ experience: updated });
                    }}
                    className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none pb-0.5 transition-colors"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = { ...updated[i], company: e.target.value };
                      updateUser({ experience: updated });
                    }}
                    className="w-full text-xs text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none pb-0.5 transition-colors"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = { ...updated[i], duration: e.target.value };
                      updateUser({ experience: updated });
                    }}
                    className="w-full text-[10px] text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none pb-0.5 transition-colors"
                    placeholder="Duration"
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = {
                        ...updated[i],
                        description: e.target.value,
                      };
                      updateUser({ experience: updated });
                    }}
                    rows={2}
                    className="w-full text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none resize-none transition-colors"
                    placeholder="Description"
                  />
                </div>
                <button
                  onClick={() =>
                    updateUser({
                      experience: user.experience.filter(
                        (_: any, idx: number) => idx !== i,
                      ),
                    })
                  }
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next of Kin / Emergency Contact */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Shield size={18} className="text-emerald-600" /> Next of Kin /
          Emergency Contact
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Required for security. This information is kept private and only used
          in emergencies.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user.nextOfKin?.name || ""}
              placeholder="e.g. Adaeze Okonkwo"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Relationship
            </label>
            <select
              defaultValue={user.nextOfKin?.relationship || ""}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            >
              <option value="">Select...</option>
              <option>Spouse</option>
              <option>Parent</option>
              <option>Sibling</option>
              <option>Child</option>
              <option>Friend</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={user.nextOfKin?.phone || ""}
              placeholder="+234 xxx xxx xxxx"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Address
            </label>
            <input
              type="text"
              defaultValue={user.nextOfKin?.address || ""}
              placeholder="e.g. 12 Main Street, Lagos"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          Save Emergency Contact
        </button>
      </div>

      {/* CAC Certificate (Business only) */}
      {user.providerSubType === "business" && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" /> CAC Business
            Certificate
          </h3>
          {!user.cacCertificate ? (
            <div className="text-center py-6 bg-orange-50 rounded-xl border border-orange-200">
              <AlertCircle size={32} className="text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-800">
                CAC Certificate Required
              </p>
              <p className="text-xs text-orange-600 mt-1 max-w-xs mx-auto">
                Business providers must upload a valid CAC certificate within 30
                days. Failure to comply may result in account suspension.
              </p>
              <button className="mt-4 px-5 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer">
                Upload CAC Certificate
              </button>
              {user.cacGracePeriodEnd && (
                <p className="text-[10px] text-orange-500 mt-2">
                  Grace period expires:{" "}
                  {new Date(user.cacGracePeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user.cacCertificate.status === "verified"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {user.cacCertificate.status === "verified" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.cacCertificate.fileName}
                  </p>
                  <p
                    className={`text-xs ${user.cacCertificate.status === "verified" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {user.cacCertificate.status === "verified"
                      ? "✓ Verified"
                      : "⏳ Under Review"}
                  </p>
                </div>
              </div>
              <button className="text-xs text-(--color-primary) font-medium hover:underline cursor-pointer">
                Replace
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map Preview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-emerald-600" /> Location Preview
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          This map shows your service area. Clients can see your approximate
          location.
        </p>
        <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              user.address?.includes("Lagos")
                ? "3.3,6.4,3.5,6.6"
                : user.address?.includes("Abuja")
                  ? "7.4,9.0,7.6,9.1"
                  : "3.0,6.0,4.0,7.0"
            }&layer=mapnik`}
            title="Provider Location"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <MapPin size={12} /> {user.address || "Location not set"}
        </p>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Provider Information</h3>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer"
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "First Name", value: user.firstName, key: "firstName" },
            { label: "Last Name", value: user.lastName, key: "lastName" },
            { label: "Email", value: user.email, key: "email" },
            { label: "Phone", value: user.phone, key: "phone" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.value}
                disabled={!editing}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          ))}
        </div>
        {user.providerSubType === "business" && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Business Name
            </label>
            <input
              type="text"
              defaultValue={user.businessName || ""}
              disabled={!editing}
              placeholder="Your business name"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />
          </div>
        )}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Bio
          </label>
          <textarea
            defaultValue={user.bio || ""}
            disabled={!editing}
            rows={3}
            placeholder="Tell clients about your experience..."
            className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none disabled:opacity-60"
          />
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={user.address || ""}
              disabled={!editing}
              placeholder="e.g. Lekki, Lagos"
              className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />
            {editing && (
              <button
                onClick={handleUseLocation}
                disabled={locationLoading}
                className="px-3 py-2.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <MapPin size={14} />
                {locationLoading ? "Locating..." : "Use Location"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-500">{isDark ? "On" : "Off"}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? "bg-emerald-600" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDark ? "translate-x-6" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          {
            icon: Bell,
            label: "Notifications",
            action: () => setShowNotifications(true),
          },
          {
            icon: MessageSquare,
            label: "Messages",
            action: () => setShowChat(true),
          },
          {
            icon: Clock,
            label: "Transaction History",
            action: () => setShowTransactions(true),
          },
          {
            icon: HelpCircle,
            label: "Help & Support",
            action: () => setShowSupport(true),
          },
          {
            icon: Info,
            label: "About HANDI",
            action: () => setShowAbout(true),
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowDeactivateConfirm(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-yellow-50 transition-colors border-b border-gray-50"
        >
          <div className="flex items-center gap-3">
            <Ban size={18} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">
              Deactivate Account
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-red-500" />
            <span className="text-sm font-medium text-red-600">
              Delete Account
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} /> Log Out
      </button>

      {/* Delete Confirm — Typed */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteConfirmText("");
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Delete Account?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action is permanent. All your data, services, and earnings
              history will be permanently removed.
            </p>
            <p className="text-xs text-gray-600 font-medium mb-2">
              Type{" "}
              <span className="font-bold text-red-600">delete my account</span>{" "}
              to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete my account"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "delete my account"}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm — Typed */}
      {showDeactivateConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowDeactivateConfirm(false);
            setDeactivateConfirmText("");
            setDeactivateDuration("");
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-yellow-600 mb-2">
              Deactivate Account?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Your account and services will be hidden from clients. You can
              reactivate anytime by logging back in.
            </p>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                How long?
              </label>
              <select
                value={deactivateDuration}
                onChange={(e) => setDeactivateDuration(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-300"
              >
                <option value="">Select duration</option>
                <option value="1 week">1 Week</option>
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="until-reactivate">Until I reactivate</option>
              </select>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-2">
              Type{" "}
              <span className="font-bold text-yellow-600">
                deactivate my account
              </span>{" "}
              to confirm:
            </p>
            <input
              type="text"
              value={deactivateConfirmText}
              onChange={(e) => setDeactivateConfirmText(e.target.value)}
              placeholder="deactivate my account"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  setDeactivateConfirmText("");
                  setDeactivateDuration("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={
                  deactivateConfirmText !== "deactivate my account" ||
                  !deactivateDuration
                }
                className="flex-1 py-2.5 bg-yellow-500 text-white rounded-full text-sm font-semibold hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Preview Modal */}
      {showProfilePreview && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowProfilePreview(false)}
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover */}
            <div className="relative w-full h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-2xl overflow-hidden">
              {coverPhoto && (
                <Image
                  src={coverPhoto}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {/* Avatar + Info */}
            <div className="px-6 pb-6 -mt-10 relative z-10">
              <div className="relative w-20 h-20 mx-auto mb-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt=""
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-700 border-4 border-white shadow-lg">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield size={10} className="text-white" />
                </div>
              </div>
              <h3 className="text-center text-lg font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-4">
                {user.providerSubType === "business"
                  ? "Business Provider"
                  : "Individual Provider"}{" "}
                • Lagos, Nigeria
              </p>
              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">45</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">98%</p>
                  <p className="text-xs text-gray-500">Response</p>
                </div>
              </div>
              {user.bio && (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {user.bio}
                </p>
              )}
              {/* Certs */}
              {certifications.filter((c) => c.status === "verified").length >
                0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {certifications
                      .filter((c) => c.status === "verified")
                      .map((c, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1"
                        >
                          <Check size={12} /> {c.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              {/* Past Work */}
              {pastWork.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Past Work
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {pastWork.slice(0, 6).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowProfilePreview(false)}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPERS
// ============================================
function statusStyle(
  status: "pending" | "upcoming" | "completed" | "cancelled",
) {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-700";
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
  }
}
