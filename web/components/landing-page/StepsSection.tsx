"use client";

import { STEPS } from "@/data/landingData";

export default function StepsSection() {
  return (
    <section className=" mx-auto max-w-7xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="">
        <div className="mb-4 px-4 py-2 bg-primary flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#eceeff] dark:text-white">How It Works</h2>
          <p className="text-xs text-[#eceeff] dark:text-gray">
            Book a service in 4 easy steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {STEPS.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center h-full hover:shadow-md transition-shadow">
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
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
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
