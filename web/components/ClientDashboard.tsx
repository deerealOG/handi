"use client";

import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { generateReceipt } from "@/lib/generateReceipt";
import {
    ArrowDown,
    ArrowUp,
    Bell,
    CalendarCheck,
    ChevronDown,
    Download,
    ExternalLink,
    Heart,
    HelpCircle,
    Home,
    Info,
    Menu,
    Moon,
    Power,
    Search,
    Share2,
    ShoppingBag,
    ShoppingCart,
    Sun,
    User,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Extracted tab components
import BookingsTab from "@/components/client/BookingsTab";
import CartPanel from "@/components/client/CartPanel";
import ClientProfileTab from "@/components/client/ClientProfileTab";
import FindProsTab from "@/components/client/FindProsTab";
import HomeTab from "@/components/client/HomeTab";
import HowItWorksTab from "@/components/client/HowItWorksTab";
import ProvidersTab from "@/components/client/ProvidersTab";
import ShopTab from "@/components/client/ShopTab";
import WishlistPanel from "@/components/client/WishlistPanel";
import CategoryPills from "@/components/ui/CategoryPills";

type TabId =
  | "home"
  | "find-pros"
  | "bookings"
  | "shop"
  | "profile"
  | "providers"
  | "how-it-works";

const TABS: {
  id: TabId;
  label: string;
  icon: typeof Home;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "find-pros", label: "Find Services", icon: Search },
  { id: "providers", label: "Providers", icon: Users },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "how-it-works", label: "How It Works", icon: Info },
  { id: "profile", label: "Profile", icon: User },
];

