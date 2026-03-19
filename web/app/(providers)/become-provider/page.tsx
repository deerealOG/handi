"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    CalendarCheck,
    DollarSign,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

const BENEFITS = [
  {
    icon: Users,
    title: "Reach More Customers",
    description:
      "Access thousands of potential customers actively looking for your services in your area.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Scheduling",
    description:
      "Manage your availability and bookings with our intuitive calendar. Accept jobs that fit your schedule.",
  },
  {
    icon: DollarSign,
    title: "Secure Payments",
    description:
      "Get paid securely and on time. Funds are deposited directly to your bank account within 3-5 days.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Build your reputation with reviews, track your performance, and grow your customer base.",
  },
];

const REQUIREMENTS = [
  "Valid government-issued ID",
  "Proof of skills/certifications (where applicable)",
  "Professional references",
  "Smartphone with internet access",
  "Commitment to quality service",
];

export default function BecomeProviderPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-(--color-primary) to-(--color-primary-dark) py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          Become a Provider
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
          Join thousands of professionals earning more by connecting with
          customers on HANDI.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="inline-flex items-center gap-2 bg-white text-(--color-primary) font-heading font-semibold px-8 py-4 rounded-[50px] hover:shadow-float transition-shadow cursor-pointer"
        >
          Sign Up as a Provider
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl lg:text-3xl text-center mb-10">
            Why Join HANDI?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white p-6 rounded-2xl shadow-card text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon
                    size={28}
                    className="text-(--color-primary)"
                  />
                </div>
                <h3 className="font-heading font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-(--color-muted) text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl lg:text-3xl mb-4">
            Requirements
          </h2>
          <p className="text-(--color-muted) mb-10">
            Here&apos;s what you need to get started as a HANDI provider.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {REQUIREMENTS.map((req) => (
              <div
                key={req}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-card"
              >
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-(--color-primary) text-sm">✓</span>
                </div>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="apply"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-(--color-secondary)"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl lg:text-3xl text-gray-900 mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-gray-700 mb-8">
            Download the HANDI app and apply to become a verified service
            provider today. It&apos;s free to join!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-[50px] hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Sign Up Now
            </button>
            <Link
              href="/contact"
              className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-[50px] hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="App Coming Soon"
        message="The HANDI mobile application for providers is currently in development. Keep an eye out for updates!"
      />
    </main>
  );
}
