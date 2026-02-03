"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ_CATEGORIES = [
  {
    category: "General",
    questions: [
      {
        q: "What is HANDI?",
        a: "HANDI is Nigeria's premier service marketplace connecting customers with verified service professionals. We make it easy to find, book, and pay for quality services ranging from electrical work to beauty services.",
      },
      {
        q: "How do I create an account?",
        a: "Download the HANDI app from the App Store or Google Play, or visit our website. Click 'Sign Up' and follow the prompts to create your account using your email or phone number.",
      },
      {
        q: "Is HANDI available in my city?",
        a: "HANDI is currently available in Lagos, Abuja, Port Harcourt, Ibadan, and over 10 other major Nigerian cities. We're expanding rapidly - check the app for availability in your area.",
      },
    ],
  },
  {
    category: "Bookings",
    questions: [
      {
        q: "How do I book a service?",
        a: "Simply search for the service you need, browse available providers, select your preferred date and time, and confirm your booking. You'll receive confirmation via email and push notification.",
      },
      {
        q: "Can I cancel or reschedule a booking?",
        a: "Yes, you can cancel or reschedule up to 24 hours before your appointment at no charge. Cancellations within 24 hours may be subject to a cancellation fee depending on the service provider's policy.",
      },
      {
        q: "What if I'm not satisfied with the service?",
        a: "We have a satisfaction guarantee. If you're not happy with a service, contact our support team within 48 hours. We'll work with you and the provider to resolve the issue or provide a refund.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major debit/credit cards, bank transfers, and mobile money payments. You can also use HANDI wallet for faster checkout.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use bank-level encryption and never store your full card details. All payments are processed through PCI-compliant payment providers.",
      },
      {
        q: "When am I charged for a service?",
        a: "You're charged after the service is completed and you've confirmed satisfaction. This ensures you only pay for services you're happy with.",
      },
    ],
  },
  {
    category: "For Service Providers",
    questions: [
      {
        q: "How do I become a service provider on HANDI?",
        a: "Download the app, select 'Join as Provider', and complete the verification process. This includes identity verification, background checks, and skills assessment where applicable.",
      },
      {
        q: "What fees does HANDI charge providers?",
        a: "HANDI charges a small service fee (typically 10-15%) on completed bookings. There are no upfront costs or monthly fees to join the platform.",
      },
      {
        q: "How and when do I get paid?",
        a: "Payments are processed within 3-5 business days after service completion and customer confirmation. You can withdraw to your bank account or keep funds in your HANDI wallet.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Find answers to common questions about HANDI
        </p>
      </section>

      {/* FAQ Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.category} className="mb-10">
              <h2 className="font-heading text-xl lg:text-2xl mb-6 text-[var(--color-primary)]">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item, idx) => {
                  const key = `${category.category}-${idx}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl shadow-card overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-semibold pr-4">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp
                            size={20}
                            className="text-[var(--color-primary)] flex-shrink-0"
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                            className="text-gray-400 flex-shrink-0"
                          />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-[var(--color-muted)]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-xl lg:text-2xl mb-4">
            Still have questions?
          </h2>
          <p className="text-[var(--color-muted)] mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our support team
            is here to help.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
