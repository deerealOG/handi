"use client";

import { ArrowRight } from "lucide-react";

export default function FinalCtaSection() {
  const handleDownloadApp = () => {
    window.open(
      "https://expo.dev/accounts/goldendove/projects/HANDI/builds",
      "_blank",
    );
  };

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl lg:text-3xl text-white mb-4">
          What Are You Waiting For?
        </h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">
          Join the service revolution today and experience the difference of
          professional, reliable, and convenient service booking.
        </p>

        <button
          onClick={handleDownloadApp}
          className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-heading font-semibold px-8 py-4 rounded-full hover:shadow-float hover:-translate-y-1 transition-all"
        >
          Get Started Now
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
