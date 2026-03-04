"use client";

import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProviderHome from "@/components/ProviderDashboard";
import ClientHeader from "@/components/client/ClientHeader";
import FeaturedSection from "@/components/home/FeaturedSection";
import HeroSection from "@/components/home/HeroSection";
import ProvidersAndStepsSection from "@/components/home/ProvidersAndStepsSection";
import TrustSection from "@/components/home/TrustSection";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import type { ClientTabId } from "@/data/landingData";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, lazy, useState } from "react";

/* ── Lazy-loaded tab content for logged-in client ── */
const LazyFindProsTab = lazy(() => import("@/components/client/FindProsTab"));
const LazyProvidersTab = lazy(() => import("@/components/client/ProvidersTab"));
const LazyShopTab = lazy(() => import("@/components/client/ShopTab"));
const LazyDealsTab = lazy(() => import("@/components/client/DealsTab"));
const LazyBookingsTab = lazy(() => import("@/components/client/BookingsTab"));
const LazyHowItWorksTab = lazy(
  () => import("@/components/client/HowItWorksTab"),
);
const LazyClientProfileTab = lazy(
  () => import("@/components/client/ClientProfileTab"),
);
const LazyCartPanel = lazy(() => import("@/components/client/CartPanel"));
const LazyWishlistPanel = lazy(
  () => import("@/components/client/WishlistPanel"),
);
const LazyHomeTab = lazy(() => import("@/components/client/HomeTab"));

export default function LandingPage() {
  const { isLoggedIn, user: authUser, logout, updateUser } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  // Landing page state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Client dashboard state
  const [activeClientTab, setActiveClientTab] = useState<ClientTabId>("home");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showWishlistPanel, setShowWishlistPanel] = useState(false);

  const isClient = isLoggedIn && authUser?.userType === "client";

  // If logged in as provider or admin, route to their dashboards
  if (isLoggedIn && authUser) {
    if (authUser.userType === "provider") return <ProviderHome />;
    if (authUser.userType === "admin") return <AdminDashboard />;
  }

  const handleConfirmedLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* ── Navbar: Landing version for logged-out, Dashboard header for logged-in client ── */}
      {isClient ? (
        <ClientHeader
          authUser={authUser}
          activeClientTab={activeClientTab}
          setActiveClientTab={setActiveClientTab}
          clientSearchQuery={clientSearchQuery}
          setClientSearchQuery={setClientSearchQuery}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          setShowCartPanel={setShowCartPanel}
          setShowWishlistPanel={setShowWishlistPanel}
          setShowNotifications={setShowNotifications}
          setShowLogoutConfirm={setShowLogoutConfirm}
        />
      ) : (
        <Navbar />
      )}

      {/* ── Client tab content (logged-in) ── */}
      {isClient && (
        <div className="flex-1 pb-20">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-(--color-primary) rounded-full animate-spin" />
              </div>
            }
          >
            {activeClientTab === "home" && (
              <LazyHomeTab
                user={authUser}
                setActiveTab={(t: string) =>
                  setActiveClientTab(t as ClientTabId)
                }
                onOpenCart={() => setShowCartPanel(true)}
              />
            )}
            {activeClientTab === "find-pros" && (
              <LazyFindProsTab searchQuery={clientSearchQuery} />
            )}
            {activeClientTab === "providers" && <LazyProvidersTab />}
            {activeClientTab === "shop" && (
              <LazyShopTab onOpenCart={() => setShowCartPanel(true)} />
            )}
            {activeClientTab === "deals" && <LazyDealsTab />}
            {activeClientTab === "bookings" && <LazyBookingsTab />}
            {activeClientTab === "how-it-works" && <LazyHowItWorksTab />}
            {activeClientTab === "profile" && (
              <LazyClientProfileTab
                user={authUser}
                updateUser={updateUser}
                logout={logout}
                router={router}
                onLogout={() => setShowLogoutConfirm(true)}
                setShowNotifications={setShowNotifications}
                setShowSupport={setShowSupport}
                setShowTransactions={setShowTransactions}
              />
            )}
          </Suspense>
        </div>
      )}

      {/* ── Landing page content (logged-out users only) ── */}
      {!isClient && (
        <>
          <HeroSection
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            router={router}
          />
          <TrustSection />
          <FeaturedSection router={router} />
          <ProvidersAndStepsSection router={router} />
        </>
      )}

      {/* ── Footer ── */}
      <Footer
        isLoggedIn={isClient}
        onTabChange={(tabId) =>
          setActiveClientTab && setActiveClientTab(tabId as ClientTabId)
        }
      />

      {/* ── Logged-in client overlays ── */}
      {isClient && (
        <>
          {/* Logout Confirm */}
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
                  Are you sure you want to log out?
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

          {/* Notifications Panel */}
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
                      body: "Use code HANDI20 for your next service.",
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

          {/* Cart & Wishlist Panels */}
          <Suspense fallback={null}>
            {showCartPanel && (
              <LazyCartPanel onClose={() => setShowCartPanel(false)} />
            )}
            {showWishlistPanel && (
              <LazyWishlistPanel onClose={() => setShowWishlistPanel(false)} />
            )}
          </Suspense>
        </>
      )}
    </main>
  );
}
