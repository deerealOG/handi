"use client";

import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    getProviderById,
    getServicesByProvider
} from "@/data/mockApi";
import {
    ArrowLeft,
    Award,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);

  const provider = getProviderById(params.id as string);

  if (!provider) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Provider Not Found
            </h1>
            <p className="text-gray-500 mb-4">
              This provider profile doesn&apos;t exist.
            </p>
            <Link
              href="/providers"
              className="text-[var(--color-primary)] hover:underline"
            >
              ← Browse Providers
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const providerServices = getServicesByProvider(provider.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero / Provider Header */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shrink-0">
                {provider.name.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {provider.name}
                  </h1>
                  {provider.badge && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                      {provider.badge}
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm">{provider.category}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/90">
                  <span className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-300 text-yellow-300"
                    />
                    {provider.rating} ({provider.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {provider.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} /> {provider.completedJobs} jobs
                    completed
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    <span
                      className={`w-2 h-2 rounded-full ${provider.isOnline ? "bg-green-300" : "bg-gray-300"}`}
                    />
                    {provider.isOnline ? "Online now" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Services */}
              {providerServices.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Services Offered
                  </h2>
                  <div className="space-y-3">
                    {providerServices.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-[var(--color-primary-light)] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                            🔧
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)]">
                              {s.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-0.5">
                                <Star
                                  size={10}
                                  className="text-yellow-400 fill-yellow-400"
                                />
                                {s.rating}
                              </span>
                              <span>· {s.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₦{s.price.toLocaleString()}
                          </p>
                          {s.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              ₦{s.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Customer Reviews
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      name: "Aisha M.",
                      date: "2 days ago",
                      rating: 5,
                      text: "Excellent work! Very professional and thorough. Will definitely use again.",
                    },
                    {
                      name: "Emeka O.",
                      date: "1 week ago",
                      rating: 5,
                      text: "Arrived on time and completed the job perfectly. Highly recommended.",
                    },
                    {
                      name: "Blessing A.",
                      date: "2 weeks ago",
                      rating: 4,
                      text: "Good service overall. Minor delay but quality work.",
                    },
                  ].map((review, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {review.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              className="text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Price Range</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {provider.price}
                  </p>
                </div>

                <button
                  onClick={() => setBookingOpen(true)}
                  className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-full font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book Now
                </button>

                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                    <Phone size={14} /> Call
                  </button>
                  <button className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                    <MessageCircle size={14} /> Chat
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">
                  QUICK STATS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Briefcase size={18} />,
                      value: provider.completedJobs,
                      label: "Jobs Done",
                    },
                    {
                      icon: <Star size={18} />,
                      value: provider.rating,
                      label: "Rating",
                    },
                    {
                      icon: <Award size={18} />,
                      value: provider.reviews,
                      label: "Reviews",
                    },
                    {
                      icon: <CheckCircle size={18} />,
                      value: "98%",
                      label: "Completion",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="text-center p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
                        {stat.icon}
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="space-y-3">
                  {[
                    { icon: "✅", label: "Identity Verified" },
                    { icon: "🛡️", label: "Background Checked" },
                    { icon: "📋", label: "Licensed & Insured" },
                    { icon: "💬", label: "Fast Response Time" },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="text-base">{badge.icon}</span>
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        serviceName={`Service by ${provider.name}`}
        providerName={provider.name}
        price={parseInt(provider.price.replace(/[^0-9]/g, "")) || 10000}
      />
    </>
  );
}
