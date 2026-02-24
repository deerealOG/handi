"use client";

import {
  ArrowRight,
  Calendar,
  CheckCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const POPULAR_SEARCHES = [
  "Plumber",
  "Hair Salon",
  "Massage Therapy",
  "House Cleaning",
  "Photography",
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`;
    }
  };

  return (
    <section className="bg-[var(--color-surface)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Mobile: flex-col (text first, then image). Desktop: flex-row */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side - Text Content */}
          <div className="flex-1 max-w-xl lg:max-w-none text-center lg:text-left animate-fadeInUp">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              Let&apos;s Connect You to Reliable{" "}
              <span className="text-[var(--color-secondary)]">
                Service Providers
              </span>
            </h1>

            <p className="text-[var(--color-muted)] text-base lg:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Connect with trusted local businesses and service providers,
              manage bookings effortlessly, and grow your business with our
              all-in-one platform designed for success.
            </p>

            {/* Search Bar */}
            {/* Mobile: Stacked Layout */}
            <form
              onSubmit={handleSearch}
              className="sm:hidden space-y-3 p-4 rounded-2xl shadow-card mb-6"
            >
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-[50px]">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 bg-[var(--color-primary)] text-white rounded-[50px] text-sm font-medium"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-[50px]">
                <MapPin size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 border border-gray-200 rounded-[50px] text-sm bg-white"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                
              </div>
            </form>

            {/* Desktop: Horizontal Layout */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-stretch gap-3 p-3 bg-white rounded-[50px] border border-[var(--color-primary)] shadow-card mb-6"
            >
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search
                  size={20}
                  className="text-[var(--color-primary)] shrink-0"
                />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-2 outline-none text-sm"
                />
              </div>

              <div className="hidden sm:flex items-center gap-2 flex-1 px-3 border-l border-gray-200">
                <MapPin
                  size={20}
                  className="text-[var(--color-primary)] shrink-0"
                />
                <input
                  type="text"
                  placeholder="Enter location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1 py-2 outline-none text-sm"
                />
              </div>

              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center gap-1 px-4 py-2 rounded-[50px] border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
              >
                <SlidersHorizontal size={16} />
                <span className="text-sm">Filters</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-[50px] hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-medium"
              >
                <Search size={18} />
                Search
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mb-8">
              <p className="text-[var(--color-primary)] font-medium text-sm mb-3">
                Popular searches:
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {POPULAR_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => setSearchQuery(search)}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-[50px] border border-[var(--color-primary)] text-[var(--color-primary)] text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
              <button
                onClick={() => router.push("/signup")}
                className="cursor-pointer inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[50px] bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <Link
                href="/services"
                className="cursor-pointer inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[50px] border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary-light)] transition-colors"
              >
                <Calendar size={18} />
                Book Services
              </Link>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-[var(--color-star)] text-[var(--color-star)]"
                  />
                ))}
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                <span className="font-medium">4.9/5</span> From platform reviews
              </p>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="flex-1 relative animate-fadeIn animate-delay-300">
            {/* Floating Card - Top */}
            <div className="hidden lg:flex absolute -top-4 -right-8 z-10 items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-float">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                <CheckCircle
                  size={20}
                  className="text-[var(--color-primary)]"
                />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">
                  Booking Confirmed
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  Hair appointment at 2 PM
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <Image
              src="/images/hero-image.png"
              alt="HANDI service providers helping customers"
              width={600}
              height={600}
              className="w-full max-w-lg lg:max-w-none mx-auto rounded-2xl object-cover"
              priority
            />

            {/* Floating Card - Bottom */}
            <div className="hidden lg:flex absolute -bottom-4 right-8 z-10 items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-float">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-[var(--color-primary)] font-bold">₦</span>
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">
                  Payment Received
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  ₦150,000 from Sarah M.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
