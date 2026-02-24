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
    MapPin,
    Paintbrush,
    PartyPopper,
    Scissors,
    ShieldCheck,
    Shirt,
    Sparkles,
    Star,
    Truck,
    WashingMachine,
    Wrench,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const CATEGORIES: Record<
  string,
  {
    label: string;
    icon: typeof Zap;
    description: string;
    longDescription: string;
    services: string[];
  }
> = {
  electrical: {
    label: "Electrical",
    icon: Zap,
    description: "Wiring, repairs, installations",
    longDescription:
      "Professional electrical services including wiring, repairs, installations, and maintenance. Our verified electricians handle residential and commercial projects with proper certifications.",
    services: [
      "Electrical Wiring",
      "Socket Installation",
      "Panel Upgrades",
      "Lighting Installation",
      "Generator Repairs",
      "Electrical Inspection",
    ],
  },
  plumbing: {
    label: "Plumbing",
    icon: Droplets,
    description: "Pipes, fixtures, water systems",
    longDescription:
      "Expert plumbing services for all your water system needs. From leak repairs to complete bathroom installations, our plumbers deliver quality work.",
    services: [
      "Pipe Repairs",
      "Drain Cleaning",
      "Water Heater Installation",
      "Bathroom Plumbing",
      "Kitchen Plumbing",
      "Septic Tank Services",
    ],
  },
  beauty: {
    label: "Beauty & Wellness",
    icon: Sparkles,
    description: "Hair, makeup, spa services",
    longDescription:
      "Transform your look with professional beauty and wellness services. Find hairstylists, makeup artists, and spa specialists near you.",
    services: [
      "Hair Styling",
      "Makeup Services",
      "Manicure & Pedicure",
      "Facial Treatments",
      "Massage Therapy",
      "Bridal Packages",
    ],
  },
  cleaning: {
    label: "Cleaning",
    icon: Brush,
    description: "Home, office, deep cleaning",
    longDescription:
      "Professional cleaning services for homes and offices. Our cleaning experts use quality products and techniques for spotless results.",
    services: [
      "Home Cleaning",
      "Office Cleaning",
      "Deep Cleaning",
      "Post-Construction Cleaning",
      "Carpet Cleaning",
      "Window Cleaning",
    ],
  },
  home: {
    label: "Home Improvement",
    icon: Home,
    description: "Renovations, repairs, upgrades",
    longDescription:
      "Complete home improvement solutions from minor repairs to major renovations. Transform your space with experienced contractors.",
    services: [
      "Kitchen Renovation",
      "Bathroom Remodeling",
      "Flooring Installation",
      "Ceiling Work",
      "Door & Window Installation",
      "General Repairs",
    ],
  },
  mechanical: {
    label: "Mechanical",
    icon: Wrench,
    description: "Equipment, machinery repair",
    longDescription:
      "Skilled mechanical services for equipment and machinery maintenance. Our technicians handle industrial and residential mechanical needs.",
    services: [
      "Equipment Repair",
      "Machinery Maintenance",
      "HVAC Services",
      "Welding Services",
      "Fabrication Work",
      "Pump Repairs",
    ],
  },
  construction: {
    label: "Construction",
    icon: Hammer,
    description: "Building, remodeling projects",
    longDescription:
      "From foundation to finish, our construction professionals handle projects of all sizes with quality workmanship and timely delivery.",
    services: [
      "Building Construction",
      "Room Extensions",
      "Roofing",
      "Masonry Work",
      "Structural Repairs",
      "Commercial Construction",
    ],
  },
  technology: {
    label: "Technology",
    icon: Laptop,
    description: "IT support, device repairs",
    longDescription:
      "Tech support and repair services for all your devices. Computer repairs, network setup, and IT consulting from verified professionals.",
    services: [
      "Computer Repair",
      "Phone Repair",
      "Network Setup",
      "Software Installation",
      "Data Recovery",
      "IT Consulting",
    ],
  },
  automotive: {
    label: "Automotive",
    icon: Car,
    description: "Vehicle repair, maintenance",
    longDescription:
      "Keep your vehicle running smoothly with professional automotive services. Oil changes, repairs, and maintenance from certified mechanics.",
    services: [
      "Oil Change",
      "Brake Service",
      "Engine Repair",
      "Tire Services",
      "AC Repair",
      "Body Work",
    ],
  },
  gardening: {
    label: "Gardening & Landscaping",
    icon: Flower2,
    description: "Lawn care, garden design",
    longDescription:
      "Create beautiful outdoor spaces with professional gardening and landscaping services. From lawn care to complete garden design.",
    services: [
      "Lawn Mowing",
      "Garden Design",
      "Tree Trimming",
      "Irrigation Systems",
      "Landscape Lighting",
      "Plant Care",
    ],
  },
  pest: {
    label: "Pest Control",
    icon: Bug,
    description: "Extermination, prevention",
    longDescription:
      "Effective pest control solutions for homes and businesses. Our experts eliminate pests safely and prevent future infestations.",
    services: [
      "Termite Control",
      "Rodent Control",
      "Insect Extermination",
      "Fumigation",
      "Preventive Treatment",
      "Commercial Pest Control",
    ],
  },
  event: {
    label: "Event & Party",
    icon: PartyPopper,
    description: "Planning, decoration, catering",
    longDescription:
      "Make your events memorable with professional event planning services. From small parties to large celebrations, we've got you covered.",
    services: [
      "Event Planning",
      "Decoration",
      "Catering",
      "Photography",
      "DJ Services",
      "Event Rentals",
    ],
  },
  moving: {
    label: "Moving & Haulage",
    icon: Truck,
    description: "Relocation, delivery services",
    longDescription:
      "Stress-free moving and delivery services. Our movers handle your belongings with care for local and long-distance relocations.",
    services: [
      "Home Moving",
      "Office Relocation",
      "Furniture Delivery",
      "Packing Services",
      "Storage Solutions",
      "Heavy Equipment Moving",
    ],
  },
  security: {
    label: "Security",
    icon: ShieldCheck,
    description: "CCTV, guards, alarms",
    longDescription:
      "Protect your property with professional security services. CCTV installation, security guards, and alarm systems from trusted providers.",
    services: [
      "CCTV Installation",
      "Security Guards",
      "Alarm Systems",
      "Access Control",
      "Security Consulting",
      "24/7 Monitoring",
    ],
  },
  appliance: {
    label: "Appliance Repair",
    icon: WashingMachine,
    description: "TV, fridge, washing machine",
    longDescription:
      "Expert repair services for all home appliances. Get your appliances working again with our certified technicians.",
    services: [
      "Refrigerator Repair",
      "Washing Machine Repair",
      "TV Repair",
      "Microwave Repair",
      "AC Servicing",
      "Dishwasher Repair",
    ],
  },
  fitness: {
    label: "Fitness & Training",
    icon: Dumbbell,
    description: "Personal training, gym",
    longDescription:
      "Achieve your fitness goals with professional trainers. Personal training, group classes, and nutrition guidance.",
    services: [
      "Personal Training",
      "Group Classes",
      "Nutrition Coaching",
      "Yoga Classes",
      "Home Workouts",
      "Sports Training",
    ],
  },
  tailoring: {
    label: "Tailoring & Fashion",
    icon: Scissors,
    description: "Clothing, alterations",
    longDescription:
      "Custom tailoring and alterations from skilled fashion professionals. Get the perfect fit for any occasion.",
    services: [
      "Custom Tailoring",
      "Alterations",
      "Wedding Attire",
      "Corporate Wear",
      "Traditional Wear",
      "Fashion Consulting",
    ],
  },
  painting: {
    label: "Painting & Decoration",
    icon: Paintbrush,
    description: "Interior, exterior painting",
    longDescription:
      "Transform your space with professional painting services. Interior, exterior, and decorative painting from experienced painters.",
    services: [
      "Interior Painting",
      "Exterior Painting",
      "Wallpaper Installation",
      "Textured Finishes",
      "Commercial Painting",
      "Color Consultation",
    ],
  },
  laundry: {
    label: "Laundry & Dry Cleaning",
    icon: Shirt,
    description: "Clothes washing, ironing",
    longDescription:
      "Professional laundry and dry cleaning services. Pickup and delivery available for your convenience.",
    services: [
      "Laundry Service",
      "Dry Cleaning",
      "Ironing",
      "Stain Removal",
      "Pickup & Delivery",
      "Same Day Service",
    ],
  },
};

