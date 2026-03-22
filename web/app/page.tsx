"use client";

import AdminDashboard from "@/components/admin/AdminDashboard";
import BookingsTab from "@/components/client/BookingsTab";
import CartPanel from "@/components/client/CartPanel";
import ClientMessagesTab from "@/components/client/ClientMessagesTab";
import ClientProfileTab from "@/components/client/ClientProfileTab";
import DealsTab from "@/components/client/DealsTab";
import EmergencyTab from "@/components/client/EmergencyTab";
import FindProsTab from "@/components/client/FindProsTab";
import HomeProfileTab from "@/components/client/HomeProfileTab";
import HomeTab from "@/components/client/HomeTab";
import HowItWorksTab from "@/components/client/HowItWorksTab";
import LoyaltyTab from "@/components/client/LoyaltyTab";
import MaintenancePlansTab from "@/components/client/MaintenancePlansTab";
import ProvidersTab from "@/components/client/ProvidersTab";
import QuotesTab from "@/components/client/QuotesTab";
import RecommendationsTab from "@/components/client/RecommendationsTab";
import ShopTab from "@/components/client/ShopTab";
import TradePurchasingTab from "@/components/client/TradePurchasingTab";
import WishlistPanel from "@/components/client/WishlistPanel";
import AboutSection from "@/components/landing-page/AboutSection";
import AppDownloadSection from "@/components/landing-page/AppDownloadSection";
import FlashDealsSection from "@/components/landing-page/FlashDealsSection";
import RecommendedServicesSection from "@/components/landing-page/RecommendedServicesSection";
import TrendingProductsSection from "@/components/landing-page/TrendingProductsSection";
import PromoSection from "@/components/landing-page/PromoSection";
import Footer from "@/components/landing-page/Footer";
import HeroSection from "@/components/landing-page/HeroSection";
import Navbar from "@/components/landing-page/Navbar";
import OfficialStoresSection from "@/components/landing-page/OfficialStoresSection";
import ProvidersAndStepsSection from "@/components/landing-page/ProvidersAndStepsSection";
import QuickAccessCards from "@/components/landing-page/QuickAccessCards";
import StepsSection from "@/components/landing-page/StepsSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import {
  ProfessionalsNearYouSection,
  StoresNearYouSection,
  CheapProductsSection,
  CategoriesSection,
} from "@/components/landing-page/ExtraHomeSections";
import ProviderHome from "@/components/provider/ProviderDashboard";
import { useAuth } from "@/context/AuthContext";
import type { ClientTabId } from "@/data/landingData";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import UnverifiedEmailBanner from "@/components/shared/UnverifiedEmailBanner";

import VendorDashboard from "@/components/vendor/VendorDashboard";

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">Loading application...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}

function LandingPageContent() {
  const { isLoggedIn, user: authUser, logout, updateUser } = useAuth();
  const router = useRouter();

  // Landing page state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Client dashboard state
  const searchParams = useSearchParams();
  const queryTab = (searchParams.get("tab") as ClientTabId) || "home";
  
  const [activeClientTab, setActiveClientTab] = useState<ClientTabId>(queryTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveClientTab(tab as ClientTabId);
  }, [searchParams]);

  const [clientSearchQuery, _setClientSearchQuery] = useState("");
  const [_showMobileMenu, _setShowMobileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [_showSupport, setShowSupport] = useState(false);
  const [_showTransactions, setShowTransactions] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showWishlistPanel, setShowWishlistPanel] = useState(false);

  const isClient = isLoggedIn && authUser?.userType === "client";

  // If logged in as provider or admin, route to their dashboards
  if (isLoggedIn && authUser) {
    if (authUser.userType === "provider") {
      // @ts-ignore - providerSubType exists on the raw profile context payload
      if (authUser.providerSubType === "business") {
        return <VendorDashboard />;
      }
      return <ProviderHome />;
    }
    if (authUser.userType === "admin") return <AdminDashboard />;
  }

  const handleConfirmedLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen handi-bg overflow-x-hidden max-w-[100vw]">
      {/* ── Always use the same Navbar ── */}
      <Navbar />
      <UnverifiedEmailBanner />

      {/* ── Client tab content (logged-in) ── */}
      {isClient && (
        <div className="flex-1 pb-20 w-full overflow-x-hidden">
          {activeClientTab === "home" && (
            <HomeTab
              user={authUser}
              setActiveTab={(t: string) => setActiveClientTab(t as ClientTabId)}
              onOpenCart={() => setShowCartPanel(true)}
            />
          )}
          {activeClientTab === "find-pros" && (
            <FindProsTab searchQuery={clientSearchQuery} />
          )}
          {activeClientTab === "providers" && <ProvidersTab />}
          {activeClientTab === "shop" && (
            <ShopTab onOpenCart={() => setShowCartPanel(true)} />
          )}
          {activeClientTab === "deals" && <DealsTab />}
          {activeClientTab === "bookings" && <BookingsTab />}
          {activeClientTab === "loyalty" && <LoyaltyTab />}
          {activeClientTab === "quotes" && <QuotesTab />}
          {activeClientTab === "maintenance" && <MaintenancePlansTab />}
          {activeClientTab === "home-profile" && <HomeProfileTab />}
          {activeClientTab === "emergency" && <EmergencyTab />}
          {activeClientTab === "messages" && <ClientMessagesTab />}
          {activeClientTab === "recommendations" && <RecommendationsTab />}
          {activeClientTab === "trade" && <TradePurchasingTab />}
          {activeClientTab === "how-it-works" && <HowItWorksTab />}
          {activeClientTab === "profile" && (
            <ClientProfileTab
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

          <QuickAccessCards />

          {/* All landing sections — consistent spacing */}
          <div className="space-y-4">
            <ScrollReveal direction="up" delay={0}>
              <section>
                <ProvidersAndStepsSection router={router} />
              </section>
            </ScrollReveal>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
              <ScrollReveal direction="up" delay={0}>
                <CategoriesSection router={router} />
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.05}>
                <ProfessionalsNearYouSection router={router} />
              </ScrollReveal>
            </section>

            <ScrollReveal direction="left" delay={0.1}>
              <RecommendedServicesSection />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1}>
              <TrendingProductsSection />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.05}>
              <FlashDealsSection />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <PromoSection />
            </ScrollReveal>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <ScrollReveal direction="right" delay={0.1}>
                <OfficialStoresSection router={router} />
              </ScrollReveal>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
              <ScrollReveal direction="right" delay={0.05}>
                <StoresNearYouSection router={router} />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.1}>
                <CheapProductsSection router={router} />
              </ScrollReveal>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full space-y-6">
              <ScrollReveal direction="up" delay={0}>
                <StepsSection />
              </ScrollReveal>
              <ScrollReveal direction="fade" delay={0.1}>
                <AboutSection />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0}>
                <AppDownloadSection />
              </ScrollReveal>
              <ScrollReveal direction="fade" delay={0.1}>
                <TestimonialsSection />
              </ScrollReveal>
            </section>
          </div>
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
          {showCartPanel && (
            <CartPanel onClose={() => setShowCartPanel(false)} />
          )}
          {showWishlistPanel && (
            <WishlistPanel onClose={() => setShowWishlistPanel(false)} />
          )}
        </>
      )}
    </main>
  );
}
