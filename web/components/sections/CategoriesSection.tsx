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
    PartyPopper,
    ShieldCheck,
    Sparkles,
    Truck,
    WashingMachine,
    Wrench,
    Zap,
} from "lucide-react";
import Link from "next/link";

const SERVICE_CATEGORIES = [
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "plumbing", label: "Plumbing", icon: Droplets },
  { id: "beauty", label: "Beauty & Wellness", icon: Sparkles },
  { id: "cleaning", label: "Cleaning", icon: Brush },
  { id: "home", label: "Home Improvement", icon: Home },
  { id: "mechanical", label: "Mechanical", icon: Wrench },
  { id: "construction", label: "Construction", icon: Hammer },
  { id: "technology", label: "Technology", icon: Laptop },
  { id: "automotive", label: "Automotive", icon: Car },
  { id: "gardening", label: "Gardening & Landscaping", icon: Flower2 },
  { id: "pest", label: "Pest Control", icon: Bug },
  { id: "event", label: "Event & Party", icon: PartyPopper },
  { id: "moving", label: "Moving & Haulage", icon: Truck },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "appliance", label: "Appliance Repair", icon: WashingMachine },
  { id: "fitness", label: "Fitness & Training", icon: Dumbbell },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl lg:text-3xl mb-4">
            Service Categories
          </h2>
          <p className="text-[var(--color-secondary)] font-semibold text-lg mb-2">
            Discover Amazing Services Near You
          </p>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
            From everyday needs to special occasions, find verified
            professionals who deliver exceptional results every time.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className="card card-hover flex flex-col items-center text-center p-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                <category.icon
                  size={28}
                  className="text-[var(--color-primary)] group-hover:text-white transition-colors"
                />
              </div>
              <span className="text-xs lg:text-sm font-medium text-[var(--color-text)]">
                {category.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Show All Button */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-block text-[var(--color-primary)] font-semibold hover:underline"
          >
            Show All 24 Categories →
          </Link>
          <p className="text-[var(--color-muted)] text-sm mt-4">
            24+ categories • 1000+ service providers • 4.5+ average rating
          </p>
        </div>
      </div>
    </section>
  );
}
