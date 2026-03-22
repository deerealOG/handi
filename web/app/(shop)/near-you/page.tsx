"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_PROVIDERS, MOCK_FLASH_DEALS, MOCK_PRODUCTS } from "@/data/mockApi";
import { MapPin, Star, ChevronRight, Navigation, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NearYouPage() {
  const [radius, setRadius] = useState(20);
  const [sortBy, setSortBy] = useState("distance");

  const providers = MOCK_PROVIDERS.slice(0, 12);
  const services = MOCK_FLASH_DEALS.slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-(--color-primary) to-teal-700 overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Navigation size={20} className="text-white/80" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Location Based</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Services Near You</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-6">Discover trusted providers and services within your area. Closer means faster delivery!</p>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-md border border-white/20">
            <MapPin size={16} className="text-white/80" />
            <span className="text-white text-sm font-medium">Within {radius}km of your location</span>
            <input type="range" min={5} max={50} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-24 accent-white" />
          </div>
        </div>
      </section>

      {/* Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><MapPin size={20} className="text-(--color-primary)" /> Providers Nearby</h2>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 outline-none cursor-pointer">
              <option value="distance">Closest First</option>
              <option value="rating">Top Rated</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {providers.map((p) => (
            <Link key={p.id} href={`/providers/${p.id}`} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={p.image || "/images/placeholder.webp"} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-800/90 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <MapPin size={10} className="text-(--color-primary)" /> {(Math.random() * radius).toFixed(1)}km
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{p.category}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Services Available Near You</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((deal) => (
            <Link key={deal.id} href="/login" className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-(--color-primary) text-white text-[9px] font-bold px-2 py-0.5 rounded-md">-{deal.discount}%</span>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{deal.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                  <Star size={9} className="fill-yellow-400 text-yellow-400" /> {deal.rating} · {deal.provider}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-sm font-bold text-(--color-primary)">₦{deal.sale.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 line-through">₦{deal.original.toLocaleString()}</span>
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
