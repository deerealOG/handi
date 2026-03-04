"use client";

import { CATEGORIES } from "@/data/landingData";
import { MOCK_FLASH_DEALS, MOCK_PRODUCTS } from "@/data/mockApi";
import { ArrowRight, Clock, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FeaturedSectionProps {
  router: any;
}

export default function FeaturedSection({ router }: FeaturedSectionProps) {
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 45,
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
    <>
      {/* Categories Grid */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Categories</h2>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-(--color-primary) font-medium cursor-pointer"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push("/login")}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-(--color-primary-light) flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight truncate w-full">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
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
            onClick={() => router.push("/login")}
            className=" cursor-pointer px-5 py-2.5 bg-white text-(--color-primary) text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Claim Offer
          </button>
          <div className="absolute -right-4 -bottom-6 opacity-10 text-[120px]">
            🎁
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Trending Products</h2>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1"
          >
            See All <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {MOCK_PRODUCTS.slice(0, 7).map((p) => (
            <div
              key={p.id}
              onClick={() => router.push("/login")}
              className="flex flex-col justify-between min-w-[160px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all shrink-0 overflow-hidden cursor-pointer"
            >
              <div className="h-32 bg-gray-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={160}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-(--color-primary)">
                  ₦{p.price.toLocaleString()}
                </p>
                {p.originalPrice && (
                  <p className="text-[10px] text-gray-400 line-through">
                    ₦{p.originalPrice.toLocaleString()}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-gray-500">
                    {p.rating} ({p.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/login");
                    }}
                    className="cursor-pointer text-xs font-semibold text-white flex items-center gap-1 bg-(--color-primary) px-3 py-2 rounded-full mt-2"
                  >
                    Buy Now <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/login");
                    }}
                    className="cursor-pointer text-xs font-semibold text-gray-900 flex items-center gap-1 bg-gray-100 border border-gray-200 px-3 py-2 rounded-full mt-2"
                  >
                    Add to Cart <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ Flash Deals */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-lg font-bold text-gray-900">Flash Deals</h2>
            <div className="flex items-center gap-1 ml-2 px-2.5 py-1 bg-red-50 rounded-full">
              <Clock size={12} className="text-red-500" />
              <span className="text-xs font-bold text-red-600 tabular-nums">
                {String(countdown.hours).padStart(2, "0")}:
                {String(countdown.minutes).padStart(2, "0")}:
                {String(countdown.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-xs font-semibold text-(--color-primary) flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
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
                    onClick={() => router.push("/login")}
                    className="px-2 py-1.5 bg-(--color-primary) text-white text-[10px] font-bold rounded-full hover:opacity-90 whitespace-nowrap"
                  >
                    Claim Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
