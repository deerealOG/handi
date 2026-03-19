"use client";

import type { Provider } from "@/data/types";
import {
    Briefcase,
    Building2,
    ChevronRight,
    Heart,
    MapPin,
    Star,
    User,
} from "lucide-react";
import Image from "next/image";

interface ProviderCardProps {
  provider: Provider & {
    isVerified?: boolean;
    businessSubType?: "agency" | "company";
  };
  viewMode?: "grid" | "list";
  isWished?: boolean;
  onToggleWishlist?: () => void;
  onClick?: () => void;
}

/**
 * Shared provider card used across all pages for consistent display.
 * Supports grid and list view modes with enhanced detail display.
 */
export default function ProviderCard({
  provider,
  viewMode = "grid",
  isWished = false,
  onToggleWishlist,
  onClick,
}: ProviderCardProps) {
  const TypeIcon = provider.providerType === "Business" ? Building2 : User;
  const typeLabel =
    provider.providerType === "Business"
      ? provider.businessSubType === "agency"
        ? "Agency"
        : provider.businessSubType === "company"
          ? "Company"
          : "Business"
      : "Individual";

  // ── List view ──
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative group"
      >
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-xl overflow-hidden shrink-0 relative">
          {provider.image ? (
            <Image
              src={provider.image}
              alt={provider.name}
              width={56}
              height={56}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            provider.name.charAt(0)
          )}
          {provider.isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900">{provider.name}</p>
            {provider.isVerified && (
              <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Category + Type */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-xs text-gray-500">{provider.category}</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-(--color-primary-light) text-(--color-primary) text-[10px] font-medium rounded-full">
              <TypeIcon size={10} />
              {typeLabel}
            </span>
          </div>

          {/* Location */}
          {provider.location && (
            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
              <MapPin size={10} /> {provider.location}
            </p>
          )}

          {/* Skills */}
          {provider.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {provider.skills.slice(0, 4).map((skill: string) => (
                <span
                  key={skill}
                  className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {provider.skills.length > 4 && (
                <span className="text-[9px] text-gray-400">
                  +{provider.skills.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {provider.rating}
              <span className="text-gray-400 font-normal">
                ({provider.reviews})
              </span>
            </span>
            {provider.completedJobs > 0 && (
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Briefcase size={10} />
                {provider.completedJobs} jobs
              </span>
            )}
            <span className="text-xs font-semibold text-(--color-primary) ml-auto">
              {provider.price}
            </span>
          </div>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full shadow-sm bg-white flex items-center justify-center hover:scale-110 transition-transform z-10 cursor-pointer"
        >
          <Heart
            size={14}
            className={isWished ? "text-red-500 fill-red-500" : "text-gray-300"}
          />
        </button>
      </div>
    );
  }

  // ── Grid view ──
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between h-full"
    >
      {/* Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.();
        }}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-sm bg-white flex items-center justify-center hover:scale-110 transition-transform z-10 cursor-pointer"
      >
        <Heart
          size={14}
          className={`${isWished ? "text-red-500 fill-red-500" : "text-gray-300"} sm:w-4 sm:h-4`}
        />
      </button>

      {/* Avatar + Name + Online indicator */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-lg overflow-hidden shrink-0 relative">
          {provider.image ? (
            <Image
              src={provider.image}
              alt={provider.name}
              width={48}
              height={48}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            provider.name.charAt(0)
          )}
          {provider.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-[11px] sm:text-sm font-semibold text-gray-900 truncate pr-6">
              {provider.name}
            </p>
            {provider.isVerified && (
              <span className="text-blue-600 shrink-0" title="Verified">
                ✓
              </span>
            )}
          </div>
          <p className="text-[9px] sm:text-xs text-gray-500 truncate">
            {provider.category}
          </p>
        </div>
      </div>

      {/* Location */}
      {provider.location && (
        <p className="text-[9px] text-gray-400 flex items-center gap-1 mb-1 truncate">
          <MapPin size={9} className="shrink-0" /> {provider.location}
        </p>
      )}

      {/* Type + Skills */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-(--color-primary-light) text-(--color-primary) text-[8px] sm:text-[10px] font-semibold rounded-full">
          <TypeIcon size={9} />
          {typeLabel}
        </span>
        {provider.skills?.slice(0, 2).map((skill: string) => (
          <span
            key={skill}
            className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[8px] rounded-full truncate"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs text-gray-900 flex items-center gap-0.5 font-medium">
            <Star
              size={10}
              className="text-yellow-400 fill-yellow-400 sm:w-3 sm:h-3"
            />
            {provider.rating}
            <span className="text-gray-400 font-normal hidden sm:inline">
              ({provider.reviews})
            </span>
          </span>
          {provider.completedJobs > 0 && (
            <span className="text-[9px] text-gray-400 hidden sm:inline">
              · {provider.completedJobs} jobs
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-(--color-primary)">
            {provider.price}
          </span>
          <ChevronRight size={12} className="text-gray-300 sm:w-4 sm:h-4" />
        </div>
      </div>
    </div>
  );
}
