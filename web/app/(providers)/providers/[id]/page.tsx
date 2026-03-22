"use client";

import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import BookingModal from "@/components/shared/BookingModal";
import AuthModal from "@/components/ui/AuthModal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ComingSoonModal from "@/components/ui/ComingSoonModal";
import { getProviderById, getServicesByProvider, MOCK_PROVIDERS } from "@/data/mockApi";
import {
    Award,
    BadgeCheck,
    Briefcase,
    Calendar,
    CheckCircle,
    ChevronDown,
    Lock,
    MapPin,
    MessageCircle,
    Phone,
    RefreshCw,
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
  { name: "Aisha M.", date: "2 days ago", rating: 5, text: "Excellent work! Very professional and thorough. Will definitely use again." },
  { name: "Emeka O.", date: "1 week ago", rating: 5, text: "Arrived on time and completed the job perfectly. Highly recommended." },
  { name: "Blessing A.", date: "2 weeks ago", rating: 4, text: "Good service overall. Minor delay but quality work." },
  { name: "Chidi N.", date: "3 weeks ago", rating: 5, text: "Very impressed with the attention to detail. Fair pricing and great communication." },
];

const MOCK_PORTFOLIO = [1, 2, 3, 4, 5, 6];

const WHATS_INCLUDED: Record<string, string[]> = {
  "home-cleaning": ["Full house dusting and surface cleaning", "Bathroom sanitization", "Kitchen deep clean", "Floor mopping and vacuuming", "All cleaning supplies provided"],
  electrical: ["Full electrical inspection", "Wiring repair or installation", "Safety compliance check", "All materials and tools included", "Post-service testing"],
  plumbing: ["Pipe inspection and diagnosis", "Leak repair or replacement", "Fixture installation", "All plumbing materials included", "Clean-up after service"],
  beauty: ["Professional consultation", "Premium products used", "Customized treatment plan", "Aftercare advice", "Satisfaction guarantee"],
  default: ["Professional service delivery", "All necessary materials included", "Quality assurance check", "Post-service cleanup", "Satisfaction guarantee"],
};

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
  const [serviceSearch, setServiceSearch] = useState("");

  const provider = getProviderById(params.id as string);

  if (!provider) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Provider Not Found</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">This provider profile doesn&apos;t exist.</p>
            <Link href="/providers" className="text-(--color-primary) hover:underline font-medium">← Browse Providers</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const providerServices = getServicesByProvider(provider.id);
  const similarProviders = MOCK_PROVIDERS.filter(p => p.category === provider.category && p.id !== provider.id).slice(0, 4);
  const includedItems = WHATS_INCLUDED[provider.category] || WHATS_INCLUDED.default;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBookNow = (service?: any) => {
    if (!user) { setAuthModalOpen(true); return; }
    if (service) { setBookingService(service); setBookingOpen(true); }
    else if (providerServices.length > 0) { setBookingService(providerServices[0]); setBookingOpen(true); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: provider.name, text: provider.bio, url }); } catch { /* cancelled */ }
    } else { await navigator.clipboard.writeText(url); }
  };

  const sortedReviews = [...MOCK_REVIEWS].sort((a, b) => {
    if (reviewSort === "highest") return b.rating - a.rating;
    if (reviewSort === "lowest") return a.rating - b.rating;
    return 0;
  });

  const breadcrumbItems = [
    { label: "Providers", href: "/providers" },
    { label: provider.category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), href: `/providers?category=${provider.category}` },
    { label: provider.name },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* ── Main 3-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* ── LEFT: Provider Photo + Info ── */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                {/* Provider Image */}
                <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg h-56 sm:h-64 flex items-center justify-center overflow-hidden mb-3">
                  {provider.image ? (
                    <Image src={provider.image} alt={provider.name} fill className="object-cover" />
                  ) : (
                    <span className="text-6xl font-bold text-gray-300 dark:text-gray-500">{provider.name.charAt(0)}</span>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded ${provider.isOnline ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                      {provider.isOnline ? "● Online" : "Offline"}
                    </span>
                    {provider.badge && (
                      <span className="px-2.5 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">{provider.badge}</span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button onClick={handleShare} className="bg-white/90 dark:bg-gray-600/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-600 transition-colors">
                      <Share2 size={16} className="text-gray-500 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { icon: <Shield size={20} className="text-emerald-600" />, title: "Verified Professional", desc: "Identity and background verified" },
                  { icon: <Lock size={20} className="text-blue-600" />, title: "Secure Payments", desc: "Payments processed through Paystack" },
                  { icon: <RefreshCw size={20} className="text-purple-600" />, title: "Satisfaction Guarantee", desc: "Support available if issues occur" },
                ].map((t, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{t.icon}</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.title}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 mt-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">What&apos;s Typically Included</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {includedItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER: Provider Details ── */}
            <div className="lg:col-span-5 space-y-4">
              {/* Name & Ratings */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <span className="inline-block px-2.5 py-0.5 bg-(--color-primary-light) text-(--color-primary) rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                  {provider.category.replace("-", " ")}
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2">{provider.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {provider.rating} ({provider.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {provider.location}</span>
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {provider.completedJobs} jobs</span>
                </div>
                <hr className="border-gray-100 dark:border-gray-700 mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{provider.price}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Starting price</p>
              </div>

              {/* CTA Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 space-y-3">
                <button onClick={() => handleBookNow()} className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-(--color-primary) text-white hover:opacity-90 text-sm cursor-pointer">
                  <Calendar size={16} /> Book Appointment
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { if (!user) setAuthModalOpen(true); else router.push("/?tab=messages"); }} className="py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 cursor-pointer">
                    <Phone size={14} /> Call
                  </button>
                  <button onClick={() => { if (!user) setAuthModalOpen(true); else router.push("/?tab=messages"); }} className="py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 cursor-pointer">
                    <MessageCircle size={14} /> Message
                  </button>
                </div>
              </div>

              {/* About & Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">About</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {provider.bio || `${provider.name} is a verified professional specializing in ${provider.category}. Providing top-quality services in the ${provider.location} area with years of experience and hundreds of satisfied customers.`}
                </p>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-(--color-primary-light) text-(--color-primary) rounded-full text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Anchor Nav + Quick Stats (sticky) ── */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Page Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">On this page</h3>
                  <nav className="flex flex-col">
                    {[
                      { id: "provider-services", label: "Services" },
                      { id: "provider-portfolio", label: "Portfolio" },
                      { id: "provider-reviews", label: "Reviews" },
                      { id: "provider-experience", label: "Experience" },
                      { id: "provider-certs", label: "Certifications" },
                      { id: "provider-hours", label: "Working Hours" },
                      { id: "provider-faq", label: "FAQ" },
                    ].map((item) => (
                      <button key={item.id} onClick={() => { const el = document.getElementById(item.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                        className="text-left px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-(--color-primary) transition-colors border-l-2 border-transparent hover:border-(--color-primary) cursor-pointer"
                      >{item.label}</button>
                    ))}
                  </nav>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <Briefcase size={14} />, value: provider.completedJobs, label: "Jobs Done", color: "text-(--color-primary) bg-(--color-primary-light)" },
                      { icon: <Star size={14} />, value: provider.rating, label: "Rating", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" },
                      { icon: <Award size={14} />, value: provider.reviews, label: "Reviews", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" },
                      { icon: <CheckCircle size={14} />, value: "98%", label: "Completion", color: "text-green-600 bg-green-50 dark:bg-green-900/30" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className={`w-7 h-7 mx-auto mb-1 rounded-full flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
                  {[
                    { icon: <BadgeCheck size={16} className="text-green-600" />, label: "Identity Verified" },
                    { icon: <Shield size={16} className="text-blue-600" />, label: "Background Checked" },
                    { icon: <Award size={16} className="text-orange-600" />, label: "Licensed & Insured" },
                    { icon: <Zap size={16} className="text-purple-600" />, label: "Fast Response Time" },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300">{badge.icon} {badge.label}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Below-fold sections ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-9 space-y-4">
              {/* Services */}
              <div id="provider-services" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Services Offered ({providerServices.length})</h2>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search services..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-(--color-primary) w-full sm:w-48" />
                  </div>
                </div>
                {providerServices.length > 0 ? (
                  <div className="space-y-2">
                    {providerServices.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-(--color-primary-light) dark:hover:bg-gray-600 transition-colors group">
                        <Link href={`/services/${s.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center text-sm shrink-0 shadow-sm">🔧</div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-gray-900 dark:text-white group-hover:text-(--color-primary) transition-colors truncate">{s.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                              <span className="flex items-center gap-0.5"><Star size={8} className="text-yellow-400 fill-yellow-400" /> {s.rating}</span>
                              <span>· {s.duration}</span>
                            </div>
                          </div>
                        </Link>
                        <div className="text-right shrink-0 ml-3">
                          <p className="font-bold text-xs text-gray-900 dark:text-white">₦{s.price.toLocaleString()}</p>
                          <button onClick={() => handleBookNow(s)} className="text-[10px] text-(--color-primary) font-semibold hover:underline cursor-pointer">Book →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No services listed yet.</p>
                )}
              </div>

              {/* Portfolio */}
              <div id="provider-portfolio" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent Work</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {MOCK_PORTFOLIO.map((i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg h-28 sm:h-36 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer group">
                      <span className="text-2xl opacity-30 group-hover:opacity-50 transition-opacity">📷</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div id="provider-reviews" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
                  <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)} className="text-[10px] bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 outline-none cursor-pointer">
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>

                {/* Rating Summary */}
                <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                  <div className="text-center shrink-0">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{provider.rating}</p>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={10} className={s <= Math.round(provider.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-500"} />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{provider.reviews} ratings</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const pct = stars === 5 ? 55 : stars === 4 ? 30 : stars === 3 ? 10 : stars === 2 ? 3 : 2;
                      return (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-gray-500 dark:text-gray-400">{stars}</span>
                          <Star size={8} className="text-yellow-400 fill-yellow-400 shrink-0" />
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-gray-500 dark:text-gray-400 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedReviews.map((review, i) => (
                    <div key={i} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-(--color-primary-light) rounded-full flex items-center justify-center text-[10px] font-bold text-(--color-primary)">{review.name.charAt(0)}</div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{review.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={8} className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-500"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience & Background */}
              <div id="provider-experience" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Experience & Background</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Years Active", value: `${Math.max(1, Math.floor(provider.completedJobs / 50))}+`, sub: "years of experience" },
                    { label: "Response Time", value: provider.isOnline ? "< 1hr" : "< 24h", sub: "average reply" },
                    { label: "Languages", value: "2", sub: "English, Pidgin" },
                    { label: "Jobs Completed", value: provider.completedJobs.toString(), sub: "verified bookings" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Awards */}
              <div id="provider-certs" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Certifications & Awards</h2>
                <div className="space-y-3">
                  {[
                    { title: "Handi Verified Professional", year: "2024", desc: "Passed identity and background verification" },
                    { title: `Certified ${provider.category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`, year: "2023", desc: "Professional certification in area of specialization" },
                    { title: "Customer Excellence Award", year: "2024", desc: `Maintained ${provider.rating}+ rating over 6 months` },
                  ].map((cert) => (
                    <div key={cert.title} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-(--color-primary-light) rounded-full flex items-center justify-center shrink-0">
                        <Award size={14} className="text-(--color-primary)" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{cert.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{cert.desc} · {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div id="provider-hours" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Working Hours</h2>
                <div className="space-y-1.5">
                  {[
                    { day: "Monday — Friday", hours: "8:00 AM — 6:00 PM", active: true },
                    { day: "Saturday", hours: "9:00 AM — 4:00 PM", active: true },
                    { day: "Sunday", hours: "Closed", active: false },
                  ].map((row) => (
                    <div key={row.day} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{row.day}</span>
                      <span className={`text-xs font-medium ${row.active ? "text-(--color-primary)" : "text-gray-400"}`}>{row.hours}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">* Emergency services may be available outside working hours. Contact provider to confirm.</p>
              </div>

              {/* FAQ */}
              <div id="provider-faq" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {[
                    { q: "How do I book this provider?", a: "Click 'Book Appointment' to select a service, choose a date and time, and confirm your booking. You'll receive a confirmation via email and SMS." },
                    { q: "What is the cancellation policy?", a: "You can cancel up to 24 hours before the appointment for a full refund. Cancellations within 24 hours may incur a small fee." },
                    { q: "Is there a warranty on the service?", a: "Yes, all services come with a 7-day satisfaction guarantee. If you're not happy, we'll work with the provider to resolve the issue." },
                    { q: "Can I request an emergency service?", a: `Contact ${provider.name} directly via the Message button for emergency or after-hours requests. Availability may vary.` },
                  ].map((faq) => (
                    <details key={faq.q} className="group">
                      <summary className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer text-xs font-medium text-gray-900 dark:text-white list-none">
                        {faq.q}
                        <ChevronDown size={14} className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
                      </summary>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed px-3 pt-2 pb-3">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — quick services list */}
            <div className="lg:col-span-3">
              {providerServices.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">All Services</h3>
                  <div className="space-y-2">
                    {providerServices.slice(0, 5).map((s) => (
                      <Link key={s.id} href={`/services/${s.id}`} className="flex items-center justify-between py-1.5 text-xs group">
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-(--color-primary) transition-colors truncate pr-2">{s.name}</span>
                        <span className="font-semibold text-gray-900 dark:text-white shrink-0">₦{s.price.toLocaleString()}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Providers */}
          {similarProviders.length > 0 && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Similar Providers</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarProviders.map((prov) => (
                  <Link key={prov.id} href={`/providers/${prov.id}`}
                    className="rounded-lg bg-gray-50 dark:bg-gray-700 p-4 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-11 h-11 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-base">
                        {prov.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-(--color-primary) transition-colors">{prov.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" /> {prov.rating}
                          <span className="text-gray-400">({prov.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {prov.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          prov.badge === "Verified" ? "bg-green-100 text-green-700"
                          : prov.badge === "Top Rated" ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                        }`}>{prov.badge}</span>
                      )}
                      {prov.isOnline && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">● Available</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2"><MapPin size={10} /> {prov.location}</p>
                    <p className="text-xs font-bold text-(--color-primary)">{prov.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 z-40 flex items-center gap-3">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{provider.price}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Starting price</p>
          </div>
          <button onClick={() => handleBookNow()} className="flex-1 py-3 bg-(--color-primary) text-white rounded-lg font-semibold hover:opacity-90 cursor-pointer text-sm">
            Book Now
          </button>
        </div>
      </main>
      <Footer />

      {bookingService && (
        <BookingModal isOpen={bookingOpen} onClose={() => { setBookingOpen(false); setBookingService(null); }}
          serviceName={bookingService.name} providerName={provider.name} price={bookingService.price} serviceId={bookingService.id} />
      )}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} title="Login to Chat or Book" message="Please sign in to contact providers, ask questions, or book their services seamlessly." />
      <ComingSoonModal isOpen={chatModalOpen} onClose={() => setChatModalOpen(false)} title="Contact Provider" message={`Direct messaging and calling for ${provider.name} is coming soon!`} />
    </>
  );
}
