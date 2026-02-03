"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    Eye,
    Heart,
    MapPin,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PRODUCT_CATEGORIES = [
  "All Categories",
  "Beauty",
  "Food & Drinks",
  "Building Materials",
  "Electronics",
  "Home Appliances",
  "Furniture & Home",
  "Health & Wellness",
];

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Professional Hair Dryer",
    category: "Beauty",
    price: 25000,
    oldPrice: 35000,
    rating: 4.8,
    reviews: 124,
    seller: "BeautyPro NG",
    inStock: true,
    badge: "Top Seller",
  },
  {
    id: "2",
    name: "Electric Drill Set",
    category: "Building Materials",
    price: 45000,
    oldPrice: 55000,
    rating: 4.9,
    reviews: 89,
    seller: "ToolMaster",
    inStock: true,
  },
  {
    id: "3",
    name: "Industrial Vacuum Cleaner",
    category: "Home Appliances",
    price: 85000,
    oldPrice: 100000,
    rating: 4.7,
    reviews: 56,
    seller: "CleanPro",
    inStock: true,
    badge: "15% OFF",
  },
  {
    id: "4",
    name: "Pipe Wrench Set",
    category: "Building Materials",
    price: 18000,
    oldPrice: 22000,
    rating: 4.6,
    reviews: 34,
    seller: "PlumbersChoice",
    inStock: false,
  },
  {
    id: "5",
    name: "LED Light Bulb Pack (10)",
    category: "Electronics",
    price: 8500,
    rating: 4.5,
    reviews: 210,
    seller: "ElectricHub",
    inStock: true,
  },
  {
    id: "6",
    name: "Makeup Brush Kit",
    category: "Beauty",
    price: 15000,
    oldPrice: 20000,
    rating: 4.9,
    reviews: 178,
    seller: "BeautyPro NG",
    inStock: true,
    badge: "Best Seller",
  },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const filteredProducts =
    activeCategory === "All Categories"
      ? SAMPLE_PRODUCTS
      : SAMPLE_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar activeTab="products" />

      {/* Hero Section with Search */}
      <section className="bg-[var(--color-primary)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-3xl lg:text-4xl text-white mb-4">
            Find the Perfect{" "}
            <span className="text-[var(--color-secondary)]">Product</span>
          </h1>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Discover and shop premium products from verified sellers in your
            area. Quality guaranteed, fast delivery.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            {/* Mobile: Stacked Layout */}
            <div className="sm:hidden space-y-3 p-4 bg-white rounded-2xl shadow-card">
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-[50px]">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What product do you need?"
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
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 border border-gray-200 rounded-[50px] text-sm bg-white">
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
                  placeholder="What products are you looking for?"
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
                  placeholder="Enter your location"
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
        </div>
      </section>

      {/* Category Bar */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 min-w-max">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-[50px] text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-[var(--color-secondary)] text-gray-900 font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 text-sm">
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
          <span className="text-[var(--color-muted)] ml-auto">
            Using location: <strong>Lagos</strong> • Country:{" "}
            <strong>Nigeria</strong>
          </span>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[var(--color-muted)]">
              <span className="font-semibold text-gray-900">
                {filteredProducts.length} Product
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>{" "}
              Found
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-float transition-shadow group"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-200 relative">
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--color-secondary)] text-gray-900 text-xs font-medium rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={16} className="text-gray-400" />
                  </button>
                </div>

                <div className="p-4">
                  <span className="text-[var(--color-primary)] text-xs font-medium">
                    {product.category}
                  </span>
                  <h3 className="font-heading font-semibold mt-1 mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-[var(--color-muted)] text-sm">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-[var(--color-muted)] text-xs mb-3">
                    by {product.seller}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[var(--color-primary)] font-heading font-bold text-lg">
                      ₦{product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[var(--color-muted)] text-sm line-through">
                        ₦{product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!product.inStock}
                      className={`flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-[50px] text-sm font-medium transition-colors ${
                        product.inStock
                          ? "bg-[var(--color-secondary)] text-gray-900 hover:opacity-90"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-[50px] hover:border-[var(--color-primary)] transition-colors"
                    >
                      <Eye size={16} className="text-gray-600" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
