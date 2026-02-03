"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    Brush,
    Bug,
    Car,
    Clock,
    Droplets,
    Dumbbell,
    Flower2,
    Hammer,
    Home,
    Laptop,
    MapPin,
    MapPinned,
    Navigation,
    PartyPopper,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Star,
    Truck,
    WashingMachine,
    Wrench,
    X,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SERVICE_CATEGORIES = [
  { id: "all", label: "All Categories", icon: null },
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "plumbing", label: "Plumbing", icon: Droplets },
  { id: "beauty", label: "Beauty & Wellness", icon: Sparkles },
  { id: "cleaning", label: "Cleaning", icon: Brush },
  { id: "home", label: "Home Improvement", icon: Home },
  { id: "mechanical", label: "Mechanical", icon: Wrench },
  { id: "construction", label: "Construction", icon: Hammer },
  { id: "technology", label: "Technology", icon: Laptop },
  { id: "automotive", label: "Automotive", icon: Car },
  { id: "gardening", label: "Gardening", icon: Flower2 },
  { id: "pest", label: "Pest Control", icon: Bug },
  { id: "event", label: "Event & Party", icon: PartyPopper },
  { id: "moving", label: "Moving & Haulage", icon: Truck },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "appliance", label: "Appliance Repair", icon: WashingMachine },
  { id: "fitness", label: "Fitness & Training", icon: Dumbbell },
];

const SAMPLE_SERVICES = [
  {
    id: "1",
    title: "Leak Fixing and Plumbing Repairs",
    description:
      "We offer same day booking and fixing of plumbing leaks. Professional and clean jobs.",
    category: "Leak Detection & Repair",
    price: 5000,
    oldPrice: 7500,
    rating: 5,
    reviews: 2,
    location: "Port Harcourt",
    duration: "1hr",
  },
  {
    id: "2",
    title: "Professional Hair Braiding",
    description:
      "Expert hair braiding services including box braids, cornrows, and twists.",
    category: "Hair Styling",
    price: 8000,
    oldPrice: 10000,
    rating: 4.8,
    reviews: 15,
    location: "Lagos",
    duration: "3hr",
  },
  {
    id: "3",
    title: "Home Electrical Wiring",
    description:
      "Complete electrical wiring, repairs, and installations for homes and offices.",
    category: "Electrical",
    price: 15000,
    oldPrice: 20000,
    rating: 4.9,
    reviews: 28,
    location: "Abuja",
    duration: "4hr",
  },
  {
    id: "4",
    title: "Deep House Cleaning",
    description:
      "Thorough cleaning service including kitchen, bathrooms, and living areas.",
    category: "Cleaning",
    price: 12000,
    oldPrice: 15000,
    rating: 4.7,
    reviews: 42,
    location: "Lagos",
    duration: "5hr",
  },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Lagos");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar activeTab="services" />

      {/* Hero Section */}
      <section className="bg-(--color-surface) py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl mb-4">
            Find the Perfect{" "}
            <span className="text-[var(--color-secondary)]">Service</span>
          </h1>
          <p className="text-[var(--color-muted)] mb-8 max-w-xl mx-auto">
            Discover and book professional services from verified providers in
            your area. Quality guaranteed, satisfaction assured.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-white rounded-[50px] border border-gray-200 shadow-card max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search size={20} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-2 outline-none text-sm"
              />
            </div>

            <div className="hidden sm:block w-px bg-gray-200" />

            <div className="hidden sm:flex items-center gap-2 flex-1 px-3">
              <MapPin size={20} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="flex-1 py-2 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-[50px] hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Search size={18} />
              <span className="text-sm font-medium">Search</span>
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {SERVICE_CATEGORIES.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-[50px] text-sm transition-colors ${
                  activeCategory === category.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[var(--color-primary)]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Filter Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300">
              <Navigation size={16} />
              Use My Location
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300">
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300">
              <X size={16} />
              Clear All
            </button>
          </div>

          {/* Location Tags */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-500">Searching in:</span>
            <span className="bg-gray-100 px-3 py-1 rounded text-[var(--color-primary)] font-medium">
              {locationQuery || "All Nigeria"}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded text-[var(--color-primary)] font-medium">
              Country: Nigeria
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-xl lg:text-2xl">All Services</h2>
              <p className="text-[var(--color-muted)] text-sm">
                Within 50km of your location
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SAMPLE_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-float transition-shadow"
              >
                {/* Image Placeholder */}
                <div className="h-44 bg-gray-200 relative">
                  <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-xs px-3 py-1 rounded">
                    {service.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={12} />
                    {service.duration}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-heading font-semibold text-base mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-medium">
                      {service.rating}
                    </span>
                    <span className="text-[var(--color-muted)] text-sm">
                      ({service.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[var(--color-muted)] text-sm mb-3">
                    <MapPinned size={14} />
                    {service.location}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[var(--color-primary)] font-heading font-bold text-lg">
                      NGN{service.price.toLocaleString()}
                    </span>
                    <span className="text-[var(--color-muted)] text-sm line-through">
                      NGN{service.oldPrice.toLocaleString()}
                    </span>
                  </div>

                  <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-[50px] font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-2xl lg:text-3xl mb-3">
            Browse by Category
          </h2>
          <p className="text-[var(--color-muted)] mb-10">
            Discover professional services tailored to your needs
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {SERVICE_CATEGORIES.slice(1, 17).map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="card card-hover flex flex-col items-center p-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                  {category.icon && (
                    <category.icon
                      size={24}
                      className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                    />
                  )}
                </div>
                <span className="text-xs font-medium text-center">
                  {category.label}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/services"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Show All 24 Categories →
          </Link>
          <p className="text-[var(--color-muted)] text-sm mt-4">
            24+ categories • 1000+ service providers • 4.5+ average rating
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
