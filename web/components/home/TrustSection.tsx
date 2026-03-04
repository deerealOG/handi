"use client";

import { TRUST_ITEMS } from "@/data/landingData";

export default function TrustSection() {
  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className=" mb-6 ">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 ">
          Why Use HANDI
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.title}
            className="bg-white flex flex-col items-center justify-center rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-3`}
            >
              <item.icon size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
