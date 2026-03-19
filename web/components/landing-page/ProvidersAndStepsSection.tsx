//components/landing-page/ProvidersAndStepsSection.tsx
"use client";

import { MOCK_PROVIDERS } from "@/data/providers";
import {
    ArrowRight,
    Star,
    X
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ScrollSection from "../shared/ScrollSection";

interface ProvidersAndStepsSectionProps {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
}

export default function ProvidersAndStepsSection({
  router,
}: ProvidersAndStepsSectionProps) {
  const topProviders = MOCK_PROVIDERS;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  return (
    <>
      {/* Top Rated Professionals */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full mb-2">
            Top Rated
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Top Rated Professionals
          </h2>
          <p className="text-sm text-gray-500 mt-1">Trusted providers with the highest ratings and reviews.</p>
        </div>
        <ScrollSection className="snap-x snap-mandatory">
          {topProviders.map((p) => (
            <div
              key={p.id}
              className="w-[200px] max-w-[45vw] bg-white rounded-2xl shadow-sm snap-start border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col shrink-0"
            >
                <div className="h-24 bg-gray-100 overflow-hidden relative">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  ) : (
                    p.name.charAt(0)
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1 gap-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                  <p className="text-xs text-gray-700 line-clamp-2">{p.description}</p>
                </div>
              <div className="flex items-center justify-between mt-auto mb-2 px-3">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />{" "}
                  {p.rating} ({p.reviews})
                </span>
                {p.isOnline && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                    ● Online
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-3 justify-between mb-2 p-3">
                <button
                  onClick={() =>
                    router.push(`/login?redirect=/providers/${p.id}`)
                  }
                  className="w-1/2 px-1 py-1.5 bg-gray-100 text-gray-900 text-[9px] font-bold rounded-full hover:opacity-90 cursor-pointer hover:bg-gray-200 transition-all text-center whitespace-nowrap"
                >
                  View Profile
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/login?redirect=/providers/${p.id}?action=book`,
                    )
                  }
                  className="w-1/2 px-1 py-1.5 bg-(--color-primary) text-white text-[9px] font-bold rounded-full hover:opacity-90 cursor-pointer hover:bg-[--color-primary-light] transition-all text-center whitespace-nowrap"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </ScrollSection>
      </section>


      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Provider Details
              </h3>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-2xl mx-auto mb-3 overflow-hidden">
                {selectedProvider.image ? (
                  <Image
                    src={selectedProvider.image}
                    alt={selectedProvider.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  selectedProvider.name.charAt(0)
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedProvider.name}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedProvider.category}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedProvider.rating} ({selectedProvider.reviews} reviews)
                </span>
                {selectedProvider.isOnline && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                    ● Online
                  </span>
                )}
              </div>
            </div>
            {selectedProvider.bio && (
              <p className="text-sm text-gray-600 mb-4 text-center">
                {selectedProvider.bio}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.completedJobs || "50+"}
                </p>
                <p className="text-xs text-gray-500">Jobs Done</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.responseTime || "~30m"}
                </p>
                <p className="text-xs text-gray-500">Response Time</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  router.push("/login");
                }}
                className="px-3 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Book Now
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-3 py-2.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="text-sm">Call</span>
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-3 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-full hover:bg-green-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
