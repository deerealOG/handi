"use client";

import { useRouter } from "next/navigation";

export default function PromoSection() {
  const router = useRouter();

  return (
    <section className=" text-white relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-md relative z-10 bg-linear-to-r from-(--color-primary) to-(--color-primary-dark) p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold mb-2">20% Off First Booking 🎉</h3>
        <p className="text-sm text-white/80 mb-4">Get professional help for less. Book your first service today and save!</p>
        <button
          onClick={() => router.push("/login?redirect=/deals")}
          className="cursor-pointer px-5 py-2.5 bg-white text-(--color-primary) text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Claim Offer
        </button>
        <div className="absolute -right-4 -bottom-6 opacity-10 text-[120px]">🎁</div>
      </div>
    </section>
  );
}