// Generate static params for all categories
export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({
    slug,
  }));
}

// Sample providers for demonstration
const SAMPLE_PROVIDERS = [
  { id: 1, name: "John Okafor", rating: 4.9, reviews: 127, location: "Lagos" },
  { id: 2, name: "Mary Adebayo", rating: 4.8, reviews: 89, location: "Abuja" },
  {
    id: 3,
    name: "Emmanuel Uche",
    rating: 4.7,
    reviews: 156,
    location: "Lagos",
  },
];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) {
    notFound();
  }

  const IconComponent = category.icon;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <IconComponent size={40} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl text-white mb-4">
            {category.label} Services
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            {category.longDescription}
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl mb-8 text-center">
            Available Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.services.map((service) => (
              <Link
                key={service}
                href={`/services?category=${slug}&service=${encodeURIComponent(service)}`}
                className="bg-white p-5 rounded-xl shadow-card hover:shadow-float transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                  <IconComponent
                    size={20}
                    className="text-[var(--color-primary)]"
                  />
                </div>
                <span className="font-medium">{service}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl mb-8 text-center">
            Top {category.label} Providers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="bg-white p-6 rounded-2xl shadow-card"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
                <h3 className="font-heading font-semibold mb-1">
                  {provider.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
                  <MapPin size={14} />
                  {provider.location}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-[var(--color-muted)]">
                    ({provider.reviews} reviews)
                  </span>
                </div>
                <Link
                  href={`/providers/${provider.id}`}
                  className="mt-4 block w-full text-center py-2 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={`/providers?category=${slug}`}
              className="inline-flex items-center text-[var(--color-primary)] font-medium hover:underline"
            >
              View All {category.label} Providers →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl mb-4">
            Ready to Book a {category.label} Service?
          </h2>
          <p className="text-[var(--color-muted)] mb-6">
            Get started today and connect with verified professionals.
          </p>
          <Link
            href={`/services?category=${slug}`}
            className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-primary)] text-white rounded-[50px] font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Browse {category.label} Services
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
