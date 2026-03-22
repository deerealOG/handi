"use client";

import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import {
  ArrowLeft,
  Building2,
  Clock,
  Globe,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// Mock store data (matches OfficialStoresSection)
const STORE_DETAILS: Record<string, {
  id: string; name: string; category: string; rating: number; reviews: number;
  image: string; location: string; description: string; phone: string;
  website: string; hours: string; badges: string[];
  products: { id: string; name: string; price: string; image: string }[];
}> = {
  store_1: {
    id: "store_1", name: "Samsung Nigeria", category: "Electronics",
    rating: 4.9, reviews: 1250,
    image: "/images/stores/samsung.webp", location: "Lagos, Nigeria",
    description: "Official Samsung Nigeria store. Shop the latest Galaxy smartphones, TVs, home appliances, and accessories with manufacturer warranty.",
    phone: "+234 800 726 7864", website: "samsung.com/ng",
    hours: "Mon–Sat: 9AM–7PM", badges: ["Official Partner", "Free Delivery"],
    products: [
      { id: "sp1", name: "Galaxy S24 Ultra", price: "₦1,250,000", image: "/images/products/ceiling-fan.svg" },
      { id: "sp2", name: "55\" QLED Smart TV", price: "₦485,000", image: "/images/products/ceiling-fan.svg" },
      { id: "sp3", name: "Galaxy Buds3 Pro", price: "₦145,000", image: "/images/products/ceiling-fan.svg" },
      { id: "sp4", name: "Galaxy Watch 6", price: "₦210,000", image: "/images/products/ceiling-fan.svg" },
    ],
  },
  store_2: {
    id: "store_2", name: "LG Electronics", category: "Home Appliances",
    rating: 4.8, reviews: 980,
    image: "/images/stores/lg-electronics.webp", location: "Abuja, Nigeria",
    description: "Official LG Electronics store. Premium home appliances, TVs, and smart devices with official warranty and nationwide service centers.",
    phone: "+234 800 544 7282", website: "lg.com/ng",
    hours: "Mon–Sat: 9AM–6PM", badges: ["Official Partner", "1 Yr Warranty"],
    products: [
      { id: "lp1", name: "Side-by-Side Fridge", price: "₦895,000", image: "/images/products/ceiling-fan.svg" },
      { id: "lp2", name: "65\" OLED TV", price: "₦1,100,000", image: "/images/products/ceiling-fan.svg" },
      { id: "lp3", name: "Front Load Washer", price: "₦350,000", image: "/images/products/ceiling-fan.svg" },
    ],
  },
};

// Fallback for stores not in detail map
const FALLBACK_STORE = {
  id: "unknown", name: "Official Store", category: "General",
  rating: 4.5, reviews: 50,
  image: "/images/stores/samsung.webp", location: "Nigeria",
  description: "Official verified store on HANDI. Browse products from trusted brands.",
  phone: "+234 800 000 0000", website: "handi.ng",
  hours: "Mon–Sat: 9AM–6PM", badges: ["Official Partner"],
  products: [],
};

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  const store = STORE_DETAILS[storeId] || { ...FALLBACK_STORE, id: storeId };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="relative h-48 sm:h-64 bg-gray-200 overflow-hidden">
          <Image src={store.image} alt={store.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-white/80 text-sm hover:text-white mb-3 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold uppercase rounded-md">
                Official Store
              </span>
              <ShieldCheck size={16} className="text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{store.name}</h1>
            <p className="text-white/70 text-sm mt-1">{store.category}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Store Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{store.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {store.badges.map((b) => (
                    <span key={b} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={18} className="text-emerald-600" /> Products
                </h2>
                {store.products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {store.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => router.push(`/products/${p.id}`)}
                        className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="relative h-28 bg-gray-100">
                          <Image src={p.image} alt={p.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-3">
                          <h3 className="text-xs font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                          <p className="text-sm font-bold text-emerald-600 mt-1">{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No products listed yet.</p>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Reviews</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-gray-900">{store.rating}</span>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= Math.round(store.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{store.reviews.toLocaleString()} reviews</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Customer reviews coming soon.</p>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-4">
              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-1.5 text-yellow-500 font-bold mb-3">
                  <Star size={16} className="fill-current" />
                  <span className="text-lg">{store.rating}</span>
                  <span className="text-xs text-gray-500 font-normal ml-1">({store.reviews.toLocaleString()} reviews)</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    {store.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    {store.hours}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    {store.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    {store.website}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
                <button onClick={() => router.push(`/products?store=${storeId}`)} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <Package size={16} /> Browse Products
                </button>
                <button className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> Contact Store
                </button>
                <button className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <Heart size={16} /> Save Store
                </button>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-1.5 mb-2">
                  <Truck size={14} /> Delivery Information
                </h3>
                <ul className="text-xs text-blue-800 space-y-1.5">
                  <li>✓ Free delivery on orders above ₦50,000</li>
                  <li>✓ Same-day delivery in Lagos & Abuja</li>
                  <li>✓ Nationwide shipping available</li>
                  <li>✓ 7-day return policy</li>
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-3">
                  <Building2 size={14} /> Trust & Safety
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500" /> Verified Official Partner</div>
                  <div className="flex items-center gap-2"><Star size={14} className="text-yellow-500" /> Top-Rated Store</div>
                  <div className="flex items-center gap-2"><Truck size={14} className="text-emerald-500" /> Reliable Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
