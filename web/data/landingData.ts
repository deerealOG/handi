// Shared data and constants for the Landing Page
import { SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    CalendarCheck,
    CheckCircle,
    Headphones,
    Home,
    Info,
    Search,
    Shield,
    ShoppingBag,
    Star,
    User,
    Users,
    Wallet,
    Zap,
} from "lucide-react";

export type ClientTabId =
  | "home"
  | "find-pros"
  | "providers"
  | "shop"
  | "deals"
  | "bookings"
  | "how-it-works"
  | "profile";

export const CLIENT_TABS: {
  id: ClientTabId;
  label: string;
  icon: typeof Home;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "find-pros", label: "Find Services", icon: Search },
  { id: "providers", label: "Providers", icon: Users },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "deals", label: "Deals", icon: Zap },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "how-it-works", label: "How It Works", icon: Info },
  { id: "profile", label: "Profile", icon: User },
];

export const CATEGORY_IMAGES: Record<string, string> = {
  electrical: "/images/categories/electrician.png",
  plumbing: "/images/categories/plumbing.jpg",
  beauty: "/images/categories/beauty.png",
  cleaning: "/images/categories/cleaning.png",
  construction: "/images/categories/construction.webp",
  technology: "/images/categories/technology.jpg",
  gardening: "/images/categories/gardening.jpg",
  home: "/images/categories/interior-decor.jpeg",
  automotive: "/images/categories/automotive.jpg",
  "pest-control": "/images/categories/pest-control.jpg",
  security: "/images/categories/technology.svg",
  appliance: "/images/categories/electrician.png",
  fitness: "/images/categories/beauty.png",
  events: "/images/categories/beauty.png",
  moving: "/images/categories/automotive.jpg",
  mechanical: "/images/categories/mechanic.jpg",
  interior_design: "/images/categories/interio.webp",
};

export const CATEGORIES = SERVICE_CATEGORIES.slice(0, 8);

export const MOCK_ACTIVE_BOOKINGS = [
  {
    id: "b1",
    service: "AC Servicing & Repair",
    provider: "CoolAir Solutions",
    date: "Today, 2:00 PM",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    icon: "🔧",
  },
  {
    id: "b2",
    service: "Home Deep Cleaning",
    provider: "SparkleClean NG",
    date: "Tomorrow, 10:00 AM",
    status: "Confirmed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🧹",
  },
  {
    id: "b3",
    service: "Electrical Wiring",
    provider: "PowerFix Pro",
    date: "Feb 23, 9:00 AM",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    icon: "⚡",
  },
];

export const STEPS = [
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
      "Review provider profiles, ratings, and past work to select the best professional for your needs.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: CalendarCheck,
    title: "Book & Pay Securely",
    description:
      "Schedule a convenient time and pay securely through our platform with escrow protection.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Star,
    title: "Get Service & Rate",
    description:
      "Receive quality service at your location, then rate and review the provider.",
    color: "bg-orange-100 text-orange-600",
  },
];

export const HERO_SLIDES = [
  {
    title: "Professional Services\nYou Can Trust",
    subtitle:
      "Everyday services you don't want to miss. Book verified professionals today!",
    cta: "Explore Now",
    href: "/services",
    bg: "from-(--color-primary) to-emerald-800",
    img: "/images/hero/hero-chef.png",
  },
  {
    title: "Find Trusted\nProviders Near You",
    subtitle:
      "Over 5,000 verified providers within your area. Quality guaranteed.",
    cta: "Find Providers",
    href: "/providers",
    bg: "from-[#5f5c6d] to-[#aca9bb]",
    img: "/images/hero/hero-electrician.png",
  },
  {
    title: "Buy Home Products Online",
    subtitle: "Shop top brands at unbeatable prices. Fast delivery guaranteed.",
    cta: "Buy Now",
    href: "/products",
    bg: "from-[#3b3b3b] to-[#111]",
    img: "/images/hero/hero-products.png",
  },
];

export const TOP_CATEGORY_PROVIDERS = [
  {
    name: "Hair Dressing",
    category: "Beauty and Wellness",
    img: "/images/categories/hairdressing.png",
  },
  {
    name: "Cleaning Service",
    category: "Home Keeping & Care",
    img: "/images/categories/gardening.jpg",
  },
  {
    name: "Chef",
    category: "Cooking & Kitchen",
    img: "/images/categories/beauty.png",
  },
  {
    name: "Nail Technician",
    category: "Beauty and Wellness",
    img: "/images/categories/beauty.png",
  },
  {
    name: "Barber",
    category: "Beauty and Wellness",
    img: "/images/categories/beauty.png",
  },
  {
    name: "Electrician",
    category: "Electricals",
    img: "/images/categories/electrical.jpg",
  },
  {
    name: "Plumber",
    category: "Plumbing",
    img: "/images/categories/plumbing.jpg",
  },
  {
    name: "Mechanic",
    category: "Automotive",
    img: "/images/categories/automotive.jpg",
  },
  {
    name: "Carpenter",
    category: "Construction",
    img: "/images/categories/construction.jpg",
  },
  {
    name: "IT Support",
    category: "Technology",
    img: "/images/categories/technology.jpg",
  },
];

export const TRUST_ITEMS = [
  {
    icon: Shield,
    title: "Verified Providers",
    desc: "Every provider is ID-verified with thorough background checks.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    desc: "End-to-end encrypted payments with escrow protection.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guarantee",
    desc: "Not satisfied? Get a full refund within 48 hours.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our dedicated team is always ready to help you.",
    color: "bg-orange-50 text-orange-600",
  },
];

// Tag badge color mapping
export function getTagColor(tag: string): string {
  const t = tag.toUpperCase();
  if (t.includes("OFF")) return "var(--tag-off)";
  if (t.includes("HOT")) return "var(--tag-hot)";
  if (t.includes("DEAL")) return "var(--tag-deal)";
  if (t.includes("BEST")) return "var(--tag-best-seller)";
  if (t.includes("TRENDING")) return "var(--tag-trending)";
  if (t.includes("NEW")) return "var(--tag-new)";
  return "var(--tag-hot)";
}
