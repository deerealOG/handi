"use client";

import { useCart } from "@/context/CartContext";
import ScrollSection from "@/components/ui/ScrollSection";
import { MOCK_PRODUCTS } from "@/data/mockApi";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TrendingProductsSection() {
  const router = useRouter();
  const { isInWishlist, toggleWishlist, addToCart } = useCart();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="mb-4 bg-primary flex justify-start items-center">
          <h2 className="text-xl sm:text-xl font-bold text-[#eceeff] px-4 py-2">Trending Products</h2>
          <p className="text-sm text-[#eceeff] dark:text-[#eceeff] mt-1 px-4 py-2">Popular products used by professionals and customers.</p>
        </div>
        <ScrollSection>
          {MOCK_PRODUCTS.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/products/${p.id}`)}
              className="w-[200px] max-w-[45vw] bg-white dark:bg-gray-800 shadow-sm snap-start hover:shadow-md transition-shadow relative overflow-hidden flex flex-col shrink-0 cursor-pointer group"
            >
              <div className="h-28 bg-gray-100 overflow-hidden relative">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                {p.originalPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
                >
                  <Heart size={12} className={isInWishlist(p.id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </button>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{p.name}</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-sm font-bold text-primary">₦{p.price.toLocaleString()}</span>
                  {p.originalPrice && <span className="text-[10px] text-gray-400 line-through">₦{p.originalPrice.toLocaleString()}</span>}
                </div>
                <div className="flex items-center gap-1 mt-auto">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-gray-500">{p.rating} ({p.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(p.id, "product", 1, p.quantity); }}
                    className="flex-1 py-2 bg-primary text-white text-[10px] font-bold hover:bg-emerald-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    Add to Cart <ShoppingCart size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ScrollSection>
      </div>
    </section>
  );
}
