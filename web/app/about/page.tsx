import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Handshake, HeartHandshake, ShieldCheck, Zap } from "lucide-react";

const TEAM_VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description:
      "We verify all service providers to ensure quality and reliability.",
  },
  {
    icon: Handshake,
    title: "Community First",
    description:
      "Building lasting relationships between customers and professionals.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Continuously improving our platform to serve you better.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Care",
    description:
      "Your satisfaction is our top priority, 24/7 support available.",
  },
];

const STATS = [
  { number: "50,000+", label: "Active Users" },
  { number: "5,000+", label: "Verified Providers" },
  { number: "15+", label: "States Covered" },
  { number: "100,000+", label: "Jobs Completed" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          About HANDI
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Connecting Nigeria with trusted service professionals since 2024
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl lg:text-3xl mb-6">
            Our Mission
          </h2>
          <p className="text-[var(--color-muted)] leading-relaxed mb-4">
            HANDI was founded with a simple mission: to make it easy for
            Nigerians to find, book, and pay for quality services from trusted
            professionals. We believe everyone deserves access to reliable
            service providers, whether you need an electrician, a hair stylist,
            or a plumber.
          </p>
          <p className="text-[var(--color-muted)] leading-relaxed">
            Our platform brings together skilled artisans, tradespeople, and
            service providers with customers who need their expertise. By
            creating a trusted marketplace, we&apos;re empowering local
            businesses while making life easier for millions of Nigerians.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl lg:text-3xl text-center mb-10">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-white p-6 rounded-2xl shadow-card text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <value.icon
                    size={28}
                    className="text-[var(--color-primary)]"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
