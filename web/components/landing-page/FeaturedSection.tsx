//components/home/FeaturedSection.tsx
"use client";

import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/landingData";
import { MOCK_FLASH_DEALS, MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockApi";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Calendar,
  Bug,
  Building2,
  Camera,
  Car,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Fuel,
  Heart,
  Laptop,
  Paintbrush,
  Scissors,
  Shield,
  ShoppingCart,
  Sparkles,
  SprayCan,
  Star,
  Thermometer,
  TreePine,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Explicit map instead of `import *` to avoid Turbopack resolving 1000+ exports
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Zap,
  Droplets,
  Sparkles,
  SprayCan,
  Car,
  Building2,
  Paintbrush,
  Laptop,
  ChefHat,
  Scissors,
  Camera,
  Shield,
  Thermometer,
  Fuel,
  Bug,
  TreePine,
};

interface FeaturedSectionProps {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
}

// Reusable horizontal scroll container with arrow buttons
function ScrollSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2"
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>
      )}
      <div
        ref={scrollRef}
        className={`flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 ${className}`}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-1/2"
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>
      )}
    </div>
  );
}

// Isolated component — only this re-renders every second, not the full section
function CountdownTimer({
  initialHours = 5,
  initialMinutes = 30,
  initialSeconds = 45,
}: {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}) {
  const [countdown, setCountdown] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

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

  return (
    <span className="text-xs font-bold text-red-600 tabular-nums">
      {String(countdown.hours).padStart(2, "0")}:
      {String(countdown.minutes).padStart(2, "0")}:
      {String(countdown.seconds).padStart(2, "0")}
    </span>
  );
}

export default function FeaturedSection({ router }: FeaturedSectionProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useCart();

  // Sort services by rating (desc) then reviews (desc) — best-rated & most-reviewed first
  const recommendedServices = [...MOCK_SERVICES].sort(
    (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  );

  return (
    <>

      {/* Trending Products - Horizontal Scroll with Arrows */}
      <section className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-2">
            Shop
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending Products</h2>
          <p className="text-sm text-gray-500 mt-1">Popular products used by professionals and customers.</p>
        </div>
        <ScrollSection>
          {MOCK_PRODUCTS.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/products/${p.id}`)}
              className="w-[200px] max-w-[45vw] bg-white rounded-2xl shadow-sm snap-start border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col shrink-0 cursor-pointer group"
            >
              {/* Image */}
              <div className="h-28 bg-gray-100 overflow-hidden relative">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
                >
                  <Heart size={12} className={isInWishlist(p.id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </button>
              </div>
              {/* Body */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">
                  {p.name}
                </p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-sm font-bold text-primary">
                    ₦{p.price.toLocaleString()}
                  </span>
                  {p.originalPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₦{p.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-auto">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-gray-500">
                    {p.rating} ({p.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p.id, "product", 1, p.quantity);
                    }}
                    className="flex-1 py-2 bg-primary text-white text-[10px] font-bold rounded-full hover:bg-emerald-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    Add to Cart <ShoppingCart size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ScrollSection>
      </section>

      {/* Recommended Services */}
      <section className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-green-50 text-primary text-xs font-bold rounded-full mb-2">
            Featured
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Recommended Services
          </h2>
          <p className="text-sm text-gray-500 mt-1">Popular services chosen for quality, value, and convenience.</p>
        </div>
        <ScrollSection>
          {recommendedServices.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/services/${s.id}`)}
              className="w-[180px] max-w-[45vw] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group cursor-pointer flex flex-col shrink-0"
            >
              <div className="w-full h-28 bg-gray-200 relative overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(s.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
                >
                  <Heart size={12} className={isInWishlist(s.id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </button>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                  {s.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                  {s.provider}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-primary">
                    ₦{s.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    {s.rating}
                  </span>
                </div>
                <div className="mt-auto pt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/services/${s.id}`); }}
                    className="w-full cursor-pointer text-[10px] font-bold text-white flex items-center justify-center gap-1 bg-primary py-2 rounded-full hover:bg-emerald-700 transition-colors"
                  >
                    Book Now <Calendar size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ScrollSection>
      </section>

      {/* ⚡ Flash Deals - Horizontal Scroll with Arrows */}
      <section className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⚡</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Flash Deals</h2>
            <p className="text-sm text-gray-500 mt-1">Limited-time offers on popular services.</p>
          </div>
          <div className="flex items-center gap-1 ml-auto px-2.5 py-1 bg-red-50 rounded-full">
            <Clock size={12} className="text-red-500" />
            <CountdownTimer />
          </div>
        </div>
        <ScrollSection className="snap-x snap-mandatory">
          {MOCK_FLASH_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="w-[160px] max-w-[45vw] bg-white rounded-2xl shadow-sm snap-start border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col shrink-0"
            >
              <div className="h-24 bg-gray-100 overflow-hidden relative">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{deal.discount}%
                </span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-sm font-bold text-gray-900 line-clamp-1">
                  {deal.name}
                </p>
                <p className="text-[10px] text-gray-500 mb-2">
                  {deal.provider}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-(--color-primary)">
                    ₦{deal.sale.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through">
                    ₦{deal.original.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <Star
                      size={10}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-[10px] text-gray-500">
                      {deal.rating} • {deal.booked} booked
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/login?redirect=/deals?deal=${deal.id}`)
                    }
                    className="px-2 py-1.5 bg-(--color-primary) text-white text-[10px] font-bold rounded-full hover:opacity-90 whitespace-nowrap"
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ScrollSection>
      </section>

      {/* Promo Banner */}
      <section className=" py-6 sm:py-8 text-white relative overflow-hidden mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 bg-linear-to-r from-(--color-primary) to-(--color-primary-dark) rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            20% Off First Booking 🎉
          </h3>
          <p className="text-sm text-white/80 mb-4">
            Get professional help for less. Book your first service today and
            save!
          </p>
          <button
            onClick={() => router.push("/login?redirect=/deals")}
            className=" cursor-pointer px-5 py-2.5 bg-white text-(--color-primary) text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Claim Offer
          </button>
          <div className="absolute -right-4 -bottom-6 opacity-10 text-[120px]">
            🎁
          </div>
        </div>
      </section>

      {/* Categories - Horizontal Scroll */}
      <section className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-(--color-primary-light) text-(--color-primary) text-xs font-bold rounded-full mb-2">
            Browse
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Explore Services by Category</h2>
          <p className="text-sm text-gray-500 mt-1">Browse the most requested services and discover professionals near you.</p>
        </div>
        <ScrollSection>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/services?category=${cat.id}`)}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group shrink-0 min-w-[80px]"
            >
              <div className="w-12 h-12 rounded-xl bg-(--color-primary-light) flex items-center justify-center group-hover:scale-110 transition-transform">
                {(() => {
                  const IconComponent = CATEGORY_ICONS[cat.icon];
                  return IconComponent ? (
                    <IconComponent
                      size={24}
                      className="text-(--color-primary)"
                    />
                  ) : (
                    <span className="text-lg">📦</span>
                  );
                })()}
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight truncate w-full">
                {cat.label}
              </span>
            </button>
          ))}
        </ScrollSection>
      </section>





    </>
  );
}
