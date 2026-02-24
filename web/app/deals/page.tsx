"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Brush,
  ChevronRight,
  Droplets,
  Sparkles,
  Star,
  Timer,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DEAL_SERVICES = [
  {
    id: "1",
    name: "Deep House Cleaning",
    provider: "Clean Pro Services",
    originalPrice: 20000,
    dealPrice: 15000,
    discount: 25,
    rating: 4.8,
    reviews: 56,
    icon: Brush,
    endsIn: "2h 30m",
    sold: 42,
  },
  {
    id: "2",
    name: "AC Installation & Repair",
    provider: "CoolTech Solutions",
    originalPrice: 18000,
    dealPrice: 12000,
    discount: 33,
    rating: 4.9,
    reviews: 89,
    icon: Wrench,
    endsIn: "4h 15m",
    sold: 28,
  },
  {
    id: "3",
    name: "Hair Styling & Braiding",
    provider: "Precious Beauty Lounge",
    originalPrice: 12000,
    dealPrice: 8000,
    discount: 33,
    rating: 4.7,
    reviews: 107,
    icon: Sparkles,
    endsIn: "1h 45m",
    sold: 65,
  },
  {
    id: "4",
    name: "Plumbing Repair",
    provider: "PipeMaster NG",
    originalPrice: 15000,
    dealPrice: 10000,
    discount: 33,
    rating: 4.6,
    reviews: 34,
    icon: Droplets,
    endsIn: "5h 20m",
    sold: 17,
  },
  {
    id: "5",
    name: "Generator Maintenance",
    provider: "PowerFix Solutions",
    originalPrice: 30000,
    dealPrice: 22000,
    discount: 27,
    rating: 4.8,
    reviews: 45,
    icon: Zap,
    endsIn: "3h 10m",
    sold: 31,
  },
  {
    id: "6",
    name: "Full Interior Cleaning",
    provider: "SparkleClean Pro",
    originalPrice: 25000,
    dealPrice: 18000,
    discount: 28,
    rating: 4.9,
    reviews: 72,
    icon: Brush,
    endsIn: "6h 45m",
    sold: 53,
  },
];

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
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Flash Deals Header */}
      <section className="bg-[var(--color-primary)]">
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
          {DEAL_SERVICES.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Image Area */}
              <div className="relative h-40 bg-[var(--color-primary-light)] flex items-center justify-center">
                <deal.icon
                  size={48}
                  className="text-[var(--color-primary)] opacity-50 group-hover:scale-110 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{deal.discount}%
                </span>
                <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Timer size={10} />
                  {deal.endsIn}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {deal.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{deal.provider}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-700">
                    {deal.rating}
                  </span>
                  <span>({deal.reviews})</span>
                  <span className="mx-1">•</span>
                  <span>{deal.sold} booked</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    ₦{deal.dealPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₦{deal.originalPrice.toLocaleString()}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div
                    className="bg-red-500 rounded-full h-2 transition-all"
                    style={{
                      width: `${Math.min((deal.sold / 80) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mb-3">
                  {deal.sold} booked — limited slots available
                </p>
                <Link
                  href="/services"
                  className="w-full inline-flex items-center justify-center gap-1 bg-[var(--color-primary)] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Book Now <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
