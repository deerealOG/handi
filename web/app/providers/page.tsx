"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { MOCK_PROVIDERS } from "@/data/mockApi";
import {
    ChevronRight,
    Heart,
    LayoutGrid,
    List,
    MapPin,
    MessageCircle,
    Phone,
    Search,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PROVIDER_TYPES = ["All", "Business", "Specialist", "Freelancer"] as const;

export default function ProvidersPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Find Professional{" "}
                <span className="text-(--color-secondary)">
                  Service Providers
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Browse verified professionals near you
              </p>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-(--color-primary)"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-(--color-primary)"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
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

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {PROVIDER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`shrink-0 cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${
                  selectedType === type
                    ? "bg-(--color-primary) text-white border-(--color-primary)"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Providers Content */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No providers found matching your criteria.
              </p>
            </div>
          ) : selectedType === "All" && !searchQuery ? (
            <div className="space-y-8">
              {PROVIDER_TYPES.filter((t) => t !== "All").map(
                (type) =>
                  grouped[type]?.length > 0 && (
                    <div key={type} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                          {type}
                        </h2>
                        <button
                          onClick={() => setSelectedType(type)}
                          className="text-sm text-(--color-primary) font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          View All <ChevronRight size={16} />
                        </button>
                      </div>
                      {viewMode === "grid" ? (
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                          {grouped[type].map((p) => (
                            <div
                              key={p.id}
                              className="w-[180px] md:w-[220px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 shrink-0"
                            >
                              <ProviderCard
                                provider={p}
                                viewMode="grid"
                                onClick={() => setSelectedProvider(p)}
                                isWished={isInWishlist(p.id)}
                                onToggleWishlist={() =>
                                  toggleWishlist(p.id, {
                                    preventDefault: () => {},
                                    stopPropagation: () => {},
                                  } as any)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {grouped[type].map((p) => (
                            <div
                              key={p.id}
                              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                            >
                              <ProviderCard
                                provider={p}
                                viewMode="list"
                                onClick={() => setSelectedProvider(p)}
                                isWished={isInWishlist(p.id)}
                                onToggleWishlist={() =>
                                  toggleWishlist(p.id, {
                                    preventDefault: () => {},
                                    stopPropagation: () => {},
                                  } as any)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-3"
              }
            >
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <ProviderCard
                    provider={p}
                    viewMode={viewMode}
                    onClick={() => setSelectedProvider(p)}
                    isWished={isInWishlist(p.id)}
                    onToggleWishlist={() =>
                      toggleWishlist(p.id, {
                        preventDefault: () => {},
                        stopPropagation: () => {},
                      } as any)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Provider Detail Modal */}
          {selectedProvider && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedProvider(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-linear-to-r from-(--color-primary) to-emerald-700 p-6 rounded-t-2xl text-center relative">
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 cursor-pointer"
                  >
                    <X size={16} />
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
                      `${selectedProvider.name} is a verified professional specializing in ${selectedProvider.category}.`}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedProvider(null);
                        router.push("/login");
                      }}
                      className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone size={16} /> Call
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProvider(null);
                        router.push("/login");
                      }}
                      className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-green-700 hover:bg-green-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProvider(null);
                      router.push("/login");
                    }}
                    className="w-full py-3 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Book This Provider
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function ProviderCard({
  provider,
  onClick,
  isWished,
  onToggleWishlist,
  viewMode = "grid",
}: {
  provider: any;
  onClick: () => void;
  isWished: boolean;
  onToggleWishlist: () => void;
  viewMode?: "grid" | "list";
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative group flex ${viewMode === "grid" ? "flex-col justify-between h-full" : "flex-row items-center justify-between"}`}
    >
      {/* Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className={`absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform z-10 cursor-pointer ${viewMode === "grid" ? "top-2 right-2 sm:top-3 sm:right-3 bg-white" : "top-2 right-2 sm:top-3 sm:right-3 bg-gray-50"}`}
      >
        <Heart
          size={14}
          className={`${isWished ? "text-red-500 fill-red-500" : "text-gray-300"} sm:w-4 sm:h-4`}
        />
      </button>

      <div
        className={`flex ${viewMode === "grid" ? "flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3" : "flex-row items-center gap-3 sm:gap-4 flex-1"}`}
      >
        <div
          className={`rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-lg overflow-hidden shrink-0 ${viewMode === "grid" ? "w-10 h-10 sm:w-14 sm:h-14" : "w-12 h-12 sm:w-16 sm:h-16"}`}
        >
          {provider.image ? (
            <Image
              src={provider.image}
              alt={provider.name}
              width={64}
              height={64}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            provider.name.charAt(0)
          )}
        </div>
        <div
          className={`flex-1 min-w-0 ${viewMode === "grid" ? "w-full mb-1 sm:mb-0" : ""}`}
        >
          <div
            className={`${viewMode === "list" ? "flex flex-col sm:flex-row sm:items-center sm:justify-between pr-8 sm:pr-12" : ""}`}
          >
            <div>
              <p
                className={`font-semibold text-gray-900 ${viewMode === "grid" ? "text-[11px] sm:text-sm pr-6 sm:pr-0" : "text-sm sm:text-base"}`}
              >
                {provider.name}
              </p>
              <div
                className={`flex flex-wrap items-center gap-2 ${viewMode === "list" ? "mt-0.5 sm:mt-1" : "mt-0"}`}
              >
                <p className="text-[9px] sm:text-xs text-gray-500 truncate">
                  {provider.category}
                </p>
                {viewMode === "list" && provider.providerType && (
                  <span className="px-2 py-0.5 bg-(--color-primary-light) text-(--color-primary) text-[10px] sm:text-xs font-medium rounded-full truncate">
                    {provider.providerType}
                  </span>
                )}
              </div>
            </div>
            {viewMode === "list" && (
              <div className="flex flex-col sm:items-end mt-1 sm:mt-0">
                <span className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {provider.rating}{" "}
                  <span className="text-gray-400 font-normal">
                    ({provider.reviews})
                  </span>
                </span>
                {provider.isOnline && (
                  <span className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold rounded-full w-fit">
                    ● Online
                  </span>
                )}
              </div>
            )}
          </div>
          {viewMode === "grid" && provider.providerType && (
            <span className="inline-block mt-1 px-1.5 sm:px-2 py-0.5 bg-(--color-primary-light) text-(--color-primary) text-[8px] sm:text-[10px] font-semibold rounded-full truncate max-w-full">
              {provider.providerType}
            </span>
          )}
        </div>
      </div>

      {viewMode === "grid" && (
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-0.5">
            <Star
              size={10}
              className="text-yellow-400 fill-yellow-400 sm:w-3 sm:h-3"
            />
            {provider.rating}{" "}
            <span className="hidden sm:inline">({provider.reviews})</span>
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            {provider.isOnline && (
              <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-[8px] sm:text-[10px] font-semibold rounded-full">
                ● Online
              </span>
            )}
            <ChevronRight size={12} className="text-gray-300 sm:w-4 sm:h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
