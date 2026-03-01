"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CategoryPills from "@/components/ui/CategoryPills";
import { useCart } from "@/context/CartContext";
import { MOCK_SERVICES, SERVICE_CATEGORIES } from "@/data/mockApi";
import { Heart, Search, ShoppingCart, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ServicesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [localSearch, setLocalSearch] = useState("");
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const query = localSearch;

  const filteredServices = MOCK_SERVICES.filter((s) => {
    const matchCategory =
      activeCategory === "all" || s.category === activeCategory;
    const matchSearch =
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.provider.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Find Professional{" "}
              <span className="text-(--color-secondary)">Services</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services, providers, skills..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <CategoryPills>
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 cursor-pointer px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border ${
                activeCategory === "all"
                  ? "bg-(--color-primary) text-white border-(--color-primary)"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All Services
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 cursor-pointer px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border ${
                  activeCategory === cat.id
                    ? "bg-(--color-primary) text-white border-(--color-primary)"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </CategoryPills>

          {/* Sort + Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredServices.length} services found
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-white outline-none cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group hover-lift flex flex-col"
              >
                <div
                  className="w-full h-28 sm:h-40 bg-gray-200 relative overflow-hidden cursor-pointer shrink-0"
                  onClick={() => setSelectedDetail(s)}
                >
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <p className="text-[11px] sm:text-sm font-semibold text-gray-900 line-clamp-2">
                    {s.name}
                  </p>
                  <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 truncate">
                    {s.provider}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-sm sm:text-base font-bold text-(--color-primary)">
                      ₦{s.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-0.5">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400 sm:w-3 sm:h-3"
                      />{" "}
                      {s.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                    <button
                      onClick={() => router.push("/login")}
                      className="cursor-pointer flex-1 py-1.5 sm:py-2 bg-(--color-primary) text-white text-[10px] sm:text-xs font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      Book Now
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => addToCart(s.id, "service")}
                        className="cursor-pointer p-1.5 sm:p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() =>
                          toggleWishlist(s.id, {
                            preventDefault: () => {},
                            stopPropagation: () => {},
                          } as any)
                        }
                        className={`cursor-pointer p-1.5 sm:p-2 rounded-full border transition-colors ${
                          isInWishlist(s.id)
                            ? "bg-red-50 border-red-200 text-red-500"
                            : "border-gray-200 text-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <Heart
                          size={14}
                          className={`sm:w-4 sm:h-4 ${isInWishlist(s.id) ? "fill-red-500" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Detail Modal */}
          {selectedDetail && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedDetail(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-56">
                  <Image
                    src={selectedDetail.image}
                    alt={selectedDetail.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setSelectedDetail(null)}
                    className="cursor-pointer absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedDetail.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedDetail.provider}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-(--color-primary)">
                      ₦{selectedDetail.price.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {selectedDetail.rating} rating
                    </span>
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
                      {selectedDetail.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Professional {selectedDetail.name.toLowerCase()} service by{" "}
                    {selectedDetail.provider}. Highly rated with{" "}
                    {selectedDetail.rating} stars. Book now for reliable,
                    quality service delivered by verified professionals in your
                    area.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedDetail(null);
                        router.push("/login");
                      }}
                      className="cursor-pointer flex-1 py-3 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => {
                        addToCart(selectedDetail.id, "service");
                        setSelectedDetail(null);
                      }}
                      className="cursor-pointer px-5 py-3 border border-gray-200 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button
                      onClick={() =>
                        toggleWishlist(selectedDetail.id, {
                          preventDefault: () => {},
                          stopPropagation: () => {},
                        } as any)
                      }
                      className={`cursor-pointer p-3 rounded-full border transition-colors ${
                        isInWishlist(selectedDetail.id)
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "border-gray-200 text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={
                          isInWishlist(selectedDetail.id) ? "fill-red-500" : ""
                        }
                      />
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
