"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_FLASH_DEALS, MOCK_PRODUCTS } from "@/data/mockApi";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Mail,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Sort options for deals
const SORT_OPTIONS = [
  { value: "discount", label: "Biggest Discount" },
  { value: "popular", label: "Most Popular" },
  { value: "ending", label: "Ending Soon" },
  { value: "rated", label: "Top Rated" },
];

// Badge component
const Badge = ({ label, color }: { label: string; color: string }) => {
  const colors: Record<string, string> = {
    red: "bg-red-500 text-white",
    orange: "bg-orange-500 text-white",
    green: "bg-emerald-500 text-white",
    blue: "bg-blue-500 text-white",
  };
  return (
    <span
      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${colors[color] || colors.red}`}
    >
      {label}
    </span>
  );
};

export default function DealsPage() {
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 45,
  });
  const [sortBy, setSortBy] = useState("discount");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Split deals into flash deals (top 6) and service deals (rest)
  const flashDeals = MOCK_FLASH_DEALS.slice(0, 8);
  const serviceDeals = MOCK_FLASH_DEALS.slice(8);
  const productDeals = MOCK_PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);

  // Sort service deals
  const sortedServiceDeals = [...serviceDeals].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discount - a.discount;
      case "popular":
        return b.booked - a.booked;
      case "rated":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ===== HERO BANNER ===== */}
      <section className="relative bg-linear-to-br from-emerald-700 via-emerald-600 to-emerald-800 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-yellow-300/40 rounded-full animate-pulse" />
          <div
            className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-yellow-200/30 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="text-center lg:text-left max-w-xl">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
                <Zap size={20} className="text-yellow-300" />
                <span className="text-yellow-200 text-sm font-semibold tracking-wide uppercase">
                  Limited Time Only
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                HANDI <span className="text-yellow-300">Flash Deals</span>
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mb-6 leading-relaxed">
                Save big on popular services and products for a limited time. Up
                to <span className="font-bold text-yellow-200">50% off</span> on
                top-rated services!
              </p>
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-6">
                <Badge label="🔥 Up to 50% off" color="red" />
                <Badge label="⭐ Exclusive discounts" color="orange" />
                <Badge label="⏰ Limited-time" color="blue" />
              </div>
              <Link
                href="#flash-deals"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 rounded-full font-bold text-sm hover:bg-yellow-50 transition-colors shadow-lg shadow-emerald-900/20"
              >
                Browse Deals <ArrowRight size={16} />
              </Link>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20">
              <p className="text-sm font-semibold text-emerald-200 mb-4 text-center flex items-center gap-2 justify-center">
                <Clock size={16} className="text-yellow-300" />
                Flash Deals End In
              </p>
              <div className="flex gap-3 sm:gap-4">
                {[
                  { value: countdown.hours, label: "HOURS" },
                  { value: countdown.minutes, label: "MINS" },
                  { value: countdown.seconds, label: "SECS" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="bg-black/30 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-center min-w-[60px] sm:min-w-[70px]"
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                      {String(t.value).padStart(2, "0")}
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-white/50 font-semibold mt-1 tracking-widest">
                      {t.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FLASH DEALS CAROUSEL ===== */}
      <section
        id="flash-deals"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Flame size={22} className="text-red-500" />
              Flash Deals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Limited-time offers on trending services
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCarousel("left")}
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {flashDeals.map((deal) => {
            const urgencyLevel =
              deal.booked > 150 ? "hot" : deal.booked > 80 ? "trending" : "new";
            const claimedPct = Math.min((deal.booked / 250) * 100, 95);
            return (
              <div
                key={deal.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 min-w-[280px] sm:min-w-[300px] flex flex-col snap-start group"
              >
                <div className="relative h-40 bg-emerald-50 overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    -{deal.discount}%
                  </span>
                  {urgencyLevel === "hot" && (
                    <Badge label="🔥 Hot Deal" color="red" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {deal.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{deal.provider}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-semibold text-gray-700">
                      {deal.rating}
                    </span>
                    <span className="mx-0.5">·</span>
                    <span>{deal.booked} booked</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-primary">
                        ₦{deal.sale.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₦{deal.original.toLocaleString()}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                      <div
                        className={`h-2 rounded-full transition-all ${claimedPct > 70 ? "bg-red-500" : "bg-orange-400"}`}
                        style={{ width: `${claimedPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3">
                      {Math.round(claimedPct)}% claimed ·{" "}
                      {urgencyLevel === "hot" ? "Ending soon" : "Limited slots"}
                    </p>
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors"
                    >
                      Book Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== SORTING BAR ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== SERVICE DEALS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag size={22} className="text-primary" />
            Service Deals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Book trusted professionals at discounted prices
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedServiceDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-36 bg-emerald-50 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{deal.discount}%
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {deal.name}
                </h3>
                <p className="text-xs text-gray-500 mb-1.5">{deal.provider}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700">
                    {deal.rating}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">
                    Available Tomorrow
                  </span>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-primary">
                      ₦{deal.sale.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₦{deal.original.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-1 bg-primary text-white py-2 rounded-full text-xs font-semibold hover:bg-primary transition-colors"
                  >
                    Book Now <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCT DEALS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary" />
            Product Deals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Popular products at reduced prices
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productDeals.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="relative h-36 bg-gray-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
                {p.originalPrice && (
                  <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {p.seller}
                </p>
                <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700">{p.rating}</span>
                  <span>({p.reviews})</span>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-gray-900">
                      ₦{p.price.toLocaleString()}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₦{p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${p.id}`}
                      className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white py-2 rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Buy Now
                    </Link>
                    <button className="py-2 px-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors cursor-pointer">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SEASONAL PROMOTIONS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={22} className="text-purple-500" />
            Seasonal Promotions
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Home Improvement Week",
              desc: "Save up to 30% on home repair, painting, and renovation services.",
              gradient: "from-blue-600 to-blue-800",
              icon: "🏠",
              cta: "Explore Offers",
            },
            {
              title: "Holiday Service Discounts",
              desc: "Get your home ready for the holidays with special cleaning and decoration deals.",
              gradient: "from-purple-600 to-purple-800",
              icon: "🎄",
              cta: "View Deals",
            },
            {
              title: "Back-to-Work Special",
              desc: "Office setup, IT support, and workspace services discounted this month.",
              gradient: "from-orange-500 to-red-600",
              icon: "💼",
              cta: "Get Started",
            },
          ].map((promo, i) => (
            <div
              key={i}
              className={`bg-linear-to-br ${promo.gradient} rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden group hover:shadow-xl transition-shadow`}
            >
              <div className="absolute -top-6 -right-6 text-7xl opacity-10">
                {promo.icon}
              </div>
              <div className="relative">
                <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed mb-5">
                  {promo.desc}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors border border-white/30"
                >
                  {promo.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== RECOMMENDED DEALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={22} className="text-primary" />
            Recommended for You
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Deals picked based on popular bookings near you
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_FLASH_DEALS.slice(0, 4).map((deal) => (
            <Link
              key={deal.id}
              href="/login"
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative h-28 sm:h-32 bg-emerald-50 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  -{deal.discount}%
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                  <Star size={9} className="fill-yellow-400 text-yellow-400" />
                  {deal.rating} · {deal.provider}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-sm font-bold text-primary">
                    ₦{deal.sale.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through">
                    ₦{deal.original.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER / APP CTA ===== */}
      <section className="text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Mail size={32} className="mx-auto text-primary mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Never Miss a Deal
            </h2>
            <p className="text-gray-900 mb-6">
              Get notified about exclusive discounts and new offers before
              anyone else.
            </p>
            {subscribed ? (
              <div className="bg-gray-200 border border-gray-300 rounded-2xl p-6">
                <p className="text-gray-900 font-semibold">
                  🎉 You&apos;re subscribed!
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  Watch your inbox for exclusive deals.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 bg-gray-200 border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                />
                <button
                  onClick={() => {
                    if (email) setSubscribed(true);
                  }}
                  className="px-8 py-3.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary transition-colors cursor-pointer shadow-lg shadow-primary/30"
                >
                  Subscribe
                </button>
              </div>
            )}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-900 mb-4">
                Download the HANDI app for exclusive deals
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-6 py-2.5 bg-gray-200 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer">
                  🍎 App Store
                </button>
                <button className="px-6 py-2.5 bg-gray-200 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer">
                  ▶️ Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
