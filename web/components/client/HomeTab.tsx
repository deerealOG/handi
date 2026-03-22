"use client";

import HeroSection from "@/components/landing-page/HeroSection";
import QuickAccessCards from "@/components/landing-page/QuickAccessCards";

import ProvidersAndStepsSection from "@/components/landing-page/ProvidersAndStepsSection";
import FlashDealsSection from "@/components/landing-page/FlashDealsSection";
import RecommendedServicesSection from "@/components/landing-page/RecommendedServicesSection";
import TrendingProductsSection from "@/components/landing-page/TrendingProductsSection";
import PromoSection from "@/components/landing-page/PromoSection";
import StepsSection from "@/components/landing-page/StepsSection";
import AboutSection from "@/components/landing-page/AboutSection";
import AppDownloadSection from "@/components/landing-page/AppDownloadSection";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import OfficialStoresSection from "@/components/landing-page/OfficialStoresSection";
import {
  ProfessionalsNearYouSection,
  StoresNearYouSection,
  CheapProductsSection,
  CategoriesSection,
} from "@/components/landing-page/ExtraHomeSections";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";

import { useCart } from "@/context/CartContext";

import {
  SERVICE_CATEGORIES,
} from "@/data/mockApi";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Grid,
  Search,
  ShoppingCart,
  Star,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type TabId = "home" | "find-pros" | "bookings" | "shop" | "profile" | "deals";

const CATEGORIES = SERVICE_CATEGORIES.slice(0, 8);

const MOCK_ACTIVE_BOOKINGS = [
  {
    id: "b1",
    service: "AC Servicing & Repair",
    provider: "CoolAir Solutions",
    date: "Today, 2:00 PM",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    icon: "🔧",
  },
  {
    id: "b2",
    service: "Home Deep Cleaning",
    provider: "SparkleClean NG",
    date: "Tomorrow, 10:00 AM",
    status: "Confirmed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🧹",
  },
  {
    id: "b3",
    service: "Electrical Wiring",
    provider: "PowerFix Pro",
    date: "Feb 23, 9:00 AM",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    icon: "⚡",
  },
];

export default function HomeTab({
  user: _user,
  setActiveTab,
  onOpenCart: _onOpenCart,
}: {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  setActiveTab: (t: TabId) => void;
  onOpenCart: () => void;
}) {
  const router = useRouter();
  const { addToCart: _addToCart, toggleWishlist: _toggleWishlist, isInWishlist: _isInWishlist } = useCart();

  // Detail modal state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedService, setSelectedService] = useState<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const HERO_SLIDES = [
    {
      title: "Professional Services\nYou Can Trust",
      subtitle:
        "Book verified service providers for home and business needs. Compare ratings, pricing, and availability in one place.",
      cta: "Book a Service",
      ctaAction: () => setActiveTab("find-pros"),
      bg: "from-(--color-primary) to-emerald-800",
      img: "/images/hero/hero-chef.webp",
    },
    {
      title: "Find Quality Products\nfor Every Job",
      subtitle:
        "From electrical tools to cleaning supplies, shop trusted products used by professionals.",
      cta: "Shop Products",
      ctaAction: () => setActiveTab("shop"),
      bg: "from-(--color-primary) to-emerald-800",
      img: "/images/hero/hero-electrician.webp",
    },
    {
      title: "Book Services\nin Minutes",
      subtitle:
        "Search, compare, schedule, and pay securely with a seamless booking experience.",
      cta: "Explore Deals",
      ctaAction: () => setActiveTab("find-pros"),
      bg: "from-(--color-primary) to-emerald-800",
      img: "/images/hero/hero-products.webp",
    },
  ];
  const _QUICK_NAV_TABS = [
    { id: "providers", label: "Pro", icon: Search },
    { id: "shop", label: "Shop", icon: ShoppingCart },
    { id: "categories", label: "Categories", icon: Grid },
    { id: "deals", label: "Deals", icon: Zap },
  ];
  const STEPS = [
    {
      icon: Search,
      title: "Search & Browse",
      description:
        "Find the service you need from our wide range of categories or search for specific providers in your area.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: CheckCircle,
      title: "Choose a Provider",
      description:
        "Compare verified providers based on ratings, reviews, pricing, and availability. Every provider is background-checked.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Calendar,
      title: "Book & Schedule",
      description:
        "Select your preferred date and time. Get instant confirmation and real-time updates on your booking status.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Star,
      title: "Get Service & Rate",
      description:
        "Your provider arrives at the scheduled time. After the job is done, rate your experience to help others.",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroHover, setHeroHover] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 45,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero auto-slide — advances every 5 seconds, pauses on hover
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (heroHover) {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
      return;
    }
    heroTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroHover]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [_showMobileCategories, _setShowMobileCategories] = useState(false);
  const [_selectedCategory, _setSelectedCategory] = useState<string | null>(null);

  // Cart/Wishlist now handled by useCart() hook above

  // Shared state for HeroSection to work properly
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }} 
      className="handi-bg flex flex-col pt-6"
    >
      <HeroSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        router={router}
      />
      
      <QuickAccessCards />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <section className="mb-4">
          <ProvidersAndStepsSection router={router} />
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full space-y-4">
        {/* Categories */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <button className="text-sm text-(--color-primary) font-medium flex items-center gap-1 cursor-pointer">
              See All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/services?q=${cat.id}`)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-(--color-primary) group-hover:shadow-md transition-all overflow-hidden relative">
                  <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

{/* Recent Bookings */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <button
            onClick={() => setActiveTab("bookings")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1 cursor-pointer"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        {MOCK_ACTIVE_BOOKINGS.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-8">
            No recent bookings found.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-2 lg:grid-cols-3">
            {MOCK_ACTIVE_BOOKINGS.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="w-[280px] max-w-[85vw] md:w-auto md:min-w-0 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow shrink-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {b.service}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.provider}</p>
                  <p className="text-xs text-gray-400 mt-1">{b.date}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${b.statusColor}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <ScrollReveal direction="up" delay={0}>
        <CategoriesSection router={router} />
      </ScrollReveal>
      <ScrollReveal direction="left" delay={0.05}>
        <section>
          <ProfessionalsNearYouSection router={router} />
        </section>
      </ScrollReveal>
      </div>

      <ScrollReveal direction="right" delay={0.1}>
        <OfficialStoresSection router={router} />
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full space-y-4">
      <ScrollReveal direction="right" delay={0.05}>
        <section>
          <StoresNearYouSection router={router} />
        </section>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <section>
          <CheapProductsSection router={router} />
        </section>
      </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0}>
        <RecommendedServicesSection />
      </ScrollReveal>
      <ScrollReveal direction="right" delay={0.05}>
        <TrendingProductsSection />
      </ScrollReveal>
      <ScrollReveal direction="left" delay={0.1}>
        <FlashDealsSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <PromoSection />
      </ScrollReveal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full space-y-6">
        <ScrollReveal direction="fade" delay={0.1}>
          <section>
            <StepsSection />
          </section>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0}>
          <section>
            <AboutSection />
          </section>
        </ScrollReveal>
        <ScrollReveal direction="fade" delay={0.1}>
          <AppDownloadSection />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0}>
          <section>
            <TestimonialsSection />
          </section>
        </ScrollReveal>
      </div>

      {/* ===== BOOKING DETAIL MODAL ===== */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-3">
                {selectedBooking.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedBooking.service}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedBooking.provider}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedBooking.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedBooking.statusColor}`}
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
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