// ============================================
// APP SHELL
// ============================================
export default function ClientDashboard() {
  const { user, logout, updateUser } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showWishlistPanel, setShowWishlistPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();

  const unreadNotifications = 3;
  const unreadMessages = 1;

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
              {/* Mobile hamburger */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
              >
                <Menu size={20} />
              </button>

              {/* Logo — stays in app, goes to Home tab */}
              <button
                onClick={() => setActiveTab("home")}
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

            {/* Search Bar — center */}
            <div className="hidden sm:flex flex-1 max-w-xl mx-6 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search services, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
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

              {/* Cart */}
              <button
                onClick={() => setShowCartPanel(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Cart"
              >
                <ShoppingCart size={20} className="text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setShowWishlistPanel(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Wishlist"
              >
                <Heart size={20} className="text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <Power size={18} className="text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-3 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services, providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
        </div>
      </header>

      {/* ===== QUICK-NAV BREADCRUMBS ===== */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full my-2">
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
                  </button>
                );
              })}
            </CategoryPills>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu Dropdown */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute top-18 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-[slideDown_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-(--color-primary-light) text-(--color-primary)"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== TAB CONTENT ===== */}
      <main className="flex-1 pb-20">
        {activeTab === "home" && (
          <HomeTab
            user={user}
            setActiveTab={setActiveTab}
            onOpenCart={() => setShowCartPanel(true)}
          />
        )}
        {activeTab === "find-pros" && <FindProsTab searchQuery={searchQuery} />}
        {activeTab === "providers" && <ProvidersTab />}
        {activeTab === "shop" && (
          <ShopTab onOpenCart={() => setShowCartPanel(true)} />
        )}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "how-it-works" && <HowItWorksTab />}
        {activeTab === "profile" && (
          <ClientProfileTab
            user={user}
            updateUser={updateUser}
            logout={logout}
            router={router}
            onLogout={() => setShowLogoutConfirm(true)}
            setShowNotifications={setShowNotifications}
            setShowSupport={setShowSupport}
            setShowTransactions={setShowTransactions}
          />
        )}
      </main>

      {/* ===== BOTTOM TAB BAR (hidden: >5 tabs, use hamburger instead) ===== */}
      <nav className="hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
        <div className="max-w-7xl mx-auto flex items-center justify-around px-2 sm:px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 sm:py-3 px-2 sm:px-5 rounded-full transition-colors ${
                activeTab === tab.id
                  ? "text-(--color-primary) bg-(--color-primary-light)"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon
                size={20}
                className={activeTab === tab.id ? "stroke-[2.5px]" : ""}
              />
              <span
                className={`text-[10px] sm:text-xs font-medium ${
                  activeTab === tab.id ? "font-bold" : ""
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== LOGOUT CONFIRM DIALOG ===== */}
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
                  title: "Booking Confirmed",
                  body: "Your AC Servicing has been confirmed for 2:00 PM today.",
                  time: "2 min ago",
                  read: false,
                },
                {
                  title: "New Provider Response",
                  body: "SparkleClean NG accepted your cleaning request.",
                  time: "1 hour ago",
                  read: false,
                },
                {
                  title: "Payment Received",
                  body: "₦8,500 payment for Plumbing Repair confirmed.",
                  time: "3 hours ago",
                  read: true,
                },
                {
                  title: "Rate Your Service",
                  body: "How was your experience with AquaFix NG?",
                  time: "1 day ago",
                  read: true,
                },
                {
                  title: "20% Off Your Next Booking!",
                  body: "Use code HANDI20 for your next service. Valid till March 1.",
                  time: "2 days ago",
                  read: true,
                },
              ].map((n, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${n.read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"}`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
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
                  q: "How do I book a service?",
                  a: "Tap 'Find Pros', choose a category, select a provider, pick a time slot, and confirm your booking.",
                },
                {
                  q: "How do payments work?",
                  a: "Payments are processed securely through the app. You can pay with card or bank transfer.",
                },
                {
                  q: "Can I cancel a booking?",
                  a: "Yes, go to Bookings tab, select the booking, and tap 'Cancel'. Free cancellation up to 2 hours before.",
                },
                {
                  q: "How do I rate a provider?",
                  a: "After your service is complete, you'll receive a prompt to rate. You can also rate from your booking history.",
                },
                {
                  q: "What if I'm not satisfied?",
                  a: "You can file a dispute within 48 hours. Our support team will review and mediate.",
                },
                {
                  q: "How do refunds work?",
                  a: "Approved refunds take 3-5 business days if paid by card. Wallet refunds are instant.",
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
                  Email: <strong>support@handi.ng</strong>
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
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
              />
              <button className="w-full py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90">
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
              {[
                {
                  title: "AC Servicing Payment",
                  date: "Today, 2:30 PM",
                  amount: "- ₦8,500",
                  type: "debit" as const,
                },
                {
                  title: "Service Booking Refund",
                  date: "Feb 19, 2026",
                  amount: "+ ₦20,000",
                  type: "credit" as const,
                },
                {
                  title: "Deep Cleaning Payment",
                  date: "Feb 18, 2026",
                  amount: "- ₦15,000",
                  type: "debit" as const,
                },
                {
                  title: "Refund — Cancelled Job",
                  date: "Feb 15, 2026",
                  amount: "+ ₦3,000",
                  type: "credit" as const,
                },
                {
                  title: "Plumbing Repair Payment",
                  date: "Feb 12, 2026",
                  amount: "- ₦8,500",
                  type: "debit" as const,
                },
                {
                  title: "Product Purchase Refund",
                  date: "Feb 10, 2026",
                  amount: "+ ₦50,000",
                  type: "credit" as const,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {t.type === "credit" ? (
                        <ArrowDown size={14} className="text-green-600" />
                      ) : (
                        <ArrowUp size={14} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t.title}
                      </p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${t.type === "credit" ? "text-green-600" : "text-red-600"}`}
                    >
                      {t.amount}
                    </span>
                    <button
                      onClick={() =>
                        generateReceipt({
                          id: `TX${1000 + i}`,
                          title: t.title,
                          date: t.date,
                          amount: t.amount,
                          type: t.type,
                          status: "Success",
                          userName: user?.firstName + " " + user?.lastName,
                        })
                      }
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                      title="Download receipt"
                    >
                      <Download size={12} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => {
                        const text = `Receipt: ${t.title} | ${t.amount} | ${t.date}`;
                        if (navigator.share) {
                          navigator.share({
                            title: "Transaction Receipt",
                            text,
                          });
                        } else {
                          navigator.clipboard.writeText(text);
                          alert("Receipt details copied to clipboard!");
                        }
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                      title="Share receipt"
                    >
                      <Share2 size={12} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== IN-APP CART PANEL ===== */}
      {showCartPanel && <CartPanel onClose={() => setShowCartPanel(false)} />}

      {/* ===== IN-APP WISHLIST PANEL ===== */}
      {showWishlistPanel && (
        <WishlistPanel onClose={() => setShowWishlistPanel(false)} />
      )}

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
