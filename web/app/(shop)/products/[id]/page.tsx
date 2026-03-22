"use client";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { getProductById, MOCK_PRODUCTS } from "@/data/mockApi";
import {
    Check,
    Heart,
    MapPin,
    Minus,
    Plus,
    RefreshCw,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Store,
    Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock reviews
const MOCK_PRODUCT_REVIEWS = [
  {
    id: "pr1",
    name: "Bola A.",
    rating: 5,
    date: "1 week ago",
    comment: "Great product, exactly as described. Fast delivery too!",
  },
  {
    id: "pr2",
    name: "Uche N.",
    rating: 4,
    date: "3 weeks ago",
    comment:
      "Good quality for the price. Packaging could be better but the product itself is solid.",
  },
  {
    id: "pr3",
    name: "Kemi L.",
    rating: 5,
    date: "1 month ago",
    comment:
      "This is my second purchase. Very reliable and durable. Highly recommended.",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = getProductById(params.id as string);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/products"
              className="text-(--color-primary) hover:underline"
            >
              ← Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const similarProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 6);

  const moreFromSeller = MOCK_PRODUCTS.filter(
    (p) => p.seller === product.seller && p.id !== product.id,
  ).slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product.id, "product", quantity, product.quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, "product", quantity, product.quantity);
    router.push("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    { label: product.category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), href: `/products?category=${product.category}` },
    { label: product.name },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbItems} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* ── Main 3-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* ── LEFT: Image Gallery ── */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                {/* Main image */}
                <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg h-64 sm:h-80 flex items-center justify-center overflow-hidden mb-3">
                  <span className="text-7xl">📦</span>
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-white/90 dark:bg-gray-600/90 backdrop-blur-sm p-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-sm"
                    >
                      <Heart
                        size={16}
                        className={
                          isInWishlist(product.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-500 dark:text-gray-300"
                        }
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-white/90 dark:bg-gray-600/90 backdrop-blur-sm p-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-sm"
                    >
                      <Share2 size={16} className="text-gray-500 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {[0, 1, 2, 3].map((thumb) => (
                    <button
                      key={thumb}
                      onClick={() => setActiveThumb(thumb)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded border-2 flex items-center justify-center bg-gray-50 dark:bg-gray-700 overflow-hidden cursor-pointer transition-all shrink-0 ${activeThumb === thumb ? "border-(--color-primary)" : "border-gray-200 dark:border-gray-600 hover:border-gray-400"}`}
                    >
                      <span className="text-lg">📦</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER: Product Info ── */}
            <div className="lg:col-span-5 space-y-4">
              {/* Title & rating */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <span className="inline-block px-2.5 py-0.5 bg-(--color-primary-light) text-(--color-primary) rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                  {product.category.replace("-", " ")}
                </span>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {product.rating} ({product.reviews} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {product.location}
                  </span>
                </div>
                <hr className="border-gray-100 dark:border-gray-700 mb-3" />
                {/* Price */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span
                    className={`flex items-center gap-1 ${product.inStock ? "text-green-600" : "text-red-500"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                    />
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.inStock && (
                    <span className="text-gray-500 dark:text-gray-400">
                      — {product.quantity} units available
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity + CTA */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Qty:
                  </span>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-semibold min-w-[40px] text-center text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.quantity, quantity + 1))
                      }
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    = ₦{(product.price * quantity).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full py-3 border border-(--color-primary) text-(--color-primary) rounded-lg font-semibold hover:bg-(--color-primary-light) transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Buy Now
                </button>
              </div>

              {/* Seller Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Store size={14} className="text-(--color-primary)" />
                  Seller Information
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-(--color-primary)">{product.seller}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {product.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Anchor Nav + Delivery & Return Info (sticky on desktop) ── */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Page Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                    On this page
                  </h3>
                  <nav className="flex flex-col">
                    {[
                      { id: "product-details", label: "Product Details" },
                      { id: "specifications", label: "Specifications" },
                      { id: "reviews", label: "Customer Reviews" },
                      { id: "similar-products", label: "You May Also Like" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const el = document.getElementById(item.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="text-left px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-(--color-primary) transition-colors border-l-2 border-transparent hover:border-(--color-primary) cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delivery & Returns</h3>

                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm">
                      <Truck size={18} className="text-(--color-primary) shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">Free Delivery</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Orders above ₦20,000. Delivery within 2-5 business days.</p>
                      </div>
                    </div>
                    <hr className="border-gray-100 dark:border-gray-700" />
                    <div className="flex gap-3 text-sm">
                      <RefreshCw size={18} className="text-(--color-primary) shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">Easy Returns</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">7-day return policy on eligible items.</p>
                      </div>
                    </div>
                    <hr className="border-gray-100 dark:border-gray-700" />
                    <div className="flex gap-3 text-sm">
                      <Shield size={18} className="text-(--color-primary) shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">Buyer Protection</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Secure payment + escrow guarantee.</p>
                      </div>
                    </div>
                    <hr className="border-gray-100 dark:border-gray-700" />
                    <div className="flex gap-3 text-sm">
                      <Check size={18} className="text-(--color-primary) shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">Genuine Products</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">All products are 100% authentic.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Details Section ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-9 space-y-4">
              {/* Description */}
              <div id="product-details" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Product Details</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Category</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">
                      {product.category.replace("-", " ")}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Seller</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{product.seller}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{product.location}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Availability</p>
                    <p className={`text-xs font-bold ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                      {product.inStock ? `In Stock (${product.quantity})` : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div id="specifications" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Specifications</h2>
                {product.specifications ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2.5 text-sm">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{key}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-xs">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No specifications available for this product.
                  </p>
                )}
              </div>

              {/* Customer Reviews */}
              <div id="reviews" className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 scroll-mt-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                    Verified Customer Feedback
                  </h2>
                  <div className="flex items-center gap-1 text-xs">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900 dark:text-white">{product.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Rating breakdown */}
                <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-5">
                  <div className="text-center shrink-0">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {product.rating}
                    </p>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={10}
                          className={
                            s <= Math.round(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-500"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {product.reviews} ratings
                    </p>
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

                {/* Individual reviews */}
                <div className="space-y-4">
                  {MOCK_PRODUCT_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-(--color-primary-light) rounded-full flex items-center justify-center text-[10px] font-bold text-(--color-primary)">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">
                              {review.name}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={8}
                              className={
                                s <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-500"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — more from seller (desktop only) */}
            <div className="lg:col-span-3">
              {moreFromSeller.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">More from {product.seller}</h3>
                  <div className="space-y-3">
                    {moreFromSeller.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.id}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center shrink-0 overflow-hidden">
                          <Image src={p.image} alt={p.name} width={56} height={56} className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate group-hover:text-(--color-primary) transition-colors">{p.name}</p>
                          <p className="text-xs font-bold text-(--color-primary) mt-0.5">₦{p.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Similar Products Carousel ── */}
          {similarProducts.length > 0 && (
            <div id="similar-products" className="mt-6 scroll-mt-24">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">You May Also Like</h2>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {similarProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow group shrink-0 w-[160px] sm:w-[180px]"
                    >
                      <div className="bg-gray-100 dark:bg-gray-600 rounded-lg h-28 sm:h-32 flex items-center justify-center mb-2 overflow-hidden">
                        <Image src={p.image} alt={p.name} width={160} height={128} className="object-cover w-full h-full" />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-(--color-primary) truncate">
                        {p.name}
                      </p>
                      <p className="text-xs font-bold text-(--color-primary) mt-0.5">
                        ₦{p.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                        <Star size={8} className="text-yellow-400 fill-yellow-400" />
                        {p.rating} · {p.seller}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
