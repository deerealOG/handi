"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CategoryPills from "@/components/ui/CategoryPills";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/data/mockApi";
import {
    Heart,
    LayoutGrid,
    List,
    MapPin,
    Search,
    ShoppingCart,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductsPage() {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const categories = ["all", ...new Set(MOCK_PRODUCTS.map((p) => p.category))];

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          {/* Header */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Shop <span className="text-(--color-secondary)">Products</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Search for products you love.
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
              />
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

          {/* Category Filters */}
          <CategoryPills>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 cursor-pointer px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  category === cat
                    ? "bg-(--color-primary) text-white border-(--color-primary)"
                    : "bg-white text-gray-600 border-gray-200 hover:border-(--color-primary)"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </CategoryPills>

          {/* Product Grid / List */}
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">
              No products found.
            </p>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group flex ${viewMode === "grid" ? "flex-col" : "flex-row h-32 sm:h-40"}`}
                >
                  <div
                    className={`relative bg-gray-100 overflow-hidden cursor-pointer shrink-0 ${viewMode === "grid" ? "h-32 sm:h-40 w-full" : "h-full w-32 sm:w-48"}`}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e: any) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {p.originalPrice && (
                      <div
                        className={`absolute bg-(--color-primary) text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${viewMode === "grid" ? "top-2.5 left-2.5" : "bottom-2.5 left-2.5"}`}
                      >
                        {Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    {!p.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-center">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* Wishlist heart */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id, {
                          preventDefault: () => {},
                          stopPropagation: () => {},
                        } as any);
                      }}
                      className={`absolute w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer ${viewMode === "grid" ? "top-2.5 right-2.5" : "top-2.5 right-2.5"}`}
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
                  <div
                    className={`flex flex-col flex-1 ${viewMode === "grid" ? "p-2.5 sm:p-3.5" : "p-3 sm:p-4 justify-between"}`}
                  >
                    <div>
                      <h3
                        className={`font-semibold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-(--color-primary) transition-colors ${viewMode === "grid" ? "text-[11px] sm:text-sm mt-auto" : "text-xs sm:text-base mt-0"}`}
                      >
                        {p.name}
                      </h3>
                      <p
                        className={`text-[9px] sm:text-[11px] text-gray-400 line-clamp-1 mb-1.5 ${viewMode === "list" ? "hidden sm:block mb-2" : ""}`}
                      >
                        Quality {p.category.toLowerCase()} product
                      </p>
                      <div
                        className={`flex items-center gap-1 text-[9px] sm:text-xs text-gray-500 truncate ${viewMode === "grid" ? "mb-2" : "mb-0"}`}
                      >
                        <Star
                          size={10}
                          className="text-yellow-400 fill-yellow-400 sm:w-3 sm:h-3 shrink-0"
                        />
                        {p.rating}{" "}
                        <span className="hidden sm:inline">({p.reviews})</span>{" "}
                        ·{" "}
                        <MapPin size={10} className="sm:w-3 sm:h-3 shrink-0" />{" "}
                        <span className="truncate">{p.seller}</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between ${viewMode === "grid" ? "mt-auto" : "mt-2"}`}
                    >
                      <div
                        className={
                          viewMode === "list"
                            ? "flex flex-col sm:flex-row sm:items-center sm:gap-2"
                            : ""
                        }
                      >
                        <span
                          className={`font-bold text-gray-900 ${viewMode === "grid" ? "text-sm sm:text-base" : "text-base sm:text-lg"}`}
                        >
                          ₦{p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && (
                          <span
                            className={`text-[8px] sm:text-[10px] text-gray-400 line-through block sm:inline ${viewMode === "grid" ? "ml-1" : ""}`}
                          >
                            ₦{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div
                        className={`flex items-center ${viewMode === "grid" ? "" : "gap-2"}`}
                      >
                        {viewMode === "list" && (
                          <button
                            onClick={() => {
                              router.push("/login");
                            }}
                            className="hidden sm:block px-4 py-2 bg-(--color-primary) text-white text-xs font-semibold rounded-full hover:bg-(--color-primary-dark) transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Buy Now
                          </button>
                        )}
                        <button
                          onClick={() => router.push("/login")}
                          className={`bg-(--color-primary-light) rounded-full hover:bg-(--color-primary) hover:text-white text-(--color-primary) transition-colors shrink-0 cursor-pointer ${viewMode === "grid" ? "p-1.5 sm:p-2" : "p-2 sm:p-2.5"}`}
                          title="Add to cart"
                        >
                          <ShoppingCart
                            size={14}
                            className={
                              viewMode === "grid"
                                ? "sm:w-4 sm:h-4 w-3.5 h-3.5"
                                : "w-4 h-4 sm:w-5 sm:h-5"
                            }
                          />
                        </button>
                      </div>
                    </div>

                    {viewMode === "grid" && (
                      <button
                        onClick={() => {
                          router.push("/login");
                        }}
                        className="cursor-pointer w-full mt-2 sm:mt-2.5 py-1.5 sm:py-2 bg-(--color-primary) text-white text-[10px] sm:text-xs font-semibold rounded-full hover:bg-(--color-primary-dark) transition-colors whitespace-nowrap"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Detail Modal */}
          {selectedProduct && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedProduct(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-56">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  {selectedProduct.originalPrice && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {Math.round(
                        (1 -
                          selectedProduct.price /
                            selectedProduct.originalPrice) *
                          100,
                      )}
                      % OFF
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedProduct.name}
                    </h2>
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full mt-1 inline-block">
                      {selectedProduct.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-(--color-primary)">
                      ₦{selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₦{selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-gray-600 ml-auto">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {selectedProduct.rating} ({selectedProduct.reviews}{" "}
                      reviews)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    High-quality {selectedProduct.name.toLowerCase()} available
                    for immediate purchase. Rated {selectedProduct.rating} stars
                    by {selectedProduct.reviews} verified buyers. Fast delivery
                    available to your location.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        router.push("/login");
                      }}
                      className="cursor-pointer flex-1 py-3 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        router.push("/login");
                      }}
                      className="cursor-pointer px-5 py-3 border border-gray-200 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
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
