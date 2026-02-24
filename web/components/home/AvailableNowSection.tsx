"use client";

import { Provider } from "@/types";
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  MapPin,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";

type AvailableNowSectionProps = {
  providers: Provider[];
  wishlist: Set<string>;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
};

export default function AvailableNowSection({
  providers,
  wishlist,
  onToggleWishlist,
}: AvailableNowSectionProps) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Available Now</h2>
          <Link
            href="/providers"
            className="flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm hover:underline"
          >
            See All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.slice(0, 4).map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow block"
            >
              <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <button
                  onClick={(e) => onToggleWishlist(`prov-${provider.id}`, e)}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                >
                  <Heart
                    size={14}
                    className={
                      wishlist.has(`prov-${provider.id}`)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }
                  />
                </button>
                {provider.badge && (
                  <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                    {provider.category}
                  </span>
                )}
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                  <User size={28} className="text-gray-400" />
                </div>
                {provider.isOnline && (
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" /> Online
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {provider.name}
                  </h3>
                  <BadgeCheck
                    size={14}
                    className="text-[var(--color-primary)] shrink-0"
                  />
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  Expert services in {provider.category.toLowerCase()}. Quality
                  guaranteed.
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-700">
                      {provider.rating}
                    </span>
                    <span>({provider.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin size={12} />
                  <span>{provider.location}</span>
                  <span className="ml-auto text-[10px] text-orange-600 font-medium">
                    Within 50km
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-3">
                  {provider.price}
                </p>
                <span className="w-full inline-flex items-center justify-center bg-[var(--color-primary)] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
                  Book Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
