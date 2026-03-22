"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const QUICK_ACCESS_CARDS = [
  { label: "Find Providers", emoji: "👷", href: "/providers", bg: "bg-emerald-500" },
  { label: "Book Services", emoji: "🛠️", href: "/services", bg: "bg-green-500" },
  { label: "Top Rated Pros", emoji: "⭐", href: "/providers?sort=rating", bg: "bg-amber-500" },
  { label: "Near You", emoji: "📍", href: "/providers?nearby=true", bg: "bg-red-400" },
  { label: "Awoof Deals", emoji: "🔥", href: "/awoof-deals", bg: "bg-orange-500" },
  { label: "New Arrivals", emoji: "🆕", href: "/new-arrivals", bg: "bg-blue-500" },
  { label: "Official Stores", emoji: "🏪", href: "/official-stores", bg: "bg-sky-500" },
  { label: "Clearance", emoji: "💰", href: "/clearance-sale", bg: "bg-yellow-500" },
  { label: "Buy 2 Pay 1", emoji: "🎁", href: "/buy-2-pay-1", bg: "bg-pink-500" },
  { label: "Top Picks", emoji: "👑", href: "/top-picks", bg: "bg-violet-500" },
];

export default function QuickAccessCards() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -240 : 240;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {QUICK_ACCESS_CARDS.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="shrink-0 flex flex-col items-center group/card"
            >
              {/* Image square */}
              <div
                className={`w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] ${card.bg} rounded-lg flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all`}
              >
                <span className="text-3xl sm:text-4xl">{card.emoji}</span>
              </div>
              {/* Label below */}
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight mt-1.5 max-w-[90px] sm:max-w-[100px] group-hover/card:text-(--color-primary) transition-colors">
                {card.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
