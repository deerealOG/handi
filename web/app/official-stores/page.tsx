"use client";

import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { MOCK_PROVIDERS } from "@/data/mockApi";
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
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Star,
    Store,
    X
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 9;

const CATEGORIES = [
  "Electronics",
  "Fashion & Apparel",
  "Home Appliances",
  "Groceries",
  "Health & Beauty",
  "Automotive Parts",
  "Computing",
  "Sports & Outdoors"
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "top-rated", label: "Top Rated" },
  { value: "most-reviews", label: "Most Reviews" },
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
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-blue-600" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4.5" : "translate-x-1"}`}
    />
  </button>
);

export default function OfficialStoresPage() {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useCart();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);

  // Only pull in generic locations for demo
  const locations = [...new Set(MOCK_PROVIDERS.map((p) => p.location))];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocation("");
    setMinRating(null);
    setSearch("");
    setPage(1);
  };

  const activeFilterCount = [
    selectedCategories.length > 0,
    !!selectedLocation,
    minRating !== null,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    // We only want OFFICIAL stores:
    const baseStores = MOCK_PROVIDERS.filter((p) => p.badge === "Verified" || p.badge === "Premium");

    const results = baseStores.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.category.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)
      )
        // Note: MOCK_PROVIDERS might not have these specific "product" categories,
        // but this logic holds for a real backend returning Store types.
        return false;
      if (selectedLocation && p.location !== selectedLocation) return false;
      if (minRating && p.rating < minRating) return false;
      
      return true;
    });

    switch (sortBy) {
      case "top-rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "most-reviews":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case "recommended":
      default:
        // Randomize/Keep default for recommended
        break;
    }
    return results;
  }, [
    search,
    selectedCategories,
    selectedLocation,
    minRating,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const getBadgeStyle = (badge: string | null) => {
    switch (badge) {
      case "Verified":
        return "bg-blue-100 text-blue-700";
      case "Premium":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
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
          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Regions</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Store Categories</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h4>
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
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
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
      
      {/* Hero Banner for Official Stores */}
      <div className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-blue-400 w-8 h-8" />
              <h1 className="text-3xl font-bold">Official Stores</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Shop directly from globally recognized brands and top-tier authorized distributors. Guaranteed authentic products and premium service.
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 text-center">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Authentic</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 text-center">
              <div className="text-2xl font-bold text-white mb-1">Premium</div>
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Store Category Pill Cards */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedCategories.includes(cat)
                    ? "bg-blue-50 border-blue-400 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Store size={18} className={selectedCategories.includes(cat) ? "text-blue-600" : "text-gray-400"} />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">{cat.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for an official brand or store..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
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
                <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="flex gap-8">
            {/* Filters Sidebar — Desktop */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Filter size={16} /> Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                    {filtered.length} stores
                  </span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Store Grid */}
              {paginated.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                  <Store size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No stores found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    View All Official Stores
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                      : "flex flex-col gap-4"
                  }
                >
                {paginated.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/providers/${p.id}`)}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-100 ${viewMode === "list" ? "flex flex-row" : "flex flex-col"}`}
                    >

                      {/* Cover Photo */}
                      <div className={`bg-gray-100 overflow-hidden relative ${viewMode === "list" ? "w-40 h-auto shrink-0" : "h-36 w-full"}`}>
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-blue-200 bg-blue-50">
                            <Store size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute bottom-3 left-3 flex gap-2">
                           <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">
                             <ShieldCheck size={12} className="text-blue-600" /> Official
                           </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2 mb-1">
                           <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-blue-600 transition-colors">
                             {p.name}
                           </h3>
                           <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                              <Star size={12} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                           </div>
                        </div>
                        <p className="text-xs font-medium text-blue-600 mb-3">{p.category}</p>
                        
                        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                           <span className="flex items-center gap-1">
                             <MapPin size={14} className="text-gray-400" /> {p.location}
                           </span>
                           <span className="font-medium bg-gray-50 px-2 py-1 rounded-md">{p.reviews} Reviews</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${page === i + 1 ? "bg-blue-600 shadow-md shadow-blue-200 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Filter size={18} className="text-blue-600" /> Filters
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filterContent}
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50">
               <button
                 onClick={() => setShowMobileFilters(false)}
                 className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
               >
                 Show Results ({filtered.length})
               </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}
