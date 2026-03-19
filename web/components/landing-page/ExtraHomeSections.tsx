"use client";

import { ChevronLeft, ChevronRight, MapPin, Star, Tag, Grid } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { SERVICE_CATEGORIES } from "@/data/mockApi";

const CATEGORIES = SERVICE_CATEGORIES.slice(0, 8);

// ==========================================
// MOCK DATA
// ==========================================
const PROS_NEAR_YOU = [
  { id: "p1", name: "David Chikelu", type: "Electrician", rating: 4.8, distance: "1.2 km", location: "Woji, Port Harcourt", image: "/images/banner/cleaning-provider.webp" },
  { id: "p2", name: "Sarah's Cleaning", type: "Home Cleaning", rating: 4.9, distance: "2.5 km", location: "GRA Phase 2, PH", image: "/images/banner/cleaning-provider.webp" },
  { id: "p3", name: "FixIt Plumbing", type: "Plumber", rating: 4.7, distance: "3.1 km", location: "Rumuola, PH", image: "/images/banner/cleaning-provider.webp" },
  { id: "p4", name: "Nkechi Hair & Co.", type: "Hair Stylist", rating: 4.9, distance: "0.8 km", location: "Eliozu, Port Harcourt", image: "/images/banner/cleaning-provider.webp" },
  { id: "p5", name: "AutoFix Mechanics", type: "Auto Mechanic", rating: 4.6, distance: "1.9 km", location: "Ada George, PH", image: "/images/banner/cleaning-provider.webp" },
  { id: "p6", name: "TechGenius Repairs", type: "Phone/Laptop Repair", rating: 4.8, distance: "2.1 km", location: "D-Line, Port Harcourt", image: "/images/banner/cleaning-provider.webp" },
];

const STORES_NEAR_YOU = [
  { id: "s1", name: "ElectroHub Gadgets", type: "Electronics", distance: "2.0 km", location: "Trans Amadi, PH", image: "/images/stores/samsung.webp", tags: ["Same-Day Delivery"] },
  { id: "s2", name: "Fresh Mart", type: "Groceries", distance: "1.5 km", location: "Rumuomasi, PH", image: "/images/stores/lg-electronics.webp", tags: ["Pickup", "Delivery"] },
  { id: "s3", name: "BuildWell Materials", type: "Hardware", distance: "4.2 km", location: "Choba, Port Harcourt", image: "/images/stores/pz-cussons.webp", tags: ["Wholesale"] },
  { id: "s4", name: "Lagos Fashion Hub", type: "Apparel", distance: "3.8 km", location: "GRA Phase 1, PH", image: "/images/stores/scanfrost.webp", tags: ["Custom Tailoring"] },
  { id: "s5", name: "Mega Electronics", type: "Electronics", distance: "1.1 km", location: "Olu Obasanjo, PH", image: "/images/stores/samsung.webp", tags: ["Verified", "Delivery"] },
  { id: "s6", name: "NaijaTools", type: "Tools & Hardware", distance: "2.8 km", location: "Mile 3, Port Harcourt", image: "/images/stores/pz-cussons.webp", tags: ["Bulk Orders"] },
];

const CHEAP_PRODUCTS = [
  { id: "c1", name: "LED Light Bulb (Pack of 3)", price: "₦4,500", oldPrice: "₦6,000", store: "ElectroHub Gadgets", image: "/images/products/ceiling-fan.svg", tag: "25% OFF" },
  { id: "c2", name: "All-Purpose Cleaner", price: "₦1,200", oldPrice: "₦2,000", store: "Fresh Mart", image: "/images/products/ceiling-fan.svg", tag: "Clearance" },
  { id: "c3", name: "Standard Extension Box", price: "₦3,500", oldPrice: "₦4,800", store: "BuildWell Materials", image: "/images/products/ceiling-fan.svg", tag: "Deal" },
  { id: "c4", name: "Plumbing Tape", price: "₦800", oldPrice: "", store: "FixIt Supplies", image: "/images/products/ceiling-fan.svg", tag: "Best Seller" },
  { id: "c5", name: "Spray Paint (Gold)", price: "₦2,800", oldPrice: "₦3,500", store: "NaijaTools", image: "/images/products/ceiling-fan.svg", tag: "20% OFF" },
  { id: "c6", name: "USB-C Charging Cable", price: "₦1,500", oldPrice: "₦2,200", store: "ElectroHub", image: "/images/products/ceiling-fan.svg", tag: "Hot Deal" },
];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop";

