"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_PROVIDERS, MOCK_PRODUCTS, MOCK_FLASH_DEALS } from "@/data/mockApi";
import { Star, Trophy, Crown, TrendingUp, Award, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TopPicksPage() {
  const [category, setCategory] = useState<"all" | "providers" | "products" | "services">("all");

  // Top rated items
  const topProviders = [...MOCK_PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const topProducts = [...MOCK_PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const topServices = [...MOCK_FLASH_DEALS].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-amber-500 via-orange-500 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-md mb-4">
            <Trophy size={16} className="text-yellow-200" />
            <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wider">CURATED FOR YOU</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Top Picks ⭐</h1>
          <p className="text-white/80 max-w-xl mx-auto mb-6">The highest-rated providers, products, and services on HANDI — handpicked for quality and trust.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["all", "providers", "products", "services"] as const).map((v) => (
            <button key={v} onClick={() => setCategory(v)}
              className={`px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                category === v ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Top Providers */}
      {(category === "all" || category === "providers") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <Crown size={20} className="text-amber-500" /> Top Rated Providers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topProviders.map((p, i) => (
              <Link key={p.id} href={`/providers/${p.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group relative">
                {i < 3 && <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-amber-500 text-white flex items-center justify-center text-xs font-bold rounded-md">#{i+1}</div>}
                <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image src={p.image || "/images/placeholder.webp"} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.category}</p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {p.rating} ({p.reviews} reviews)
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Products */}
      {(category === "all" || category === "products") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <Award size={20} className="text-blue-500" /> Top Rated Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topProducts.map((p, i) => (
              <Link key={p.id} href={`/products/${p.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group relative">
                {i < 3 && <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-blue-500 text-white flex items-center justify-center text-xs font-bold rounded-md">#{i+1}</div>}
                <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₦{p.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Services */}
      {(category === "all" || category === "services") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <ThumbsUp size={20} className="text-emerald-500" /> Top Rated Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topServices.map((s, i) => (
              <Link key={s.id} href="/login" className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group relative">
                {i < 3 && <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-emerald-500 text-white flex items-center justify-center text-xs font-bold rounded-md">#{i+1}</div>}
                <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{s.name}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{s.provider}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-(--color-primary)">₦{s.sale.toLocaleString()}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <Star size={9} className="fill-amber-400" /> {s.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
