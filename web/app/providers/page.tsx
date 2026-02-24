"use client";

import CategoryPills from "@/components/ui/CategoryPills";
import ComingSoonModal from "@/components/ui/ComingSoonModal";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { MOCK_PROVIDERS, SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    Briefcase,
    MapPin,
    MessageCircle,
    Phone,
    Search,
    Star
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PROVIDER_CATEGORIES = [
  { id: "all", label: "All Providers" },
  ...SERVICE_CATEGORIES.slice(0, 12).map((c) => ({
    id: c.label,
    label: c.label,
  })),
];

export default function ProvidersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const filteredProviders = useMemo(() => {
    let providers = MOCK_PROVIDERS;

    if (activeCategory !== "all") {
      providers = providers.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      providers = providers.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }

    if (sortBy === "rating")
      providers = [...providers].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "reviews")
      providers = [...providers].sort((a, b) => b.reviews - a.reviews);
    else if (sortBy === "jobs")
      providers = [...providers].sort(
        (a, b) => b.completedJobs - a.completedJobs,
      );

    return providers;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Service{" "}
              <span className="text-[var(--color-primary)]">Providers</span>
            </h1>
            <p className="text-gray-500 mb-6">
              Connect with verified professionals near you
            </p>

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-2 max-w-2xl mx-auto">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search providers by name, skill, or location..."
                className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-white border border-gray-200 rounded-full px-3 py-2 outline-none cursor-pointer shrink-0"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="jobs">Most Jobs</option>
              </select>
              <button className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryPills>
              {PROVIDER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[var(--color-primary)] text-white"
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
                {filteredProviders.length}
              </strong>{" "}
              providers found
            </p>
          </div>

          {/* Providers Grid */}
          {filteredProviders.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.id}`}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-(--color-primary) text-white flex items-center justify-center text-xl font-bold shrink-0">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-(--color-primary) transition-colors truncate">
                          {provider.name}
                        </h3>
                        {provider.isOnline && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0"
                            title="Online"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {provider.category}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {provider.providerType && (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              provider.providerType === "Business"
                                ? "bg-blue-50 text-blue-700"
                                : provider.providerType === "Specialist"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {provider.providerType}
                          </span>
                        )}
                        {provider.badge && (
                          <span className="inline-block px-2 py-0.5 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-xs font-medium">
                            {provider.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {provider.rating} ({provider.reviews})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {provider.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} /> {provider.completedJobs} jobs
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {provider.skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {provider.skills.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        +{provider.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Price + Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-900">
                      {provider.price}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (provider.phone)
                            window.open(`tel:${provider.phone}`);
                        }}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title="Call"
                      >
                        <Phone size={14} className="text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setChatModalOpen(true);
                        }}
                        className="p-2 bg-[var(--color-primary-light)] rounded-full hover:bg-green-100 transition-colors"
                        title="Message"
                      >
                        <MessageCircle
                          size={14}
                          className="text-[var(--color-primary)]"
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No providers found
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

        {/* Become a Provider CTA */}
        <div className="bg-[var(--color-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Are you a service provider?
            </h2>
            <p className="text-white/80 mb-6">
              Join thousands of professionals earning on HANDI
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 bg-white text-[var(--color-primary)] rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ComingSoonModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        title="Chat"
        message="The in-app messaging feature is coming soon! You'll be able to chat directly with service providers."
      />
    </>
  );
}
