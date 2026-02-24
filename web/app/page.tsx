"use client";

import AdminDashboard from "@/components/AdminDashboard";
import AuthenticatedHome from "@/components/AuthenticatedHome";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProviderHome from "@/components/ProviderHome";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { useAuth } from "@/context/AuthContext";
import { MOCK_DEALS } from "@/data/mockApi";
import { MOCK_PROVIDERS, SERVICE_CATEGORIES } from "@/data/providers";
import { Provider } from "@/types";
import {
    ArrowRight,
    BadgeCheck,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    CircleDollarSign,
    Headphones,
    Heart,
    Lock,
    MapPin,
    Menu,
    Search,
    Star,
    Timer,
    User,
    UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";

const LazyTopCategoriesSection = lazy(
  () => import("@/components/home/TopCategoriesSection"),
);
const LazyAvailableNowSection = lazy(
  () => import("@/components/home/AvailableNowSection"),
);

// Category images mapping for the sidebar
const CATEGORY_IMAGES: Record<string, string> = {
  electrical: "/images/categories/electrician.png",
  plumbing: "/images/categories/plumbing.jpg",
  beauty: "/images/categories/beauty.png",
  cleaning: "/images/categories/cleaning.png",
  construction: "/images/categories/construction.webp",
  technology: "/images/categories/technology.jpg",
  gardening: "/images/categories/gardening.jpg",
  home: "/images/categories/interior-decor.jpeg",
  automotive: "/images/categories/automotive.jpg",
  "pest-control": "/images/categories/pest-control.jpg",
  security: "/images/categories/technology.jpg",
  appliance: "/images/categories/electrical.jpg",
  fitness: "/images/categories/beauty.jpg",
  events: "/images/categories/beauty.jpg",
  moving: "/images/categories/automotive.jpg",
  mechanical: "/images/categories/mechanic.jpg",
};

// Hero slides
const HERO_SLIDES = [
  {
    title: "Professional Services\nYou Can Trust",
    subtitle:
      "Everyday services you don't want to miss. Book verified professionals today!",
    cta: "Explore Now",
    href: "/services",
    bg: "from-(--color-primary) to-emerald-800",
    img: "/images/hero/hero-chef.png",
  },
  {
    title: "Find Trusted\nProviders Near You",
    subtitle:
      "Over 5,000 verified providers within your area. Quality guaranteed.",
    cta: "Find Providers",
    href: "/providers",
    bg: "from-[#5f5c6d] to-[#aca9bb]",
    img: "/images/hero/hero-electrician.png",
  },
  {
    title: "Buy Home Products Online",
    subtitle: "Shop top brands at unbeatable prices. Fast delivery guaranteed.",
    cta: "Buy Now",
    href: "/products",
    bg: "from-[#3b3b3b] to-[#111]",
    img: "/images/hero/hero-products.png",
  },
];

// Top Categories data
const TOP_CATEGORY_PROVIDERS = [
  {
    name: "Hair Dressing",
    category: "Beauty and Wellness",
    img: "/images/categories/hairdressing.png",
  },
  {
    name: "Cleaning Service",
    category: "Home Keeping & Care",
    img: "/images/categories/gardening.jpg",
  },
  {
    name: "Chef",
    category: "Cooking & Kitchen",
    img: "/images/categories/beauty.jpg",
  },
  {
    name: "Nail Technician",
    category: "Beauty and Wellness",
    img: "/images/categories/beauty.jpg",
  },
  {
    name: "Barber",
    category: "Beauty and Wellness",
    img: "/images/categories/beauty.jpg",
  },
  {
    name: "Electrician",
    category: "Electricals",
    img: "/images/categories/electrical.jpg",
  },
  {
    name: "Plumber",
    category: "Plumbing",
    img: "/images/categories/plumbing.jpg",
  },
  {
    name: "Mechanic",
    category: "Automotive",
    img: "/images/categories/automotive.jpg",
  },
  {
    name: "Carpenter",
    category: "Construction",
    img: "/images/categories/construction.jpg",
  },
  {
    name: "IT Support",
    category: "Technology",
    img: "/images/categories/technology.jpg",
  },
];

// Tag badge color mapping
function getTagColor(tag: string): string {
  const t = tag.toUpperCase();
  if (t.includes("OFF")) return "var(--tag-off)";
  if (t.includes("HOT")) return "var(--tag-hot)";
  if (t.includes("DEAL")) return "var(--tag-deal)";
  if (t.includes("BEST")) return "var(--tag-best-seller)";
  if (t.includes("TRENDING")) return "var(--tag-trending)";
  if (t.includes("NEW")) return "var(--tag-new)";
  return "var(--tag-hot)";
}

export default function LandingPage() {
  const { isLoggedIn, user: authUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 45,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroHover, setHeroHover] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

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

  // Hero auto-advance
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter providers
  const filteredProviders: Provider[] = selectedCategory
    ? MOCK_PROVIDERS.filter(
        (p) =>
          p.category.toLowerCase() ===
          SERVICE_CATEGORIES.find(
            (c) => c.id === selectedCategory,
          )?.label.toLowerCase(),
      )
    : MOCK_PROVIDERS;

  // If logged in, route by user type
  if (isLoggedIn && authUser) {
    if (authUser.userType === "provider") return <ProviderHome />;
    if (authUser.userType === "admin") return <AdminDashboard />;
    return <AuthenticatedHome />;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      {/* ========================================
          MAIN CONTENT WITH SIDEBAR + HERO
      ======================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4">
          {/* LEFT SIDEBAR */}
          <aside className="w-52 shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <Menu size={16} className="text-gray-600" />
                <span className="font-semibold text-sm text-gray-900">
                  Top Categories
                </span>
              </div>
              <nav className="divide-y divide-gray-50">
                {SERVICE_CATEGORIES.slice(0, 7).map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id,
                      )
                    }
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                      selectedCategory === category.id
                        ? "bg-(--color-primary-light) text-[var(--color-primary)] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={
                          CATEGORY_IMAGES[category.id] ||
                          "/images/categories/electrical.jpg"
                        }
                        alt={category.label}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CENTER - Hero Slider */}
          <div className="flex-1 min-w-0">
            {/* Mobile Category Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className="w-full flex items-center justify-between bg-white rounded-full shadow-sm px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Menu size={18} className="text-[var(--color-primary)]" />
                  <span className="font-medium text-gray-900 text-sm">
                    {selectedCategory
                      ? SERVICE_CATEGORIES.find(
                          (c) => c.id === selectedCategory,
                        )?.label
                      : "All Categories"}
                  </span>
                </div>
                {showMobileCategories ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {showMobileCategories && (
                <div className="mt-2 bg-white rounded-xl shadow-sm max-h-64 overflow-y-auto">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === cat.id ? null : cat.id,
                        );
                        setShowMobileCategories(false);
                      }}
                      className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm border-b border-gray-50 ${
                        selectedCategory === cat.id
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium"
                          : ""
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={
                            CATEGORY_IMAGES[cat.id] ||
                            "/images/categories/electrical.jpg"
                          }
                          alt={cat.label}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Slider */}
            <div
              className="relative rounded-xl overflow-hidden shadow-lg group"
              onMouseEnter={() => setHeroHover(true)}
              onMouseLeave={() => setHeroHover(false)}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {HERO_SLIDES.map((slide, i) => (
                  <div
                    key={i}
                    className={`min-w-full  h-[385px] bg-gradient-to-r ${slide.bg} flex flex-col md:flex-row items-center`}
                  >
                    <div className="flex-1 p-8 md:p-10">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight whitespace-pre-line">
                        {slide.title}
                      </h1>
                      <p className="text-white/90 mb-6 max-w-md text-sm">
                        {slide.subtitle}
                      </p>
                      <Link
                        href={slide.href}
                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
                      >
                        {slide.cta} <ArrowRight size={16} />
                      </Link>
                    </div>
                    <div className="hidden md:flex md:w-64 lg:w-120 lg:h-full h-full items-end justify-center relative">
                      <div className="w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-t-full flex flex-col relative top-10">
                        <Image
                          src={slide.img}
                          alt="Hero"
                          width={480}
                          height={480}
                          className="w-full h-full object-contain"
                          priority={i === 0}
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hover Arrows */}
              <button
                onClick={prevSlide}
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity duration-300 ${
                  heroHover ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={nextSlide}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity duration-300 ${
                  heroHover ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChevronRight size={22} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === currentSlide ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          TRUST BADGES ROW
      ======================================== */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100 lg:mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Lock,
                title: "Secure Payments",
                desc: "All transactions are verified securely",
              },
              {
                icon: Headphones,
                title: "24/7 Customer Support",
                desc: "We're here whenever you need us",
              },
              {
                icon: BadgeCheck,
                title: "Verified Providers",
                desc: "Providers are carefully vetted for quality",
              },
              {
                icon: CircleDollarSign,
                title: "Discounted Rates",
                desc: "Get the best rates whenever you need",
              },
            ].map((badge, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                  <badge.icon
                    size={20}
                    className="text-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FLASH DEALS
      ======================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                ⚡ Flash Deals
              </h2>
              <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Timer size={12} />
                <span>
                  {String(countdown.hours).padStart(2, "0")}:
                  {String(countdown.minutes).padStart(2, "0")}:
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
            <Link
              href="/deals"
              className="text-sm text-[var(--color-primary)] hover:underline font-medium flex items-center gap-1"
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {MOCK_DEALS.map((deal) => (
              <Link
                key={deal.id}
                href={`/services/${deal.serviceId}`}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative h-32 bg-gradient-to-br from-[var(--color-primary-light)] to-blue-50 flex items-center justify-center">
                  <Image
                    src="/images/promo/home-fumigation.jpg"
                    alt={deal.serviceName}
                    width={320}
                    height={128}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => toggleWishlist(`deal-${deal.id}`, e)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                  >
                    <Heart
                      size={14}
                      className={
                        wishlist.has(`deal-${deal.id}`)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500"
                      }
                    />
                  </button>
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{deal.discount}%
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] line-clamp-1">
                    {deal.serviceName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {deal.provider}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-sm font-bold text-[var(--color-primary)]">
                      ₦{deal.dealPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₦{deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-orange-400 h-1.5 rounded-full"
                        style={{
                          width: `${(deal.soldSlots / deal.totalSlots) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {deal.soldSlots}/{deal.totalSlots} sold
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURED PRODUCTS ROW
      ======================================== */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 — Drill Set (Teal/Navy) */}
            <Link
              href="/products"
              className="group relative bg-gradient-to-br from-[#005D80] to-[#00131A] rounded-xl overflow-hidden p-5 min-h-[140px] hover:shadow-lg transition-shadow"
            >
              <button
                onClick={(e) => toggleWishlist("fp-1", e)}
                className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <Heart
                  size={14}
                  className={
                    wishlist.has("fp-1")
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }
                />
              </button>
              <span className="absolute top-3 right-3 bg-[var(--color-secondary)] text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                HOT DEAL
              </span>
              <div className="relative z-10 flex gap-2 items-start h-full">
                <div className="flex-1">
                  <h3 className="text-white text-md font-medium mb-2 line-clamp-2 leading-snug">
                    Generic Multifunctional Electric Drill Set
                  </h3>
                  <p className="text-white font-bold text-base mb-3">
                    Price: ₦8,300
                  </p>
                  <span className="inline-flex items-center gap-1 text-[var(--color-secondary)] text-md font-semibold hover:underline">
                    Order Now
                  </span>
                </div>
                <div className="w-40 h-40 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src="/images/promo/drillset.png"
                    alt="Electric Drill Set"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>

            {/* Card 2 — Home Cleaner (Purple) */}
            <Link
              href="/products"
              className="group relative bg-gradient-to-br from-[#6B2FA0] to-[#2D1050] rounded-xl overflow-hidden p-5 min-h-[140px] hover:shadow-lg transition-shadow"
            >
              <button
                onClick={(e) => toggleWishlist("fp-2", e)}
                className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <Heart
                  size={14}
                  className={
                    wishlist.has("fp-2")
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }
                />
              </button>
              <div className="relative z-10 flex gap-2 items-start h-full">
                <div className="flex-1">
                  <h3 className="text-white text-md font-medium mb-2 line-clamp-2 leading-snug">
                    Professional Home Self Use Low Carbon Cleaner
                  </h3>
                  <p className="text-white font-bold text-base mb-3">
                    Price: ₦5,800
                  </p>
                  <span className="inline-flex items-center gap-1 text-[var(--color-secondary)] text-md font-semibold hover:underline">
                    Order Now
                  </span>
                </div>
                <div className="w-40 h-40 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src="/images/categories/gardening.jpg"
                    alt="Home Cleaner"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>

            {/* Card 3 — Blender (Orange/Brown) */}
            <Link
              href="/products"
              className="group relative bg-gradient-to-br from-[#B8430E] to-[#3D1500] rounded-xl overflow-hidden p-5 min-h-[140px] hover:shadow-lg transition-shadow"
            >
              <button
                onClick={(e) => toggleWishlist("fp-3", e)}
                className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <Heart
                  size={14}
                  className={
                    wishlist.has("fp-3")
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }
                />
              </button>
              <span className="absolute top-3 right-3 bg-[var(--color-secondary)] text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                BEST SELLER
              </span>
              <div className="relative z-10 flex gap-2 items-start h-full">
                <div className="flex-1">
                  <h3 className="text-white text-md font-medium mb-2 line-clamp-2 leading-snug">
                    SILVER CREST 2L Industrial 850W Food Crusher Blender
                  </h3>
                  <p className="text-white font-bold text-base mb-3">
                    Price: ₦8,300
                  </p>
                  <span className="inline-flex items-center gap-1 text-[var(--color-secondary)] text-md font-semibold hover:underline">
                    Order Now
                  </span>
                </div>
                <div className="w-40 h-40 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src="/images/categories/technology.jpg"
                    alt="Industrial Blender"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          TOP CATEGORIES SECTION
      ======================================== */}
      <Suspense
        fallback={
          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto h-40 animate-pulse rounded-xl bg-gray-100" />
          </section>
        }
      >
        <LazyTopCategoriesSection topCategoryProviders={TOP_CATEGORY_PROVIDERS} />
      </Suspense>

      {/* ========================================
          AVAILABLE NOW SECTION
      ======================================== */}
      <Suspense
        fallback={
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto h-56 animate-pulse rounded-xl bg-gray-100" />
          </section>
        }
      >
        <LazyAvailableNowSection
          providers={filteredProviders}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
      </Suspense>

      {/* ========================================
          TOP RATED PROVIDERS
      ======================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Top Rated Providers
            </h2>
            <Link
              href="/providers"
              className="flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm hover:underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_PROVIDERS.filter(
              (p) => p.badge === "Top Rated" || p.rating >= 4.7,
            )
              .slice(0, 4)
              .map((provider) => (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
                >
                  <div className="relative px-3 pt-3 flex items-center justify-between">
                    <button
                      onClick={(e) => toggleWishlist(`tr-${provider.id}`, e)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        size={14}
                        className={
                          wishlist.has(`tr-${provider.id}`)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }
                      />
                    </button>
                    {provider.badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {provider.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-3">
                      <User size={36} className="text-gray-500" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center border-2 border-white">
                        <BadgeCheck size={12} className="text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 mb-1">
                      {provider.category}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900">
                      {provider.name.split(" ")[0]}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {provider.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({provider.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <MapPin size={10} />
                      <span>2.4 km</span>
                    </div>
                  </div>
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400">From</p>
                      <p className="font-bold text-sm text-gray-900">₦25,000</p>
                    </div>
                    <span className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
                      Book Now
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FLASH DEALS SECTION
      ======================================== */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[var(--color-primary)] rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <Timer size={22} className="text-white" />
                <span className="text-white font-bold text-base">
                  Flash Deals
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xs hidden sm:inline">Time Left:</span>
                <div className="flex gap-1">
                  <span className="bg-black/30 px-2 py-1 rounded text-xs font-mono">
                    {String(countdown.hours).padStart(2, "0")}h
                  </span>
                  <span className="bg-black/30 px-2 py-1 rounded text-xs font-mono">
                    {String(countdown.minutes).padStart(2, "0")}m
                  </span>
                  <span className="bg-black/30 px-2 py-1 rounded text-xs font-mono">
                    {String(countdown.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>
              <Link
                href="/deals"
                className="text-white text-sm hover:underline flex items-center gap-1"
              >
                See All <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          PROMOTIONAL BANNERS
      ======================================== */}
      <section className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative bg-gradient-to-r from-[#1a3a2a] to-[#245e37] rounded-xl overflow-hidden p-6 md:p-8 min-h-[180px] group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative z-10">
                <span className="inline-block bg-[var(--color-secondary)] text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  OFFICIAL STORE
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Professional Cleaning
                </h3>
                <p className="text-white/80 text-sm mb-4 max-w-xs">
                  Top-rated cleaning professionals at your doorstep. Book now
                  and get 20% off!
                </p>
                <Link
                  href="/services?category=cleaning"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Book Now <ArrowRight size={16} />
                </Link>
              </div>
              <Image
                src="/images/banner/cleaning-provider.png"
                alt="Cleaning"
                width={100}
                height={100}
                className="absolute top-8 right-4 w-80 h-50 rounded-lg"
                loading="lazy"
              />

              <div className="absolute top-4 right-4 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
            </div>

            <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl overflow-hidden p-6 md:p-8 min-h-[180px] group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  EARN WITH HANDI
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Become a Service Provider
                </h3>
                <p className="text-white/80 text-sm mb-4 max-w-xs">
                  Join thousands of verified professionals. Set your own
                  schedule and grow your business.
                </p>
                <Link
                  href="/become-provider"
                  className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
              <Image
                src="/images/banner/banner-two.png"
                alt="Provider"
                width={100}
                height={100}
                className="absolute top-8 right-4 w-50 h-50 rounded-lg"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          POPULAR SERVICES
      ======================================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Popular Services
            </h2>
            <Link
              href="/services"
              className="flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm hover:underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                name: "Deep House Cleaning",
                price: "₦15,000",
                originalPrice: "₦20,000",
                tag: "20% OFF",
                img: "/images/categories/gardening.jpg",
              },
              {
                name: "AC Installation & Repair",
                price: "₦12,000",
                originalPrice: "₦18,000",
                tag: "HOT",
                img: "/images/categories/electrical.jpg",
              },
              {
                name: "Hair Styling & Makeup",
                price: "₦8,000",
                originalPrice: null,
                tag: "TRENDING",
                img: "/images/categories/beauty.jpg",
              },
              {
                name: "Plumbing Services",
                price: "₦10,000",
                originalPrice: "₦15,000",
                tag: "DEAL",
                img: "/images/categories/plumbing.jpg",
              },
              {
                name: "Generator Repair",
                price: "₦25,000",
                originalPrice: null,
                tag: "NEW",
                img: "/images/categories/technology.jpg",
              },
            ].map((service, i) => (
              <Link
                key={i}
                href="/services"
                className="group bg-gray-50 rounded-xl p-4 hover:shadow-md hover:bg-white transition-all border border-transparent hover:border-gray-200"
              >
                <div className="relative mb-3">
                  <div className="w-full h-28 rounded-lg overflow-hidden">
                    <Image
                      src={service.img}
                      alt={service.name}
                      width={200}
                      height={112}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  {service.tag && (
                    <span
                      style={{ backgroundColor: getTagColor(service.tag) }}
                      className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                    >
                      {service.tag}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {service.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--color-primary)]">
                    {service.price}
                  </span>
                  {service.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {service.originalPrice}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS
      ======================================== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-500 mb-10">Get started in 3 simple steps</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                num: 1,
                title: "Search & Browse",
                desc: "Find the service you need from thousands of verified providers",
              },
              {
                num: 2,
                title: "Book & Pay",
                desc: "Schedule a convenient time and pay securely through the app",
              },
              {
                num: 3,
                title: "Get It Done",
                desc: "Receive quality service and rate your experience",
              },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 mt-8 text-[var(--color-primary)] font-medium hover:underline"
          >
            Learn more about how HANDI works <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ========================================
          TESTIMONIALS
      ======================================== */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Real reviews from satisfied customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Chidinma O.",
                location: "Lagos",
                text: "Found an amazing electrician within minutes. Very professional service!",
                rating: 5,
              },
              {
                name: "Emeka A.",
                location: "Abuja",
                text: "The beauty salon I found through HANDI exceeded my expectations. Highly recommend!",
                rating: 5,
              },
              {
                name: "Blessing I.",
                location: "Port Harcourt",
                text: "Quick response, fair pricing, and quality work. HANDI is a game changer!",
                rating: 5,
              },
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          APP DOWNLOAD
      ======================================== */}
      <section id="download" className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 p-8 md:p-12 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Download the HANDI App
                </h2>
                <p className="text-white/90 mb-6">
                  Get the full experience. Book services, track your provider,
                  and pay securely—all from your phone.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setDownloadModalOpen(true)}
                    className="cursor-pointer inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full hover:bg-gray-900 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.27 2.33-1.96 4.15-3.74 4.25z" />
                    </svg>
                    App Store
                  </button>
                  <button
                    onClick={() => setDownloadModalOpen(true)}
                    className="cursor-pointer inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full hover:bg-gray-900 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.324l-2.302 2.303L5.864 2.658z" />
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
              <div className="md:w-72 h-48 md:h-64 relative flex items-center justify-center">
                <Image
                  src="/images/handiapp-preview.png"
                  alt="HANDI App"
                  width={190}
                  height={190}
                  className="rounded-3xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          BOTTOM CTA
      ======================================== */}
      <section className="relative overflow-hidden bg-[var(--color-primary)] py-16 px-4">
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/85 mb-8 text-lg">
            Join thousands of satisfied customers using HANDI for trusted,
            professional services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Search size={20} /> Find Services
            </Link>
            <Link
              href="/become-provider"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              <UserPlus size={20} /> Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ComingSoonModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Download App"
        message="The HANDI mobile app is coming soon! We'll notify you when it's available on App Store and Google Play."
      />
    </main>
  );
}
