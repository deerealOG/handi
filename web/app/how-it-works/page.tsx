import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    ArrowRight,
    Bell,
    Calendar,
    CalendarX2,
    HandCoins,
    Headphones,
    Search,
    ShieldCheck,
    UserCheck,
    Wallet,
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search & Discover",
    description:
      "Browse through our extensive list of verified service providers. Filter by category, location, ratings, and price to find the perfect match for your needs.",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Choose a Provider",
    description:
      "View detailed profiles, read reviews from other customers, and compare prices. Select the service provider that best fits your requirements.",
  },
  {
    icon: Calendar,
    step: "03",
    title: "Book & Schedule",
    description:
      "Pick a convenient date and time for your service. Our easy booking system lets you schedule appointments in just a few clicks.",
  },
  {
    icon: HandCoins,
    step: "04",
    title: "Pay & Enjoy",
    description:
      "Complete your payment securely through our platform. Sit back and let the professional handle the rest. Rate your experience afterwards!",
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verified Providers",
    description:
      "All service providers go through thorough background checks and verification.",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    description:
      "End-to-end encrypted payment processing for complete peace of mind.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated support team is always ready to assist you anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Satisfaction Guarantee",
    description: "Not satisfied? We'll make it right or refund your payment.",
  },
  {
    icon: CalendarX2,
    title: "Easy Rescheduling",
    description:
      "Flexible booking with hassle-free rescheduling and cancellation.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Stay updated with instant booking confirmations and reminders.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar activeTab="how-it-works" />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          How HANDI Works
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Booking professional services has never been easier. Follow these
          simple steps to get started.
        </p>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {STEPS.map((step, index) => (
              <div
                key={step.step}
                className={`flex flex-col md:flex-row items-start gap-6 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <step.icon size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-[var(--color-secondary)] font-heading font-bold text-sm">
                    STEP {step.step}
                  </span>
                  <h3 className="font-heading text-xl lg:text-2xl mt-1 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose HANDI Section - Expanded Cards */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl lg:text-4xl mb-4">
              Why Choose HANDI?
            </h2>
            <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
              We&apos;ve built HANDI with your safety and convenience in mind.
              Here&apos;s what sets us apart.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-shadow group"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)] transition-colors">
                  <benefit.icon
                    size={28}
                    className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[50px] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Start Booking Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
