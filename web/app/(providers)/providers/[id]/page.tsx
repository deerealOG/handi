"use client";

import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import BookingModal from "@/components/shared/BookingModal";
import AuthModal from "@/components/ui/AuthModal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { getProviderById, getServicesByProvider } from "@/data/mockApi";
import {
    ArrowLeft,
    Award,
    BadgeCheck,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Globe,
    MapPin,
    MessageCircle,
    Phone,
    Search,
    Share2,
    Shield,
    Star,
    Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const MOCK_REVIEWS = [
  {
    name: "Aisha M.",
    date: "2 days ago",
    rating: 5,
    text: "Excellent work! Very professional and thorough. Will definitely use again.",
  },
  {
    name: "Emeka O.",
    date: "1 week ago",
    rating: 5,
    text: "Arrived on time and completed the job perfectly. Highly recommended.",
  },
  {
    name: "Blessing A.",
    date: "2 weeks ago",
    rating: 4,
    text: "Good service overall. Minor delay but quality work.",
  },
  {
    name: "Chidi N.",
    date: "3 weeks ago",
    rating: 5,
    text: "Very impressed with the attention to detail. Fair pricing and great communication.",
  },
];

const MOCK_PORTFOLIO = [1, 2, 3, 4, 5, 6];

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookingService, setBookingService] = useState<any>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent");
  const [activeSection, setActiveSection] = useState("about");
  const [serviceSearch, setServiceSearch] = useState("");

  const provider = getProviderById(params.id as string);

  if (!provider) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Provider Not Found
            </h1>
            <p className="text-gray-500 mb-4">
              This provider profile doesn&apos;t exist.
            </p>
            <Link
              href="/providers"
              className="text-emerald-600 hover:underline font-medium"
            >
              ← Browse Providers
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const providerServices = getServicesByProvider(provider.id);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBookNow = (service?: any) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (service) {
      setBookingService(service);
      setBookingOpen(true);
    } else if (providerServices.length > 0) {
      setBookingService(providerServices[0]);
      setBookingOpen(true);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: provider.name,
          text: provider.bio,
          url,
        });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const getBadgeStyle = (badge: string | null) => {
    switch (badge) {
      case "Verified":
        return "bg-green-400/20 text-green-100";
      case "Top Rated":
        return "bg-yellow-400/20 text-yellow-100";
      case "Featured":
        return "bg-purple-400/20 text-purple-100";
      case "Premium":
        return "bg-blue-400/20 text-blue-100";
      case "Specialist":
        return "bg-orange-400/20 text-orange-100";
      default:
        return "bg-white/20 text-white";
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
      <Breadcrumbs />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Overhauled Provider Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                 <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-5">
                   {/* Avatar */}
                   <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-400 shrink-0 overflow-hidden relative">
                     {provider.image ? (
                        <Image src={provider.image} alt={provider.name} fill className="object-cover" />
                     ) : (
                        <span>{provider.name.charAt(0)}</span>
                     )}
                   </div>
                   <div className="flex-1 flex flex-col justify-center">
                     <div className="flex items-center gap-2 mb-2">
                       <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold capitalize">
                         {provider.category.replace("-", " ")}
                       </span>
                       {provider.badge && (
                         <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyle(provider.badge).replace('/20', '/100').replace('text-white', 'text-gray-900').replace('text-yellow-100', 'text-yellow-900').replace('text-green-100', 'text-green-900').replace('text-blue-100', 'text-blue-900').replace('text-orange-100','text-orange-900').replace('text-purple-100', 'text-purple-900')}`}>
                           {provider.badge}
                         </span>
                       )}
                       <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${provider.isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                         {provider.isOnline ? "Online Now" : "Offline"}
                       </span>
                     </div>
                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                     
                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
                       <span className="flex items-center gap-1">
                         <Star size={14} className="text-yellow-400 fill-yellow-400" />
                         <span className="font-semibold text-gray-700">{provider.rating}</span> ({provider.reviews} reviews)
                       </span>
                       <span className="flex items-center gap-1">
                         <MapPin size={14} /> {provider.location}
                       </span>
                       <span className="flex items-center gap-1">
                         <Briefcase size={14} /> {provider.completedJobs} jobs completed
                       </span>
                     </div>
                     
                     <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xl font-bold text-(--color-primary)">{provider.price}</span>
                     </div>
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                    <button onClick={() => handleBookNow()} className="flex-1 sm:flex-none px-6 py-3 bg-(--color-primary) text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                       <Calendar size={18} /> Book Appointment
                    </button>
                    <button onClick={() => { if(!user) setAuthModalOpen(true); else router.push("/?tab=messages"); }} className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                       <MessageCircle size={18} /> Message
                    </button>
                 </div>
              </div>
              {/* Quick Nav Tabs */}
              <div className="bg-white rounded-2xl shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto">
                {[
                  { id: "about", label: "About" },
                  {
                    id: "services",
                    label: `Services (${providerServices.length})`,
                  },
                  { id: "portfolio", label: "Portfolio" },
                  { id: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeSection === tab.id
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* About */}
              {(activeSection === "about" ||
                activeSection === "services" ||
                activeSection === "portfolio" ||
                activeSection === "reviews") &&
                activeSection === "about" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 mb-3">
                        About
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {provider.bio ||
                          `${provider.name} is a verified professional specializing in ${provider.category}. Providing top-quality services in the ${provider.location} area with years of experience and hundreds of satisfied customers.`}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Skills & Expertise
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        {
                          label: "Experience",
                          value: `${Math.floor(provider.completedJobs / 50)}+ years`,
                          icon: (
                            <Clock size={16} className="text-emerald-600" />
                          ),
                        },
                        {
                          label: "Location",
                          value: provider.location,
                          icon: <MapPin size={16} className="text-blue-600" />,
                        },
                        {
                          label: "Response",
                          value: provider.isOnline ? "< 1 hour" : "Within 24h",
                          icon: <Zap size={16} className="text-yellow-600" />,
                        },
                        {
                          label: "Type",
                          value: provider.providerType || "Individual",
                          icon: <Globe size={16} className="text-purple-600" />,
                        },
                        {
                          label: "Languages",
                          value: "English, Pidgin",
                          icon: (
                            <MessageCircle
                              size={16}
                              className="text-indigo-600"
                            />
                          ),
                        },
                        {
                          label: "Completion",
                          value: "98%",
                          icon: (
                            <CheckCircle size={16} className="text-green-600" />
                          ),
                        },
                      ].map((info) => (
                        <div
                          key={info.label}
                          className="bg-white rounded-xl p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {info.icon}
                            <span className="text-[10px] text-gray-400">
                              {info.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {info.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Services */}
              {activeSection === "services" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Services Offered
                    </h2>
                    <div className="relative">
                       <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         type="text"
                         placeholder="Search services..."
                         value={serviceSearch}
                         onChange={e => setServiceSearch(e.target.value)}
                         className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                       />
                    </div>
                  </div>
                  {providerServices.length > 0 ? (
                    <div className="space-y-3">
                      {providerServices.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors group"
                        >
                          <Link
                            href={`/services/${s.id}`}
                            className="flex items-center gap-3 flex-1 min-w-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                              🔧
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                                {s.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="flex items-center gap-0.5">
                                  <Star
                                    size={10}
                                    className="text-yellow-400 fill-yellow-400"
                                  />{" "}
                                  {s.rating}
                                </span>
                                <span>· {s.duration}</span>
                                <span>· {s.location.split(",")[0]}</span>
                              </div>
                            </div>
                          </Link>
                          <div className="text-right shrink-0 ml-3">
                            <p className="font-bold text-gray-900">
                              ₦{s.price.toLocaleString()}
                            </p>
                            {s.originalPrice && (
                              <p className="text-[10px] text-gray-400 line-through">
                                ₦{s.originalPrice.toLocaleString()}
                              </p>
                            )}
                            <button
                              onClick={() => handleBookNow(s)}
                              className="mt-1 text-[10px] text-emerald-600 font-semibold hover:underline cursor-pointer"
                            >
                              Book →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No services listed yet. Contact the provider for
                      availability.
                    </p>
                  )}
                </div>
              )}

              {/* Portfolio */}
              {activeSection === "portfolio" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Recent Work
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MOCK_PORTFOLIO.map((i) => (
                      <div
                        key={i}
                        className="bg-linear-to-br from-gray-100 to-gray-50 rounded-xl h-32 sm:h-40 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow group"
                      >
                        <span className="text-3xl opacity-30 group-hover:opacity-50 transition-opacity">
                          📷
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeSection === "reviews" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                      Customer Reviews
                    </h2>
                    <select
                      value={reviewSort}
                      onChange={(e) => setReviewSort(e.target.value)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>
                  </div>

                  {/* Rating Summary */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-5">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {provider.rating}
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={
                              s <= Math.round(provider.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {provider.reviews} reviews
                      </p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const pct =
                          stars === 5
                            ? 55
                            : stars === 4
                              ? 30
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

                  <div className="space-y-4">
                    {sortedReviews.map((review, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {review.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {review.date}
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
                        <p className="text-sm text-gray-600">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ====== RIGHT COLUMN (STICKY) ====== */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  Price Range
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {provider.price}
                </p>

                <button
                  onClick={() => handleBookNow()}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={18} /> Book Now
                </button>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                        if (!user) setAuthModalOpen(true);
                        else router.push("/?tab=messages");
                    }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone size={14} /> Call
                  </button>
                  <button
                    onClick={() => {
                        if (!user) setAuthModalOpen(true);
                        else router.push("/?tab=messages");
                    }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle size={14} /> Chat
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: <Briefcase size={16} />,
                      value: provider.completedJobs,
                      label: "Jobs Done",
                      color: "text-emerald-600 bg-emerald-50",
                    },
                    {
                      icon: <Star size={16} />,
                      value: provider.rating,
                      label: "Rating",
                      color: "text-yellow-600 bg-yellow-50",
                    },
                    {
                      icon: <Award size={16} />,
                      value: provider.reviews,
                      label: "Reviews",
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      icon: <CheckCircle size={16} />,
                      value: "98%",
                      label: "Completion",
                      color: "text-green-600 bg-green-50",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="text-center p-3 bg-gray-50 rounded-xl"
                    >
                      <div
                        className={`w-8 h-8 mx-auto mb-1.5 rounded-full flex items-center justify-center ${stat.color}`}
                      >
                        {stat.icon}
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="space-y-3">
                  {[
                    {
                      icon: <BadgeCheck size={16} className="text-green-600" />,
                      label: "Identity Verified",
                    },
                    {
                      icon: <Shield size={16} className="text-blue-600" />,
                      label: "Background Checked",
                    },
                    {
                      icon: <Award size={16} className="text-orange-600" />,
                      label: "Licensed & Insured",
                    },
                    {
                      icon: <Zap size={16} className="text-purple-600" />,
                      label: "Fast Response Time",
                    },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-gray-700"
                    >
                      {badge.icon} {badge.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Services List */}
              {providerServices.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Services
                  </h3>
                  <div className="space-y-2">
                    {providerServices.slice(0, 3).map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="flex items-center justify-between py-2 text-sm group"
                      >
                        <span className="text-gray-700 group-hover:text-emerald-600 transition-colors truncate pr-2">
                          {s.name}
                        </span>
                        <span className="font-semibold text-gray-900 shrink-0">
                          ₦{s.price.toLocaleString()}
                        </span>
                      </Link>
                    ))}
                    {providerServices.length > 3 && (
                      <button
                        onClick={() => setActiveSection("services")}
                        className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                      >
                        View all {providerServices.length} services →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40 flex items-center gap-3">
          <div>
            <p className="text-lg font-bold text-gray-900">{provider.price}</p>
            <p className="text-[10px] text-gray-500">Price range</p>
          </div>
          <button
            onClick={() => handleBookNow()}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </main>
      <Footer />

      {bookingService && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => {
            setBookingOpen(false);
            setBookingService(null);
          }}
          serviceName={bookingService.name}
          providerName={provider.name}
          price={bookingService.price}
          serviceId={bookingService.id}
        />
      )}

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        title="Login to Chat or Book"
        message="Please sign in to contact providers, ask questions, or book their services seamlessly."
      />

      <ComingSoonModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        title="Contact Provider"
        message={`Direct messaging and calling for ${provider.name} is coming soon! You'll be able to communicate directly with providers.`}
      />
    </>
  );
}
