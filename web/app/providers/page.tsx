"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    CheckCircle,
    MapPin,
    Phone,
    Search,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PROVIDER_CATEGORIES = [
  "All",
  "Electrical",
  "Plumbing",
  "Beauty",
  "Cleaning",
  "Construction",
];

const SAMPLE_PROVIDERS = [
  {
    id: "1",
    name: "ChiChi Beauty Salon",
    category: "Beauty",
    rating: 4.9,
    reviews: 234,
    location: "Lagos, Nigeria",
    verified: true,
    experience: "5 years",
    services: ["Hair Styling", "Makeup", "Nail Art"],
    isOpen: true,
  },
  {
    id: "2",
    name: "ElectroPro Services",
    category: "Electrical",
    rating: 4.8,
    reviews: 189,
    location: "Abuja, Nigeria",
    verified: true,
    experience: "8 years",
    services: ["Wiring", "Installation", "Repairs"],
    isOpen: true,
  },
  {
    id: "3",
    name: "PlumbRight NG",
    category: "Plumbing",
    rating: 4.7,
    reviews: 156,
    location: "Port Harcourt, Nigeria",
    verified: true,
    experience: "10 years",
    services: ["Leak Repair", "Installation", "Maintenance"],
    isOpen: false,
  },
  {
    id: "4",
    name: "SparkleClean Services",
    category: "Cleaning",
    rating: 4.6,
    reviews: 98,
    location: "Lagos, Nigeria",
    verified: false,
    experience: "3 years",
    services: ["Home Cleaning", "Office Cleaning", "Deep Cleaning"],
    isOpen: true,
  },
  {
    id: "5",
    name: "BuildRight Construction",
    category: "Construction",
    rating: 4.9,
    reviews: 67,
    location: "Ibadan, Nigeria",
    verified: true,
    experience: "15 years",
    services: ["Building", "Renovation", "Painting"],
    isOpen: true,
  },
  {
    id: "6",
    name: "Hair by Ada",
    category: "Beauty",
    rating: 5.0,
    reviews: 312,
    location: "Lagos, Nigeria",
    verified: true,
    experience: "7 years",
    services: ["Braiding", "Locs", "Natural Hair Care"],
    isOpen: true,
  },
];

export default function ProvidersPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const filteredProviders =
    activeCategory === "All"
      ? SAMPLE_PROVIDERS
      : SAMPLE_PROVIDERS.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar activeTab="providers" />

      {/* Hero Section with Search */}
      <section className="bg-[var(--color-surface)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--color-primary)] text-sm font-medium mb-3">
            🔍 Find Trusted Providers
          </p>
          <h1 className="font-heading text-3xl lg:text-4xl mb-4">
            Discover Professional{" "}
            <span className="text-[var(--color-secondary)]">Providers</span>
          </h1>
          <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
            Connect with verified service professionals and businesses in your
            area. Quality products and services, trusted providers.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            {/* Mobile: Stacked Layout */}
            <div className="sm:hidden space-y-3 p-4 bg-white rounded-2xl shadow-card">
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-[50px]">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
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
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 border border-gray-200 rounded-[50px] text-sm">
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 bg-[var(--color-secondary)] text-gray-900 rounded-[50px] text-sm font-medium"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>

            {/* Desktop: Horizontal Layout */}
            <div className="hidden sm:flex items-stretch gap-3 p-3 bg-white rounded-[50px] shadow-card">
              <div className="flex items-center gap-2 flex-1 px-4">
                <Search
                  size={20}
                  className="text-[var(--color-primary)] shrink-0"
                />
                <input
                  type="text"
                  placeholder="Search providers, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-2 outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 px-4 border-l border-gray-200">
                <MapPin
                  size={20}
                  className="text-[var(--color-primary)] shrink-0"
                />
                <input
                  type="text"
                  placeholder="City, address, or postcode"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1 py-2 outline-none text-sm"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[var(--color-secondary)] text-gray-900 rounded-[50px] text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          {/* Quick Actions - Desktop Only */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 text-sm">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[var(--color-primary)] transition-colors">
              <MapPin size={14} />
              Use My Location
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[var(--color-primary)] transition-colors">
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[var(--color-primary)] transition-colors">
              <X size={14} />
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {PROVIDER_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-[50px] text-sm transition-colors ${
                  activeCategory === category
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[var(--color-primary)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[var(--color-muted)]">
              <span className="font-semibold text-gray-900">
                {filteredProviders.length} Provider
                {filteredProviders.length !== 1 ? "s" : ""}
              </span>{" "}
              Found
            </p>
          </div>

          {/* Providers Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-float transition-shadow group"
              >
                {/* Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-heading text-2xl">
                    {provider.name.charAt(0)}
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white rounded-full text-xs font-medium">
                    {provider.category}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold">
                      {provider.name}
                    </h3>
                    {provider.verified && (
                      <CheckCircle
                        size={16}
                        className="text-blue-500 fill-blue-500"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[var(--color-muted)] text-sm mb-3">
                    <MapPin size={14} />
                    {provider.location}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-[var(--color-muted)]">
                        ({provider.reviews} reviews)
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${provider.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {provider.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <button className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 border border-gray-200 rounded-[50px] text-sm hover:border-[var(--color-primary)] transition-colors">
                      <Phone size={14} />
                      Call
                    </button>
                    <Link
                      href={`/providers/${provider.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 bg-[var(--color-secondary)] text-gray-900 rounded-[50px] text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-primary)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl lg:text-3xl text-white mb-4">
            Are You a Service Professional?
          </h2>
          <p className="text-white/80 mb-8">
            Join the growing list of providers who trust HANDI to grow their
            business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/become-provider"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-gray-900 rounded-[50px] font-medium hover:bg-gray-100 transition-colors"
            >
              Become a Provider →
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 border-2 border-white text-white rounded-[50px] font-medium hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
