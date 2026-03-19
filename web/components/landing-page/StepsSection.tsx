"use client";

import { STEPS } from "@/data/landingData";

export default function StepsSection() {
  return (
    <section className="mt-10 mx-auto py-6 max-w-7xl">
      <div className="rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">How It Works</h2>
        <p className="text-xs text-gray-500 mb-5">
          Book a service in 4 easy steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center h-full hover:shadow-md transition-shadow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="w-7 h-7 bg-(--color-primary) text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mx-auto mb-4 mt-2`}
                >
                  <step.icon size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
