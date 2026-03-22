"use client";

import { Building2, ChevronRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScrollSection from "../shared/ScrollSection";

// Mock data for officially verified stores
const OFFICIAL_STORES = [
  {
    id: "store_1",
    name: "Samsung Nigeria",
    category: "Electronics",
    rating: 4.9,
    reviews: 1250,
    status: "verified",
    image: "/images/stores/samsung.webp",
    badges: ["Official Partner", "Free Delivery"],
    location: "Lagos, Nigeria",
  },
  {
    id: "store_2",
    name: "LG Electronics",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 980,
    status: "verified",
    image: "/images/stores/lg-electronics.webp",
    badges: ["Official Partner", "1 Yr Warranty"],
    location: "Abuja, Nigeria",
  },
  {
    id: "store_3",
    name: "PZ Cussons",
    category: "Home & Personal Care",
    rating: 4.7,
    reviews: 3400,
    status: "verified",
    image: "/images/stores/pz-cussons.webp",
    badges: ["Official Partner"],
    location: "Port Harcourt, Nigeria",
  },
  {
    id: "store_4",
    name: "Scanfrost Official",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 670,
    status: "verified",
    image: "/images/stores/scanfrost.webp",
    badges: ["Official Partner", "Nationwide"],
    location: "Lagos, Nigeria",
  },
  {
    id: "store_5",
    name: "Haier Thermocool",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 670,
    status: "verified",
    image: "/images/stores/haier-thermocool.webp",
    badges: ["Official Partner", "Nationwide"],
    location: "Lagos, Nigeria",
  },
  {
    id: "store_6",
    name: "Hisense",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 670,
    status: "verified",
    image: "/images/stores/hisense.webp",
    badges: ["Official Partner", "Nationwide"],
    location: "Lagos, Nigeria",
  },
  {
    id: "store_7",
    name: "Polystar",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 670,
    status: "verified",
    image: "/images/stores/polystar.webp",
    badges: ["Official Partner", "Nationwide"],
    location: "Lagos, Nigeria",
  },
  {
    id: "store_8",
    name: "Binatone",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 670,
    status: "verified",
    image: "/images/stores/binatone.webp",
    badges: ["Official Partner", "Nationwide"],
    location: "Lagos, Nigeria",
  },
  {
    id: "store_9",
    name: "Hypo",
    category: "Home Appliances",
    rating: 4.8,
    reviews: 670,
    status: "verified",
    image: "/images/stores/hypo.webp",
    badges: ["Official Partner", "Nationwide"],
    location: "Lagos, Nigeria",
  },
];

export default function OfficialStoresSection({
  router,
}: {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
}) {
  return (
    <section className="">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Section Header */}
        <div className="bg-primary px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#eceeff]">
              Official Stores
              </h2>
              <span className="text-lg text-[#eceeff]"><Building2 size={20} /></span>
            </span>
          </div>
          <div className="hidden sm:flex">
            <p className="text-sm text-[#eceeff] dark:text-[#eceeff] mt-1 px-4 py-2">
              Shop directly from verified top brands and authorized distributors. Guaranteed authentic products.
            </p>
          </div>
          
          <button
            onClick={() => router.push("/official-stores")}
            className="hidden sm:flex items-center gap-2 text-[#eceeff] font-bold hover:gap-3 transition-all shrink-0 cursor-pointer"
          >
            View All Stores
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <ChevronRight size={18} className="text-[#eceeff]" />
            </div>
          </button>
        </div>

        {/* Stores Grid */}
        <div className="px-4 py-4">
        <ScrollSection className="snap-x snap-mandatory">
          {OFFICIAL_STORES.map((store) => (
            <div
              key={store.id}
              onClick={() => router.push(`/official-stores/${store.id}`)}
              className="snap-start shrink-0 w-[200px] sm:w-[220px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group border border-gray-100 dark:border-gray-700"
            >
              {/* Header Image */}
              <div className="relative h-28 sm:h-32 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                {/* Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold tracking-wider uppercase rounded-md shadow-sm">
                  Official
                </span>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-(--color-primary) transition-colors">
                  {store.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{store.category}</p>

                <div className="flex items-center gap-2 text-xs mb-2">
                  <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
                    <Star size={11} className="fill-current" />
                    {store.rating}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 truncate">
                    {store.reviews.toLocaleString()} reviews
                  </span>
                </div>

                <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                  <MapPin size={10} className="text-gray-400 shrink-0" />
                  {store.location}
                </span>
              </div>
            </div>
          ))}
        </ScrollSection>
        </div>

        {/* Mobile View All Button */}
        <button
          onClick={() => router.push("/providers?type=official")}
          className="w-full mt-8 sm:hidden py-4 bg-gray-100 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          View All Stores
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>
    </section>
  );
}
