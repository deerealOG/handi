"use client";

import BookingModal from "@/components/BookingModal";
import { useCart } from "@/context/CartContext";
import { MOCK_SERVICES, SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Search,
    ShoppingCart,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function FindProsTab({
  searchQuery: globalSearch,
}: {
  searchQuery: string;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [localSearch, setLocalSearch] = useState("");
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [bookingService, setBookingService] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  const query = localSearch || globalSearch;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Find Professionals</h1>

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
      <div className="pills-container">
        <button
          className="pills-scroll-btn left"
          onClick={() =>
            pillsRef.current?.scrollBy({ left: -200, behavior: "smooth" })
          }
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={pillsRef}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-8"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "all"
                ? "bg-(--color-primary) text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Services
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-(--color-primary) text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          className="pills-scroll-btn right"
          onClick={() =>
            pillsRef.current?.scrollBy({ left: 200, behavior: "smooth" })
          }
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Sort + Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredServices.length} services found
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-white outline-none"
        >
          <option value="rating">Top Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group hover-lift"
          >
            <div
              className="w-full h-40 bg-gray-200 relative overflow-hidden cursor-pointer"
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
            <div className="p-4">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {s.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {s.provider}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-base font-bold text-(--color-primary)">
                  ₦{s.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />{" "}
                  {s.rating}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setBookingService(s)}
                  className="flex-1 py-2 bg-(--color-primary) text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Book Now
                </button>
                <button
                  onClick={() => addToCart(s.id, "service")}
                  className="p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} />
                </button>
                <button
                  onClick={() => toggleWishlist(s.id)}
                  className={`p-2 rounded-full border transition-colors ${
                    isInWishlist(s.id)
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-gray-200 text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isInWishlist(s.id) ? "fill-red-500" : ""}
                  />
                </button>
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
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60"
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
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {selectedDetail.rating} rating
                </span>
                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
                  {selectedDetail.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Professional {selectedDetail.name.toLowerCase()} service by{" "}
                {selectedDetail.provider}. Highly rated with{" "}
                {selectedDetail.rating} stars. Book now for reliable, quality
                service delivered by verified professionals in your area.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setBookingService(selectedDetail);
                    setSelectedDetail(null);
                  }}
                  className="flex-1 py-3 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Book Now
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedDetail.id, "service");
                    setSelectedDetail(null);
                  }}
                  className="px-5 py-3 border border-gray-200 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(selectedDetail.id)}
                  className={`p-3 rounded-full border transition-colors ${
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

      {/* Booking Modal */}
      {bookingService && (
        <BookingModal
          isOpen={!!bookingService}
          onClose={() => setBookingService(null)}
          serviceName={bookingService.name}
          providerName={bookingService.provider}
          price={bookingService.price}
        />
      )}
    </div>
  );
}
