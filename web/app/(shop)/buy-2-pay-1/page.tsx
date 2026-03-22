"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_PRODUCTS, MOCK_FLASH_DEALS } from "@/data/mockApi";
import { Gift, Star, ShoppingCart, Tag, ArrowRight, Percent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Buy2Pay1Page() {
  const { addToCart } = useCart();

  // Products with BOGO deals (simulated: pick products with good ratings)
  const bogoProducts = MOCK_PRODUCTS.filter((p) => p.rating >= 4.0).slice(0, 12);
  const bogoServices = MOCK_FLASH_DEALS.filter((d) => d.discount >= 20).slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-linear-to-br from-pink-500 via-rose-500 to-red-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-md mb-4">
            <Percent size={16} className="text-yellow-200" />
            <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wider">BOGO DEALS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Buy 2, Pay for <span className="text-yellow-300">1!</span>
          </h1>
          <p className="text-white/80 max-w-xl mx-auto mb-6">Double the value! Buy any two qualifying items and only pay for one. Limited time offer on select products and services.</p>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-md border border-white/20">
            <Gift size={18} className="text-yellow-200" />
            <span className="text-white text-sm font-medium">Add 2 items to get the cheapest one FREE</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Choose 2+ Items", desc: "Browse qualifying products and services below", icon: ShoppingCart },
            { step: "2", title: "Add to Cart", desc: "Add at least 2 qualifying items to your cart", icon: Tag },
            { step: "3", title: "Get 1 Free!", desc: "The cheaper item is automatically free at checkout", icon: Gift },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-lg rounded-md shrink-0">{s.step}</div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOGO Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
          <ShoppingCart size={20} className="text-pink-500" /> Qualifying Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bogoProducts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">BOGO</span>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.seller}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 my-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})
                </div>
                <div className="mt-auto">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₦{p.price.toLocaleString()}</span>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/products/${p.id}`} className="flex-1 inline-flex items-center justify-center bg-(--color-primary) text-white py-2 rounded-md text-xs font-semibold hover:opacity-90">
                      View <ArrowRight size={12} className="ml-1" />
                    </Link>
                    <button onClick={() => addToCart(p.id, "product", 1)} className="p-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 rounded-md hover:bg-pink-100 cursor-pointer">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOGO Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
          <Tag size={20} className="text-rose-500" /> Qualifying Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bogoServices.map((s) => (
            <Link key={s.id} href="/login" className="bg-white dark:bg-gray-900 rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">2-FOR-1</span>
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

      <Footer />
    </main>
  );
}
