"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ProviderDashboard } from "@/components/provider";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  Users,
  X,
} from "lucide-react";

const MOCK_ACTIVE_BOOKINGS = [
  {
    id: "b1",
    service: "AC Servicing & Repair",
    provider: "CoolAir Solutions",
    date: "Today, 2:00 PM",
    status: "Service in progress",
    statusColor: "bg-blue-100 text-blue-700",
    icon: "🔧",
  },
  {
    id: "b2",
    service: "Deep House Cleaning",
    provider: "SparkleClean NG",
    date: "Tomorrow, 9:00 AM",
    status: "Confirmed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🧹",
  },
  {
    id: "b3",
    service: "Electrical Wiring",
    provider: "PowerFix Pro",
    date: "Feb 24, 10:00 AM",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    icon: "⚡",
  },
];

const MOCK_COMPLETED_BOOKINGS = [
  {
    id: "c1",
    service: "Plumbing Repair",
    provider: "AquaFix NG",
    date: "Feb 15, 2026",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🔧",
    amount: "₦8,500",
  },
  {
    id: "c2",
    service: "House Painting",
    provider: "PaintMaster Pro",
    date: "Feb 10, 2026",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    icon: "🎨",
    amount: "₦45,000",
  },
];

const TRACKING_STEPS = [
  { label: "Confirmed", done: true },
  { label: "Provider on the way", done: true },
  { label: "Service in progress", done: false },
  { label: "Completed", done: false },
];

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isProvider = user.userType === "provider";

  if (isProvider) {
    return <ProviderDashboard />;
  }

  return <ClientDashboard user={user} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClientDashboard({ user }: { user: any }) {
  const { logout } = useAuth();
  const { cartItems, wishlistItems } = useCart();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingFilter, setBookingFilter] = useState<"active" | "completed">("active");
  const [cancelledBookings, setCancelledBookings] = useState<Set<string>>(new Set());

  const bookings = bookingFilter === "active" ? MOCK_ACTIVE_BOOKINGS : MOCK_COMPLETED_BOOKINGS;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canCancel = (booking: any) => {
    return !cancelledBookings.has(booking.id) && bookingFilter === "active";
  };

  const handleCancel = (bookingId: string) => {
    setCancelledBookings((prev) => new Set([...prev, bookingId]));
    setSelectedBooking(null);
  };

  const QUICK_ACTIONS = [
    { label: "Browse Services", href: "/services", icon: Search, color: "bg-blue-50 text-blue-600" },
    { label: "Find Providers", href: "/providers", icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Shop Products", href: "/products", icon: ShoppingBag, color: "bg-amber-50 text-amber-600" },
    { label: "Hot Deals", href: "/deals", icon: Tag, color: "bg-red-50 text-red-600" },
    { label: "My Bookings", href: "#bookings", icon: Calendar, color: "bg-emerald-50 text-emerald-600" },
    { label: "Wishlist", href: "/products", icon: Heart, color: "bg-pink-50 text-pink-600" },
  ];

  const STATS = [
    { label: "Cart Items", value: cartItems.length, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
    { label: "Wishlist", value: wishlistItems.length, icon: Heart, color: "text-pink-600 bg-pink-50" },
    { label: "Active Bookings", value: MOCK_ACTIVE_BOOKINGS.filter(b => !cancelledBookings.has(b.id)).length, icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Here&apos;s what&apos;s happening with your account today.
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="px-5 py-2.5 border border-red-200 text-red-500 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer self-start"
            >
              Logout
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-3"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    if (action.href === "#bookings") {
                      document.getElementById("bookings-section")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      router.push(action.href);
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-(--color-primary)/20 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Section */}
          <div id="bookings-section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">My Bookings</h2>
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setBookingFilter("active")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    bookingFilter === "active"
                      ? "bg-white text-(--color-primary) shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Active ({MOCK_ACTIVE_BOOKINGS.length})
                </button>
                <button
                  onClick={() => setBookingFilter("completed")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    bookingFilter === "completed"
                      ? "bg-white text-(--color-primary) shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Completed ({MOCK_COMPLETED_BOOKINGS.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow ${
                    cancelledBookings.has(b.id) ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{b.service}</p>
                      <p className="text-xs text-gray-500">{b.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{b.date}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      cancelledBookings.has(b.id) ? "bg-red-100 text-red-700" : b.statusColor
                    }`}>
                      {cancelledBookings.has(b.id) ? "Cancelled" : b.status}
                    </span>
                  </div>
                  {"amount" in b && (
                    <p className="text-sm font-bold text-gray-900 mt-2">
                      {(b as { amount?: string }).amount}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {bookings.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Calendar size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No bookings found.</p>
              </div>
            )}
          </div>

          {/* Ratings Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Star size={18} className="text-amber-500" /> Your Reviews
            </h2>
            <p className="text-sm text-gray-500">
              You&apos;ve completed {MOCK_COMPLETED_BOOKINGS.length} bookings. Leave reviews to help other customers!
            </p>
          </div>
        </div>

        <Footer />
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">
                  {selectedBooking.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedBooking.service}</h4>
                  <p className="text-sm text-gray-500">{selectedBooking.provider}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedBooking.date}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    cancelledBookings.has(selectedBooking.id) ? "bg-red-100 text-red-700" : selectedBooking.statusColor
                  }`}>
                    {cancelledBookings.has(selectedBooking.id) ? "Cancelled" : selectedBooking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-medium text-gray-900">#{selectedBooking.id}</span>
                </div>
                {"amount" in selectedBooking && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-(--color-primary)">
                      {(selectedBooking as { amount?: string }).amount}
                    </span>
                  </div>
                )}
              </div>

              {/* Tracking */}
              {bookingFilter === "active" && !cancelledBookings.has(selectedBooking.id) && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-blue-600" /> Booking Tracking
                  </h5>
                  <div className="space-y-3">
                    {TRACKING_STEPS.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${
                          step.done ? "bg-(--color-primary)" : "bg-gray-300"
                        }`}>
                          {step.done ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs ${step.done ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {canCancel(selectedBooking) && (
                  <button
                    onClick={() => handleCancel(selectedBooking.id)}
                    className="flex-1 py-2.5 text-sm font-semibold border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
                {bookingFilter === "active" && !cancelledBookings.has(selectedBooking.id) && (
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle size={14} /> Message Provider
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 text-sm font-semibold bg-(--color-primary) text-white rounded-full hover:opacity-90 transition-colors cursor-pointer"
                >
                  {bookingFilter === "active" ? "Track Provider" : "Book Again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
