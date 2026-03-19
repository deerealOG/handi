//components/home/WhyChooseSection.tsx
"use client";

import { WHY_CHOOSE_FEATURES } from "@/data/landingData";

export default function WhyChooseSection() {
  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* SectionHeader */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-(--color-primary-light) text-(--color-primary) text-xs font-bold rounded-full mb-3">
          Why HANDI
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Why Choose HANDI
        </h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Everything you need for a seamless service experience, all in one platform.
        </p>
      </div>

      {/* 2 rows × 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY_CHOOSE_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover-lift"
          >
            <div
              className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
            >
              <feature.icon size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
