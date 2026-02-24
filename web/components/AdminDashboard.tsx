"use client";

import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import {
    AlertTriangle,
    ArrowUp,
    Ban,
    BarChart3,
    Bell,
    Briefcase,
    Calendar,
    Check,
    CheckCircle,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    MessageSquare,
    Moon,
    Package,
    Search,
    Settings,
    Shield,
    Sun,
    TrendingUp,
    User,
    UserPlus,
    Users,
    X,
    XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================
// TYPES
// ============================================
type TabId =
  | "overview"
  | "users"
  | "disputes"
  | "providers"
  | "bookings"
  | "transactions"
  | "services"
  | "reports"
  | "analytics"
  | "team"
  | "settings";
type AdminRole =
  | "super_admin"
  | "moderator"
  | "support_agent"
  | "data_analyst"
  | "finance_manager"
  | "content_manager";

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
      "reports",
      "analytics",
      "team",
      "settings",
    ],
  },
  {
    id: "moderator",
    label: "Moderator",
    desc: "Content & dispute management",
    color: "bg-blue-100 text-blue-700",
    tabs: ["overview", "disputes", "providers", "bookings", "services"],
  },
  {
    id: "support_agent",
    label: "Support Agent",
    desc: "Customer support & tickets",
    color: "bg-purple-100 text-purple-700",
    tabs: ["overview", "disputes", "bookings", "users"],
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
    tabs: ["overview", "transactions", "reports", "bookings", "providers"],
  },
  {
    id: "content_manager",
    label: "Content Manager",
    desc: "Services, products & categories",
    color: "bg-pink-100 text-pink-700",
    tabs: ["overview", "services", "providers", "reports"],
  },
];

const ALL_TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "transactions", label: "Transactions", icon: CreditCard },
  { id: "services", label: "Services", icon: Package },
  { id: "disputes", label: "Disputes", icon: AlertTriangle },
  { id: "providers", label: "Providers", icon: Briefcase },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "team", label: "Team", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

// ============================================
// MOCK DATA
// ============================================
const MOCK_PLATFORM_STATS = {
  totalUsers: 12450,
  totalProviders: 890,
  totalBookings: 34200,
  revenue: "₦24.5M",
  activeDisputes: 8,
  pendingProviders: 15,
};

const MOCK_USERS_LIST = [
  {
    id: "u1",
    name: "Golden Amadi",
    email: "golden@example.com",
    phone: "+234 812 345 6789",
    type: "client" as const,
    status: "active" as const,
    joined: "Jan 15, 2026",
    bookings: 12,
    totalSpent: "₦285,000",
    lastActive: "Today",
    verified: true,
    location: "Lekki, Lagos",
  },
  {
    id: "u2",
    name: "Adaobi Chen",
    email: "adaobi@example.com",
    phone: "+234 803 456 7890",
    type: "client" as const,
    status: "active" as const,
    joined: "Feb 1, 2026",
    bookings: 5,
    totalSpent: "₦128,500",
    lastActive: "Yesterday",
    verified: true,
    location: "Victoria Island, Lagos",
  },
  {
    id: "u3",
    name: "Emeka Johnson",
    email: "emeka@example.com",
    phone: "+234 705 678 1234",
    type: "client" as const,
    status: "suspended" as const,
    joined: "Dec 20, 2025",
    bookings: 0,
    totalSpent: "₦0",
    lastActive: "2 weeks ago",
    verified: false,
    location: "Ikeja, Lagos",
  },
  {
    id: "u4",
    name: "Tunde Bakare",
    email: "tunde@example.com",
    phone: "+234 816 789 0123",
    type: "provider" as const,
    status: "active" as const,
    joined: "Jan 28, 2026",
    bookings: 8,
    totalSpent: "₦192,000",
    lastActive: "2 hours ago",
    verified: true,
    location: "Surulere, Lagos",
  },
  {
    id: "u5",
    name: "Grace Obi",
    email: "grace@example.com",
    phone: "+234 907 234 5678",
    type: "client" as const,
    status: "active" as const,
    joined: "Feb 10, 2026",
    bookings: 3,
    totalSpent: "₦67,500",
    lastActive: "3 days ago",
    verified: true,
    location: "Yaba, Lagos",
  },
  {
    id: "u6",
    name: "Ngozi Eze",
    email: "ngozi@example.com",
    phone: "+234 811 456 2345",
    type: "admin" as const,
    status: "active" as const,
    joined: "Nov 1, 2025",
    bookings: 0,
    totalSpent: "₦0",
    lastActive: "Today",
    verified: true,
    location: "Ikoyi, Lagos",
  },
  {
    id: "u7",
    name: "Chisom Nwosu",
    email: "chisom@example.com",
    phone: "+234 802 345 8901",
    type: "provider" as const,
    status: "active" as const,
    joined: "Dec 5, 2025",
    bookings: 22,
    totalSpent: "₦410,000",
    lastActive: "1 hour ago",
    verified: true,
    location: "Ajah, Lagos",
  },
  {
    id: "u8",
    name: "Adekunle Balogun",
    email: "adekunle@example.com",
    phone: "+234 708 567 1234",
    type: "client" as const,
    status: "banned" as const,
    joined: "Oct 15, 2025",
    bookings: 2,
    totalSpent: "₦35,000",
    lastActive: "1 month ago",
    verified: false,
    location: "Apapa, Lagos",
  },
];

const MOCK_PROVIDERS_LIST = [
  {
    id: "p1",
    name: "Chinedu Okonkwo",
    email: "chinedu@example.com",
    category: "Electrical",
    status: "verified" as const,
    rating: 4.8,
    jobs: 45,
    joined: "Nov 5, 2025",
  },
  {
    id: "p2",
    name: "CleanPro Services",
    email: "cleanpro@example.com",
    category: "Cleaning",
    status: "verified" as const,
    rating: 4.9,
    jobs: 120,
    joined: "Oct 1, 2025",
  },
  {
    id: "p3",
    name: "AutoCare Mechanics",
    email: "autocare@example.com",
    category: "Automotive",
    status: "pending" as const,
    rating: 0,
    jobs: 0,
    joined: "Feb 18, 2026",
  },
  {
    id: "p4",
    name: "Sarah Beauty Hub",
    email: "sarah@beauty.com",
    category: "Beauty",
    status: "pending" as const,
    rating: 0,
    jobs: 0,
    joined: "Feb 19, 2026",
  },
  {
    id: "p5",
    name: "handi Plumbing",
    email: "handi@plumbing.com",
    category: "Plumbing",
    status: "suspended" as const,
    rating: 3.2,
    jobs: 15,
    joined: "Sep 15, 2025",
  },
];

