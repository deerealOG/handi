"use client";

import {
  MOCK_PRODUCTS,
  MOCK_PROVIDERS,
  MOCK_SERVICES,
  SERVICE_CATEGORIES,
} from "@/data/mockApi";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type TabId = "home" | "find-pros" | "bookings" | "shop" | "profile";

const CATEGORIES = SERVICE_CATEGORIES.slice(0, 8);

const MOCK_ACTIVE_BOOKINGS = [
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

export default function HomeTab({
  user,
  setActiveTab,
  onOpenCart,
}: {
  user: any;
  setActiveTab: (t: TabId) => void;
  onOpenCart: () => void;
}) {
  const router = useRouter();
  const topProviders = MOCK_PROVIDERS.slice(0, 6);
  const recommendedServices = MOCK_SERVICES.slice(0, 6);

  // Detail modal state
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const HERO_SLIDES = [
    {
      title: "Professional Services\nYou Can Trust",
      subtitle:
        "Everyday services you don't want to miss. Book verified professionals today!",
      cta: "Explore Now",
      ctaAction: () => setActiveTab("find-pros"),
      bg: "from-(--color-primary) to-emerald-800",
      img: "/images/hero/hero-chef.png",
    },
    {
      title: "Find Trusted\nProviders Near You",
      subtitle:
        "Over 5,000 verified providers within your area. Quality guaranteed.",
      cta: "Find Providers",
      ctaAction: () => setActiveTab("find-pros"),
      bg: "from-[#5f5c6d] to-[#aca9bb]",
      img: "/images/hero/hero-electrician.png",
    },
    {
      title: "Buy Home Products Online",
      subtitle:
        "Shop top brands at unbeatable prices. Fast delivery guaranteed.",
      cta: "Shop Now",
      ctaAction: () => setActiveTab("shop"),
      bg: "from-[#3b3b3b] to-[#111]",
      img: "/images/hero/hero-products.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroHover, setHeroHover] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 45,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero auto-slide — advances every 5 seconds, pauses on hover
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (heroHover) {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
      return;
    }
    heroTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroHover]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi, {user.firstName}! 👋
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={14} /> Lagos, Nigeria
          </p>
        </div>
        {/* Mobile Shop shortcut */}
        <button
          onClick={() => setActiveTab("shop")}
          className="md:hidden flex items-center gap-2 px-3 py-2 bg-(--color-primary-light) rounded-full"
        >
          <ShoppingBag size={14} className="text-(--color-primary)" />
          <span className="text-xs font-bold text-(--color-primary)">Shop</span>
        </button>
      </div>

      {/* Hero Slider */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg group"
        onMouseEnter={() => setHeroHover(true)}
        onMouseLeave={() => setHeroHover(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`min-w-full h-[220px] sm:h-[260px] bg-gradient-to-r ${slide.bg} flex flex-col md:flex-row items-center`}
            >
              <div className="flex-1 p-6 sm:p-8 md:p-10">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight whitespace-pre-line">
                  {slide.title}
                </h1>
                <p className="text-white/80 mb-4 max-w-md text-xs sm:text-sm line-clamp-2">
                  {slide.subtitle}
                </p>
                <button
                  onClick={slide.ctaAction}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-xs sm:text-sm font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg"
                >
                  {slide.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="hidden md:flex md:w-64 lg:w-120 lg:h-full h-full items-end justify-center relative">
                <div className="w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-t-full flex flex-col relative top-10">
                  <Image
                    src={slide.img}
                    alt="Hero"
                    width={480}
                    height={480}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hover Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity duration-300 ${
            heroHover ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity duration-300 ${
            heroHover ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentSlide ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Categories</h2>
          <button
            onClick={() => setActiveTab("find-pros")}
            className="text-sm text-(--color-primary) font-medium"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab("find-pros")}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-(--color-primary-light) flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                <Image
                  src={`/images/categories/${cat.id}.jpg`}
                  alt={cat.label}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight truncate w-full">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-linear-to-r from-(--color-primary) to-(--color-primary-dark) rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            20% Off First Booking 🎉
          </h3>
          <p className="text-sm text-white/80 mb-4">
            Get professional help for less. Book your first service today and
            save!
          </p>
          <button className="px-5 py-2.5 bg-white text-(--color-primary) text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors">
            Claim Offer
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-[120px]">
          🎁
        </div>
      </section>

      {/* Recent Bookings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <button
            onClick={() => setActiveTab("bookings")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        {MOCK_ACTIVE_BOOKINGS.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-8">
            No recent bookings found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_ACTIVE_BOOKINGS.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {b.service}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.provider}</p>
                  <p className="text-xs text-gray-400 mt-1">{b.date}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${b.statusColor}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Trending Products</h2>
          <button
            onClick={() => setActiveTab("shop")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {MOCK_PRODUCTS.slice(0, 6).map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="min-w-[160px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all shrink-0 overflow-hidden cursor-pointer"
            >
              <div className="h-32 bg-gray-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={160}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-(--color-primary)">
                  ₦{p.price.toLocaleString()}
                </p>
                {p.originalPrice && (
                  <p className="text-[10px] text-gray-400 line-through">
                    ₦{p.originalPrice.toLocaleString()}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-gray-500">
                    {p.rating} ({p.reviews})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ Flash Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-lg font-bold text-gray-900">Flash Deals</h2>
            <div className="flex items-center gap-1 ml-2 px-2.5 py-1 bg-red-50 rounded-full">
              <Clock size={12} className="text-red-500" />
              <span className="text-xs font-bold text-red-600 tabular-nums">
                {String(countdown.hours).padStart(2, "0")}:
                {String(countdown.minutes).padStart(2, "0")}:
                {String(countdown.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("find-pros")}
            className="text-xs font-semibold text-(--color-primary) flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {[
            {
              id: "fd1",
              name: "AC Deep Clean + Gas Refill",
              provider: "CoolAir Solutions",
              original: 25000,
              sale: 14999,
              discount: 40,
              rating: 4.9,
              booked: 128,
              icon: "❄️",
            },
            {
              id: "fd2",
              name: "Full House Fumigation",
              provider: "PestFree NG",
              original: 35000,
              sale: 19500,
              discount: 44,
              rating: 4.7,
              booked: 85,
              icon: "🐛",
            },
            {
              id: "fd3",
              name: "Generator Servicing",
              provider: "PowerFix Pro",
              original: 18000,
              sale: 9999,
              discount: 45,
              rating: 4.8,
              booked: 64,
              icon: "⚡",
            },
            {
              id: "fd4",
              name: "Interior Painting (1 Room)",
              provider: "ProPaint Lagos",
              original: 40000,
              sale: 24999,
              discount: 37,
              rating: 4.6,
              booked: 42,
              icon: "🎨",
            },
            {
              id: "fd5",
              name: "Plumbing Emergency Fix",
              provider: "DrainMaster",
              original: 15000,
              sale: 8500,
              discount: 43,
              rating: 4.9,
              booked: 96,
              icon: "🔧",
            },
          ].map((deal) => (
            <div
              key={deal.id}
              className="min-w-[260px] bg-white rounded-2xl shadow-sm p-4 snap-start border border-gray-100 hover:shadow-md transition-shadow relative"
            >
              {/* Discount badge */}
              <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{deal.discount}%
              </span>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{deal.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">
                    {deal.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{deal.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-(--color-primary)">
                  ₦{deal.sale.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₦{deal.original.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] text-gray-500">
                    {deal.rating} • {deal.booked} booked
                  </span>
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-3 py-1.5 bg-(--color-primary) text-white text-[10px] font-bold rounded-full hover:opacity-90"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Professionals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Top Rated Professionals
          </h2>
          <button
            onClick={() => setActiveTab("find-pros")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {topProviders.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProvider(p)}
              className="min-w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all shrink-0 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    p.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />{" "}
                  {p.rating} ({p.reviews})
                </span>
                {p.isOnline && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                    ● Online
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROMOTIONAL BANNERS ===== */}
      <section>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="relative bg-linear-to-r from-[#1a3a2a] to-[#245e37] rounded-xl overflow-hidden p-4 sm:p-5 min-h-[120px] sm:min-h-[140px] group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <span className="inline-block bg-(--color-secondary) text-gray-900 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2">
                OFFICIAL STORE
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                Professional Cleaning
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3 max-w-[200px] line-clamp-2">
                Top-rated cleaning pros. Book now — 20% off!
              </p>
              <button
                onClick={() => setActiveTab("find-pros")}
                className="inline-flex items-center gap-1.5 bg-white text-gray-900 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Book Now <ArrowRight size={14} />
              </button>
            </div>
            <Image
              src="/images/banner/cleaning-provider.png"
              alt="Cleaning"
              width={100}
              height={100}
              className="absolute bottom-0 right-2 w-24 sm:w-36 md:w-48 h-auto rounded-lg object-contain"
            />
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          </div>

          <div className="relative bg-linear-to-r from-(--color-primary) to-(--color-secondary) rounded-xl overflow-hidden p-4 sm:p-5 min-h-[120px] sm:min-h-[140px] group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2">
                EARN WITH HANDI
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                Become a Provider
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3 max-w-[200px] line-clamp-2">
                Join verified professionals. Grow your business.
              </p>
              <button
                onClick={() => router.push("/signup")}
                className="inline-flex items-center gap-1.5 bg-white text-(--color-primary) px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started <ArrowRight size={14} />
              </button>
            </div>
            <Image
              src="/images/banner/banner-two.png"
              alt="Provider"
              width={100}
              height={100}
              className="absolute bottom-0 right-2 w-24 sm:w-36 md:w-48 h-auto rounded-lg object-contain"
            />
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          </div>
        </div>
      </section>

      {/* Recommended Services */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Recommended Services
          </h2>
          <button
            onClick={() => setActiveTab("find-pros")}
            className="text-sm text-(--color-primary) font-medium flex items-center gap-1"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {recommendedServices.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedService(s)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group cursor-pointer hover-lift"
            >
              <div className="w-full h-28 sm:h-32 bg-gray-200 relative overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {s.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {s.provider}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-(--color-primary)">
                    ₦{s.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-0.5">
                    <Star
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />{" "}
                    {s.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-1">How It Works</h2>
        <p className="text-xs text-gray-500 mb-5">
          Book a service in 4 easy steps
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              step: "1",
              title: "Search",
              desc: "Find the service you need",
              icon: "🔍",
            },
            {
              step: "2",
              title: "Choose",
              desc: "Pick a verified provider",
              icon: "✅",
            },
            {
              step: "3",
              title: "Book",
              desc: "Schedule at your convenience",
              icon: "📅",
            },
            {
              step: "4",
              title: "Rate",
              desc: "Share your experience",
              icon: "⭐",
            },
          ].map((s) => (
            <div
              key={s.step}
              onClick={() => setActiveTab("how-it-works" as TabId)}
              className="text-center p-3 rounded-xl bg-gray-50 hover:bg-(--color-primary-light) transition-colors cursor-pointer group"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="w-6 h-6 bg-(--color-primary) text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-1.5">
                {s.step}
              </div>
              <p className="text-sm font-semibold text-gray-900">{s.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT HANDI ===== */}
      <section className="bg-linear-to-br from-(--color-primary) to-emerald-800 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-2">About HANDI</h2>
          <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-xl">
            Nigeria&apos;s #1 on-demand service marketplace. We connect you with
            verified, trusted professionals for all your home and business needs
            — from plumbing to beauty, cleaning to tech support.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">10K+</p>
              <p className="text-[10px] text-white/70">Providers</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">50K+</p>
              <p className="text-[10px] text-white/70">Bookings</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <p className="text-xl font-bold">4.8★</p>
              <p className="text-[10px] text-white/70">User Rating</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-white/15 rounded-full">
              ✓ Verified Pros
            </span>
            <span className="px-3 py-1 bg-white/15 rounded-full">
              ✓ Secure Payments
            </span>
            <span className="px-3 py-1 bg-white/15 rounded-full">
              ✓ Money-Back Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* ===== DOWNLOAD THE APP ===== */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Get the HANDI App
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Book services faster, get real-time notifications, and track your
              provider — all from your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
              <button
                onClick={() => alert("App Store link coming soon!")}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">🍎</span>
                <span className="text-left leading-tight">
                  <span className="text-[10px] text-gray-400 block">
                    Download on
                  </span>
                  App Store
                </span>
              </button>
              <button
                onClick={() => alert("Google Play link coming soon!")}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">▶️</span>
                <span className="text-left leading-tight">
                  <span className="text-[10px] text-gray-400 block">
                    Get it on
                  </span>
                  Google Play
                </span>
              </button>
            </div>
          </div>
          <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl">
            📱
          </div>
        </div>
      </section>

      {/* ===== BOOKING DETAIL MODAL ===== */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mx-auto mb-3">
                {selectedBooking.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedBooking.service}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedBooking.provider}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedBooking.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedBooking.statusColor}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setActiveTab("bookings");
                }}
                className="px-4 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                View in Bookings
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={400}
                  height={224}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {selectedProduct.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {selectedProduct.brand || "HANDI Store"}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xl font-bold text-(--color-primary)">
                    ₦{selectedProduct.price.toLocaleString()}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      ₦{selectedProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {selectedProduct.rating} ({selectedProduct.reviews})
                </span>
              </div>

              {selectedProduct.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {selectedProduct.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onOpenCart();
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={16} /> Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PROVIDER DETAIL MODAL ===== */}
      {selectedProvider && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Provider Details
              </h3>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-2xl mx-auto mb-3 overflow-hidden">
                {selectedProvider.image ? (
                  <Image
                    src={selectedProvider.image}
                    alt={selectedProvider.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  selectedProvider.name.charAt(0)
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedProvider.name}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedProvider.category}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedProvider.rating} ({selectedProvider.reviews} reviews)
                </span>
                {selectedProvider.isOnline && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                    ● Online
                  </span>
                )}
              </div>
            </div>

            {selectedProvider.bio && (
              <p className="text-sm text-gray-600 mb-4 text-center">
                {selectedProvider.bio}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.completedJobs || "50+"}
                </p>
                <p className="text-xs text-gray-500">Jobs Done</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-lg font-bold text-gray-900">
                  {selectedProvider.responseTime || "~30m"}
                </p>
                <p className="text-xs text-gray-500">Response Time</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setActiveTab("find-pros");
                }}
                className="px-3 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Book Now
              </button>
              <button className="px-3 py-2.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                <Phone size={14} /> Call
              </button>
              <button className="px-3 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                <MessageSquare size={14} /> Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SERVICE DETAIL MODAL ===== */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-48 bg-gray-200 overflow-hidden rounded-t-2xl relative">
                <Image
                  src={selectedService.image}
                  alt={selectedService.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {selectedService.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                by {selectedService.provider}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-(--color-primary)">
                  ₦{selectedService.price.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {selectedService.rating} ({selectedService.reviews || 0}{" "}
                  reviews)
                </span>
              </div>

              {selectedService.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {selectedService.description}
                </p>
              )}

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  Duration: {selectedService.duration || "1-2 hours"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {selectedService.location || "Lagos, Nigeria"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setActiveTab("find-pros");
                  }}
                  className="px-4 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Book Now
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
