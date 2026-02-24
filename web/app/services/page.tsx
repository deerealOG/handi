"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CategoryPills from "@/components/ui/CategoryPills";
import { useCart } from "@/context/CartContext";
import { MOCK_SERVICES, SERVICE_CATEGORIES } from "@/data/mockApi";
import { Clock, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "rating";
  const initialLocation = searchParams.get("location") || "";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState(initialSort);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const filteredServices = useMemo(() => {
    let services = MOCK_SERVICES;

    // Category filter
    if (activeCategory !== "all") {
      services = services.filter((s) => s.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }

    // Location filter
    if (initialLocation) {
      const loc = initialLocation.toLowerCase();
      services = services.filter((s) => s.location.toLowerCase().includes(loc));
    }

    // Price range filter
    if (initialMinPrice) {
      services = services.filter((s) => s.price >= Number(initialMinPrice));
    }
    if (initialMaxPrice) {
      services = services.filter((s) => s.price <= Number(initialMaxPrice));
    }

    // Sort
    if (sortBy === "rating")
      services = [...services].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price-low")
      services = [...services].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high")
      services = [...services].sort((a, b) => b.price - a.price);
    else if (sortBy === "reviews")
      services = [...services].sort((a, b) => b.reviews - a.reviews);

    return services;
  }, [
    activeCategory,
    searchQuery,
    sortBy,
    initialLocation,
    initialMinPrice,
    initialMaxPrice,
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Browse <span className="text-(--color-primary)">Services</span>
            </h1>
            <p className="text-black/80 mb-6">
              Find the perfect service provider for your needs
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-2 max-w-2xl lg:w-4xl">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search services, providers..."
                className="flex-1  text-gray-900 placeholder:text-gray-500 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-white border border-gray-200 rounded-full px-3 py-2 outline-none cursor-pointer shrink-0"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
              <button className="bg-(--color-primary) text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryPills>
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === "all"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Services
              </button>
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? "bg-(--color-primary) text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </CategoryPills>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Result Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              <strong className="text-gray-900">
                {filteredServices.length}
              </strong>{" "}
              services found
              {activeCategory !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-(--color-primary) font-medium capitalize">
                    {activeCategory.replace("-", " ")}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[var(--color-primary-light)] to-blue-50 flex items-center justify-center">
                    <span className="text-4xl">🔧</span>
                    {service.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {Math.round(
                          ((service.originalPrice - service.price) /
                            service.originalPrice) *
                            100,
                        )}
                        % OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        {service.rating} ({service.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {service.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {service.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ₦{service.price.toLocaleString()}
                        </span>
                        {service.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            ₦{service.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--color-primary)] font-medium">
                        {service.provider}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="bg-(--color-primary)">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Can&apos;t find what you need?
            </h2>
            <p className="text-white/80 mb-6">
              Post your requirement and let providers come to you
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 bg-white text-[var(--color-primary)] rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Post a Request
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-lg">Loading...</span>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