const MOCK_DISPUTES = [
  {
    id: "d1",
    status: "open" as const,
    priority: "high" as const,
    client: "Golden Amadi",
    provider: "handi Plumbing",
    service: "Plumbing Repair",
    amount: "₦12,000",
    date: "Feb 20, 2026",
    category: "Incomplete Work",
    description:
      "Provider left without completing pipe installation. Water is still leaking.",
    providerResponse:
      "Client was not available when I arrived for the second visit to complete the job.",
  },
  {
    id: "d2",
    status: "in-review" as const,
    priority: "medium" as const,
    client: "Adaobi Chen",
    provider: "CleanPro Services",
    service: "Deep Cleaning",
    amount: "₦15,000",
    date: "Feb 18, 2026",
    category: "Quality Issue",
    description:
      "Cleaning quality was poor. Several areas were missed and kitchen was not properly done.",
    providerResponse:
      "We cleaned all areas as agreed. Client added extra rooms that weren't in the original booking.",
  },
  {
    id: "d3",
    status: "resolved" as const,
    priority: "low" as const,
    client: "Tunde Bakare",
    provider: "Chinedu Okonkwo",
    service: "Electrical Wiring",
    amount: "₦25,000",
    date: "Feb 12, 2026",
    category: "Billing Dispute",
    description: "Was charged for materials that weren't used.",
    providerResponse:
      "Materials were purchased and available. Client cancelled part of the job midway.",
    resolution: "Partial refund of ₦5,000 issued to client.",
  },
  {
    id: "d4",
    status: "open" as const,
    priority: "high" as const,
    client: "Grace Obi",
    provider: "Sarah Beauty Hub",
    service: "Bridal Makeup",
    amount: "₦35,000",
    date: "Feb 19, 2026",
    category: "No Show",
    description:
      "Provider did not show up for the appointment. Wedding day was ruined.",
    providerResponse: "",
  },
];

