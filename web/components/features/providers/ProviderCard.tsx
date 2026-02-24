"use client";

import { Provider } from "@/types";
import { MapPin, Phone, Star, User } from "lucide-react";
import Link from "next/link";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group bg-white rounded-xl shadow-card overflow-hidden card-hover block"
    >
      {/* Badge */}
      {provider.badge && (
        <span className="absolute top-3 left-3 z-10 bg-[var(--color-primary)] text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {provider.badge}
        </span>
      )}

      {/* Image Placeholder */}
      <div className="relative h-36 bg-gray-100 flex items-center justify-center">
        {provider.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={provider.image}
            alt={provider.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={48} className="text-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">
          {provider.name}
        </h3>
        <p className="text-sm text-[var(--color-primary)] mb-2">
          {provider.category}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[var(--color-muted)] text-sm mb-2">
          <MapPin size={14} />
          <span className="truncate">{provider.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.floor(provider.rating)
                    ? "fill-[var(--color-star)] text-[var(--color-star)]"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-[var(--color-muted)]">
            ({provider.reviews})
          </span>
        </div>

        {/* Price */}
        <p className="font-medium text-[var(--color-text)] mb-2">
          {provider.price}
        </p>

        {/* Status */}
        <div className="flex items-center gap-1.5 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              provider.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              provider.isOnline ? "text-green-600" : "text-gray-500"
            }`}
          >
            {provider.isOnline ? "Available" : "Offline"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle call action
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-primary)] text-white py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Phone size={14} />
            Call
          </button>
          <span className="flex-1 flex items-center justify-center border border-gray-200 text-[var(--color-text)] py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
