"use client";

import { webFeatureService } from "@/lib/api";
import {
  ArrowRight,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Recommendation {
  id: string;
  type: "service" | "provider" | "product";
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price?: number;
  image?: string;
  reason: string;
  matchScore: number;
}

// Mock recommendations — replaced with API data when available
const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1", type: "service", name: "AC Maintenance & Repair",
    category: "Electrical", rating: 4.8, reviews: 234, price: 15000,
    image: "/images/categories/electrician.webp",
    reason: "Based on your home profile — AC servicing recommended quarterly",
    matchScore: 95,
  },
  {
    id: "r2", type: "provider", name: "SparkleClean NG",
    category: "Cleaning", rating: 4.9, reviews: 189,
    image: "/images/categories/cleaning.webp",
    reason: "Top-rated in your area with quick response times",
    matchScore: 92,
  },
  {
    id: "r3", type: "service", name: "Plumbing Inspection",
    category: "Plumbing", rating: 4.7, reviews: 156, price: 8000,
    image: "/images/categories/plumbing.webp",
    reason: "Seasonal recommendation — prevent pipe damage before rainy season",
    matchScore: 88,
  },
  {
    id: "r4", type: "product", name: "Smart Home Security Kit",
    category: "Security", rating: 4.6, reviews: 98, price: 45000,
    image: "/images/categories/technology.webp",
    reason: "Popular in your neighborhood — 40% of homes have upgraded",
    matchScore: 85,
  },
  {
    id: "r5", type: "service", name: "Pest Control Treatment",
    category: "Pest Control", rating: 4.8, reviews: 312, price: 12000,
    image: "/images/categories/pest-control.webp",
    reason: "Recommended every 3 months for your property type",
    matchScore: 82,
  },
  {
    id: "r6", type: "provider", name: "GreenGarden Pros",
    category: "Gardening", rating: 4.5, reviews: 67,
    image: "/images/categories/gardening.webp",
    reason: "New highly-rated provider near you — specializes in your garden type",
    matchScore: 78,
  },
];

export default function RecommendationsTab() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "service" | "provider" | "product">("all");

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    const res = await webFeatureService.getRecommendations();
    if (res.success && res.data && res.data.length > 0) {
      setRecommendations(res.data);
    } else {
      setRecommendations(MOCK_RECOMMENDATIONS);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRecs(); }, [fetchRecs]);

  const filtered = filter === "all"
    ? recommendations
    : recommendations.filter((r) => r.type === filter);

  const typeColors = {
    service: "bg-blue-100 text-blue-700",
    provider: "bg-green-100 text-green-700",
    product: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={22} className="text-yellow-500" />
            Smart Recommendations
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Personalized suggestions based on your home profile, location, and booking history.
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {(["all", "service", "provider", "product"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              filter === t
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary"
            }`}
          >
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((rec) => (
            <div key={rec.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              {/* Image */}
              <div className="relative h-36 bg-gray-100">
                {rec.image && (
                  <Image
                    src={rec.image}
                    alt={rec.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[rec.type]}`}>
                    {rec.type.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary">{rec.matchScore}% match</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {rec.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{rec.category}</span>
                  <span className="flex items-center gap-0.5 text-xs text-gray-500">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    {rec.rating} ({rec.reviews})
                  </span>
                </div>

                {/* Reason */}
                <div className="flex items-start gap-2 mt-3 p-2.5 bg-amber-50 rounded-lg">
                  <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">{rec.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3">
                  {rec.price && (
                    <span className="font-bold text-gray-900">₦{rec.price.toLocaleString()}</span>
                  )}
                  <button className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:opacity-90 ml-auto">
                    {rec.type === "provider" ? "View Profile" : rec.type === "product" ? "View Product" : "Book Now"}
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
