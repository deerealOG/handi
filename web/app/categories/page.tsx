import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    Brush,
    Bug,
    Car,
    Droplets,
    Dumbbell,
    Flower2,
    Hammer,
    Home,
    Laptop,
    Paintbrush,
    PartyPopper,
    Scissors,
    ShieldCheck,
    Shirt,
    Sparkles,
    Truck,
    WashingMachine,
    Wrench,
    Zap,
} from "lucide-react";
import Link from "next/link";

const ALL_CATEGORIES = [
  {
    id: "electrical",
    label: "Electrical",
    icon: Zap,
    description: "Wiring, repairs, installations",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    icon: Droplets,
    description: "Pipes, fixtures, water systems",
  },
  {
    id: "beauty",
    label: "Beauty & Wellness",
    icon: Sparkles,
    description: "Hair, makeup, spa services",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    icon: Brush,
    description: "Home, office, deep cleaning",
  },
  {
    id: "home",
    label: "Home Improvement",
    icon: Home,
    description: "Renovations, repairs, upgrades",
  },
  {
    id: "mechanical",
    label: "Mechanical",
    icon: Wrench,
    description: "Equipment, machinery repair",
  },
  {
    id: "construction",
    label: "Construction",
    icon: Hammer,
    description: "Building, remodeling projects",
  },
  {
    id: "technology",
    label: "Technology",
    icon: Laptop,
    description: "IT support, device repairs",
  },
  {
    id: "automotive",
    label: "Automotive",
    icon: Car,
    description: "Vehicle repair, maintenance",
  },
  {
    id: "gardening",
    label: "Gardening & Landscaping",
    icon: Flower2,
    description: "Lawn care, garden design",
  },
  {
    id: "pest",
    label: "Pest Control",
    icon: Bug,
    description: "Extermination, prevention",
  },
  {
    id: "event",
    label: "Event & Party",
    icon: PartyPopper,
    description: "Planning, decoration, catering",
  },
  {
    id: "moving",
    label: "Moving & Haulage",
    icon: Truck,
    description: "Relocation, delivery services",
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldCheck,
    description: "CCTV, guards, alarms",
  },
  {
    id: "appliance",
    label: "Appliance Repair",
    icon: WashingMachine,
    description: "TV, fridge, washing machine",
  },
  {
    id: "fitness",
    label: "Fitness & Training",
    icon: Dumbbell,
    description: "Personal training, gym",
  },
  {
    id: "tailoring",
    label: "Tailoring & Fashion",
    icon: Scissors,
    description: "Clothing, alterations",
  },
  {
    id: "painting",
    label: "Painting & Decoration",
    icon: Paintbrush,
    description: "Interior, exterior painting",
  },
  {
    id: "laundry",
    label: "Laundry & Dry Cleaning",
    icon: Shirt,
    description: "Clothes washing, ironing",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-3xl lg:text-4xl text-white mb-4">
          All Service Categories
        </h1>
        <p className="text-white/90 max-w-xl mx-auto">
          Browse our complete range of professional services. Find the perfect
          provider for any job, big or small.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {ALL_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-float transition-all group text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                  <category.icon
                    size={32}
                    className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-heading font-semibold mb-1">
                  {category.label}
                </h3>
                <p className="text-sm text-[var(--color-muted)]">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl mb-4">
            Can&apos;t find what you need?
          </h2>
          <p className="text-[var(--color-muted)] mb-6">
            Contact us and we&apos;ll help connect you with the right service
            provider.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-primary)] text-white rounded-[50px] font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
