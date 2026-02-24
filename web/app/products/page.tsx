"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CategoryPills from "@/components/ui/CategoryPills";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES } from "@/data/mockApi";
import {
    Heart,
    MapPin,
    Search,
    ShoppingCart,
    Star
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS;

    if (activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (sortBy === "rating")
      products = [...products].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price-low")
      products = [...products].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high")
      products = [...products].sort((a, b) => b.price - a.price);
    else if (sortBy === "reviews")
      products = [...products].sort((a, b) => b.reviews - a.reviews);

    return products;
  }, [activeCategory, searchQuery, sortBy]);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Shop <span className="text-primary">Products</span>
            </h1>
            <p className="text-gray-900/80 mb-6">
              Quality tools, materials & supplies for every project
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-2 max-w-2xl lg:w-4xl">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1  text-gray-900 placeholder:text-gray-500 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-white border border-gray-200 rounded-full px-3 py-2 outline-none cursor-pointer shrink-0"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
              <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryPills>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? "bg-primary text-white"
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
                {filteredProducts.length}
              </strong>{" "}
              products found
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100,
                        )}
                        % OFF
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {product.rating} ({product.reviews}) ·{" "}
                      <MapPin size={10} /> {product.seller}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            ₦{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id);
                          }}
                          className="p-2 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <Heart
                            size={16}
                            className={
                              isInWishlist(product.id)
                                ? "text-red-500 fill-red-500"
                                : ""
                            }
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(
                              product.id,
                              "product",
                              1,
                              product.quantity,
                            );
                          }}
                          className="p-2 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
