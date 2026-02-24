"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import {
    AlertCircle,
    ArrowLeft,
    Bookmark,
    Calendar,
    Camera,
    ChevronRight,
    CreditCard,
    Globe,
    Home,
    LogOut,
    Moon,
    Package,
    Settings,
    Star,
    Sun,
    User as UserIcon,
    Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CLIENT_NAV = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "bookings", label: "My Bookings", icon: Calendar },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "wishlist", label: "Wishlist", icon: Bookmark },
  { id: "settings", label: "Settings", icon: Settings },
];

const PROVIDER_NAV = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "services", label: "My Services", icon: Package },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "earnings", label: "Earnings", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "b1",
    service: "Deep House Cleaning",
    provider: "CleanPro Services",
    date: "2026-02-25",
    status: "upcoming" as const,
    amount: "₦15,000",
  },
  {
    id: "b2",
    service: "AC Installation",
    provider: "CoolTech Nigeria",
    date: "2026-02-18",
    status: "completed" as const,
    amount: "₦12,000",
  },
  {
    id: "b3",
    service: "Plumbing Repair",
    provider: "handi Plumbing",
    date: "2026-02-10",
    status: "completed" as const,
    amount: "₦10,000",
  },
  {
    id: "b4",
    service: "Hair Styling",
    provider: "Beauty Queens",
    date: "2026-01-28",
    status: "cancelled" as const,
    amount: "₦8,000",
  },
];

