"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_PRODUCTS, MOCK_FLASH_DEALS } from "@/data/mockApi";
import { Tag, Star, ShoppingCart, Percent, Clock, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function ClearanceSalePage() {
  const { addToCart } = useCart();
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });

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

  // Clearance items — big discounts
  const clearanceProducts = MOCK_PRODUCTS.filter(
    (p) => p.originalPrice && p.originalPrice > p.price * 1.4
  ).slice(0, 12);
  const clearanceServices = MOCK_FLASH_DEALS.filter((d) => d.discount >= 25).slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-yellow-500 via-amber-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-md mb-4">
            <Sparkles size={16} className="text-yellow-200" />
            <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wider">MASSIVE CLEARANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Clearance <span className="text-yellow-200">Sale!</span> 🏷️
          </h1>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Everything must go! Grab unbeatable prices on products and services before stock runs out.
          </p>
          {/* Countdown */}
          <div className="flex gap-3 justify-center mb-4">
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
          <p className="text-white/60 text-sm">Deals refresh daily — don&apos;t miss out!</p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Percent size={18} />, value: "Up to 60%", label: "Off Select Items", color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300" },
            { icon: <ShoppingCart size={18} />, value: `${clearanceProducts.length}+`, label: "Products on Sale", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300" },
            { icon: <Tag size={18} />, value: `${clearanceServices.length}+`, label: "Services Discounted", color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300" },
            { icon: <Clock size={18} />, value: "Limited", label: "Time Only", color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-md p-4 text-center`}>
              <div className="flex items-center justify-center mb-1">{stat.icon}</div>
              <p className="text-lg font-extrabold">{stat.value}</p>
              <p className="text-[10px] font-medium opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clearance Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShoppingCart size={20} className="text-amber-500" /> Clearance Products
          </h2>
          <Link href="/products" className="text-sm text-(--color-primary) font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {clearanceProducts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                {p.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded">
                  CLEARANCE
                </span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{p.name}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.seller}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})
                </div>
                <div className="mt-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₦{p.price.toLocaleString()}</span>
                    {p.originalPrice && <span className="text-[10px] text-gray-400 line-through">₦{p.originalPrice.toLocaleString()}</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/products/${p.id}`} className="flex-1 inline-flex items-center justify-center bg-(--color-primary) text-white py-2 rounded-md text-xs font-semibold hover:opacity-90">
                      View
                    </Link>
                    <button onClick={() => addToCart(p.id, "product", 1)} className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 rounded-md hover:bg-amber-100 cursor-pointer">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clearance Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Tag size={20} className="text-orange-500" /> Clearance Services
          </h2>
          <Link href="/services" className="text-sm text-(--color-primary) font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {clearanceServices.map((s) => (
            <Link key={s.id} href={`/services/${s.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{s.discount}%</span>
                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded">CLEARANCE</span>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{s.name}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{s.provider}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {s.rating}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-(--color-primary)">₦{s.sale.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 line-through">₦{s.original.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-extrabold text-white mb-2">Don&apos;t Miss These Deals!</h3>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">New clearance items are added every day. Follow us to get notified when prices drop even further.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products" className="px-6 py-3 bg-white text-amber-600 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm">
              Browse All Products
            </Link>
            <Link href="/services" className="px-6 py-3 bg-white/15 border border-white/30 text-white font-bold rounded-full hover:bg-white/25 transition-colors text-sm">
              Browse All Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
