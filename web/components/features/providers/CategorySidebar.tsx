"use client";

import { Category } from "@/types";
import {
    Brush,
    Bug,
    Car,
    Droplets,
    Dumbbell,
    Flower2,
    Grid3X3,
    Hammer,
    Home,
    Laptop,
    PartyPopper,
    Shield,
    Sparkles,
    Truck,
    WashingMachine,
    Wrench,
    Zap,
} from "lucide-react";

const ICON_MAP: {
  [key: string]: React.ComponentType<{ size?: number; className?: string }>;
} = {
  Zap,
  Droplets,
  Sparkles,
  Brush,
  Home,
  Wrench,
  Hammer,
  Laptop,
  Car,
  Flower2,
  Bug,
  PartyPopper,
  Truck,
  Shield,
  WashingMachine,
  Dumbbell,
};

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategorySidebarProps) {
  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="bg-white rounded-xl shadow-card p-4 sticky top-24">
        <h2 className="text-lg font-heading font-bold text-[var(--color-text)] mb-4 pb-3 border-b border-gray-200">
          Categories
        </h2>
        <nav className="space-y-1 max-h-[500px] overflow-y-auto">
          {/* All Services */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text)] hover:bg-gray-50"
            }`}
          >
            <Grid3X3 size={18} />
            <span>All Services</span>
          </button>

          {/* Category List */}
          {categories.map((category) => {
            const IconComponent = ICON_MAP[category.icon] || Grid3X3;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-text)] hover:bg-gray-50"
                }`}
              >
                <IconComponent size={18} />
                <span className="truncate">{category.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
