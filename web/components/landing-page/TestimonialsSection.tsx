//components/home/TestimonialsSection.tsx
"use client";

import { TESTIMONIALS } from "@/data/landingData";
import { Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* SectionHeader */}
      <div className="text-center mb-8 bg-primary flex items-center gap-2 px-4 py-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#eceeff] dark:text-white mb-2">
          What Customers Are Saying
        </h2>
        <p className="text-sm text-[#eceeff] dark:text-gray-400 max-w-lg mx-auto">
          Real stories from real customers who trust HANDI for their service needs.
        </p>
      </div>

      {/* Testimonial cards grid */}
      <div className="px-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow hover-lift flex flex-col"
          >
            {/* Quote */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-1 italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Rating stars */}
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < t.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 dark:text-gray-600"
                  }
                />
              ))}
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {t.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{t.service}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
