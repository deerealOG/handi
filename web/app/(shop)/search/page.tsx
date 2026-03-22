"use client";

import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import {
    MOCK_PRODUCTS,
    MOCK_PROVIDERS,
    MOCK_SERVICES,
    searchAll,
} from "@/data/mockApi";
import {
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Filter,
    Heart,
    MapPin,
    Package,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    TrendingUp,
    Wrench,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type TabType = "all" | "services" | "providers" | "products";

const ITEMS_PER_PAGE = 12;

const SUGGESTED_SEARCHES = [
  "Electrician",
  "Cleaning service",
  "Generator repair",
  "Makita drill",
  "Plumber",
  "Beauty",
  "Home painting",
  "Car battery",
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { toggleWishlist, isInWishlist, addToCart } = useCart();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        services: MOCK_SERVICES,
        providers: MOCK_PROVIDERS,
        products: MOCK_PRODUCTS,
      };
    }
    return searchAll(query);
  }, [query]);

  // Apply additional filters
  const filteredServices = useMemo(() => {
    return results.services.filter((s) => {
      if (minRating && s.rating < minRating) return false;
      if (priceMin && s.price < Number(priceMin)) return false;
      if (priceMax && s.price > Number(priceMax)) return false;
      return true;
    });
  }, [results.services, minRating, priceMin, priceMax]);

  const filteredProviders = useMemo(() => {
    return results.providers.filter((p) => {
      if (minRating && p.rating < minRating) return false;
      if (verifiedOnly && p.badge !== "Verified" && p.badge !== "Top Rated")
        return false;
      if (availableOnly && !p.isOnline) return false;
      return true;
    });
  }, [results.providers, minRating, verifiedOnly, availableOnly]);

  const filteredProducts = useMemo(() => {
    return results.products.filter((p) => {
      if (minRating && p.rating < minRating) return false;
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      if (onSaleOnly && !p.originalPrice) return false;
      if (availableOnly && !p.inStock) return false;
      return true;
    });
  }, [
    results.products,
    minRating,
    priceMin,
    priceMax,
    onSaleOnly,
    availableOnly,
  ]);

  const totalAll =
    filteredServices.length +
    filteredProviders.length +
    filteredProducts.length;

  const tabCounts = {
    all: totalAll,
    services: filteredServices.length,
    providers: filteredProviders.length,
    products: filteredProducts.length,
  };

  // Get current page items based on active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case "services":
        return filteredServices.slice(
          (page - 1) * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE,
        );
      case "providers":
        return filteredProviders.slice(
          (page - 1) * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE,
        );
      case "products":
        return filteredProducts.slice(
          (page - 1) * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE,
        );
      default:
        return [];
    }
  };

  const getCurrentTotal = () => {
    switch (activeTab) {
      case "services":
        return filteredServices.length;
      case "providers":
        return filteredProviders.length;
      case "products":
        return filteredProducts.length;
      default:
        return 0;
    }
  };

  const totalPages =
    activeTab === "all" ? 1 : Math.ceil(getCurrentTotal() / ITEMS_PER_PAGE);

  const activeFilterCount = [
    minRating !== null,
    !!priceMin || !!priceMax,
    availableOnly,
    verifiedOnly,
    onSaleOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setMinRating(null);
    setPriceMin("");
    setPriceMax("");
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setOnSaleOnly(false);
    setPage(1);
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1);
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-emerald-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4.5" : "translate-x-1"}`}
      />
    </button>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => {
                  setMinRating(minRating === r ? null : r);
                  setPage(1);
                }}
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={
                      s <= r
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      {(activeTab === "all" ||
        activeTab === "services" ||
        activeTab === "products") && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Price Range (₦)
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
          </div>
        </div>
      )}

      {/* Availability */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Availability
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Available Only</span>
          <Toggle
            checked={availableOnly}
            onChange={() => {
              setAvailableOnly(!availableOnly);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Verified (providers) */}
      {(activeTab === "all" || activeTab === "providers") && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Provider Status
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Verified Only</span>
            <Toggle
              checked={verifiedOnly}
              onChange={() => {
                setVerifiedOnly(!verifiedOnly);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {/* On Sale (products) */}
      {(activeTab === "all" || activeTab === "products") && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Discount</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">On Sale</span>
            <Toggle
              checked={onSaleOnly}
              onChange={() => {
                setOnSaleOnly(!onSaleOnly);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  // Service Card
  const ServiceResultCard = ({
    service,
  }: {
    service: (typeof MOCK_SERVICES)[0];
  }) => (
    <Link
      href={`/services/${service.id}`}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
    >
      <div className="h-32 bg-emerald-50 flex items-center justify-center relative overflow-hidden">
        <span className="text-4xl">🔧</span>
        {service.originalPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            -{Math.round((1 - service.price / service.originalPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {service.name}
        </h3>
        <p className="text-[10px] text-gray-500 mt-0.5">{service.provider}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-700">{service.rating}</span>
          <span>({service.reviews})</span>
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-emerald-600">
            ₦{service.price.toLocaleString()}
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );

  // Provider Card
  const ProviderResultCard = ({
    provider,
  }: {
    provider: (typeof MOCK_PROVIDERS)[0];
  }) => (
    <div
      onClick={() => router.push(`/providers/${provider.id}`)}
      className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base shrink-0">
          {provider.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
            {provider.name}
          </p>
          <p className="text-[10px] text-gray-500">{provider.category}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {provider.badge && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${provider.badge === "Verified" ? "bg-green-100 text-green-700" : provider.badge === "Top Rated" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}
          >
            {provider.badge}
          </span>
        )}
        {provider.isOnline && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
            ● Online
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <Star size={10} className="fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-gray-700">{provider.rating}</span>
        <span>({provider.reviews})</span>
        {provider.completedJobs > 0 && (
          <span>· {provider.completedJobs} jobs</span>
        )}
      </div>
      <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-2">
        <MapPin size={10} /> {provider.location}
      </p>
      <div className="mt-auto flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push("/login");
          }}
          className="flex-1 py-1.5 bg-emerald-600 text-white text-[10px] font-semibold rounded-full hover:bg-emerald-700 cursor-pointer"
        >
          Book Service
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/providers/${provider.id}`);
          }}
          className="py-1.5 px-2.5 border border-gray-200 text-gray-700 text-[10px] font-semibold rounded-full hover:bg-gray-50 cursor-pointer"
        >
          Profile
        </button>
      </div>
    </div>
  );

  // Product Card
  const ProductResultCard = ({
    product,
  }: {
    product: (typeof MOCK_PRODUCTS)[0];
  }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col">
      <div
        className="h-32 bg-gray-100 relative overflow-hidden cursor-pointer"
        onClick={() => router.push(`/products/${product.id}`)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError={(e: any) => {
            e.target.style.display = "none";
          }}
        />
        {product.originalPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-sm cursor-pointer"
        >
          <Heart
            size={12}
            className={
              isInWishlist(product.id)
                ? "text-red-500 fill-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[9px] text-gray-400 uppercase tracking-wider">
          {product.seller}
        </p>
        <h3
          className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm font-bold text-gray-900">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => router.push(`/products/${product.id}`)}
              className="flex-1 py-1.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full hover:bg-blue-700 cursor-pointer"
            >
              Buy Now
            </button>
            <button
              onClick={() =>
                addToCart(product.id, "product", 1, product.quantity)
              }
              className="py-1.5 px-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer"
            >
              <ShoppingCart size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Section for "All" tab
  const AllTabSection = ({
    title,
    icon,
    items,
    type,
  }: {
    title: string;
    icon: React.ReactNode;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    type: TabType;
  }) => {
    if (items.length === 0) return null;
    const shown = items.slice(0, 4);
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {icon} {title}{" "}
            <span className="text-sm font-normal text-gray-400">
              ({items.length})
            </span>
          </h3>
          {items.length > 4 && (
            <button
              onClick={() => {
                setActiveTab(type);
                setPage(1);
              }}
              className="text-sm text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              View All →
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {type === "services" &&
// eslint-disable-next-line @typescript-eslint/no-explicit-any
            shown.map((s: any) => <ServiceResultCard key={s.id} service={s} />)}
          {type === "providers" &&
// eslint-disable-next-line @typescript-eslint/no-explicit-any
            shown.map((p: any) => (
              <ProviderResultCard key={p.id} provider={p} />
            ))}
          {type === "products" &&
// eslint-disable-next-line @typescript-eslint/no-explicit-any
            shown.map((p: any) => <ProductResultCard key={p.id} product={p} />)}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search services, providers, or products..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-50 rounded-md text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
            {query && (
              <p className="text-sm text-gray-500 mt-2">
                Results for &ldquo;
                <span className="font-semibold text-gray-900">{query}</span>
                &rdquo; —{" "}
                <span className="font-medium text-gray-700">
                  {totalAll} results found
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Result Tabs */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
            {(["all", "services", "providers", "products"] as TabType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "services"
                      ? "Services"
                      : tab === "providers"
                        ? "Providers"
                        : "Products"}
                  <span
                    className={`ml-1.5 text-xs ${activeTab === tab ? "text-emerald-100" : "text-gray-400"}`}
                  >
                    ({tabCounts[tab]})
                  </span>
                </button>
              ),
            )}

            {/* Mobile filter button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden ml-auto flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shrink-0"
            >
              <SlidersHorizontal size={14} />
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-28">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Filter size={16} /> Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {totalAll === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No results found{query ? ` for "${query}"` : ""}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">Suggestions:</p>
                  <ul className="text-sm text-gray-500 mb-4 space-y-0.5">
                    <li>• Check your spelling</li>
                    <li>• Try a different keyword</li>
                    <li>• Remove filters</li>
                  </ul>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                    <Link
                      href="/services"
                      className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Browse Services
                    </Link>
                  </div>
                </div>
              ) : activeTab === "all" ? (
                <>
                  <AllTabSection
                    title="Services"
                    icon={<Wrench size={20} className="text-emerald-600" />}
                    items={filteredServices}
                    type="services"
                  />
                  <AllTabSection
                    title="Providers"
                    icon={<Briefcase size={20} className="text-blue-600" />}
                    items={filteredProviders}
                    type="providers"
                  />
                  <AllTabSection
                    title="Products"
                    icon={<Package size={20} className="text-purple-600" />}
                    items={filteredProducts}
                    type="products"
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {activeTab === "services" &&
                      (getCurrentItems() as typeof MOCK_SERVICES).map((s) => (
                        <ServiceResultCard key={s.id} service={s} />
                      ))}
                    {activeTab === "providers" &&
                      (getCurrentItems() as typeof MOCK_PROVIDERS).map((p) => (
                        <ProviderResultCard key={p.id} provider={p} />
                      ))}
                    {activeTab === "products" &&
                      (getCurrentItems() as typeof MOCK_PRODUCTS).map((p) => (
                        <ProductResultCard key={p.id} product={p} />
                      ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${page === i + 1 ? "bg-emerald-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Suggested Searches */}
          {!query && (
            <div className="mt-10 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" /> Popular
                Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Searches */}
          {query && (
            <div className="mt-10 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Related Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.filter(
                  (s) => s.toLowerCase() !== query.toLowerCase(),
                )
                  .slice(0, 5)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 cursor-pointer"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading search...</p>
          </div>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
