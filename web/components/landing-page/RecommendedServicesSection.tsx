"use client";

import ScrollSection from "@/components/ui/ScrollSection";
import { useCart } from "@/context/CartContext";
import { MOCK_SERVICES } from "@/data/mockApi";
import { Calendar, Heart, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RecommendedServicesSection() {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useCart();

  const recommendedServices = [...MOCK_SERVICES].sort(
    (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="mb-4 bg-primary flex justify-start items-center">
          <h2 className="text-xl sm:text-xl font-bold text-[#eceeff] px-4 py-2">Recommended Services</h2>
          <p className="text-sm text-[#eceeff] dark:text-[#eceeff] mt-1 px-4 py-2">Popular services chosen for quality, value, and convenience.</p>
        </div>
       
        <ScrollSection>
          {recommendedServices.map((s) => (
            <div
              key={s.id}
              onClick={() => router.push(`/services/${s.id}`)}
              className="w-[200px] max-w-[45vw] bg-white dark:bg-gray-800 shadow-sm snap-start hover:shadow-md transition-shadow relative overflow-hidden flex flex-col shrink-0 cursor-pointer group"
            >
              <div className="w-full h-28 bg-gray-200 relative overflow-hidden">
                <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(s.id); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
                >
                  <Heart size={12} className={isInWishlist(s.id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </button>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-emerald-600 transition-colors">{s.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{s.provider}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-primary">₦{s.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />{s.rating}
                  </span>
                </div>
                <div className="mt-auto pt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/services/${s.id}`); }}
                    className="w-full cursor-pointer text-[10px] font-bold text-white flex items-center justify-center gap-1 bg-primary py-2 hover:bg-emerald-700 transition-colors"
                  >
                    Book Now <Calendar size={12} />
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
