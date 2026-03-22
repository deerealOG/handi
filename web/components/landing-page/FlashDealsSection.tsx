"use client";

import { MOCK_FLASH_DEALS } from "@/data/mockApi";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1">
      {[
        { val: countdown.hours, label: "H" },
        { val: countdown.minutes, label: "M" },
        { val: countdown.seconds, label: "S" },
      ].map((t, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span className="bg-gray-900 text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[24px] text-center tabular-nums">
            {String(t.val).padStart(2, "0")}
          </span>
          {i < 2 && <span className="text-white font-bold text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function FlashDealsSection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
              ⚡ Flash Sales
            </h2>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <Clock size={14} className="text-white" />
              <span className="text-white text-xs font-medium">Time Left:</span>
              <CountdownTimer />
            </div>
          </div>
          <button
            onClick={() => router.push("/deals?type=flash")}
            className="text-white text-sm font-semibold hover:underline cursor-pointer flex items-center gap-1"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile countdown */}
        <div className="sm:hidden bg-red-50 dark:bg-red-900/20 px-4 py-2 flex items-center justify-center gap-2">
          <Clock size={12} className="text-red-500" />
          <span className="text-red-600 dark:text-red-400 text-xs font-medium">Ends in:</span>
          <CountdownTimer />
        </div>

        {/* Product Grid */}
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden sm:flex"
          >
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-0 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {MOCK_FLASH_DEALS.map((deal, i) => (
              <div
                key={deal.id}
                onClick={() => router.push(`/deals?deal=${deal.id}`)}
                className={`shrink-0 w-[150px] sm:w-[170px] p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  i < MOCK_FLASH_DEALS.length - 1 ? "border-r border-gray-100 dark:border-gray-700" : ""
                }`}
              >
                {/* Image */}
                <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg h-[120px] sm:h-[140px] flex items-center justify-center overflow-hidden mb-2">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -{deal.discount}%
                  </span>
                </div>

                {/* Name */}
                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1.5 min-h-[32px]">
                  {deal.name}
                </p>

                {/* Price */}
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  ₦{deal.sale.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 line-through">
                  ₦{deal.original.toLocaleString()}
                </p>

                {/* Stock Bar */}
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                      style={{ width: `${Math.max(15, 100 - deal.booked * 3)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    {deal.booked} sold
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden sm:flex"
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
