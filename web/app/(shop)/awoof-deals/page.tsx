"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_FLASH_DEALS, MOCK_PRODUCTS } from "@/data/mockApi";
import { Zap, Star, ShoppingCart, Gift, ChevronRight, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AwoofDealsPage() {
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((p) => {
        if (p.seconds > 0) return { ...p, seconds: p.seconds - 1 };
        if (p.minutes > 0) return { ...p, minutes: p.minutes - 1, seconds: 59 };
        if (p.hours > 0) return { hours: p.hours - 1, minutes: 59, seconds: 59 };
        return p;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const awoofServices = MOCK_FLASH_DEALS.filter((d) => d.discount >= 30);
  const awoofProducts = MOCK_PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price * 1.3).slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-red-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-md mb-4">
            <Gift size={16} className="text-yellow-200" />
            <span className="text-yellow-100 text-sm font-semibold">MEGA SAVINGS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Awoof <span className="text-yellow-300">Deals!</span> 🎉
          </h1>
          <p className="text-white/80 max-w-xl mx-auto mb-6">Unbelievable prices on the best services and products. Grab them before they're gone!</p>
          {/* Countdown */}
          <div className="flex gap-3 justify-center mb-6">
            {[
              { v: countdown.hours, l: "HRS" },
              { v: countdown.minutes, l: "MIN" },
              { v: countdown.seconds, l: "SEC" },
            ].map((t) => (
              <div key={t.l} className="bg-black/30 rounded-md px-4 py-3 text-center min-w-[60px]">
                <span className="text-2xl font-extrabold font-mono text-white">{String(t.v).padStart(2, "0")}</span>
                <p className="text-[9px] text-white/50 font-semibold mt-0.5 tracking-widest">{t.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awoof Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
          <Flame size={20} className="text-red-500" /> Service Awoof Deals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {awoofServices.map((deal) => (
            <Link key={deal.id} href="/login" className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{deal.discount}%</span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{deal.name}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{deal.provider}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {deal.rating}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-(--color-primary)">₦{deal.sale.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 line-through">₦{deal.original.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Awoof Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
          <ShoppingCart size={20} className="text-orange-500" /> Product Awoof Deals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {awoofProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                {p.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₦{p.price.toLocaleString()}</span>
                  {p.originalPrice && <span className="text-[10px] text-gray-400 line-through">₦{p.originalPrice.toLocaleString()}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