const MOCK_ACTIVITY = [
  {
    id: "a1",
    text: "New provider application: AutoCare Mechanics",
    time: "2 hours ago",
    type: "provider" as const,
  },
  {
    id: "a2",
    text: "Dispute #d1 opened by Golden Amadi",
    time: "3 hours ago",
    type: "dispute" as const,
  },
  {
    id: "a3",
    text: "New user registered: Fatima Bello",
    time: "5 hours ago",
    type: "user" as const,
  },
  {
    id: "a4",
    text: "Dispute #d3 resolved — partial refund issued",
    time: "1 day ago",
    type: "dispute" as const,
  },
  {
    id: "a5",
    text: "Provider suspended: handi Plumbing (low rating)",
    time: "2 days ago",
    type: "provider" as const,
  },
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
            {/* Left: Logo + mobile menu + role */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
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
                  src="/images/handi-logo-light.png"
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

            {/* Right Actions */}
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
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-full"
              >
                <AlertTriangle size={14} className="text-red-600" />
                <span className="text-xs font-bold text-red-700">
                  {MOCK_PLATFORM_STATS.activeDisputes}
                </span>
              </button>
              <button
                className="relative p-2 rounded-lg hover:bg-gray-100"
                title="Notifications"
              >
                <Bell size={18} className="text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs uppercase ring-2 ring-purple-200"
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </button>
            </div>
          </div>
        </div>
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
              <LogOut size={18} />
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
              className="absolute top-14 left-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto animate-[slideRight_0.2s_ease-out]"
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
                  <LogOut size={18} />
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
          {activeTab === "disputes" && <DisputesTab />}
          {activeTab === "providers" && <ProvidersTab adminRole={adminRole} />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "reports" && <AdminReportsTab />}
          {activeTab === "team" && <TeamManagementTab />}
          {activeTab === "settings" && (
            <SettingsTab onLogout={() => setShowLogoutConfirm(true)} />
          )}
        </main>
      </div>

      {/* ===== BOTTOM TAB BAR ===== */}
      <nav className="hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
        <div className="max-w-4xl mx-auto flex items-center justify-around px-2 sm:px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 sm:py-3 px-2 sm:px-5 rounded-full transition-colors relative ${
                activeTab === tab.id
                  ? "text-purple-600 bg-purple-100"
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
              {tab.id === "disputes" &&
                MOCK_PLATFORM_STATS.activeDisputes > 0 && (
                  <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {MOCK_PLATFORM_STATS.activeDisputes}
                  </span>
                )}
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

// ============================================
// OVERVIEW TAB
// ============================================
function OverviewTab({ setActiveTab }: { setActiveTab: (t: TabId) => void }) {
  const stats = [
    {
      label: "Total Users",
      value: MOCK_PLATFORM_STATS.totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-purple-600 to-indigo-700",
      change: "+12%",
    },
    {
      label: "Providers",
      value: MOCK_PLATFORM_STATS.totalProviders.toLocaleString(),
      icon: Briefcase,
      gradient: "from-emerald-500 to-teal-600",
      change: "+8%",
    },
    {
      label: "Bookings",
      value: MOCK_PLATFORM_STATS.totalBookings.toLocaleString(),
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-600",
      change: "+15%",
    },
    {
      label: "Revenue",
      value: MOCK_PLATFORM_STATS.revenue,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      change: "+22%",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Platform overview and management
        </p>
      </div>

      {/* Stats – Individual Gradient Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white relative overflow-hidden`}
          >
            <div className="absolute -top-3 -right-3 opacity-10">
              <stat.icon size={56} />
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUp size={10} /> {stat.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold">{stat.value}</p>
            <p className="text-[11px] opacity-80 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab("disputes")}
          className="bg-red-50 border border-red-100 rounded-2xl p-5 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-red-600" />
            <h3 className="font-semibold text-red-800">Active Disputes</h3>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {MOCK_PLATFORM_STATS.activeDisputes}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Requires immediate attention
          </p>
        </button>
        <button
          onClick={() => setActiveTab("providers")}
          className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Pending Providers</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {MOCK_PLATFORM_STATS.pendingProviders}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting verification</p>
        </button>
      </div>

      {/* Admin Decision Log / Audit Trail */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield size={16} className="text-purple-600" /> Admin Decision Log
          </h3>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            Last 5 actions
          </span>
        </div>
        <div className="space-y-2.5">
          {[
            {
              action: "Approved provider",
              target: "CleanPro Services",
              by: "Super Admin",
              time: "2 min ago",
              type: "approve",
              icon: "✅",
            },
            {
              action: "Resolved dispute",
              target: "#DSP-1089",
              by: "Super Admin",
              time: "28 min ago",
              type: "resolve",
              icon: "🔧",
            },
            {
              action: "Issued refund",
              target: "₦40,000 to Fatima Bello",
              by: "Super Admin",
              time: "1 hr ago",
              type: "refund",
              icon: "💸",
            },
            {
              action: "Suspended user",
              target: "bad_actor_99",
              by: "Moderator",
              time: "3 hrs ago",
              type: "suspend",
              icon: "🚫",
            },
            {
              action: "Rejected provider",
              target: "Sketchy Services Ltd",
              by: "Support Agent",
              time: "5 hrs ago",
              type: "reject",
              icon: "❌",
            },
          ].map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm">{log.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{log.action}</span> —{" "}
                  <span className="text-gray-600">{log.target}</span>
                </p>
                <p className="text-[10px] text-gray-400">
                  by {log.by} • {log.time}
                </p>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  log.type === "approve"
                    ? "bg-emerald-100 text-emerald-700"
                    : log.type === "resolve"
                      ? "bg-blue-100 text-blue-700"
                      : log.type === "refund"
                        ? "bg-purple-100 text-purple-700"
                        : log.type === "suspend"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                }`}
              >
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {MOCK_ACTIVITY.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  a.type === "dispute"
                    ? "bg-red-100"
                    : a.type === "provider"
                      ? "bg-emerald-100"
                      : "bg-blue-100"
                }`}
              >
                {a.type === "dispute" ? (
                  <AlertTriangle size={14} className="text-red-600" />
                ) : a.type === "provider" ? (
                  <Briefcase size={14} className="text-emerald-600" />
                ) : (
                  <User size={14} className="text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{a.text}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// USERS TAB
// ============================================
function UsersTab({ adminRole }: { adminRole: AdminRole }) {
  const isSuperAdmin = adminRole === "super_admin";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "suspended" | "banned"
  >("all");
  const [users, setUsers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      phone?: string;
      type: string;
      status: string;
      joined: string;
      bookings: number;
      totalSpent?: string;
      lastActive?: string;
      verified?: boolean;
      location?: string;
    }>
  >(MOCK_USERS_LIST);
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");

  const { addToast } = useNotification();

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const updateUserStatus = (id: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );
  };

  const handleSuspend = (user: (typeof users)[0]) => {
    updateUserStatus(user.id, "suspended");
    addToast({
      type: "warning",
      title: "⚠️ User Suspended",
      message: `${user.name} has been suspended from the platform.`,
    });
    setSelectedUser(null);
  };

  const handleBan = (user: (typeof users)[0]) => {
    updateUserStatus(user.id, "banned");
    addToast({
      type: "error",
      title: "🚫 User Banned",
      message: `${user.name} has been permanently banned.`,
    });
    setSelectedUser(null);
  };

  const handleActivate = (user: (typeof users)[0]) => {
    updateUserStatus(user.id, "active");
    addToast({
      type: "success",
      title: "✅ User Activated",
      message: `${user.name}'s account has been reactivated.`,
    });
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;
    addToast({
      type: "info",
      title: "📨 Message Sent",
      message: `Message sent to ${selectedUser.name}`,
    });
    setMessageText("");
    setShowMessageForm(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "suspended":
        return "bg-yellow-100 text-yellow-700";
      case "banned":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">{users.length} total users</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "active", "suspended", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 opacity-60">
                ({users.filter((u) => f === "all" || u.status === f).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  User
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                  Joined
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  Bookings
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  Spent
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setShowMessageForm(false);
                  }}
                  className="hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          u.type === "provider"
                            ? "bg-emerald-50 text-emerald-700"
                            : u.type === "admin"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                        u.type === "provider"
                          ? "bg-emerald-50 text-emerald-700"
                          : u.type === "admin"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {u.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {u.joined}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-900 font-medium hidden md:table-cell">
                    {u.bookings}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-900 font-medium hidden md:table-cell">
                    {u.totalSpent || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusBadge(u.status)}`}
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No users matching your search.</p>
          </div>
        )}
      </div>

      {/* ===== USER DETAIL MODAL ===== */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Avatar & Identity */}
            <div className="text-center mb-5">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xl ${
                  selectedUser.type === "provider"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedUser.type === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {selectedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                {selectedUser.name}
              </h4>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    selectedUser.type === "provider"
                      ? "bg-emerald-50 text-emerald-700"
                      : selectedUser.type === "admin"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {selectedUser.type}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusBadge(selectedUser.status)}`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Email
                </p>
                <p className="text-sm text-gray-900 truncate">
                  {selectedUser.email}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Phone
                </p>
                <p className="text-sm text-gray-900">
                  {selectedUser.phone || "Not provided"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Joined
                </p>
                <p className="text-sm text-gray-900">{selectedUser.joined}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-medium">
                  Location
                </p>
                <p className="text-sm text-gray-900">
                  {selectedUser.location || "Lagos"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-lg font-bold text-blue-700">
                  {selectedUser.bookings}
                </p>
                <p className="text-[10px] text-blue-500">Bookings</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <p className="text-lg font-bold text-emerald-700">
                  {selectedUser.totalSpent || "₦0"}
                </p>
                <p className="text-[10px] text-emerald-500">Total Spent</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-center">
                <p className="text-lg font-bold text-purple-700">
                  {selectedUser.lastActive || "—"}
                </p>
                <p className="text-[10px] text-purple-500">Last Active</p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-5">
              {selectedUser.verified ? (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <p className="text-sm text-emerald-700 font-medium">
                    Verified Account
                  </p>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-500">Not Verified</p>
                </>
              )}
            </div>

            {/* Message Form */}
            {showMessageForm && (
              <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 mb-2">
                  Send Message to {selectedUser.name}
                </p>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm border border-blue-200 outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setShowMessageForm(false)}
                    className="px-4 py-2 bg-white text-gray-600 text-xs font-semibold rounded-full border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowMessageForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700"
              >
                <MessageSquare size={16} /> Send Message
              </button>

              {selectedUser.status === "active" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => isSuperAdmin && handleSuspend(selectedUser)}
                    disabled={!isSuperAdmin}
                    title={
                      !isSuperAdmin
                        ? "Requires Super Admin privileges"
                        : "Suspend this user"
                    }
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 bg-yellow-50 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-200 ${isSuperAdmin ? "hover:bg-yellow-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Clock size={16} /> Suspend
                  </button>
                  <button
                    onClick={() => isSuperAdmin && handleBan(selectedUser)}
                    disabled={!isSuperAdmin}
                    title={
                      !isSuperAdmin
                        ? "Requires Super Admin privileges"
                        : "Ban this user"
                    }
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-200 ${isSuperAdmin ? "hover:bg-red-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <Ban size={16} /> Ban User
                  </button>
                  {!isSuperAdmin && (
                    <p className="col-span-2 text-[10px] text-gray-400 text-center">
                      🔒 Super Admin required for these actions
                    </p>
                  )}
                </div>
              )}

              {(selectedUser.status === "suspended" ||
                selectedUser.status === "banned") && (
                <button
                  onClick={() => handleActivate(selectedUser)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 border border-emerald-200"
                >
                  <CheckCircle size={16} /> Reactivate Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// DISPUTES TAB
// ============================================
function DisputesTab() {
  const [filter, setFilter] = useState<
    "all" | "open" | "in-review" | "resolved"
  >("all");
  const [selectedDispute, setSelectedDispute] = useState<
    (typeof MOCK_DISPUTES)[0] | null
  >(null);

  const filtered =
    filter === "all"
      ? MOCK_DISPUTES
      : MOCK_DISPUTES.filter((d) => d.status === filter);

  const statusStyle = (s: string) => {
    switch (s) {
      case "open":
        return "bg-red-100 text-red-700";
      case "in-review":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-emerald-100 text-emerald-700";
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
          onClick={() => setSelectedDispute(null)}
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
          <div className="grid sm:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
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
                  placeholder="Describe the resolution..."
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700">
                  <Eye size={14} /> Mark In Review
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700">
                  <Check size={14} /> Resolve — Issue Refund
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-600 text-white rounded-full text-xs font-semibold hover:bg-yellow-700">
                  <MessageSquare size={14} /> Request More Info
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700">
                  <Ban size={14} /> Suspend Provider
                </button>
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
      <h2 className="text-xl font-bold text-gray-900">Dispute Resolution</h2>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {(["all", "open", "in-review", "resolved"] as const).map((f) => (
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
            {f === "open" && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                {MOCK_DISPUTES.filter((d) => d.status === "open").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dispute Cards */}
      <div className="space-y-3">
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDispute(d)}
            className={`w-full bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md transition-shadow ${
              d.status === "open"
                ? "border-l-4 border-red-400"
                : d.status === "in-review"
                  ? "border-l-4 border-yellow-400"
                  : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">
                    #{d.id.slice(1)}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(d.status)}`}
                  >
                    {d.status.replace("-", " ")}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${priorityStyle(d.priority)}`}
                  >
                    {d.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {d.category}: {d.service}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {d.client} vs {d.provider}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {d.date} • {d.amount}
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0 mt-1" />
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

// ============================================
// PROVIDERS TAB
// ============================================
function ProvidersTab({ adminRole }: { adminRole: AdminRole }) {
  const isSuperAdmin = adminRole === "super_admin";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "verified" | "pending" | "suspended"
  >("all");
  const [providers, setProviders] = useState(MOCK_PROVIDERS_LIST);
  const [selectedProvider, setSelectedProvider] = useState<
    (typeof MOCK_PROVIDERS_LIST)[0] | null
  >(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const { addToast } = useNotification();

  const filtered = providers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleApprove = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "verified" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "success",
        title: "✅ Provider Approved",
        message: `${prov.name} has been verified and can now receive bookings.`,
      });
    setSelectedProvider(null);
  };

  const handleReject = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "suspended" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "error",
        title: "❌ Provider Rejected",
        message: `${prov.name}'s application has been rejected.`,
      });
    setSelectedProvider(null);
  };

  const handleSuspend = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "suspended" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "warning",
        title: "⚠️ Provider Suspended",
        message: `${prov.name} has been suspended from the platform.`,
      });
    setSelectedProvider(null);
  };

  const handleReinstate = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "verified" as const } : p,
      ),
    );
    const prov = providers.find((p) => p.id === id);
    if (prov)
      addToast({
        type: "success",
        title: "✅ Provider Reinstated",
        message: `${prov.name}'s account has been reinstated.`,
      });
    setSelectedProvider(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedProvider) return;
    addToast({
      type: "info",
      title: "📨 Message Sent",
      message: `Message sent to ${selectedProvider.name}: "${messageText.slice(0, 50)}..."`,
    });
    setMessageText("");
    setShowMessageForm(false);
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Provider Management</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "verified", "pending", "suspended"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 opacity-60">
                ({providers.filter((p) => f === "all" || p.status === f).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Provider Cards */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProvider(p);
              setShowMessageForm(false);
              setMessageSent(false);
            }}
            className={`bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer ${
              p.status === "pending" ? "border-l-4 border-yellow-400" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    p.status === "verified"
                      ? "bg-emerald-50 text-emerald-700"
                      : p.status === "pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                        p.status === "verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : p.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {p.category} • {p.email}
                  </p>
                  {p.rating > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      ★ {p.rating} • {p.jobs} jobs • Joined {p.joined}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:+234000000000`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  title="Call provider"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${p.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                  title="Email provider"
                >
                  <Mail size={14} className="text-purple-600" />
                </a>
                <ChevronRight size={18} className="text-gray-400 ml-1" />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No providers found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* ===== PROVIDER DETAIL MODAL ===== */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Provider Details
              </h3>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Avatar & Name */}
            <div className="text-center mb-5">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xl ${
                  selectedProvider.status === "verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedProvider.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {selectedProvider.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                {selectedProvider.name}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedProvider.category}
              </p>
              <span
                className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  selectedProvider.status === "verified"
                    ? "bg-emerald-100 text-emerald-700"
                    : selectedProvider.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {selectedProvider.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.rating > 0
                    ? `${selectedProvider.rating} ★`
                    : "N/A"}
                </p>
                <p className="text-[10px] text-gray-500">Rating</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.jobs}
                </p>
                <p className="text-[10px] text-gray-500">Jobs</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.joined.split(",")[0]}
                </p>
                <p className="text-[10px] text-gray-500">Joined</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Mail size={14} className="text-gray-400" />
                <p className="text-sm text-gray-700">
                  {selectedProvider.email}
                </p>
              </div>
            </div>

            {/* Message Form */}
            {showMessageForm && (
              <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 mb-2">
                  Send Message to {selectedProvider.name}
                </p>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 bg-white rounded-lg text-sm border border-blue-200 outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setShowMessageForm(false)}
                    className="px-4 py-2 bg-white text-gray-600 text-xs font-semibold rounded-full border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {messageSent && (
              <div className="mb-4 p-3 bg-green-50 rounded-xl text-center">
                <p className="text-xs text-green-700 font-medium">
                  ✅ Message sent successfully
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowMessageForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700"
              >
                <MessageSquare size={16} /> Contact Provider
              </button>

              {selectedProvider.status === "pending" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(selectedProvider.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() =>
                      isSuperAdmin && handleReject(selectedProvider.id)
                    }
                    disabled={!isSuperAdmin}
                    title={
                      !isSuperAdmin
                        ? "Requires Super Admin privileges"
                        : "Reject this provider"
                    }
                    className={`flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-full ${isSuperAdmin ? "hover:bg-red-700 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}

              {selectedProvider.status === "verified" && (
                <button
                  onClick={() =>
                    isSuperAdmin && handleSuspend(selectedProvider.id)
                  }
                  disabled={!isSuperAdmin}
                  title={
                    !isSuperAdmin
                      ? "Requires Super Admin privileges"
                      : "Suspend this provider"
                  }
                  className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-200 ${isSuperAdmin ? "hover:bg-red-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  <Ban size={16} /> Suspend Provider
                </button>
              )}

              {selectedProvider.status === "suspended" && (
                <button
                  onClick={() => handleReinstate(selectedProvider.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-100 border border-emerald-200"
                >
                  <CheckCircle size={16} /> Reinstate Provider
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// TEAM MANAGEMENT TAB (Super Admin only)
// ============================================
function TeamManagementTab() {
  const { session } = useSession() as any;
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    adminRole: "MODERATOR",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = session?.accessToken;
      const res = await fetch(`${BACKEND}/api/auth/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAdmins(data.data || []);
    } catch (e) {
      console.error("Failed to fetch admins:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const token = session?.accessToken;
      const res = await fetch(`${BACKEND}/api/auth/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Admin created successfully!");
        setShowCreateForm(false);
        setCreateForm({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          adminRole: "MODERATOR",
        });
        fetchAdmins();
      } else {
        setError(data.error || "Failed to create admin");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (adminId: string, newRole: string) => {
    try {
      const token = session?.accessToken;
      const res = await fetch(`${BACKEND}/api/auth/admin/${adminId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminRole: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdmins();
        setSuccess("Role updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to update role");
        setTimeout(() => setError(""), 3000);
      }
    } catch (e) {
      setError("Network error");
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-amber-100 text-amber-700",
    MODERATOR: "bg-blue-100 text-blue-700",
    SUPPORT: "bg-emerald-100 text-emerald-700",
    FINANCE: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Team Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition text-sm font-semibold"
        >
          <UserPlus size={16} /> Add Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm">
          {success}
        </div>
      )}

      {/* Create Admin Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Admin</h3>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, email: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={createForm.firstName}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, firstName: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={createForm.lastName}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, lastName: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
            />
            <input
              type="password"
              placeholder="Password (min 8 chars)"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, password: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
              minLength={8}
            />
            <select
              value={createForm.adminRole}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, adminRole: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="MODERATOR">Moderator</option>
              <option value="SUPPORT">Support Agent</option>
              <option value="FINANCE">Finance Manager</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            <div className="flex gap-2 items-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition text-sm font-semibold disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Admin Team ({admins.length})
          </h3>
        </div>
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : admins.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No admin users found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {admin.firstName} {admin.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={admin.adminRole || "MODERATOR"}
                      onChange={(e) =>
                        handleRoleChange(admin.id, e.target.value)
                      }
                      className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${roleColors[admin.adminRole] || "bg-gray-100 text-gray-700"}`}
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="SUPPORT">Support</option>
                      <option value="FINANCE">Finance</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============================================
// SETTINGS TAB
// ============================================
function SettingsTab({ onLogout }: { onLogout: () => void }) {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>

      {/* Commission */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Commission Settings
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Default Commission Rate (%)
            </label>
            <input
              type="number"
              defaultValue={10}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Minimum Withdrawal (₦)
            </label>
            <input
              type="number"
              defaultValue={5000}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
        <button className="mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-purple-700">
          Save Settings
        </button>
      </div>

      {/* Platform Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Platform Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-500">Platform Name</span>
            <span className="font-medium text-gray-900">HANDI</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-500">Support Email</span>
            <span className="font-medium text-gray-900">support@handi.ng</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-gray-500">Support Phone</span>
            <span className="font-medium text-gray-900">+234 800 000 0000</span>
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
            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? "bg-purple-600" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDark ? "translate-x-6" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} /> Log Out
      </button>
    </div>
  );
}

// ============================================
// ADMIN BOOKINGS TAB
// ============================================
function AdminBookingsTab() {
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "amount-high" | "amount-low"
  >("newest");
  const [search, setSearch] = useState("");

  const bookings = [
    {
      id: "ab1",
      service: "Deep Cleaning",
      client: "Golden Amadi",
      provider: "CleanPro Services",
      date: "Feb 22, 2026",
      time: "10:00 AM",
      status: "confirmed",
      amount: "₦15,000",
    },
    {
      id: "ab2",
      service: "Plumbing Repair",
      client: "Adaobi Chen",
      provider: "handi Plumbing",
      date: "Feb 21, 2026",
      time: "2:00 PM",
      status: "pending",
      amount: "₦12,000",
    },
    {
      id: "ab3",
      service: "Electrical Wiring",
      client: "James Nwachukwu",
      provider: "Chinedu Okonkwo",
      date: "Feb 20, 2026",
      time: "9:00 AM",
      status: "completed",
      amount: "₦25,000",
    },
    {
      id: "ab4",
      service: "Interior Painting",
      client: "Fatima Bello",
      provider: "ArtSpace Interiors",
      date: "Feb 19, 2026",
      time: "11:30 AM",
      status: "cancelled",
      amount: "₦40,000",
    },
    {
      id: "ab5",
      service: "AC Maintenance",
      client: "Emeka Udo",
      provider: "AutoCare Mechanics",
      date: "Feb 18, 2026",
      time: "3:00 PM",
      status: "in_progress",
      amount: "₦8,000",
    },
    {
      id: "ab6",
      service: "Home Fumigation",
      client: "Grace Obi",
      provider: "PestGuard NG",
      date: "Feb 17, 2026",
      time: "8:00 AM",
      status: "completed",
      amount: "₦20,000",
    },
    {
      id: "ab7",
      service: "Bridal Makeup",
      client: "Aisha Mohammed",
      provider: "Sarah Beauty Hub",
      date: "Feb 16, 2026",
      time: "6:00 AM",
      status: "disputed",
      amount: "₦35,000",
    },
  ];

  const filtered = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.client.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-high":
          return (
            parseInt(b.amount.replace(/[^0-9]/g, "")) -
            parseInt(a.amount.replace(/[^0-9]/g, ""))
          );
        case "amount-low":
          return (
            parseInt(a.amount.replace(/[^0-9]/g, "")) -
            parseInt(b.amount.replace(/[^0-9]/g, ""))
          );
        default:
          return 0;
      }
    });
  const statusColor: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    in_progress: "bg-purple-100 text-purple-700",
    disputed: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-xs text-gray-500">
            {bookings.length} total bookings on the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search client or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white w-44 outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 hover:border-purple-400 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount-high">Amount ↓</option>
            <option value="amount-low">Amount ↑</option>
          </select>
          <button className="px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-semibold hover:bg-purple-700 flex items-center gap-1">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          "all",
          "pending",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
          "disputed",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize ${filter === s ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div className="space-y-2">
        {filtered.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBooking(b)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex items-center gap-4"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{b.service}</p>
              <p className="text-xs text-gray-500">
                {b.client} → {b.provider}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {b.date} at {b.time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{b.amount}</p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[b.status] || "bg-gray-100"}`}
              >
                {b.status.replace("_", " ")}
              </span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        ))}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedBooking.service}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">{selectedBooking.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium">{selectedBooking.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">{selectedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-(--color-primary)">
                  {selectedBooking.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[selectedBooking.status]}`}
                >
                  {selectedBooking.status.replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  alert("Booking cancelled");
                  setSelectedBooking(null);
                }}
                className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700"
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
// ADMIN TRANSACTIONS TAB
// ============================================
function AdminTransactionsTab() {
  const { addToast } = useNotification();
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [actionType, setActionType] = useState<"refund" | "chargeback" | null>(
    null,
  );
  const [actionReason, setActionReason] = useState("");

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-500">
            Financial overview • Powered by Paystack
          </p>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-semibold hover:bg-purple-700">
          <Download size={12} /> Export Report
        </button>
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
            className={`rounded-2xl bg-gradient-to-br ${c.gradient} p-4 text-white relative overflow-hidden`}
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

      {/* Transaction List */}
      <div className="space-y-2">
        {transactions.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTxn(t)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl ${typeColors[t.type]} flex items-center justify-center shrink-0`}
            >
              {t.type === "payment" && <DollarSign size={18} />}
              {t.type === "withdrawal" && <ArrowUp size={18} />}
              {t.type === "refund" && <XCircle size={18} />}
              {t.type === "commission" && <TrendingUp size={18} />}
              {t.type === "subscription" && <CreditCard size={18} />}
              {t.type === "chargeback" && <AlertTriangle size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {t.title}
              </p>
              <p className="text-xs text-gray-500">
                {t.from} → {t.to}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                {t.ref}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-900">{t.amount}</p>
              <p className="text-[10px] text-gray-400">{t.date}</p>
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${t.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>

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
                className="p-1 rounded-full hover:bg-gray-100"
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

            {/* Actions */}
            {selectedTxn.type === "payment" &&
              selectedTxn.status === "completed" &&
              !actionType && (
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setActionType("refund")}
                    className="flex-1 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 flex items-center justify-center gap-1"
                  >
                    <XCircle size={14} /> Refund
                  </button>
                  <button
                    onClick={() => setActionType("chargeback")}
                    className="flex-1 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-100 flex items-center justify-center gap-1"
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
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={!actionReason.trim()}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
                  >
                    Confirm
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

// ============================================
// ADMIN SERVICES TAB
// ============================================
function AdminServicesTab() {
  const categories = [
    {
      id: "c1",
      name: "Home Cleaning",
      services: 45,
      providers: 23,
      avgPrice: "₦12,000",
      status: "active",
    },
    {
      id: "c2",
      name: "Plumbing",
      services: 32,
      providers: 18,
      avgPrice: "₦15,000",
      status: "active",
    },
    {
      id: "c3",
      name: "Electrical",
      services: 28,
      providers: 15,
      avgPrice: "₦18,000",
      status: "active",
    },
    {
      id: "c4",
      name: "Painting",
      services: 20,
      providers: 12,
      avgPrice: "₦25,000",
      status: "active",
    },
    {
      id: "c5",
      name: "Beauty & Spa",
      services: 38,
      providers: 20,
      avgPrice: "₦8,000",
      status: "active",
    },
    {
      id: "c6",
      name: "Catering",
      services: 15,
      providers: 10,
      avgPrice: "₦30,000",
      status: "active",
    },
    {
      id: "c7",
      name: "Moving & Logistics",
      services: 12,
      providers: 8,
      avgPrice: "₦40,000",
      status: "active",
    },
    {
      id: "c8",
      name: "Tech Support",
      services: 22,
      providers: 14,
      avgPrice: "₦10,000",
      status: "draft",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Service Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage platform services and categories
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700">
          + Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {categories.length}
          </p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {categories.reduce((s, c) => s + c.services, 0)}
          </p>
          <p className="text-xs text-gray-500">Total Services</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {categories.reduce((s, c) => s + c.providers, 0)}
          </p>
          <p className="text-xs text-gray-500">Active Providers</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">{c.name}</h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {c.status}
              </span>
            </div>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Services</span>
                <span className="font-medium text-gray-900">{c.services}</span>
              </div>
              <div className="flex justify-between">
                <span>Providers</span>
                <span className="font-medium text-gray-900">{c.providers}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Price</span>
                <span className="font-medium text-gray-900">{c.avgPrice}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100">
                Edit
              </button>
              <button className="flex-1 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-100">
                View Services
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ANALYTICS TAB (Data Analyst)
// ============================================
function AnalyticsTab() {
  const { addToast } = useNotification();
  const [dateRange, setDateRange] = useState({
    from: "2025-12-01",
    to: "2026-02-22",
  });

  const KEY_METRICS = [
    {
      label: "Conversion Rate",
      value: "12.4%",
      trend: "+2.1%",
      gradient: "from-purple-500 to-indigo-600",
      icon: TrendingUp,
    },
    {
      label: "Avg. Booking Value",
      value: "₦18,500",
      trend: "+₦1,200",
      gradient: "from-emerald-500 to-teal-600",
      icon: DollarSign,
    },
    {
      label: "Avg. Response Time",
      value: "18min",
      trend: "-3min",
      gradient: "from-blue-500 to-cyan-600",
      icon: Clock,
    },
    {
      label: "Retention Rate",
      value: "68%",
      trend: "+5%",
      gradient: "from-amber-500 to-orange-600",
      icon: Users,
    },
  ];

  const FUNNEL = [
    { stage: "Page Visit", count: 45200, color: "bg-purple-500" },
    { stage: "Sign Up", count: 12450, color: "bg-indigo-500" },
    { stage: "First Booking", count: 8300, color: "bg-blue-500" },
    { stage: "Payment", count: 7100, color: "bg-teal-500" },
    { stage: "Review Left", count: 3200, color: "bg-emerald-500" },
  ];
  const maxFunnel = FUNNEL[0].count;

  const COHORTS = [
    { month: "Sep 2025", users: 820, w1: 78, w2: 62, w4: 48, w8: 35, w12: 28 },
    { month: "Oct 2025", users: 950, w1: 82, w2: 68, w4: 52, w8: 40, w12: 32 },
    { month: "Nov 2025", users: 1100, w1: 85, w2: 71, w4: 55, w8: 42, w12: 0 },
    { month: "Dec 2025", users: 1350, w1: 80, w2: 65, w4: 50, w8: 0, w12: 0 },
    { month: "Jan 2026", users: 1480, w1: 88, w2: 72, w4: 0, w8: 0, w12: 0 },
    { month: "Feb 2026", users: 890, w1: 90, w2: 0, w4: 0, w8: 0, w12: 0 },
  ];

  const EXPORTS = [
    {
      label: "Users",
      desc: "All user accounts with profile data",
      icon: Users,
    },
    {
      label: "Bookings",
      desc: "Booking records with status & amounts",
      icon: Calendar,
    },
    {
      label: "Transactions",
      desc: "Payment history with Paystack refs",
      icon: CreditCard,
    },
    {
      label: "Services",
      desc: "Service catalog with ratings & bookings",
      icon: Package,
    },
  ];

  const handleExport = (type: string) => {
    addToast({
      type: "success",
      title: `${type} export started`,
      message: `Your ${type.toLowerCase()} CSV is being prepared.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-xs text-gray-500">
            Deep insights into platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange((p) => ({ ...p, from: e.target.value }))
            }
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange((p) => ({ ...p, to: e.target.value }))
            }
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
          />
        </div>
      </div>

      {/* Key Metrics – Gradient Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KEY_METRICS.map((m) => (
          <div
            key={m.label}
            className={`rounded-2xl bg-gradient-to-br ${m.gradient} p-4 text-white relative overflow-hidden`}
          >
            <div className="absolute top-3 right-3 opacity-20">
              <m.icon size={32} />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              {m.label}
            </p>
            <p className="text-2xl font-extrabold mt-1">{m.value}</p>
            <p className="text-xs mt-1 flex items-center gap-1 opacity-90">
              <ArrowUp size={12} /> {m.trend}{" "}
              <span className="opacity-60">vs last period</span>
            </p>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          📊 Conversion Funnel
        </h3>
        <div className="space-y-3">
          {FUNNEL.map((step, i) => (
            <div key={step.stage} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 shrink-0">
                {step.stage}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                <div
                  className={`h-full ${step.color} rounded-full flex items-center justify-end pr-2 transition-all duration-700`}
                  style={{ width: `${(step.count / maxFunnel) * 100}%` }}
                >
                  <span className="text-[10px] font-bold text-white">
                    {step.count.toLocaleString()}
                  </span>
                </div>
              </div>
              {i > 0 && (
                <span className="text-[10px] font-semibold text-gray-400 w-12 text-right">
                  {((step.count / FUNNEL[i - 1].count) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Retention */}
      <div className="bg-white rounded-2xl shadow-sm p-5 overflow-x-auto no-scrollbar">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          📈 User Cohort Retention
        </h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-3 font-semibold text-gray-500">
                Cohort
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Users
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 1
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 2
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 4
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 8
              </th>
              <th className="text-center py-2 px-2 font-semibold text-gray-500">
                Week 12
              </th>
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((c) => (
              <tr key={c.month} className="border-b border-gray-50">
                <td className="py-2 pr-3 font-medium text-gray-700 whitespace-nowrap">
                  {c.month}
                </td>
                <td className="text-center py-2 px-2 font-semibold text-gray-900">
                  {c.users.toLocaleString()}
                </td>
                {[c.w1, c.w2, c.w4, c.w8, c.w12].map((val, i) => {
                  const bg =
                    val > 0
                      ? val >= 70
                        ? "bg-emerald-100 text-emerald-700"
                        : val >= 50
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      : "bg-gray-50 text-gray-300";
                  return (
                    <td key={i} className="text-center py-2 px-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${bg}`}
                      >
                        {val > 0 ? `${val}%` : "—"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">💾 Data Export</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {EXPORTS.map((exp) => (
            <div
              key={exp.label}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <exp.icon size={18} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {exp.label}
                </p>
                <p className="text-[10px] text-gray-400">{exp.desc}</p>
              </div>
              <button
                onClick={() => handleExport(exp.label)}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700"
              >
                <Download size={12} /> CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADMIN REPORTS TAB
// ============================================
function AdminReportsTab() {
  const [reportTab, setReportTab] = useState<
    "platform" | "users" | "financial"
  >("platform");

  const kpis = [
    {
      label: "User Growth",
      value: "12,450",
      change: "+18.2%",
      period: "vs last month",
      direction: "up",
    },
    {
      label: "Booking Rate",
      value: "78.5%",
      change: "+5.3%",
      period: "conversion",
      direction: "up",
    },
    {
      label: "Avg. Rating",
      value: "4.6 ★",
      change: "+0.2",
      period: "platform wide",
      direction: "up",
    },
    {
      label: "Churn Rate",
      value: "3.2%",
      change: "-1.1%",
      period: "vs last month",
      direction: "down",
    },
    {
      label: "Avg. Booking Value",
      value: "₦18,500",
      change: "+₦2,300",
      period: "vs last month",
      direction: "up",
    },
    {
      label: "Resolution Time",
      value: "4.2 hrs",
      change: "-1.8 hrs",
      period: "avg dispute",
      direction: "down",
    },
  ];

  const topServices = [
    { name: "Home Cleaning", bookings: 1250, revenue: "₦15M", growth: "+22%" },
    {
      name: "Plumbing Repair",
      bookings: 890,
      revenue: "₦13.4M",
      growth: "+15%",
    },
    {
      name: "Electrical Work",
      bookings: 720,
      revenue: "₦12.9M",
      growth: "+18%",
    },
    { name: "Beauty & Spa", bookings: 650, revenue: "₦5.2M", growth: "+30%" },
    { name: "Painting", bookings: 480, revenue: "₦12M", growth: "+10%" },
  ];

  const userGrowth = [
    { month: "Sep", clients: 580, providers: 42 },
    { month: "Oct", clients: 720, providers: 65 },
    { month: "Nov", clients: 890, providers: 78 },
    { month: "Dec", clients: 1050, providers: 95 },
    { month: "Jan", clients: 1380, providers: 120 },
    { month: "Feb", clients: 1650, providers: 145 },
  ];

  const userBreakdown = [
    { label: "Clients", count: 10200, pct: 82, color: "bg-blue-500" },
    { label: "Providers", count: 1890, pct: 15, color: "bg-emerald-500" },
    { label: "Admins", count: 360, pct: 3, color: "bg-purple-500" },
  ];

  const userStatus = [
    { label: "Active", count: 10850, color: "text-emerald-600 bg-emerald-50" },
    { label: "Suspended", count: 420, color: "text-yellow-600 bg-yellow-50" },
    { label: "Banned", count: 85, color: "text-red-600 bg-red-50" },
    { label: "Deactivated", count: 195, color: "text-gray-600 bg-gray-100" },
  ];

  const topLocations = [
    { area: "Lekki", users: 1850 },
    { area: "Ikeja", users: 1420 },
    { area: "Victoria Island", users: 1280 },
    { area: "Surulere", users: 980 },
    { area: "Yaba", users: 870 },
    { area: "Ajah", users: 760 },
  ];

  const topUsers = [
    { name: "Golden Amadi", bookings: 48, spent: "₦1.2M" },
    { name: "Adaobi Okonkwo", bookings: 42, spent: "₦980K" },
    { name: "Tunde Balogun", bookings: 38, spent: "₦850K" },
    { name: "Ngozi Eze", bookings: 35, spent: "₦720K" },
    { name: "Emeka Nwosu", bookings: 31, spent: "₦680K" },
  ];

  const financialSummary = [
    { label: "Total Revenue", value: "₦24.5M", change: "+22%", icon: "💰" },
    { label: "Total Payouts", value: "₦19.8M", change: "+18%", icon: "💸" },
    { label: "Platform Fees", value: "₦4.7M", change: "+30%", icon: "🏦" },
    { label: "Refunds Issued", value: "₦680K", change: "-15%", icon: "↩️" },
  ];

  const paymentMethods = [
    { method: "Card (Visa/MC)", count: 4200, volume: "₦12.5M", pct: 52 },
    { method: "Bank Transfer", count: 3100, volume: "₦8.2M", pct: 34 },
    { method: "USSD", count: 850, volume: "₦2.1M", pct: 9 },
    { method: "Wallet", count: 520, volume: "₦1.4M", pct: 5 },
  ];

  const monthlyRevenue = [
    { month: "Sep", revenue: 2800000 },
    { month: "Oct", revenue: 3200000 },
    { month: "Nov", revenue: 3600000 },
    { month: "Dec", revenue: 4100000 },
    { month: "Jan", revenue: 4800000 },
    { month: "Feb", revenue: 5200000 },
  ];
  const maxRev = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500">Platform performance insights</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700">
          Download Report
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "platform" as const, label: "📊 Platform Overview" },
          { id: "users" as const, label: "👥 User Report" },
          { id: "financial" as const, label: "💰 Financial Report" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportTab(tab.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              reportTab === tab.id
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== PLATFORM OVERVIEW ===== */}
      {reportTab === "platform" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                <p className="text-xl font-bold text-gray-900">{k.value}</p>
                <p
                  className={`text-xs mt-0.5 ${k.direction === "up" ? "text-green-600" : "text-red-500"}`}
                >
                  {k.change} <span className="text-gray-400">{k.period}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Top Performing Services
            </h2>
            <div className="space-y-3">
              {topServices.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {s.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {s.bookings} bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {s.revenue}
                    </p>
                    <p className="text-[10px] text-green-600">{s.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== USER REPORT ===== */}
      {reportTab === "users" && (
        <>
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              User Growth (6 months)
            </h2>
            <div className="grid grid-cols-6 gap-2">
              {userGrowth.map((m) => (
                <div key={m.month} className="text-center">
                  <div className="relative h-32 bg-gray-50 rounded-lg flex flex-col justify-end p-1 gap-0.5">
                    <div
                      className="bg-blue-400 rounded-sm"
                      style={{ height: `${(m.clients / 1700) * 100}%` }}
                    />
                    <div
                      className="bg-emerald-400 rounded-sm"
                      style={{ height: `${(m.providers / 200) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">
                    {m.month}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {m.clients + m.providers}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 bg-blue-400 rounded-sm" />
                Clients
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-sm" />
                Providers
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                User Type Breakdown
              </h3>
              <div className="flex h-3 rounded-full overflow-hidden mb-3">
                {userBreakdown.map((u) => (
                  <div
                    key={u.label}
                    className={`${u.color}`}
                    style={{ width: `${u.pct}%` }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                {userBreakdown.map((u) => (
                  <div
                    key={u.label}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${u.color}`} />
                      {u.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {u.count.toLocaleString()} ({u.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                User Status
              </h3>
              <div className="space-y-2">
                {userStatus.map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between p-2.5 rounded-xl ${s.color}`}
                  >
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-sm font-bold">
                      {s.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic & Top Users */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Top Locations
              </h3>
              <div className="space-y-2">
                {topLocations.map((loc, i) => (
                  <div key={loc.area} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm text-gray-700">
                          {loc.area}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {loc.users.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-purple-400 rounded-full"
                          style={{ width: `${(loc.users / 1850) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Top Users by Bookings
              </h3>
              <div className="space-y-2">
                {topUsers.map((u, i) => (
                  <div key={u.name} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {u.bookings} bookings • {u.spent} spent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== FINANCIAL REPORT ===== */}
      {reportTab === "financial" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {financialSummary.map((f) => (
              <div
                key={f.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{f.icon}</span>
                  <p className="text-xs text-gray-500">{f.label}</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{f.value}</p>
                <p className="text-xs text-green-600 mt-0.5">
                  {f.change} vs last month
                </p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Monthly Revenue Trend
            </h2>
            <div className="grid grid-cols-6 gap-3">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="text-center">
                  <div className="relative h-32 bg-gray-50 rounded-lg flex flex-col justify-end p-1">
                    <div
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm"
                      style={{ height: `${(m.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">
                    {m.month}
                  </p>
                  <p className="text-[10px] font-bold text-gray-700">
                    ₦{(m.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Payment Method Breakdown
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{pm.method}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {pm.volume}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${pm.pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {pm.count.toLocaleString()} transactions ({pm.pct}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
