"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import BookingModal from "@/components/shared/BookingModal";
import AuthModal from "@/components/ui/AuthModal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import {
    getServiceById,
    getServicesByProvider,
    MOCK_PROVIDERS,
    MOCK_SERVICES,
} from "@/data/mockApi";
import {
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Lock,
    MapPin,
    MessageCircle,
    RefreshCw,
    Share2,
    Shield,
    Star,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock reviews
const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Aisha M.",
    rating: 5,
    date: "2 weeks ago",
    service: "Electrical Wiring",
    comment:
      "Excellent service! Very professional and completed on time. Would definitely recommend to others.",
  },
  {
    id: "r2",
    name: "Tunde O.",
    rating: 4,
    date: "1 month ago",
    service: "Circuit Installation",
    comment:
      "Good quality work. The provider was punctual and the job was done well. Minor delay at start but overall satisfied.",
  },
  {
    id: "r3",
    name: "Chioma E.",
    rating: 5,
    date: "1 month ago",
    service: "Electrical Inspection",
    comment:
      "Outstanding! Exceeded my expectations. Very neat and thorough. Will book again for sure.",
  },
  {
    id: "r4",
    name: "Ibrahim K.",
    rating: 4,
    date: "2 months ago",
    service: "Home Wiring",
    comment:
      "Professional and courteous. Fair pricing too. Happy with the results.",
  },
];

// What's Included items per category
const WHATS_INCLUDED: Record<string, string[]> = {
  "home-cleaning": [
    "Full house dusting and surface cleaning",
    "Bathroom sanitization and scrubbing",
    "Kitchen deep clean including appliances",
    "Floor mopping and vacuuming",
    "All cleaning supplies provided",
  ],
  electrical: [
    "Full electrical inspection",
    "Wiring repair or installation",
    "Safety compliance check",
    "All materials and tools included",
    "Post-service testing and verification",
  ],
  plumbing: [
    "Pipe inspection and diagnosis",
    "Leak repair or replacement",
    "Fixture installation",
    "All plumbing materials included",
    "Clean-up after service",
  ],
  beauty: [
    "Professional consultation",
    "Premium products used",
    "Customized treatment plan",
    "Aftercare advice",
    "Satisfaction guarantee",
  ],
  default: [
    "Professional service delivery",
    "All necessary materials included",
    "Quality assurance check",
    "Post-service cleanup",
    "Satisfaction guarantee",
  ],
};

