//components/home/TrustSection.tsx
"use client";

import { TRUST_ITEMS } from "@/data/landingData";

export default function TrustSection() {
  return (
    <section className="mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.title}
            className="bg-white flex items-center gap-4 justify-center rounded-2xl p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover-lift"
          >
            <div
              className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-3`}
            >
              <item.icon size={22} />
            </div>
            <div className="flex flex-col items-start justify-center ">
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed text-center">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
