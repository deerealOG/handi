"use client";

import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { MOCK_PROVIDERS, SERVICE_CATEGORIES } from "@/data/mockApi";
import { Suspense } from "react";
import {
    Award,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Filter,
    Heart,
    LayoutGrid,
    List,
    MapPin,
    MessageCircle,
    Phone,
    Search,
    SlidersHorizontal,
    Star,
    X
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

const ITEMS_PER_PAGE = 9;

const PROFESSIONS = [
  "Electrical",
  "Plumbing",
  "Beauty & Wellness",
  "Cleaning",
  "Technology",
  "Automotive",
  "Home Improvement",
  "Gardening",
  "Event & Party",
  "Security",
  "Fitness",
  "Construction",
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "top-rated", label: "Top Rated" },
  { value: "most-experienced", label: "Most Experienced" },
  { value: "most-jobs", label: "Most Jobs Completed" },
  { value: "fastest", label: "Fastest Response" },
];

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-emerald-600" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4.5" : "translate-x-1"}`}
    />
  </button>
);

export default function ProvidersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleWishlist, isInWishlist } = useCart();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Filter states
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minExperience, setMinExperience] = useState<string>("");
  const [minJobs, setMinJobs] = useState<string>("");
  const [availability, setAvailability] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [fastResponseOnly, setFastResponseOnly] = useState(false);
  const [isOfficialStoreView, setIsOfficialStoreView] = useState(false);

  useEffect(() => {
    if (searchParams.get("type") === "official") {
      setIsOfficialStoreView(true);
      setVerifiedOnly(true);
    } else {
      setIsOfficialStoreView(false);
    }
  }, [searchParams]);

  const locations = [...new Set(MOCK_PROVIDERS.map((p) => p.location))];

  const toggleProfession = (prof: string) => {
    setSelectedProfessions((prev) =>
      prev.includes(prof) ? prev.filter((p) => p !== prof) : [...prev, prof],
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedProfessions([]);
    setSelectedLocation("");
    setMinRating(null);
    setMinExperience("");
    setMinJobs("");
    setAvailability("");
    setVerifiedOnly(false);
    setTopRatedOnly(false);
    setFastResponseOnly(false);
    setSearch("");
    setPage(1);
  };

  const activeFilterCount = [
    selectedProfessions.length > 0,
    !!selectedLocation,
    minRating !== null,
    !!minExperience,
    !!minJobs,
    !!availability,
    verifiedOnly,
    topRatedOnly,
    fastResponseOnly,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const results = MOCK_PROVIDERS.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.category.toLowerCase().includes(search.toLowerCase()) &&
        !(p.skills as string[] | undefined)?.some((s: string) =>
          s.toLowerCase().includes(search.toLowerCase()),
        )
      )
        return false;
      if (
        selectedProfessions.length > 0 &&
        !selectedProfessions.includes(p.category)
      )
        return false;
      if (selectedLocation && p.location !== selectedLocation) return false;
      if (minRating && p.rating < minRating) return false;
      if (minJobs && ((p.completedJobs as number) || 0) < Number(minJobs))
        return false;
      if (verifiedOnly && p.badge !== "Verified" && p.badge !== "Top Rated")
        return false;
      if (topRatedOnly && p.rating < 4.7) return false;
      if (fastResponseOnly && !p.isOnline) return false;
      if (availability === "today" && !p.isOnline) return false;
      if (isOfficialStoreView && p.badge !== "Verified" && p.badge !== "Premium") return false;
      return true;
    });

    switch (sortBy) {
      case "top-rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "most-experienced":
        results.sort(
          (a, b) =>
            ((b.completedJobs as number) || 0) -
            ((a.completedJobs as number) || 0),
        );
        break;
      case "most-jobs":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case "fastest":
        results.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
        break;
    }
    return results;
  }, [
    search,
    selectedProfessions,
    selectedLocation,
    minRating,
    minJobs,
    verifiedOnly,
    topRatedOnly,
    fastResponseOnly,
    availability,
    sortBy,
    isOfficialStoreView,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const recommended = MOCK_PROVIDERS.filter(
    (p) => p.rating >= 4.7 && !paginated.find((pp) => pp.id === p.id),
  ).slice(0, 4);

  const getBadgeStyle = (badge: string | null) => {
    switch (badge) {
      case "Verified":
        return "bg-green-100 text-green-700";
      case "Top Rated":
        return "bg-yellow-100 text-yellow-700";
      case "Featured":
        return "bg-purple-100 text-purple-700";
      case "Premium":
        return "bg-blue-100 text-blue-700";
      case "Specialist":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case "Verified":
        return "✔";
      case "Top Rated":
        return "⭐";
      case "Featured":
        return "🌟";
      case "Premium":
        return "💎";
      case "Specialist":
        return "🏆";
      default:
        return "";
    }
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Location</h4>
        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="">All Areas</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Profession / Skill */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Profession</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {PROFESSIONS.map((prof) => (
            <label
              key={prof}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedProfessions.includes(prof)}
                onChange={() => toggleProfession(prof)}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {prof}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => {
                  setMinRating(minRating === r ? null : r);
                  setPage(1);
                }}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={
                      s <= r
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Completed Jobs */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Completed Jobs
        </h4>
        <div className="space-y-2">
          {[
            { value: "10", label: "10+ jobs" },
            { value: "50", label: "50+ jobs" },
            { value: "100", label: "100+ jobs" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="jobs"
                checked={minJobs === opt.value}
                onChange={() => {
                  setMinJobs(minJobs === opt.value ? "" : opt.value);
                  setPage(1);
                }}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Availability
        </h4>
        <div className="space-y-2">
          {[
            { value: "today", label: "Available Today" },
            { value: "tomorrow", label: "Available Tomorrow" },
            { value: "flexible", label: "Flexible Schedule" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="availability"
                checked={availability === opt.value}
                onChange={() => {
                  setAvailability(availability === opt.value ? "" : opt.value);
                  setPage(1);
                }}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Provider Status */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Provider Status
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Verified Providers</span>
            <Toggle
              checked={verifiedOnly}
              onChange={() => {
                setVerifiedOnly(!verifiedOnly);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Top Rated</span>
            <Toggle
              checked={topRatedOnly}
              onChange={() => {
                setTopRatedOnly(!topRatedOnly);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Fast Response</span>
            <Toggle
              checked={fastResponseOnly}
              onChange={() => {
                setFastResponseOnly(!fastResponseOnly);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Service <span className="text-primary">Professionals</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse verified professionals offering services near you.
              <span className="font-medium text-gray-700 ml-1">
                {filtered.length} providers available
              </span>
            </p>
          </div>

          {/* Category Pill Cards */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
            {SERVICE_CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleProfession(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                  selectedProfessions.includes(cat.id)
                    ? "bg-(--color-primary)/10 border-(--color-primary) shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-50 overflow-hidden relative">
                  <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for a provider or skill..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="flex gap-6">
            {/* Filters Sidebar — Desktop */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Filter size={16} /> Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>
                {filterContent}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Sorting + View Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-primary"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                    {filtered.length}
                  </span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Provider Grid */}
              {paginated.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No providers found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary cursor-pointer"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => {
                        clearFilters();
                      }}
                      className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Browse All Providers
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                {paginated.map((p) => (
                    <div
                      key={p.id}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer relative border border-gray-100 ${viewMode === "list" ? "flex flex-row" : "flex flex-col"}`}
                      onClick={() => router.push(`/providers/${p.id}`)}
                    >
                      {/* Wishlist heart */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10 cursor-pointer"
                      >
                        <Heart
                          size={14}
                          className={
                            isInWishlist(p.id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>

                      {/* Image Area */}
                      <div className={`bg-gray-100 overflow-hidden relative ${viewMode === "list" ? "w-32 h-auto shrink-0" : "h-32 w-full"}`}>
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-emerald-600 bg-emerald-50">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        {/* Online badge on image */}
                        {p.isOnline && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                            ● Online
                          </span>
                        )}
                        {/* Provider badge on image */}
                        {p.badge && (
                          <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(p.badge)}`}>
                            {getBadgeIcon(p.badge)} {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
                        <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {p.description || `Professional ${p.category.toLowerCase()} services in ${p.location}.`}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            {p.rating}
                            <span className="font-normal text-gray-400">({p.reviews})</span>
                          </span>
                          {(p.completedJobs as number) > 0 && (
                            <span className="flex items-center gap-1">
                              <Briefcase size={11} /> {p.completedJobs as number} jobs
                            </span>
                          )}
                        </div>

                        {/* Location */}
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5">
                          <MapPin size={11} className="shrink-0" /> {p.location}
                        </p>

                        {/* Price Range */}
                        <p className="text-sm font-bold text-primary mt-2">{p.price}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/providers/${p.id}`);
                            }}
                            className="flex-1 py-2 bg-gray-100 text-gray-900 text-xs font-semibold rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/providers/${p.id}?action=book`);
                            }}
                            className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary transition-colors cursor-pointer"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${page === i + 1 ? "bg-primary text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Providers */}
          {recommended.length > 0 && (
            <div className="mt-12 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Award size={20} className="text-primary" /> Recommended
                Professionals
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/providers/${p.id}`)}
                    className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {p.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="font-semibold text-gray-700">
                        {p.rating}
                      </span>
                      <span>· {p.location}</span>
                    </div>
                    {p.badge && (
                      <span
                        className={`inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${getBadgeStyle(p.badge)}`}
                      >
                        {getBadgeIcon(p.badge)} {p.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {filterContent}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary cursor-pointer"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-primary p-6 rounded-t-2xl text-center relative">
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
              <div className="flex items-center justify-center gap-2 mt-2">
                {selectedProvider.badge && (
                  <span className="px-3 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                    {getBadgeIcon(selectedProvider.badge)}{" "}
                    {selectedProvider.badge}
                  </span>
                )}
                {selectedProvider.isOnline && (
                  <span className="px-2 py-0.5 bg-green-400/30 text-white text-xs font-semibold rounded-full">
                    ● Online
                  </span>
                )}
              </div>
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
                    {(selectedProvider.completedJobs as number) || 0}
                  </p>
                  <p className="text-[10px] text-gray-500">Jobs Done</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                {selectedProvider.location}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {(selectedProvider.bio as string) ||
                  `${selectedProvider.name} is a verified professional specializing in ${selectedProvider.category}. Providing top-quality services in the Lagos area.`}
              </p>

              {/* Price Range */}
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-sm font-semibold text-primary">
                  Price Range: {selectedProvider.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    router.push(`/providers/${selectedProvider.id}`);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-primary hover:bg-primary flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone size={16} /> Call
                </button>
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    router.push(`/providers/${selectedProvider.id}`);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-primary hover:bg-primary flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={16} /> Message
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  router.push(`/providers/${selectedProvider.id}`);
                }}
                className="w-full py-3 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 cursor-pointer"
              >
                Book This Provider
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
