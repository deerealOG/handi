"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl lg:text-3xl mb-4">
          Stay Updated with Exclusive Offers
        </h2>
        <p className="text-[var(--color-muted)] mb-8">
          Get the latest updates, special discounts, and insider tips delivered
          to your inbox.
        </p>

        {subscribed ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm max-w-lg mx-auto mb-6">
            ✅ Thank you for subscribing! You&apos;ll receive our latest
            updates.
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3 rounded-full border bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
            />
            <button
              type="submit"
              className="btn-primary rounded-full cursor-pointer px-5 py-3"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[var(--color-muted)] text-sm mb-6">
          We respect your privacy. Unsubscribe at any time.
        </p>

        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className="fill-[var(--color-star)] text-[var(--color-star)]"
              />
            ))}
          </div>
          <p className="text-sm">Rated 4.9/5 by over customers</p>
        </div>
      </div>
    </section>
  );
}
