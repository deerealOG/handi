"use client";

import { Award, CheckCircle, Shield, Star, TrendingUp, Users } from "lucide-react";

const STATS = [
  { icon: Users, value: "10K+", label: "Verified Providers", color: "text-blue-600", bg: "bg-blue-200"  },
  { icon: TrendingUp, value: "50K+", label: "Completed Bookings", color: "text-emerald-600", bg: "bg-emerald-200" },
  { icon: Star, value: "4.8★", label: "Average Rating", color: "text-amber-600", bg: "bg-amber-200" },
  { icon: Award, value: "99%", label: "Satisfaction Rate", color: "text-purple-600", bg: "bg-purple-200" },
];

const TRUST_BADGES = [
  { icon: CheckCircle, text: "Verified Professionals", desc: "Every provider is background-checked" },
  { icon: Shield, text: "Secure Payments", desc: "Your money is protected with escrow" },
  { icon: Award, text: "7-Day Money-Back Guarantee", desc: "Full refund within 7 days, subject to T&C" },
];

export default function AboutSection() {
  return (
    <section className=" max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-4 py-2 flex items-center gap-2">
        <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#eceeff] dark:text-white">
          About Us
        </h2>
        <p className="text-[#eceeff] dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          We connect you with verified, trusted professionals for all your home and business needs
        </p>
      </div>

      {/* Stats Grid — each card has its own unique background */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 mt-4 px-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-center group`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} ${stat.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 px-4 mb-4">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.text} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-(--color-primary)/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center shrink-0">
                <badge.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{badge.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{badge.desc}</p>
              </div>
            </div>
        ))}
      </div>
    </section>
  );
}