// FAQ per category
const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  default: [
    {
      q: "How long does this service take?",
      a: "Service duration varies based on scope, but typically takes between 1-4 hours. Your provider will give you a more accurate estimate after reviewing the job details.",
    },
    {
      q: "Do I need to provide equipment?",
      a: "No, our professionals come fully equipped with all necessary tools and materials. If any specific materials are needed, this will be discussed during booking.",
    },
    {
      q: "Is emergency service available?",
      a: "Yes, we offer emergency services with faster response times. Additional charges may apply for emergency bookings outside of normal working hours.",
    },
    {
      q: "What happens if I cancel?",
      a: "Free cancellation up to 24 hours before the scheduled service. Cancellations within 24 hours may incur a 20% fee. See our full cancellation policy for details.",
    },
    {
      q: "Are all providers verified?",
      a: "Yes, all providers on HANDI undergo a thorough verification process including identity checks, skill assessments, and background screening.",
    },
  ],
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviewSort, setReviewSort] = useState("recent");
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
  const service = getServiceById(params.id as string);
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Service Not Found
            </h1>
            <p className="text-gray-500 mb-4">
              The service you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/services" className="text-emerald-600 hover:underline">
              ← Browse Services
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedServices = getServicesByProvider(service.providerId)
    .filter((s) => s.id !== service.id)
    .slice(0, 3);
  const similarServices = MOCK_SERVICES.filter(
    (s) => s.category === service.category && s.id !== service.id,
  ).slice(0, 4);
  const availableProviders = MOCK_PROVIDERS.filter((p) =>
    p.category.toLowerCase().includes(service.category.split("-")[0]),
  ).slice(0, 3);
  const includedItems =
    WHATS_INCLUDED[service.category] || WHATS_INCLUDED.default;
  const faqs = FAQ_DATA.default;

  // Mock gallery thumbnails
  const galleryImages = [0, 1, 2, 3, 4];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: service.description,
          url,
        });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleBookNow = () => {
    if (user) {
      setBookingOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const sortedReviews = [...MOCK_REVIEWS].sort((a, b) => {
    if (reviewSort === "highest") return b.rating - a.rating;
    if (reviewSort === "lowest") return a.rating - b.rating;
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
           <Breadcrumbs 
             items={[
               { label: "Services", href: "/services" },
               { label: service.category.replace("-", " "), href: `/services?category=${service.category}` },
               { label: service.name }
             ]} 
           />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8">
            {/* ====== LEFT COLUMN ====== */}
            <div className="space-y-6">
              {/* Service Header */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Image Gallery */}
                <div className="flex gap-3 mb-5">
                  <div className="flex-1 bg-linear-to-br from-emerald-100 to-blue-50 rounded-2xl h-64 sm:h-72 flex items-center justify-center relative overflow-hidden">
                    {service.originalPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {Math.round(
                          ((service.originalPrice - service.price) /
                            service.originalPrice) *
                            100,
                        )}
                        % OFF
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => toggleWishlist(service.id)}
                        className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={
                            isInWishlist(service.id)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }
                        />
                      </button>
                      <button
                        onClick={handleShare}
                        className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors cursor-pointer"
                      >
                        <Share2 size={18} className="text-gray-600" />
                      </button>
                    </div>
                    <span className="text-6xl">🔧</span>
                  </div>
                  {/* Thumbnail strip (desktop only) */}
                  <div className="hidden sm:flex flex-col gap-2 w-16">
                    {galleryImages.map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedGalleryImage(idx)}
                        className={`w-16 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-lg cursor-pointer border-2 transition-colors ${
                          selectedGalleryImage === idx
                            ? "border-primary"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        🔧
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title + Meta */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium capitalize">
                    {service.category.replace("-", " ")}
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    Available Now
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    {service.rating} ({service.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {service.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {service.duration}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-primary">
                    ₦{service.price.toLocaleString()}
                  </span>
                  {service.originalPrice && (
                    <span className="text-gray-400 line-through">
                      ₦{service.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleBookNow}
                    className="px-6 py-3 bg-primary text-white rounded-full cursor-pointer font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Calendar size={18} /> Book Service
                  </button>
                  <button
                    onClick={() => addToCart(service.id, "service")}
                    className="px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full cursor-pointer font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: <Shield size={20} className="text-emerald-600" />,
                    title: "Verified Professionals",
                    desc: "All providers are vetted and verified",
                  },
                  {
                    icon: <Lock size={20} className="text-blue-600" />,
                    title: "Secure Payments",
                    desc: "Payments processed through Paystack",
                  },
                  {
                    icon: <RefreshCw size={20} className="text-purple-600" />,
                    title: "Satisfaction Guarantee",
                    desc: "Support available if issues occur",
                  },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3"
                  >
                    <div className="mt-0.5">{t.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* About This Service */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  About This Service
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
                  {service.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  This professional {service.name.toLowerCase()} service is
                  delivered by experienced providers who are vetted and verified
                  by HANDI. The service includes a thorough consultation,
                  execution with premium materials, and a post-service quality
                  check.
                </p>

                {/* Service Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                  {[
                    {
                      label: "Price",
                      value: `₦${service.price.toLocaleString()}`,
                    },
                    { label: "Duration", value: service.duration },
                    {
                      label: "Category",
                      value: service.category.replace("-", " "),
                    },
                    { label: "Service Type", value: "On-site" },
                    { label: "Status", value: "Available", green: true },
                    { label: "Mode", value: "In-Person" },
                  ].map((d) => (
                    <div key={d.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">
                        {d.label}
                      </p>
                      <p
                        className={`text-sm font-bold ${d.green ? "text-green-600" : "text-gray-900 dark:text-white"} capitalize`}
                      >
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  What&apos;s Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {includedItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <CheckCircle
                        size={16}
                        className="text-green-500 mt-0.5 shrink-0"
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio / Work Examples */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Work
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl h-28 sm:h-36 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <span className="text-3xl opacity-30">📷</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Providers */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Available Professionals
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProviders.length > 0 ? (
                    availableProviders.map((prov) => (
                      <div
                        key={prov.id}
                        className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-primary font-bold text-base">
                            {prov.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {prov.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star
                                size={10}
                                className="fill-yellow-400 text-yellow-400"
                              />{" "}
                              {prov.rating}
                              <span className="text-gray-400">
                                ({prov.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {prov.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                prov.badge === "Verified"
                                  ? "bg-green-100 text-green-700"
                                  : prov.badge === "Top Rated"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {prov.badge}
                            </span>
                          )}
                          {prov.isOnline && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                              ● Available
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-3">
                          <MapPin size={10} /> {prov.location}
                        </p>
                        <div className="flex gap-2">
                          <Link
                            href={`/providers/${prov.id}`}
                            className="flex-1 py-1.5 text-center border border-gray-200 text-gray-700 text-[10px] font-semibold rounded-full hover:bg-gray-50 transition-colors"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={handleBookNow}
                            className="flex-1 py-1.5 bg-primary text-white text-[10px] font-semibold rounded-full hover:bg-primary transition-colors cursor-pointer"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-full">
                      No additional providers available for this service at the
                      moment.
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Customer Reviews
                  </h2>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="text-xs bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-5">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {service.rating}
                    </p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={
                            s <= Math.round(service.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {service.reviews} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const pct =
                        stars === 5
                          ? 60
                          : stars === 4
                            ? 25
                            : stars === 3
                              ? 10
                              : stars === 2
                                ? 3
                                : 2;
                      return (
                        <div
                          key={stars}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-3">{stars}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-gray-500">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {sortedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {review.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {review.service} · {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={
                                s <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-gray-100">
                  {faqs.map((faq, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
                      >
                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="pb-4 -mt-1">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Services */}
              {similarServices.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Similar Services
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {similarServices.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="rounded-xl bg-gray-50 p-3 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg mb-2">
                          🔧
                        </div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {s.provider}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-emerald-600">
                            ₦{s.price.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                            <Star
                              size={9}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            {s.rating}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ====== RIGHT COLUMN (STICKY) ====== */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* Provider Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Service Provider
                </h3>
                <Link
                  href={`/providers/${service.providerId}`}
                  className="flex items-center gap-3 group mb-3"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                    {service.provider.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {service.provider}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-yellow-400"
                      />{" "}
                      {service.rating}
                      <span className="text-gray-400">
                        · {service.location}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                        if (!user) setAuthModalOpen(true);
                        else router.push("/?tab=messages");
                    }}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary cursor-pointer"
                  >
                    <MessageCircle size={16} /> Message
                  </button>
                  <Link
                    href={`/providers/${service.providerId}`}
                    className="flex-1 py-2.5 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary transition-colors text-center"
                  >
                    View Profile
                  </Link>
                </div>

                {relatedServices.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      More from this provider:
                    </p>
                    {relatedServices.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="block text-sm text-primary hover:underline py-1"
                      >
                        {s.name} — ₦{s.price.toLocaleString()}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
                  <Calendar size={18} className="text-primary" /> Book This
                  Service
                </div>

                {/* Availability */}
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2 mb-4">
                  <CheckCircle size={16} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Available Today
                    </p>
                    <p className="text-xs text-green-600">
                      Earliest slot: Today 1:00 PM
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-primary">
                    ₦{service.price.toLocaleString()}
                  </p>
                  {service.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">
                      ₦{service.originalPrice.toLocaleString()}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    Starting price · Final quote after booking
                  </p>
                </div>

                {/* Book / Login */}
                {user ? (
                  <button
                    onClick={handleBookNow}
                    className="w-full py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar size={16} /> Book Service
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="w-full py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 cursor-pointer mb-2"
                    >
                      Sign In to Book
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex items-start gap-2">
                  <Zap size={16} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-500">
                    {service.provider} is solely responsible for service
                    fulfillment.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Lock
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-gray-500">
                    HANDI facilitates booking with secure payment through
                    Paystack.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-gray-500">
                    Money-back guarantee if service is not delivered as
                    described.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 z-40 flex items-center gap-3">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ₦{service.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">Starting price</p>
          </div>
          <button
            onClick={handleBookNow}
            className="flex-1 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary cursor-pointer"
          >
            Book Service
          </button>
        </div>
      </main>
      <Footer />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        serviceName={service.name}
        providerName={service.provider}
        price={service.price}
        serviceId={service.id}
      />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        title="Login to Chat or Book"
        message="Please sign in to contact providers, ask questions, or book their services seamlessly."
      />
    </>
  );
}
