"use client";

import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Search,
    Shield,
    Smartphone,
    Star,
} from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search & Browse",
    description:
      "Find the service you need from our wide range of categories or search for specific providers in your area.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: CheckCircle,
    title: "Choose a Provider",
    description:
      "Compare verified providers based on ratings, reviews, pricing, and availability. Every provider is background-checked.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Calendar,
    title: "Book & Schedule",
    description:
      "Select your preferred date and time. Get instant confirmation and real-time updates on your booking status.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Star,
    title: "Get Service & Rate",
    description:
      "Your provider arrives at the scheduled time. After the job is done, rate your experience to help others.",
    color: "bg-yellow-100 text-yellow-600",
  },
];

const BENEFITS = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "Every provider is ID-verified with background checks.",
  },
  {
    icon: CheckCircle,
    title: "Money-Back Guarantee",
    description: "Not satisfied? Get a full refund within 48 hours.",
  },
  {
    icon: Smartphone,
    title: "Real-Time Tracking",
    description: "Track your provider's arrival and service progress live.",
  },
];

export default function HowItWorksTab() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          How HANDI Works
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Getting professional help has never been easier. Follow these simple
          steps to book a service.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step, i) => (
          <div key={i} className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center h-full hover:shadow-md transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="w-7 h-7 bg-(--color-primary) text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {i + 1}
                </span>
              </div>
              <div
                className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mx-auto mb-4 mt-2`}
              >
                <step.icon size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
                <ArrowRight size={16} className="text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Benefits */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
          Why Choose HANDI?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-(--color-primary-light) text-(--color-primary) flex items-center justify-center shrink-0">
                <b.icon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  {b.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-2">
          {[
            {
              q: "How much does it cost?",
              a: "Pricing varies by service. You'll see the exact price before booking — no hidden fees.",
            },
            {
              q: "How are providers vetted?",
              a: "All providers undergo ID verification, background checks, and skill assessments before joining HANDI.",
            },
            {
              q: "Can I cancel a booking?",
              a: "Yes — free cancellation up to 2 hours before the appointment. Late cancellations may incur a small fee.",
            },
            {
              q: "What if I'm not satisfied?",
              a: "We offer a full money-back guarantee. File a dispute within 48 hours and our team will resolve it.",
            },
            {
              q: "Is my payment secure?",
              a: "Absolutely. All payments are processed through encrypted, PCI-compliant channels.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 group"
            >
              <summary className="text-sm font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">
                  ▼
                </span>
              </summary>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
