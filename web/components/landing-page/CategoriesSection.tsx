"use client";

import ScrollSection from "@/components/ui/ScrollSection";
import { CATEGORIES } from "@/data/landingData";
import type { LucideIcon } from "lucide-react";
import {
  Bug, Building2, Camera, Car, ChefHat, Droplets, Fuel,
  Laptop, Paintbrush, Scissors, Shield, Sparkles, SprayCan,
  Thermometer, TreePine, Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Zap, Droplets, Sparkles, SprayCan, Car, Building2,
  Paintbrush, Laptop, ChefHat, Scissors, Camera, Shield,
  Thermometer, Fuel, Bug, TreePine,
};

export default function CategoriesSection() {
  const router = useRouter();

  return (
    <section className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-(--color-primary-light) text-(--color-primary) text-xs font-bold mb-2">Browse</span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Explore Services by Category</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse the most requested services and discover professionals near you.</p>
        </div>
        <ScrollSection>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/services?category=${cat.id}`)}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group shrink-0 min-w-[80px]"
            >
              <div className="w-12 h-12 rounded-xl bg-(--color-primary-light) flex items-center justify-center group-hover:scale-110 transition-transform">
                {(() => {
                  const IconComponent = CATEGORY_ICONS[cat.icon];
                  return IconComponent ? (
                    <IconComponent size={24} className="text-(--color-primary)" />
                  ) : (
                    <span className="text-lg">📦</span>
                  );
                })()}
              </div>
              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight truncate w-full">
                {cat.label}
              </span>
            </button>
          ))}
        </ScrollSection>
      </div>
    </section>
  );
}
