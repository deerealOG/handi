"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
    AlertTriangle,
    BarChart3,
    Bell,
    Briefcase,
    Calendar,
    CreditCard,
    DollarSign,
    FileText,
    FolderOpen,
    LayoutDashboard,
    Menu,
    MessageSquare,
    Moon,
    Package,
    Power,
    Search,
    Settings,
    Shield,
    Sun,
    Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Shared types & data
import { MOCK_PLATFORM_STATS } from "./data";
import type { AdminRole, TabId } from "./types";

// Extracted tab components
import AdminBookingsTab from "./AdminBookingsTab";
import AdminCategoriesTab from "./AdminCategoriesTab";
import AdminReportsTab from "./AdminReportsTab";
import AdminServicesTab from "./AdminServicesTab";
import AdminTransactionsTab from "./AdminTransactionsTab";
import AnalyticsTab from "./AnalyticsTab";
import DisputesTab from "./DisputesTab";
import EscrowTab from "./EscrowTab";
import GuaranteeTab from "./GuaranteeTab";
import OverviewTab from "./OverviewTab";
import ProvidersTab from "./ProvidersTab";
import SettingsTab from "./SettingsTab";
import TeamManagementTab from "./TeamManagementTab";
import UsersTab from "./UsersTab";
import MessagesTab from "../provider/MessagesTab";

// ============================================
// ROLE CONFIGURATION
// ============================================
const ADMIN_ROLES: {
  id: AdminRole;
  label: string;
  desc: string;
  color: string;
  tabs: TabId[];
}[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    desc: "Full platform access",
    color: "bg-red-100 text-red-700",
    tabs: [
      "overview",
      "users",
      "disputes",
      "providers",
      "bookings",
      "transactions",
      "services",
      "categories",
      "reports",
      "analytics",
      "escrow",
      "guarantee",
      "messages",
      "team",
      "settings",
    ],
  },
  {
    id: "moderator",
    label: "Moderator",
    desc: "Content & dispute management",
    color: "bg-blue-100 text-blue-700",
    tabs: [
      "overview",
      "disputes",
      "providers",
      "bookings",
      "services",
      "categories",
    ],
  },
  {
    id: "support_agent",
    label: "Support Agent",
    desc: "Customer support & tickets",
    color: "bg-purple-100 text-purple-700",
    tabs: ["overview", "disputes", "bookings", "users", "messages"],
  },
  {
    id: "data_analyst",
    label: "Data Analyst",
    desc: "Analytics & data exports",
    color: "bg-teal-100 text-teal-700",
    tabs: [
      "overview",
      "analytics",
      "reports",
      "bookings",
      "transactions",
      "services",
    ],
  },
  {
    id: "finance_manager",
    label: "Finance Manager",
    desc: "Payments, refunds & payouts",
    color: "bg-amber-100 text-amber-700",
    tabs: ["overview", "transactions", "reports", "bookings", "providers", "escrow"],
  },
  {
    id: "content_manager",
    label: "Content Manager",
    desc: "Services, products & categories",
    color: "bg-pink-100 text-pink-700",
    tabs: ["overview", "services", "categories", "providers", "reports"],
  },
];

const ALL_TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "transactions", label: "Transactions", icon: CreditCard },
  { id: "services", label: "Services", icon: Package },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "disputes", label: "Disputes", icon: AlertTriangle },
  { id: "providers", label: "Providers", icon: Briefcase },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "escrow", label: "Escrow/Refunds", icon: DollarSign },
  { id: "guarantee", label: "Guarantee", icon: Shield },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "team", label: "Team", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

