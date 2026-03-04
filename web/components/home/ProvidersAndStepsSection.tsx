"use client";

import { useCart } from "@/context/CartContext";
import { STEPS } from "@/data/landingData";
import { MOCK_SERVICES } from "@/data/mockApi";
import { MOCK_PROVIDERS } from "@/data/providers";
import {
    ArrowRight,
    Calendar,
    ChevronRight,
    Clock,
    Heart,
    MapPin,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProvidersAndStepsSectionProps {
  router: any;
}

export default function ProvidersAndStepsSection({
  router,
}: ProvidersAndStepsSectionProps) {
  const topProviders = MOCK_PROVIDERS.slice(0, 6);
  const recommendedServices = MOCK_SERVICES.slice(0, 6);
  const { isInWishlist } = useCart();

  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <>
      {/* Top Rated Professionals */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Top Rated Professionals
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {topProviders.map((p) => (
            <div
              key={p.id}
              className="w-[180px] max-w-[50vw] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all shrink-0 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    p.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />{" "}
                  {p.rating} ({p.reviews})
                </span>
                {p.isOnline && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                    ● Online
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-3 justify-between">
                <button
                  onClick={() => router.push("/login")}
                  className="w-1/2 px-1 py-1.5 bg-gray-100 text-gray-900 text-[9px] font-bold rounded-full hover:opacity-90 cursor-pointer hover:bg-gray-200 transition-all text-center whitespace-nowrap"
                >
                  View Profile
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="w-1/2 px-1 py-1.5 bg-(--color-primary) text-white text-[9px] font-bold rounded-full hover:opacity-90 cursor-pointer hover:bg-[--color-primary-light] transition-all text-center whitespace-nowrap"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto no-scrollbar pb-2">
          <div className="w-[280px] max-w-[85vw] md:w-auto md:min-w-0 relative bg-linear-to-r from-[#1a3a2a] to-[#245e37] rounded-xl overflow-hidden p-4 sm:p-5 min-h-[120px] sm:min-h-[140px] group cursor-pointer hover:shadow-lg transition-shadow shrink-0">
            <div className="relative z-10 w-[65%]">
              <span className="inline-block bg-(--color-secondary) text-gray-900 text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2">
                OFFICIAL STORE
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                Professional Cleaning
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3 max-w-[200px] line-clamp-2">
                Top-rated cleaning pros. Book now — 20% off!
              </p>
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-1.5 bg-white text-gray-900 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Book Now <ArrowRight size={14} />
              </button>
            </div>
            <Image
              src="/images/banner/cleaning-provider.png"
              alt="Cleaning"
              width={100}
              height={100}
              className="absolute bottom-0 right-2 w-24 sm:w-36 md:w-48 h-auto rounded-lg object-contain"
            />
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          </div>

          <div
            onClick={() => router.push("/signup")}
            className="w-[280px] max-w-[85vw] md:w-auto md:min-w-0 relative bg-linear-to-r from-(--color-primary) to-(--color-secondary) rounded-xl overflow-hidden p-4 sm:p-5 min-h-[120px] sm:min-h-[140px] group cursor-pointer hover:shadow-lg transition-shadow shrink-0"
          >
            <div className="relative z-10 w-[65%]">
              <span className="inline-block bg-white/20 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2">
                EARN WITH HANDI
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                Become a Provider
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3 max-w-[200px] line-clamp-2">
                Join verified professionals. Grow your business.
              </p>
              <button
                onClick={() => router.push("/signup")}
                className="inline-flex items-center gap-1.5 bg-white text-(--color-primary) px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started <ArrowRight size={14} />
              </button>
            </div>
            <Image
              src="/images/banner/banner-two.png"
              alt="Provider"
              width={100}
              height={100}
              className="absolute bottom-0 right-2 w-24 sm:w-36 md:w-48 h-auto rounded-lg object-contain"
            />
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          </div>
        </div>
      </section>

      {/* Recommended Services */}
      <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Recommended Services
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1 cursor-pointer"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {recommendedServices.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push("/login")}
              className="w-[160px] max-w-[45vw] md:w-auto md:min-w-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group cursor-pointer hover-lift flex flex-col shrink-0"
            >
              <div className="w-full h-24 sm:h-32 bg-gray-200 relative overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {s.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {s.provider}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-(--color-primary)">
                    ₦{s.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-0.5">
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />{" "}
                    {s.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-auto pt-2">
                  <button
                    onClick={() => router.push("/login")}
                    className="flex-1 cursor-pointer text-[10px] font-bold text-white flex items-center justify-center gap-1 bg-(--color-primary) px-2 py-2 rounded-full whitespace-nowrap"
                  >
                    Book Now <Calendar size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/login");
                    }}
                    className={`shrink-0 cursor-pointer text-xs font-semibold flex items-center justify-center gap-1 w-8 h-8 rounded-full transition-colors ${isInWishlist(s.id) ? "bg-red-50 text-red-500 border border-red-200" : "bg-gray-100 text-gray-900 border border-gray-200"}`}
                  >
                    <Heart
                      size={12}
                      className={isInWishlist(s.id) ? "fill-red-500" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-10 mx-auto py-6 max-w-7xl">
        <div className="rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">How It Works</h2>
          <p className="text-xs text-gray-500 mb-5">
            Book a service in 4 easy steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                <div className=" bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center h-full hover:shadow-md transition-shadow">
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

      {/* About HANDI */}
      <section className=" p-5 sm:p-6 text-white relative overflow-hidden max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 bg-linear-to-br from-(--color-primary) to-emerald-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">About HANDI</h2>
          <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-xl">
            Nigeria&apos;s #1 on-demand service marketplace. We connect you with
            verified, trusted professionals for all your home and business needs
            — from plumbing to beauty, cleaning to tech support.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">10K+</p>
              <p className="text-[10px] text-white/70">Providers</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">50K+</p>
              <p className="text-[10px] text-white/70">Bookings</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">4.8★</p>
              <p className="text-[10px] text-white/70">User Rating</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-white/15 rounded-full">
              ✓ Verified Pros
            </span>
            <span className="px-3 py-1 bg-white/15 rounded-full">
              ✓ Secure Payments
            </span>
            <span className="px-3 py-1 bg-white/15 rounded-full">
              ✓ Money-Back Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* Download the App */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Get the HANDI App
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Book services faster, get real-time notifications, and track your
              provider — all from your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
              <button
                onClick={() => alert("App Store link coming soon!")}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">🍎</span>
                <span className="text-left leading-tight">
                  <span className="text-[10px] text-gray-400 block">
                    Download on
                  </span>
                  App Store
                </span>
              </button>
              <button
                onClick={() => alert("Google Play link coming soon!")}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">▶️</span>
                <span className="text-left leading-tight">
                  <span className="text-[10px] text-gray-400 block">
                    Get it on
                  </span>
                  Google Play
                </span>
              </button>
            </div>
          </div>
          <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl">
            📱
          </div>
        </div>
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

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-48 bg-gray-200 overflow-hidden rounded-t-2xl relative">
                <Image
                  src={selectedService.image}
                  alt={selectedService.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {selectedService.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                by {selectedService.provider}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-(--color-primary)">
                  ₦{selectedService.price.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {selectedService.rating} ({selectedService.reviews || 0}{" "}
                  reviews)
                </span>
              </div>
              {selectedService.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {selectedService.description}
                </p>
              )}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  Duration: {selectedService.duration || "1-2 hours"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {selectedService.location || "Lagos, Nigeria"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    router.push("/login");
                  }}
                  className="px-4 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Book Now
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
