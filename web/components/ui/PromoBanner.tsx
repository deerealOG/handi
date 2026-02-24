"use client";

import Link from "next/link";

interface PromoBannerProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export default function PromoBanner({
  message = "🎉 Special Offer: Get 20% off your first booking!",
  linkText = "Sign Up Now",
  linkHref = "/signup",
}: PromoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-center py-2 px-4 text-sm">
      <span className="font-medium">{message}</span>
      <Link href={linkHref} className="ml-2 underline hover:no-underline">
        {linkText}
      </Link>
    </div>
  );
}
