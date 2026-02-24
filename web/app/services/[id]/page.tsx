"use client";

import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
    getServiceById,
    getServicesByProvider,
    MOCK_SERVICES,
} from "@/data/mockApi";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Globe,
    Lock,
    MapPin,
    MessageCircle,
    RefreshCw,
    Share2,
    Shield,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Aisha M.",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Excellent service! Very professional and completed on time. Would definitely recommend to others.",
  },
  {
    id: "r2",
    name: "Tunde O.",
    rating: 4,
    date: "1 month ago",
    comment:
      "Good quality work. The provider was punctual and the job was done well. Minor delay at start but overall satisfied.",
  },
  {
    id: "r3",
    name: "Chioma E.",
    rating: 5,
    date: "1 month ago",
    comment:
      "Outstanding! Exceeded my expectations. Very neat and thorough. Will book again for sure.",
  },
  {
    id: "r4",
    name: "Ibrahim K.",
    rating: 4,
    date: "2 months ago",
    comment:
      "Professional and courteous. Fair pricing too. Happy with the results.",
  },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [chatModalOpen, setChatModalOpen] = useState(false);
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
            <Link
              href="/services"
              className="text-[var(--color-primary)] hover:underline"
            >
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
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleBookNow = () => {
    if (user) {
      setBookingOpen(true);
    } else {
      router.push("/login");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900">
              About This Service
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>

            {/* Service Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="text-sm font-bold text-gray-900">
                  ₦{service.price.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-bold text-gray-900">
                  {service.duration}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {service.category.replace("-", " ")}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Service Type</p>
                <p className="text-sm font-bold text-gray-900">On-site</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle size={12} /> Available
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Mode</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  <Globe size={12} /> In-Person
                </p>
              </div>
            </div>
          </div>
        );

      case "policies":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900">
              Service Policies
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <RefreshCw
                  size={20}
                  className="text-blue-600 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Cancellation Policy
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Free cancellation up to <strong>24 hours</strong> before the
                    scheduled service. Cancellations within 24 hours may incur a
                    20% fee.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <RefreshCw
                  size={20}
                  className="text-green-600 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Refund Policy
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Full refund if canceled up to <strong>6 hours</strong>{" "}
                    before the service. Partial refunds may be available for
                    cancellations made within the 6-hour window, at provider
                    discretion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                <Shield size={20} className="text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Payment Protection
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your payment is held securely in escrow until the service is
                    completed to your satisfaction. Funds are only released to
                    the provider after you confirm completion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                <Lock size={20} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Secure Booking
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    All bookings are processed through secure payment via
                    Paystack. Your financial information is never shared with
                    providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{service.rating}</span>
                <span className="text-gray-500">
                  ({service.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Rating breakdown */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
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

            {/* Individual reviews */}
            <div className="space-y-4">
              {MOCK_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">{review.date}</p>
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
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1 hover:text-[var(--color-primary)]"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <span>/</span>
              <Link
                href="/services"
                className="hover:text-[var(--color-primary)]"
              >
                Services
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{service.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column — Image + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="bg-gradient-to-br from-[var(--color-primary-light)] to-blue-50 rounded-3xl h-64 sm:h-80 flex items-center justify-center relative overflow-hidden">
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
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
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
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <Share2 size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Service Header */}
                <div className="mt-5">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[var(--color-primary)]">
                      ₦{service.price.toLocaleString()}
                    </span>
                    {service.originalPrice && (
                      <span className="text-gray-500 line-through">
                        ₦{service.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-xs font-medium capitalize">
                      {service.category.replace("-", " ")}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      Available Now
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleBookNow}
                      className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full cursor-pointer font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                    >
                      <Calendar size={18} /> Book Now
                    </button>
                    <button
                      onClick={() => addToCart(service.id, "service")}
                      className="px-6 py-3 border border-gray-200 text-gray-700 rounded-full cursor-pointer font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="bg-gray-50 rounded-lg shadow-sm flex items-center p-2 justify-between">
                {(["description", "policies", "reviews"] as const).map(
                  (tab) => (
                    <div
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex cursor-pointer items-center justify-center gap-2 p-2 w-1/3 rounded-md transition-colors ${activeTab === tab ? "bg-white shadow-sm" : "hover:bg-gray-100"}`}
                    >
                      <div className="text-sm font-bold text-gray-900 capitalize">
                        {tab}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Tab Content */}
              {renderTabContent()}

              {/* Similar Services */}
              {similarServices.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Similar Services
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {similarServices.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[var(--color-primary-light)] transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shrink-0">
                          🔧
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[var(--color-primary)]">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₦{s.price.toLocaleString()} · {s.provider}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column — Provider + Booking */}
            <div className="space-y-6">
              {/* Provider Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  SERVICE PROVIDER
                </h3>
                <Link
                  href={`/providers/${service.providerId}`}
                  className="flex flex-col gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-lg font-bold">
                    {service.provider.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)]">
                      {service.provider}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {service.rating}
                    </div>
                    <div className="flex flex-col items-start gap-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} /> {service.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} /> {service.duration}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => {
                      setChatModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-[var(--color-primary)] cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <Link
                    href={`/providers/${service.providerId}`}
                    className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-full font-medium text-sm hover:opacity-90 transition-colors text-center"
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
                        className="block text-sm text-[var(--color-primary)] hover:underline py-1"
                      >
                        {s.name} — ₦{s.price.toLocaleString()}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Service CTA */}
              {!user && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-md font-medium">
                      <Calendar
                        size={18}
                        className="text-[var(--color-primary)]"
                      />
                      Book This Service
                    </div>
                    <button
                      onClick={() => router.push("/login")}
                      className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-full font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => router.push("/signup")}
                      className="w-full py-3.5 bg-gray-100 text-black rounded-full font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar
                    size={18}
                    className="text-[var(--color-primary)] mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-gray-500">
                    {service.provider} is solely responsible for the fulfillment
                    of all services and appointments.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Lock
                    size={18}
                    className="text-[var(--color-primary)] mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-gray-500">
                    HANDI facilitates this booking with secure payment through
                    Paystack.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        serviceName={service.name}
        providerName={service.provider}
        price={service.price}
      />
      <ComingSoonModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        title="Chat"
        message="The in-app messaging feature is coming soon! You'll be able to chat directly with service providers."
      />
    </>
  );
}