// Mock provider bookings
const MOCK_PROVIDER_BOOKINGS = [
  {
    id: "pb1",
    service: "Home Fumigation",
    client: "Adaobi Chen",
    date: "2026-02-26",
    status: "pending" as const,
    amount: "₦20,000",
  },
  {
    id: "pb2",
    service: "Deep Cleaning",
    client: "Emeka Johnson",
    date: "2026-02-22",
    status: "upcoming" as const,
    amount: "₦15,000",
  },
  {
    id: "pb3",
    service: "Kitchen Renovation",
    client: "Sarah Williams",
    date: "2026-02-15",
    status: "completed" as const,
    amount: "₦45,000",
  },
];

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading, updateUser, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [walletBalance] = useState(25000);
  const { isDark: darkMode, toggleDarkMode } = useTheme();
  const [language, setLanguage] = useState("en");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isProvider = user.userType === "provider";
  const navItems = isProvider ? PROVIDER_NAV : CLIENT_NAV;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const statusStyle = (
    status: "upcoming" | "completed" | "cancelled" | "pending",
  ) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-700";
      case "completed":
        return "bg-green-50 text-green-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <ArrowLeft
            size={20}
            className="text-(--color-primary) cursor-pointer absolute top-4 left-4"
          />
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Logo / Home Link */}
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                src="/images/handi-logo-light.png"
                alt="HANDI"
                width={120}
                height={48}
                className="h-8 w-auto"
              />
            </Link>
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-(--color-primary-light) rounded-full flex items-center justify-center text-2xl font-bold text-(--color-primary)">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-(--color-primary) text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                >
                  <Camera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <h3 className="font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {isProvider
                  ? `${user.providerSubType || "Individual"} Provider`
                  : "Client"}
              </p>
              {isProvider && user.profileComplete === false && (
                <div className="mt-3 p-2 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-700 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  Complete your profile to post
                </div>
              )}
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-(--color-primary-light) text-(--color-primary) border-l-3 border-(--color-primary)"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ====== CLIENT OVERVIEW ====== */}
            {!isProvider && activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Welcome back, {user.firstName}! 👋
                </h2>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Bookings",
                      value: MOCK_BOOKINGS.length,
                      icon: Calendar,
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      label: "Completed",
                      value: MOCK_BOOKINGS.filter(
                        (b) => b.status === "completed",
                      ).length,
                      icon: Star,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Wallet Balance",
                      value: `₦${walletBalance.toLocaleString()}`,
                      icon: Wallet,
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      label: "Cart Items",
                      value: cartCount,
                      icon: Package,
                      color: "text-orange-600 bg-orange-50",
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
                      >
                        <stat.icon size={20} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Recent Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-(--color-primary) font-medium flex items-center gap-1 hover:underline"
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_BOOKINGS.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.provider} • {booking.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {booking.amount}
                          </p>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Browse Services",
                        href: "/services",
                        icon: Package,
                      },
                      {
                        label: "Find Providers",
                        href: "/providers",
                        icon: UserIcon,
                      },
                      {
                        label: "View Cart",
                        href: "/cart",
                        icon: CreditCard,
                      },
                      {
                        label: "Shop Products",
                        href: "/products",
                        icon: Bookmark,
                      },
                    ].map((action, i) => (
                      <Link
                        key={i}
                        href={action.href}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-(--color-primary-light) transition-colors group"
                      >
                        <action.icon
                          size={22}
                          className="text-gray-400 group-hover:text-(--color-primary) transition-colors"
                        />
                        <span className="text-xs font-medium text-gray-600 group-hover:text-(--color-primary) text-center">
                          {action.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ====== BOOKINGS TAB ====== */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {isProvider ? "Bookings" : "My Bookings"}
                </h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Service
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            {isProvider ? "Client" : "Provider"}
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Amount
                          </th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {(isProvider
                          ? MOCK_PROVIDER_BOOKINGS
                          : MOCK_BOOKINGS
                        ).map((booking) => (
                          <tr
                            key={booking.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">
                              {booking.service}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-500">
                              {"provider" in booking
                                ? booking.provider
                                : (booking as { client: string }).client}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-500">
                              {booking.date}
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                              {booking.amount}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyle(booking.status)}`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ====== WALLET TAB ====== */}
            {!isProvider && activeTab === "wallet" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">My Wallet</h2>
                <div className="bg-gradient-to-br from-(--color-primary) to-(--color-primary-dark) rounded-2xl p-6 text-white">
                  <p className="text-sm text-white/70 mb-1">
                    Available Balance
                  </p>
                  <p className="text-3xl font-bold">
                    ₦{walletBalance.toLocaleString()}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full text-sm font-medium transition-colors">
                      Top Up
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full text-sm font-medium transition-colors">
                      Withdraw
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Transaction History
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "House Cleaning Payment",
                        amount: "-₦15,000",
                        date: "Feb 18",
                        type: "debit",
                      },
                      {
                        label: "Wallet Top-up",
                        amount: "+₦50,000",
                        date: "Feb 15",
                        type: "credit",
                      },
                      {
                        label: "Refund - Cancelled Booking",
                        amount: "+₦8,000",
                        date: "Jan 28",
                        type: "credit",
                      },
                      {
                        label: "AC Repair Payment",
                        amount: "-₦12,000",
                        date: "Jan 20",
                        type: "debit",
                      },
                    ].map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tx.label}
                          </p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            tx.type === "credit"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ====== WISHLIST TAB ====== */}
            {!isProvider && activeTab === "wishlist" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <Bookmark size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Your wishlist is empty. Start browsing services and products
                    to save items you love!
                  </p>
                  <Link
                    href="/services"
                    className="inline-block mt-4 bg-(--color-primary) text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
                  >
                    Browse Services
                  </Link>
                </div>
              </div>
            )}

            {/* ====== PROVIDER OVERVIEW ====== */}
            {isProvider && activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Welcome back, {user.firstName}! 👋
                </h2>

                {user.profileComplete === false && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className="text-yellow-600 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Complete your profile to start receiving bookings
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Add your skills, bio, and location so clients can find
                        you.
                      </p>
                      <button
                        onClick={() => setActiveTab("settings")}
                        className="mt-2 text-sm font-medium text-yellow-800 underline"
                      >
                        Complete Profile →
                      </button>
                    </div>
                  </div>
                )}

                {/* Provider Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Jobs",
                      value: "23",
                      icon: Package,
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      label: "Rating",
                      value: "4.8",
                      icon: Star,
                      color: "text-yellow-600 bg-yellow-50",
                    },
                    {
                      label: "This Month",
                      value: "₦125,000",
                      icon: CreditCard,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Pending",
                      value: "3",
                      icon: Calendar,
                      color: "text-purple-600 bg-purple-50",
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
                      >
                        <stat.icon size={20} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Recent Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-(--color-primary) font-medium flex items-center gap-1 hover:underline"
                    >
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_PROVIDER_BOOKINGS.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.client} • {booking.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {booking.amount}
                          </p>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ====== PROVIDER SERVICES TAB ====== */}
            {isProvider && activeTab === "services" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    My Services
                  </h2>
                  <button className="bg-(--color-primary) text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                    + Add Service
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    You haven&apos;t added any services yet. Create your first
                    service listing to start receiving bookings.
                  </p>
                </div>
              </div>
            )}

            {/* ====== EARNINGS TAB ====== */}
            {isProvider && activeTab === "earnings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Earnings</h2>
                <div className="bg-gradient-to-br from-(--color-primary) to-(--color-primary-dark) rounded-2xl p-6 text-white">
                  <p className="text-sm text-white/70 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">₦380,000</p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-white/60">This Month</p>
                      <p className="text-lg font-semibold">₦125,000</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Pending</p>
                      <p className="text-lg font-semibold">₦20,000</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Withdrawn</p>
                      <p className="text-lg font-semibold">₦235,000</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Earnings History
                  </h3>
                  <div className="space-y-3">
                    {MOCK_PROVIDER_BOOKINGS.filter(
                      (b) => b.status === "completed",
                    ).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.client} • {booking.date}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          +{booking.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ====== SETTINGS TAB ====== */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Account Settings
                </h2>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.firstName}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.lastName}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="mt-4 bg-(--color-primary) text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-5">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {darkMode ? (
                          <Moon size={18} className="text-gray-500" />
                        ) : (
                          <Sun size={18} className="text-yellow-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Dark Mode
                          </p>
                          <p className="text-xs text-gray-500">
                            {darkMode
                              ? "Dark theme is active"
                              : "Light theme is active"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? "bg-(--color-primary)" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Language
                          </p>
                          <p className="text-xs text-gray-500">
                            Choose your preferred language
                          </p>
                        </div>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="yo">Yorùbá</option>
                        <option value="ig">Igbo</option>
                        <option value="ha">Hausa</option>
                        <option value="pcm">Pidgin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isProvider && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Provider Profile
                    </h3>
                    <div className="space-y-4">
                      {user.providerSubType === "business" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Business Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user.businessName || ""}
                            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                            placeholder="Your business name"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Bio
                        </label>
                        <textarea
                          defaultValue={user.bio || ""}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent resize-none"
                          placeholder="Tell clients about your experience..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue={user.address || ""}
                          className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                          placeholder="e.g. Lekki, Lagos"
                        />
                      </div>
                    </div>
                    <button className="mt-4 bg-(--color-primary) text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
