// Shared data and constants for the Landing Page
import { SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    Award,
    Building2,
    CalendarCheck,
    CheckCircle,
    FileText,
    Headphones,
    Home,
    Info,
    MessageCircle,
    RefreshCw,
    Search,
    Shield,
    ShoppingBag,
    Siren,
    Sparkles,
    Star,
    User,
    Users,
    Wallet,
    Wrench,
    Zap
} from "lucide-react";

export type ClientTabId =
  | "home"
  | "find-pros"
  | "providers"
  | "shop"
  | "deals"
  | "bookings"
  | "how-it-works"
  | "loyalty"
  | "maintenance"
  | "quotes"
  | "home-profile"
  | "emergency"
  | "messages"
  | "recommendations"
  | "trade"
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
  { id: "loyalty", label: "Rewards", icon: Award },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "maintenance", label: "Plans", icon: Wrench },
  { id: "home-profile", label: "My Home", icon: Home },
  { id: "emergency", label: "Emergency", icon: Siren },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "recommendations", label: "For You", icon: Sparkles },
  { id: "trade", label: "Trade", icon: Building2 },
  { id: "how-it-works", label: "How It Works", icon: Info },
  { id: "profile", label: "Profile", icon: User },
];

export const CATEGORY_IMAGES: Record<string, string> = {
  electrical: "/images/categories/electrician.webp",
  plumbing: "/images/categories/plumbing.webp",
  beauty: "/images/categories/beauty.webp",
  cleaning: "/images/categories/cleaning.webp",
  construction: "/images/categories/construction.webp",
  technology: "/images/categories/technology.webp",
  gardening: "/images/categories/interior-decor.webp",
  home: "/images/categories/interior-decor.webp",
  automotive: "/images/categories/automotive.webp",
  pest_control: "/images/categories/pest-control.webp",
  security: "/images/categories/technology.webp",
  appliance: "/images/categories/electrician.webp",
  fitness: "/images/categories/beauty.webp",
  events: "/images/categories/beauty.webp",
  moving: "/images/categories/automotive.webp",
  mechanical: "/images/categories/mechanic.webp",
  interior_design: "/images/categories/interior-decor.webp",
};

export const CATEGORIES = SERVICE_CATEGORIES.slice(0, 14);

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
      "Book verified service providers for home and business needs. Compare ratings, pricing, and availability in one place.",
    cta: "Book a Service",
    secondaryCta: "Browse Providers",
    href: "/services",
    secondaryHref: "/providers",
    bg: "from-(--color-primary) to-emerald-800",
    img: "/images/hero/hero-chef.webp",
  },
  {
    title: "Book Services\nin Minutes",
    subtitle:
      "Search, compare, schedule, and pay securely with a seamless booking experience.",
    cta: "Explore Deals",
    secondaryCta: "How It Works",
    href: "/deals",
    secondaryHref: "/how-it-works",
    bg: "from-[#5f5c6d] to-[#aca9bb]",
    img: "/images/hero/hero-electrician.webp",
  },
  {
    title: "Find Quality Products\nfor Every Job",
    subtitle:
      "From electrical tools to cleaning supplies, shop trusted products used by professionals.",
    cta: "Shop Products",
    secondaryCta: "View Categories",
    href: "/products",
    secondaryHref: "/services",
    bg: "from-[#3b3b3b] to-[#111]",
    img: "/images/hero/hero-products.webp",
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
    desc: "Every provider is screened and verified.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    desc: "Protected checkout with secure payment processing.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guarantee",
    desc: "Support is available if something goes wrong.",
    color: "bg-purple-50 text-purple-600",
  },
];

export const WHY_CHOOSE_FEATURES = [
  {
    icon: Shield,
    title: "Verified Providers",
    description: "Every provider undergoes thorough background checks and ID verification before joining the platform.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    description: "End-to-end encrypted payments with escrow protection ensure your money is always safe.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to help you with any issues.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: CheckCircle,
    title: "Satisfaction Guarantee",
    description: "Not satisfied with a service? We offer hassle-free resolution and refund support.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CalendarCheck,
    title: "Easy Scheduling",
    description: "Book services at your convenience with flexible scheduling and instant confirmation.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: RefreshCw,
    title: "Real-time Updates",
    description: "Track your booking status, provider location, and get instant notifications.",
    color: "bg-cyan-50 text-cyan-600",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Chioma Adeyemi",
    avatar: "/images/avatar/avatar-1.webp",
    service: "Electrical Repair",
    quote: "HANDI helped me find a reliable electrician within minutes. The whole process was seamless and professional.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Emeka Obi",
    avatar: "/images/avatar/avatar-2.webp",
    service: "Home Cleaning",
    quote: "I've been using HANDI for months now. The cleaning service I booked was top-notch and very affordable.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Aisha Mohammed",
    avatar: "/images/avatar/avatar-3.webp",
    service: "Plumbing Service",
    quote: "Fast response, verified providers, and secure payments. HANDI is now my go-to for all home services.",
    rating: 4,
  },
  {
    id: "t4",
    name: "Tunde Bakare",
    avatar: "/images/avatar/avatar-4.webp",
    service: "AC Servicing",
    quote: "Booking an AC technician used to be stressful until I found HANDI. Now it takes just 2 minutes!",
    rating: 5,
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
