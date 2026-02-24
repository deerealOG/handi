import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    title: "Easy Booking",
    description:
      "Book services in just a few taps. Our intuitive interface makes scheduling appointments effortless.",
  },
  {
    title: "Verified Providers",
    description:
      "All service providers undergo thorough verification including background checks and skills assessment.",
  },
  {
    title: "Secure Payments",
    description:
      "Pay securely through our platform with bank-level encryption. Multiple payment options available.",
  },
  {
    title: "Real-time Tracking",
    description:
      "Track your service provider's arrival and get real-time updates on your booking status.",
  },
  {
    title: "Rating & Reviews",
    description:
      "Read honest reviews from real customers and share your own experience after each service.",
  },
  {
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to help with any issues or questions.",
  },
];

const PROVIDER_BENEFITS = [
  "Access to thousands of potential customers",
  "Set your own prices and availability",
  "Secure and timely payments",
  "Build your online reputation",
  "Business analytics and insights",
  "Marketing and promotional support",
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-5xl text-white mb-4">
          Platform Features
        </h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Everything you need to find, book, and manage professional services
        </p>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl lg:text-3xl text-center mb-10">
            For Customers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <CheckCircle
                    size={24}
                    className="text-[var(--color-primary)]"
                  />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl lg:text-3xl text-center mb-4">
            For Service Providers
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-10 max-w-xl mx-auto">
            Grow your business with HANDI. Reach more customers and manage your
            services efficiently.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {PROVIDER_BENEFITS.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-card"
              >
                <CheckCircle
                  size={20}
                  className="text-[var(--color-primary)] flex-shrink-0"
                />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/become-provider"
              className="btn-primary inline-flex items-center gap-2 cursor-pointer rounded-full px-6 py-3"
            >
              Become a Provider
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
