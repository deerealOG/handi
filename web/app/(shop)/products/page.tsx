"use client";

import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { MOCK_PRODUCTS } from "@/data/mockApi";
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Heart,
    LayoutGrid,
    List,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 8;

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "electrical", label: "Electrical Tools" },
  { value: "tools", label: "Power Tools" },
  { value: "cleaning", label: "Cleaning Supplies" },
  { value: "plumbing", label: "Plumbing Materials" },
  { value: "beauty", label: "Beauty Products" },
  { value: "automotive", label: "Automotive" },
  { value: "safety", label: "Safety Equipment" },
];

const BRANDS = ["QASA", "Makita", "Professional", "Industrial", "SafetyGear"];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-low", label: "Lowest Price" },
  { value: "price-high", label: "Highest Price" },
  { value: "top-rated", label: "Top Rated" },
  { value: "newest", label: "Newest" },
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

export default function ProductsPage() {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setCategory("all");
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
    setMinRating(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearch("");
    setPage(1);
  };

  const activeFilterCount = [
    category !== "all",
    selectedBrands.length > 0,
    !!priceMin || !!priceMax,
    minRating !== null,
    inStockOnly,
    onSaleOnly,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    const results = MOCK_PRODUCTS.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (category !== "all" && p.category !== category) return false;
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.some((b) =>
          p.name.toLowerCase().includes(b.toLowerCase()),
        )
      )
        return false;
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      if (minRating && p.rating < minRating) return false;
      if (inStockOnly && !p.inStock) return false;
      if (onSaleOnly && !p.originalPrice) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "top-rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "best-selling":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        results.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return results;
  }, [
    search,
    category,
    selectedBrands,
    priceMin,
    priceMax,
    minRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Recommended products (just show ones not currently visible)
  const recommended = MOCK_PRODUCTS.filter(
    (p) => !paginatedProducts.find((pp) => pp.id === p.id),
  ).slice(0, 4);

  // Filter Sidebar Content (shared between desktop sidebar and mobile drawer)
  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={category === cat.value}
                onChange={() => {
                  setCategory(cat.value);
                  setPage(1);
                }}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => {
                  toggleBrand(brand);
                  setPage(1);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {brand}
              </span>
            </label>
          ))}
        </div>
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
            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
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
            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
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

      {/* Availability */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Availability
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">In Stock Only</span>
          <Toggle
            checked={inStockOnly}
            onChange={() => {
              setInStockOnly(!inStockOnly);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Discount */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Discount</h4>
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

      {/* Clear All */}
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
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shop <span className="text-primary">Products</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Browse professional tools, equipment, and supplies.
                <span className="font-medium text-gray-700 ml-1">
                  {filtered.length} products available
                </span>
              </p>
            </div>
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
                placeholder="Search for products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent shadow-sm"
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
            {/* Mobile filter trigger */}
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
                    <Filter size={16} />
                    Filters
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
                    className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-emerald-500"
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
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                    {filtered.length}
                  </span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {paginatedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No products found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-emerald-700 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => {
                        clearFilters();
                        setSearch("");
                      }}
                      className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Browse All Products
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
                  {paginatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group flex ${viewMode === "grid" ? "flex-col" : "flex-row h-36 sm:h-44"}`}
                    >
                      {/* Image */}
                      <div
                        className={`relative bg-gray-100 overflow-hidden cursor-pointer shrink-0 ${viewMode === "grid" ? "h-36 sm:h-44 w-full" : "h-full w-36 sm:w-48"}`}
                        onClick={() => router.push(`/products/${p.id}`)}
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onError={(e: any) => {
                            e.target.style.display = "none";
                          }}
                        />
                        {p.originalPrice && (
                          <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{Math.round((1 - p.price / p.originalPrice) * 100)}
                            %
                          </span>
                        )}
                        {!p.inStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(p.id);
                          }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
                        >
                          <Heart
                            size={14}
                            className={
                              isInWishlist(p.id)
                                ? "text-red-500 fill-red-500"
                                : "text-gray-600"
                            }
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div
                        className={`flex flex-col flex-1 ${viewMode === "grid" ? "p-3 sm:p-4" : "p-3 sm:p-4 justify-between"}`}
                      >
                        <div>
                          {/* Category badge - matching services page */}
                          <span className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                            {p.category.replace(/-/g, " ")}
                          </span>

                          <h3
                            onClick={() => router.push(`/products/${p.id}`)}
                            className="font-semibold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-emerald-600 transition-colors cursor-pointer text-sm"
                          >
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {p.seller}
                          </p>

                          {/* Meta row - matching services page style */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                              <Star
                                size={11}
                                className="text-yellow-400 fill-yellow-400"
                              />{" "}
                              {p.rating}
                              <span className="font-normal text-gray-400">
                                ({p.reviews})
                              </span>
                            </span>
                            <span className={`flex items-center gap-0.5 ${p.inStock ? "text-emerald-600" : "text-red-500"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? "bg-emerald-500" : "bg-red-400"}`} />
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        {/* Price + Actions - matching services page */}
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-primary">
                              ₦{p.price.toLocaleString()}
                            </span>
                            {p.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ₦{p.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Buttons - matching services page */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/products/${p.id}`);
                            }}
                            className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p.id, "product", 1, p.quantity);
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
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        page === i + 1
                          ? "bg-primary text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
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

          {/* Recommended Products */}
          {recommended.length > 0 && (
            <div className="mt-12 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Recommended for You
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/products/${p.id}`)}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="relative h-32 bg-gray-100 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={300}
                        height={160}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onError={(e: any) => {
                          e.target.style.display = "none";
                        }}
                      />
                      {p.originalPrice && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                        <Star
                          size={10}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        {p.rating} · {p.seller}
                      </div>
                      <p className="text-sm font-bold text-emerald-600 mt-1.5">
                        ₦{p.price.toLocaleString()}
                      </p>
                    </div>
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
                <Filter size={18} />
                Filters
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

      <Footer />
    </>
  );
}
