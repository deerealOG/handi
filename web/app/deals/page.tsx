"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    ChevronRight,
    Star,
    Timer
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MOCK_FLASH_DEALS } from "@/data/mockApi";
import Image from "next/image";

export default function DealsPage() {
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
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Flash Deals Header */}
      <section className="bg-(--color-primary)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Timer size={28} className="text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Flash Deals</h1>
                <p className="text-white/80 text-sm">
                  Limited-time offers on top services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="text-sm font-medium">Ends in:</span>
              <div className="flex gap-2">
                <div className="bg-black/30 px-3 py-2 rounded-xl text-center min-w-[50px]">
                  <span className="text-lg font-bold font-mono">
                    {String(countdown.hours).padStart(2, "0")}
                  </span>
                  <p className="text-[10px] text-white/60">HRS</p>
                </div>
                <div className="bg-black/30 px-3 py-2 rounded-xl text-center min-w-[50px]">
                  <span className="text-lg font-bold font-mono">
                    {String(countdown.minutes).padStart(2, "0")}
                  </span>
                  <p className="text-[10px] text-white/60">MIN</p>
                </div>
                <div className="bg-black/30 px-3 py-2 rounded-xl text-center min-w-[50px]">
                  <span className="text-lg font-bold font-mono">
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                  <p className="text-[10px] text-white/60">SEC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_FLASH_DEALS.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              {/* Image Area */}
              <div className="relative h-40 bg-(--color-primary-light) overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{deal.discount}%
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-(--color-primary) transition-colors">
                    {deal.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{deal.provider}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-700">
                      {deal.rating}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{deal.booked} booked</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-(--color-primary)">
                      ₦{deal.sale.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₦{deal.original.toLocaleString()}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div
                      className="bg-red-500 rounded-full h-2 transition-all"
                      style={{
                        width: `${Math.min((deal.booked / 80) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mb-3">
                    {deal.booked} booked — limited slots available
                  </p>
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-1 bg-(--color-primary) text-white py-2.5 rounded-full text-sm font-semibold hover:bg-(--color-primary-dark) transition-colors"
                  >
                    Book Now <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
