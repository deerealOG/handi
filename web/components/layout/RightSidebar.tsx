"use client";

import {
    Headphones,
    Phone,
    Shield,
    ShieldCheck,
    Star,
    UserPlus,
} from "lucide-react";
import Link from "next/link";

export default function RightSidebar() {
  return (
    <aside className="w-72 shrink-0 hidden xl:block space-y-4">
      {/* Call to Order */}
      <div className="bg-white rounded-xl shadow-card p-5 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
          <Phone size={24} className="text-[var(--color-primary)]" />
        </div>
        <h3 className="font-heading font-bold text-[var(--color-text)] mb-1">
          Need Help?
        </h3>
        <p className="text-lg font-bold text-[var(--color-primary)] mb-1">
          0800-HANDI-NG
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          24/7 Customer Support
        </p>
      </div>

      {/* Become a Provider */}
      <div className="bg-[var(--color-primary)] rounded-xl shadow-card p-5 text-center text-white">
        <UserPlus size={32} className="mx-auto mb-3" />
        <h3 className="font-heading font-bold mb-1">Become a Provider</h3>
        <p className="text-sm text-white/80 mb-4">
          Start earning by offering your services
        </p>
        <Link
          href="/signup?type=provider"
          className="inline-block bg-white text-[var(--color-primary)] px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Sign Up Free
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <h3 className="font-heading font-bold text-[var(--color-text)] mb-4 text-center">
          Why Choose HANDI?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <ShieldCheck size={18} className="text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text)]">
              Verified Providers
            </span>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <Shield size={18} className="text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text)]">
              Secure Payments
            </span>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <Headphones size={18} className="text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text)]">
              24/7 Support
            </span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <Star size={18} className="text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text)]">
              Top-Rated Services
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