// ==========================================
// Scroll Arrow Helper
// ==========================================
function ScrollArrows({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-white transition-colors cursor-pointer hidden sm:inline-flex"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} className="text-gray-600" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-md items-center justify-center hover:bg-white transition-colors cursor-pointer hidden sm:inline-flex"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} className="text-gray-600" />
      </button>
    </>
  );
}

// ==========================================
// COMPONENTS
// ==========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfessionalsNearYouSection({ router }: { router: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="w-full px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading text-gray-900">Professionals Near You</h2>
        <button onClick={() => router.push("/providers")} className="text-sm font-semibold text-(--color-primary) flex items-center gap-1 hover:underline cursor-pointer">
          See All <ChevronRight size={16} />
        </button>
      </div>
      <div className="relative">
        <ScrollArrows scrollRef={scrollRef} />
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x no-scrollbar pb-4">
          {PROS_NEAR_YOU.map((pro) => (
            <div
              key={pro.id}
              className="snap-start shrink-0 w-[200px] sm:w-[220px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/providers/${pro.id}`)}
            >
              <div className="h-28 sm:h-32 bg-gray-200 relative">
                <Image src={pro.image} alt={pro.name} fill className="object-cover" onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-sm text-gray-900 truncate">{pro.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{pro.type}</p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1 text-gray-700">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> {pro.rating}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 truncate max-w-[110px]" title={`${pro.location} (${pro.distance})`}>
                    <MapPin size={11} className="shrink-0" /> {pro.location.split(",")[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StoresNearYouSection({ router }: { router: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="w-full px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading text-gray-900">Stores Near You</h2>
        <button onClick={() => router.push("/official-stores")} className="text-sm font-semibold text-(--color-primary) flex items-center gap-1 hover:underline cursor-pointer">
          See All <ChevronRight size={16} />
        </button>
      </div>
      <div className="relative">
        <ScrollArrows scrollRef={scrollRef} />
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x no-scrollbar pb-4">
          {STORES_NEAR_YOU.map((store) => (
            <div
              key={store.id}
              className="snap-start shrink-0 w-[200px] sm:w-[220px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/providers/${store.id}`)}
            >
              <div className="h-28 sm:h-32 bg-gray-100 relative">
                <Image src={store.image} alt={store.name} fill className="object-cover" onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-sm text-gray-900 truncate">{store.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{store.type}</p>
                <span className="text-xs text-gray-500 flex items-center gap-1 truncate" title={`${store.location} (${store.distance})`}>
                  <MapPin size={11} className="shrink-0" /> {store.location.split(",")[0]} · {store.distance}
                </span>
                {store.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {store.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CheapProductsSection({ router }: { router: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="w-full px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
          Budget-Friendly Finds <Tag size={18} className="text-emerald-500" />
        </h2>
        <button onClick={() => router.push("/deals")} className="text-sm font-semibold text-(--color-primary) flex items-center gap-1 hover:underline cursor-pointer">
          Shop All <ChevronRight size={16} />
        </button>
      </div>
      <div className="relative">
        <ScrollArrows scrollRef={scrollRef} />
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x no-scrollbar pb-4">
          {CHEAP_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="snap-start shrink-0 w-[160px] sm:w-[180px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/products/${prod.id}`)}
            >
              <div className="h-28 sm:h-32 bg-gray-50 relative p-2">
                <Image src={prod.image} alt={prod.name} fill className="object-contain mix-blend-multiply p-4" onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} />
                {prod.tag && (
                  <span className="absolute top-2 left-2 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {prod.tag}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-2">{prod.name}</h3>
                <p className="text-[10px] text-gray-500 truncate mb-1">{prod.store}</p>
                <div className="flex items-end gap-1.5">
                  <span className="font-bold text-gray-900">{prod.price}</span>
                  {prod.oldPrice && <span className="text-xs text-gray-400 line-through mb-0.5">{prod.oldPrice}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CategoriesSection({ router }: { router: any }) {
  return (
    <section className="w-full px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
          Categories <Grid size={18} className="text-(--color-primary)" />
        </h2>
        <button onClick={() => router.push("/services")} className="text-sm font-semibold text-(--color-primary) flex items-center gap-1 hover:underline cursor-pointer">
          See All <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/services?q=${cat.id}`)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-(--color-primary) group-hover:shadow-md transition-all overflow-hidden relative">
              <Image src={cat.image} alt={cat.label} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
