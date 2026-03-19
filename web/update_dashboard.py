import re

with open("app/(dashboard)/dashboard/page.tsx", "r", encoding="utf-8") as f:
    text = f.read()

new_imports = """
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ProviderDashboard } from "@/components/provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Heart,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  MapPin,
  Clock,
  X,
  Wallet,
  Wrench,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
"""

imports_pattern = r'import { useAuth } from "@/context/AuthContext";\s*import { ProviderDashboard } from "@/components/provider";\s*import { useRouter } from "next/navigation";\s*import { useEffect } from "react";'
text = re.sub(imports_pattern, new_imports.strip(), text, count=1)

mock_data = """
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
"""
# insert mock data right after imports
text = text.replace("export default function DashboardPage() {", mock_data + "\nexport default function DashboardPage() {")

# replace the placeholder function
placeholder_pattern = r'// Temporary client dashboard until Phase 2\s*// eslint-disable-next-line @typescript-eslint/no-explicit-any\s*function ClientDashboardPlaceholder.*?$ '
text = text.replace('function ClientDashboardPlaceholder({ user }: { user: any }) {', 'function ClientDashboardPlaceholder({ user }: { user: any }) {\n  const { cartCount, wishlistCount } = useCart();\n  const [selectedBooking, setSelectedBooking] = useState<any>(null);')

new_render = """
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Top Banner */}
      <div className="bg-emerald-700 text-white pt-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2"
            >
              Welcome back, {user.firstName}! 👋
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: 0.1 }}
               className="text-emerald-100 text-sm sm:text-base"
            >
              Here's an overview of your account and activities.
            </motion.p>
          </div>
          <div className="hidden sm:block">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/50">
               {user.firstName?.[0]}{user.lastName?.[0]}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 space-y-6">
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-medium">Active Bookings</p>
                 <p className="text-xl font-bold text-gray-900">{MOCK_ACTIVE_BOOKINGS.filter(b => b.status !== "Completed").length}</p>
              </div>
           </div>
           
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <ShoppingCart size={24} />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-medium">Cart Items</p>
                 <p className="text-xl font-bold text-gray-900">{cartCount || 0}</p>
              </div>
           </div>
           
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Heart size={24} />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-medium">Wishlist</p>
                 <p className="text-xl font-bold text-gray-900">{wishlistCount || 0}</p>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Wallet size={24} />
              </div>
              <div>
                 <p className="text-sm text-gray-500 font-medium">Wallet Balance</p>
                 <p className="text-xl font-bold text-gray-900">₦0.00</p>
              </div>
           </div>
        </motion.div>

        {/* Quick Actions & Recent Bookings wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
             {/* Recent Bookings */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                  <Link href="/services" className="text-sm text-(--color-primary) font-medium flex items-center gap-1 hover:underline">
                    View All <ChevronRight size={16} />
                  </Link>
                </div>
                
                {MOCK_ACTIVE_BOOKINGS.length === 0 ? (
                  <div className="text-center py-8">
                     <Wrench size={48} className="mx-auto text-gray-300 mb-3" />
                     <p className="text-gray-500 text-sm">You have no active bookings right now.</p>
                     <button onClick={() => router.push('/services')} className="mt-4 px-5 py-2 bg-(--color-primary) text-white rounded-full text-sm font-semibold">Book a Service</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {MOCK_ACTIVE_BOOKINGS.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
                          {b.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 t
