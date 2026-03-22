"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_PROVIDERS, MOCK_PRODUCTS, MOCK_FLASH_DEALS } from "@/data/mockApi";
import { Clock, Star, Sparkles, ChevronRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NewArrivalsPage() {
  const [view, setView] = useState<"all" | "providers" | "products" | "services">("all");

  const newProviders = MOCK_PROVIDERS.slice(-8);
  const newProducts = MOCK_PRODUCTS.slice(-8);
  const newServices = MOCK_FLASH_DEALS.slice(-8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-violet-600 to-purple-800 overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-md mb-4">
            <Sparkles size={16} className="text-yellow-200" />
            <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wider">Fresh on HANDI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">New Arrivals</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-6">Check out the latest providers, products, and services just added to the platform.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(["all", "providers", "products", "services"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                view === v ? "bg-(--color-primary) text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* New Providers */}
      {(view === "all" || view === "providers") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <BadgeCheck size={20} className="text-violet-500" /> New Providers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProviders.map((p) => (
              <Link key={p.id} href={`/providers/${p.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image src={p.image || "/images/placeholder.webp"} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-violet-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">NEW</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.category}</p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Products */}
      {(view === "all" || view === "products") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <Clock size={20} className="text-blue-500" /> New Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">NEW</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₦{p.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Services */}
      {(view === "all" || view === "services") && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-emerald-500" /> New Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newServices.map((s) => (
              <Link key={s.id} href="/login" className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">NEW</span>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{s.name}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{s.provider}</p>
                  <span className="text-sm font-bold text-(--color-primary)">₦{s.sale.toLocaleString()}</span>
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
