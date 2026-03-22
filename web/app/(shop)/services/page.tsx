"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BookingModal from "@/components/shared/BookingModal";
import { MOCK_SERVICES, SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Filter,
    Heart,
    LayoutGrid,
    List,
    MapPin,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "top-rated", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
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

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookingService, setBookingService] = useState<any>(null);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const locations = [...new Set(MOCK_SERVICES.map((s) => s.location))];

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
    setPriceMin("");
    setPriceMax("");
    setVerifiedOnly(false);
    setAvailableToday(false);
    setOnSaleOnly(false);
    setSearch("");
    setPage(1);
  };

  const activeFilterCount = [
    selectedCategories.length > 0,
    !!selectedLocation,
    minRating !== null,
    !!priceMin || !!priceMax,
    verifiedOnly,
    availableToday,
    onSaleOnly,
  ].filter(Boolean).length;

  const isServiceAvailable = (id: string) => {
    const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return hash % 3 !== 0;
  };

  const filtered = useMemo(() => {
    const results = MOCK_SERVICES.filter((s) => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.provider.toLowerCase().includes(search.toLowerCase()) &&
        !s.category.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(s.category)
      )
        return false;
      if (selectedLocation && s.location !== selectedLocation) return false;
      if (minRating && s.rating < minRating) return false;
      if (priceMin && s.price < Number(priceMin)) return false;
      if (priceMax && s.price > Number(priceMax)) return false;
      if (verifiedOnly && s.rating < 4.5) return false;
      if (availableToday && !isServiceAvailable(s.id)) return false;
      if (onSaleOnly && !s.originalPrice) return false;
      return true;
    });

    switch (sortBy) {
      case "top-rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "recommended":
        results.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
        break;
    }
    return results;
  }, [
    search,
    selectedCategories,
    selectedLocation,
    minRating,
    priceMin,
    priceMax,
    verifiedOnly,
    availableToday,
    onSaleOnly,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const recommended = MOCK_SERVICES.filter(
    (s) => s.rating >= 4.5 && !paginated.find((p) => p.id === s.id),
  ).slice(0, 4);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBookNow = (service: any) => {
    if (user) {
      setBookingService(service);
      setBookingOpen(true);
    } else {
      router.push("/login");
    }
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Category</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {SERVICE_CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Location</h4>
        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Price Range (₦)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => {
              setPriceMin(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-primary w-full"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => {
              setPriceMax(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-primary w-full"
          />
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
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary cursor-pointer"
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

      {/* Availability */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Availability
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Available Today</span>
          <Toggle
            checked={availableToday}
            onChange={() => {
              setAvailableToday(!availableToday);
              setPage(1);
            }}
          />
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
            <span className="text-sm text-gray-600">On Sale</span>
            <Toggle
              checked={onSaleOnly}
              onChange={() => {
                setOnSaleOnly(!onSaleOnly);
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Browse <span className="text-primary">Services</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Find reliable professionals for any service you need.
              <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">
                {filtered.length} services available
              </span>
            </p>
          </div>

          {/* Category Pill Cards */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
            {SERVICE_CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => { toggleCategory(cat.id); }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-md border transition-all cursor-pointer ${
                  selectedCategories.includes(cat.id)
                    ? "bg-(--color-primary)/10 border-(--color-primary) shadow-sm"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-gray-50 overflow-hidden relative">
                  <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{cat.label}</span>
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
                placeholder="Search services, providers, categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 rounded-md text-sm border border-gray-200 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-sm cursor-pointer"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
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
                    className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-(--color-primary)"
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
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-(--color-primary)" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-(--color-primary)" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Grid */}
              {paginated.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    No services found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters or search query.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-(--color-primary) cursor-pointer"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => clearFilters()}
                      className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Browse All Services
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
                  {paginated.map((s) => (
                    <div
                      key={s.id}
                      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer relative ${viewMode === "list" ? "flex flex-row" : "flex flex-col"}`}
                    >
                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(s.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10 cursor-pointer"
                      >
                        <Heart
                          size={14}
                          className={
                            isInWishlist(s.id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>

                      {/* Image */}
                      <div
                        className={`${viewMode === "list" ? "w-36 sm:w-48 shrink-0" : "h-36 sm:h-44"} bg-gray-200 relative overflow-hidden`}
                        onClick={() => router.push(`/services/${s.id}`)}
                      >
                        <Image
                          src={s.image}
                          alt={s.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {s.originalPrice && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              -
                              {Math.round(
                                (1 - s.price / s.originalPrice) * 100,
                              )}
                              %
                            </span>
                          )}
                          {isServiceAvailable(s.id) && (
                            <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle size={8} /> Available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div
                        className="p-4 flex-1 flex flex-col"
                        onClick={() => router.push(`/services/${s.id}`)}
                      >
                        {/* Category badge */}
                        <span className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                          {s.category.replace("-", " ")}
                        </span>

                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {s.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {s.provider}
                        </p>

                        {/* Meta row */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span className="flex items-center gap-1 font-semibold text-gray-700">
                            <Star
                              size={11}
                              className="text-yellow-400 fill-yellow-400"
                            />{" "}
                            {s.rating}
                            <span className="font-normal text-gray-400">
                              ({s.reviews})
                            </span>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} /> {s.duration}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} /> {s.location.split(",")[0]}
                          </span>
                        </div>

                        {/* Price + Actions */}
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-primary">
                              ₦{s.price.toLocaleString()}
                            </span>
                            {s.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ₦{s.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookNow(s);
                            }}
                            className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary transition-colors cursor-pointer"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(s.id, "service");
                            }}
                            className="py-2 px-2.5 border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Add to Cart"
                          >
                            <ShoppingCart size={14} />
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

          {/* Recommended Services */}
          {recommended.length > 0 && (
            <div className="mt-12 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Star size={20} className="text-primary" /> Recommended
                Services
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="h-28 bg-gray-200 relative overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {s.name}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {s.provider}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-emerald-600">
                          ₦{s.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                          <Star
                            size={9}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {s.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
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

      {/* Booking Modal */}
      {bookingService && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => {
            setBookingOpen(false);
            setBookingService(null);
          }}
          serviceName={bookingService.name}
          providerName={bookingService.provider}
          price={bookingService.price}
          serviceId={bookingService.id}
        />
      )}

      <Footer />
    </>
  );
}
