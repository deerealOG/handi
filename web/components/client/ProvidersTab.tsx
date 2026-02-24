"use client";

import { useCart } from "@/context/CartContext";
import { MOCK_PROVIDERS } from "@/data/mockApi";
import {
    ChevronRight,
    Heart,
    MapPin,
    MessageSquare,
    Phone,
    Search,
    Star,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const PROVIDER_TYPES = ["All", "Business", "Specialist", "Freelancer"] as const;

export default function ProvidersTab() {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const { toggleWishlist, isInWishlist } = useCart();

  const filtered = MOCK_PROVIDERS.filter((p) => {
    const matchesType =
      selectedType === "All" || p.providerType === selectedType;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const grouped = PROVIDER_TYPES.filter((t) => t !== "All").reduce(
    (acc, type) => {
      acc[type] = filtered.filter(
        (p) =>
          p.providerType === type || (!p.providerType && type === "Freelancer"),
      );
      return acc;
    },
    {} as Record<string, typeof MOCK_PROVIDERS>,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse verified professionals near you
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search providers by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
        />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {PROVIDER_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedType === type
                ? "bg-(--color-primary) text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Provider Groups */}
      {selectedType === "All" ? (
        // Show grouped by type
        Object.entries(grouped).map(
          ([type, providers]) =>
            providers.length > 0 && (
              <section key={type}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{type}s</h2>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {providers.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providers.map((p) => (
                    <ProviderCard
                      key={p.id}
                      provider={p}
                      onClick={() => setSelectedProvider(p)}
                      isWished={isInWishlist(p.id)}
                      onToggleWishlist={() => toggleWishlist(p.id)}
                    />
                  ))}
                </div>
              </section>
            ),
        )
      ) : (
        // Show flat list
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-full text-center py-12">
              No providers found matching your criteria.
            </p>
          ) : (
            filtered.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                onClick={() => setSelectedProvider(p)}
                isWished={isInWishlist(p.id)}
                onToggleWishlist={() => toggleWishlist(p.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-linear-to-r from-(--color-primary) to-emerald-700 p-6 rounded-t-2xl text-center relative">
              <button
                onClick={() => setSelectedProvider(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
              >
                ✕
              </button>
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 overflow-hidden">
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
              <h3 className="text-xl font-bold text-white">
                {selectedProvider.name}
              </h3>
              <p className="text-white/80 text-sm mt-1">
                {selectedProvider.category}
              </p>
              {selectedProvider.providerType && (
                <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                  {selectedProvider.providerType}
                </span>
              )}
            </div>

            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedProvider.rating}
                  </p>
                  <p className="text-[10px] text-gray-500">Rating</p>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedProvider.reviews}
                  </p>
                  <p className="text-[10px] text-gray-500">Reviews</p>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedProvider.completedJobs || 0}
                  </p>
                  <p className="text-[10px] text-gray-500">Jobs Done</p>
                </div>
              </div>

              {/* Location */}
              {selectedProvider.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  {selectedProvider.location}
                </div>
              )}

              {/* Bio */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedProvider.bio ||
                  `${selectedProvider.name} is a verified professional specializing in ${selectedProvider.category}. Book with confidence.`}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    alert("Calling " + selectedProvider.name + "...");
                  }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Call
                </button>
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    alert("Opening chat with " + selectedProvider.name);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Message
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  alert("Booking " + selectedProvider.name);
                }}
                className="w-full py-3 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90"
              >
                Book This Provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderCard({
  provider,
  onClick,
  isWished,
  onToggleWishlist,
}: {
  provider: any;
  onClick: () => void;
  isWished: boolean;
  onToggleWishlist: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative group"
    >
      {/* Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
      >
        <Heart
          size={16}
          className={isWished ? "text-red-500 fill-red-500" : "text-gray-300"}
        />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-lg overflow-hidden shrink-0">
          {provider.image ? (
            <Image
              src={provider.image}
              alt={provider.name}
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          ) : (
            provider.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {provider.name}
          </p>
          <p className="text-xs text-gray-500">{provider.category}</p>
          {provider.providerType && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-(--color-primary-light) text-(--color-primary) text-[10px] font-semibold rounded-full">
              {provider.providerType}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          {provider.rating} ({provider.reviews})
        </span>
        <div className="flex items-center gap-2">
          {provider.isOnline && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
              ● Online
            </span>
          )}
          <ChevronRight size={14} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
}
