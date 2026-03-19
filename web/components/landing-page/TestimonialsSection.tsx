//components/home/TestimonialsSection.tsx
"use client";

import { TESTIMONIALS } from "@/data/landingData";
import { Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* SectionHeader */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full mb-3">
          Testimonials
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          What Customers Are Saying
        </h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Real stories from real customers who trust HANDI for their service needs.
        </p>
      </div>

      {/* Testimonial cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover-lift flex flex-col"
          >
            {/* Quote */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 italic">
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
                      : "text-gray-200"
                  }
                />
              ))}
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
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
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {t.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{t.service}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
