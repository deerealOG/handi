"use client";

import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS } from "@/data/mockApi";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ShoppingCart,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ShopTab({ onOpenCart }: { onOpenCart: () => void }) {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const shopPillsRef = useRef<HTMLDivElement>(null);

  const categories = ["all", ...new Set(MOCK_PRODUCTS.map((p) => p.category))];

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Shop Products</h2>

      {/* Search */}
      <div className="relative">
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

      {/* Category Filters */}
      <div className="pills-container">
        <button
          className="pills-scroll-btn left"
          onClick={() =>
            shopPillsRef.current?.scrollBy({ left: -200, behavior: "smooth" })
          }
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={shopPillsRef}
          className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-(--color-primary) text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-(--color-primary)"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="pills-scroll-btn right"
          onClick={() =>
            shopPillsRef.current?.scrollBy({ left: 200, behavior: "smooth" })
          }
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
            >
              <div
                className="h-36 bg-gray-100 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedProduct(p)}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={200}
                  height={144}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-(--color-primary)">
                  ₦{p.price.toLocaleString()}
                </p>
                {p.originalPrice && (
                  <p className="text-[10px] text-gray-400 line-through">
                    ₦{p.originalPrice.toLocaleString()}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-gray-500">
                    {p.rating} ({p.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      addToCart(p.id, "product");
                      onOpenCart();
                    }}
                    className="flex-1 py-2 bg-(--color-primary) text-white text-[11px] font-semibold rounded-full hover:bg-(--color-primary-dark) transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => addToCart(p.id, "product")}
                    className="p-2 bg-(--color-primary-light) rounded-full hover:bg-(--color-primary) hover:text-white text-(--color-primary) transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
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
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60"
              >
                <X size={16} />
              </button>
              {selectedProduct.originalPrice && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {Math.round(
                    (1 -
                      selectedProduct.price / selectedProduct.originalPrice) *
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
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                High-quality {selectedProduct.name.toLowerCase()} available for
                immediate purchase. Rated {selectedProduct.rating} stars by{" "}
                {selectedProduct.reviews} verified buyers. Fast delivery
                available to your location.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct.id, "product");
                    setSelectedProduct(null);
                    onOpenCart();
                  }}
                  className="flex-1 py-3 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct.id, "product");
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-3 border border-gray-200 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
