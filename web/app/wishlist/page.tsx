"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Heart, MapPin, ShoppingCart, Star, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface WishlistItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "1",
    name: "Precious Beauty Lounge",
    category: "Beauty and Wellness",
    rating: 4.7,
    reviews: 107,
    price: "₦15,000–₦25,000",
    location: "Port Harcourt",
  },
  {
    id: "2",
    name: "Sparkling Clean Services",
    category: "Home Keeping",
    rating: 4.9,
    reviews: 89,
    price: "₦12,000–₦20,000",
    location: "Lagos",
  },
  {
    id: "3",
    name: "TechFix Solutions",
    category: "Technology",
    rating: 4.8,
    reviews: 65,
    price: "₦8,000–₦30,000",
    location: "Abuja",
  },
  {
    id: "4",
    name: "AutoCare Pro",
    category: "Automotive",
    rating: 4.6,
    reviews: 124,
    price: "₦10,000–₦45,000",
    location: "Lagos",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);

  const removeItem = (id: string) => {
    setWishlist((items) => items.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          <Heart className="inline mr-2 text-red-500" size={24} />
          My Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save your favorite providers and services to come back to later.
            </p>
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Browse Providers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image/Avatar */}
                <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate group-hover:text-[var(--color-primary)] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-700">
                      {item.rating}
                    </span>
                    <span>({item.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin size={12} />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    {item.price}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/providers/${item.id}`}
                      className="flex-1 inline-flex items-center justify-center bg-[var(--color-primary)] text-white py-2 rounded-full text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Book Now
                    </Link>
                    <button className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
