import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FileText, HelpCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";

const HELP_CATEGORIES = [
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Find quick answers to common questions",
    href: "/faq",
  },
  {
    icon: Mail,
    title: "Contact Support",
    description: "Get in touch with our support team",
    href: "/contact",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with a representative",
    href: "tel:+234800442634",
  },
  {
    icon: FileText,
    title: "Safety Guidelines",
    description: "Learn about our safety protocols",
    href: "/safety",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          Help Center
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          How can we help you today?
        </p>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {HELP_CATEGORIES.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                  <category.icon
                    size={24}
                    className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {category.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-xl mb-6">Popular Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "How to book a service",
              "Payment methods",
              "Cancellation policy",
              "Become a provider",
              "Account settings",
              "Refund requests",
            ].map((topic) => (
              <Link
                key={topic}
                href="/faq"
                className="bg-white px-4 py-2 rounded-[50px] text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
