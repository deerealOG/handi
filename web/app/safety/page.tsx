import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    AlertTriangle,
    Clock,
    FileCheck,
    Phone,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const GUIDELINES = [
  {
    icon: ShieldCheck,
    title: "Verify Provider Credentials",
    description:
      "Always check the provider's verification badge, reviews, and ratings before booking. Look for providers with consistent positive feedback.",
  },
  {
    icon: FileCheck,
    title: "Document Everything",
    description:
      "Take photos before and after the service. Keep all receipts and communication records through the app for your protection.",
  },
  {
    icon: Clock,
    title: "Be Present During Service",
    description:
      "When possible, be home or have a trusted adult present during service delivery. This helps ensure quality and immediate feedback.",
  },
  {
    icon: AlertTriangle,
    title: "Report Concerns Immediately",
    description:
      "If something doesn't feel right, contact our support team immediately. We take all safety concerns seriously.",
  },
];

const PROVIDER_GUIDELINES = [
  {
    title: "Complete identity verification and background checks",
    description: "Undergo thorough vetting to build trust with customers.",
  },
  {
    title: "Maintain professional conduct at all times",
    description: "Represent HANDI with professionalism and integrity.",
  },
  {
    title: "Carry appropriate insurance and certifications",
    description: "Ensure proper coverage and credentials for your services.",
  },
  {
    title: "Respect customer property and privacy",
    description: "Treat every job site and customer with care and discretion.",
  },
  {
    title: "Follow all health and safety protocols",
    description: "Adhere to industry standards and safety regulations.",
  },
  {
    title: "Report any incidents or concerns promptly",
    description: "Communicate openly about any issues that arise.",
  },
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          Safety Guidelines
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Your safety is our top priority. Follow these guidelines for a secure
          experience.
        </p>
      </section>

      {/* Customer Guidelines */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl lg:text-3xl text-center mb-12">
            For Customers
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {GUIDELINES.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-shadow group"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)] transition-colors">
                  <item.icon
                    size={28}
                    className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Guidelines */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl lg:text-3xl text-center mb-4">
            For Service Providers
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-12 max-w-xl mx-auto">
            We expect all providers to maintain the highest safety standards.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROVIDER_GUIDELINES.map((guideline) => (
              <div
                key={guideline.title}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4 shrink-0">
                  <span className="text-[var(--color-primary)] text-lg">✓</span>
                </div>
                <h3 className="font-heading font-semibold text-base mb-2">
                  {guideline.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm">
                  {guideline.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl lg:text-3xl mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-[var(--color-muted)] mb-8">
            If you&apos;re in an emergency situation, please contact local
            authorities first.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[50px] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Phone size={18} />
              Emergency: 112
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[50px] border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary-light)] transition-colors"
            >
              Contact HANDI Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