// ============================================
// APP SHELL
// ============================================
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Role is read from DB via session — no local switching allowed
  const adminRole: AdminRole = (user?.adminRole as AdminRole) || "super_admin";
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentRoleConfig =
    ADMIN_ROLES.find((r) => r.id === adminRole) || ADMIN_ROLES[0];
  const TABS = ALL_TABS.filter((tab) =>
    currentRoleConfig.tabs.includes(tab.id),
  );

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
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + Desktop sidebar toggle + role */}
            <div className="flex items-center gap-3">
              {/* Desktop sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <Menu size={18} className="text-gray-500" />
              </button>

              <button
                onClick={() => setActiveTab("overview")}
                className="shrink-0"
              >
                <Image
                  src="/images/handi-logo-light.webp"
                  alt="HANDI"
                  width={100}
                  height={32}
                  className="h-7 w-auto"
                  priority
                />
              </button>
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 ${currentRoleConfig.color} text-[10px] font-bold rounded-full`}
              >
                <Shield size={10} /> {currentRoleConfig.label}
              </span>
            </div>

            {/* Global Search */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search users, providers, bookings..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && globalSearch.trim()) {
                      const q = globalSearch.toLowerCase();
                      if (
                        q.includes("user") ||
                        q.includes("@") ||
                        q.includes("client")
                      )
                        setActiveTab("users");
                      else if (q.includes("dispute") || q.includes("complaint"))
                        setActiveTab("disputes");
                      else if (q.includes("provider") || q.includes("artisan"))
                        setActiveTab("providers");
                      else if (
                        q.includes("booking") ||
                        q.includes("appointment")
                      )
                        setActiveTab("bookings");
                      else if (
                        q.includes("transaction") ||
                        q.includes("payment") ||
                        q.includes("refund")
                      )
                        setActiveTab("transactions");
                      else if (q.includes("service") || q.includes("category"))
                        setActiveTab("services");
                      else if (q.includes("message") || q.includes("chat"))
                        setActiveTab("messages");
                      else setActiveTab("users");
                    }
                  }}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-row-reverse sm:flex-row items-center gap-2">
              {/* Mobile hamburger */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} className="text-gray-600" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title={isDark ? "Light Mode" : "Dark Mode"}
                >
                  {isDark ? (
                    <Sun size={18} className="text-yellow-500" />
                  ) : (
                    <Moon size={18} className="text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("disputes")}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full cursor-pointer"
                >
                  <AlertTriangle size={14} className="text-red-600" />
                  <span className="text-xs font-bold text-red-700">
                    {MOCK_PLATFORM_STATS.activeDisputes}
                  </span>
                </button>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  title="Notifications"
                >
                  <Bell size={18} className="text-gray-500" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <Power
                    size={18}
                    className="text-gray-500 hover:text-red-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Dropdown Panel */}
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-4 sm:right-6 top-12 z-50 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {[
                  { id: 1, title: "New dispute filed", desc: "Golden Amadi vs CleanPro Services — booking #BK102", time: "2 min ago", tab: "disputes" as TabId, color: "bg-red-100 text-red-600" },
                  { id: 2, title: "Provider approved", desc: "TechGenius Repairs has been auto-approved", time: "15 min ago", tab: "providers" as TabId, color: "bg-green-100 text-green-600" },
                  { id: 3, title: "Withdrawal request", desc: "CleanPro Services requested ₦12,750 payout", time: "1 hr ago", tab: "transactions" as TabId, color: "bg-blue-100 text-blue-600" },
                  { id: 4, title: "Payment completed", desc: "₦15,000 received for Deep Cleaning service", time: "2 hrs ago", tab: "transactions" as TabId, color: "bg-purple-100 text-purple-600" },
                  { id: 5, title: "New user registered", desc: "Sarah Adamu signed up as a Client", time: "3 hrs ago", tab: "users" as TabId, color: "bg-amber-100 text-amber-600" },
                ].map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { setActiveTab(n.tab); setShowNotifications(false); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Bell size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{n.desc}</p>
                      <p className="text-[9px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100">
                <button onClick={() => { setActiveTab("disputes"); setShowNotifications(false); }} className="w-full text-center text-xs font-semibold text-purple-600 hover:underline cursor-pointer">View All Notifications</button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* ===== BODY: SIDEBAR + CONTENT ===== */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-100 transition-all duration-200 ${sidebarOpen ? "w-56" : "w-16"}`}
        >
          <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const disputeCount =
                tab.id === "disputes" ? MOCK_PLATFORM_STATS.activeDisputes : 0;
              const providerCount =
                tab.id === "providers"
                  ? MOCK_PLATFORM_STATS.pendingProviders
                  : 0;
              const badge = disputeCount || providerCount;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={!sidebarOpen ? tab.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border-l-[3px] border-purple-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-l-[3px] border-transparent"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "stroke-[2.5px]" : ""}
                  />
                  {sidebarOpen && <span className="truncate">{tab.label}</span>}
                  {badge > 0 && (
                    <span
                      className={`${sidebarOpen ? "ml-auto" : "absolute -top-1 -right-1"} min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          {/* Sidebar Footer */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Power size={18} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute top-14 right-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto animate-slide-in-right"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Role in mobile sidebar */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 ${currentRoleConfig.color} text-[9px] font-bold rounded-full`}
                    >
                      <Shield size={8} /> {currentRoleConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="py-2 px-2 space-y-0.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-gray-100 p-2 mt-2">
                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Power size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB CONTENT ===== */}
        <main className="flex-1 min-w-0 pb-20">
          {activeTab === "overview" && (
            <OverviewTab setActiveTab={setActiveTab} />
          )}
          {activeTab === "users" && <UsersTab adminRole={adminRole} />}
          {activeTab === "bookings" && <AdminBookingsTab />}
          {activeTab === "transactions" && <AdminTransactionsTab />}
          {activeTab === "services" && <AdminServicesTab />}
          {activeTab === "categories" && <AdminCategoriesTab />}
          {activeTab === "disputes" && <DisputesTab />}
          {activeTab === "providers" && <ProvidersTab adminRole={adminRole} />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "escrow" && <EscrowTab />}
          {activeTab === "guarantee" && <GuaranteeTab />}
          {activeTab === "reports" && <AdminReportsTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "team" && <TeamManagementTab />}
          {activeTab === "settings" && (
            <SettingsTab
              onLogout={() => setShowLogoutConfirm(true)}
              adminRole={adminRole}
            />
          )}
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
              Are you sure you want to log out of the admin panel?
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
    </div>
  );
}
