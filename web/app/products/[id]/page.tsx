"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { getProductById, MOCK_PRODUCTS } from "@/data/mockApi";
import {
    ArrowLeft,
    Heart,
    MapPin,
    Minus,
    Plus,
    Share2,
    ShoppingCart,
    Star,
    Truck,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = getProductById(params.id as string);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-500 mb-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/products"
              className="text-[var(--color-primary)] hover:underline"
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
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, "product", quantity, product.quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, "product", quantity, product.quantity);
    // Navigate to cart/checkout
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {product.category.replace("-", " ")}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Seller</p>
                <p className="text-sm font-bold text-gray-900">
                  {product.seller}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm font-bold text-gray-900">
                  {product.location}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Availability</p>
                <p
                  className={`text-sm font-bold ${product.inStock ? "text-green-600" : "text-red-500"}`}
                >
                  {product.inStock
                    ? `In Stock (${product.quantity} units)`
                    : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>
        );

      case "specifications":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Specifications
            </h2>
            {product.specifications ? (
              <div className="divide-y divide-gray-100">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3">
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No specifications available for this product.
              </p>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Rating breakdown */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {product.rating}
                </p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s <= Math.round(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {product.reviews} reviews
                </p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct =
                    stars === 5
                      ? 55
                      : stars === 4
                        ? 30
                        : stars === 3
                          ? 10
                          : stars === 2
                            ? 3
                            : 2;
                  return (
                    <div
                      key={stars}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="w-3">{stars}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-gray-500">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual reviews */}
            <div className="space-y-4">
              {MOCK_PRODUCT_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={10}
                          className={
                            s <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1 hover:text-[var(--color-primary)]"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <span>/</span>
              <Link
                href="/products"
                className="hover:text-[var(--color-primary)]"
              >
                Products
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left — Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl h-80 sm:h-[28rem] flex items-center justify-center relative overflow-hidden">
              <span className="text-7xl">📦</span>
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )}
                  % OFF
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      isInWishlist(product.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Share2 size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Right — Details */}
            <div className="space-y-6">
              <div>
                <span className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-xs font-medium capitalize">
                  {product.category.replace("-", " ")}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    {product.rating} ({product.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {product.seller}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span
                    className={`flex items-center gap-1 ${product.inStock ? "text-green-600" : "text-red-500"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                    />
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.inStock && (
                    <span className="text-gray-500">
                      {product.quantity} units available
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 rounded-l-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 text-sm font-semibold min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.quantity, quantity + 1))
                      }
                      className="p-2 hover:bg-gray-50 rounded-r-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: ₦{(product.price * quantity).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 py-3.5 rounded-full font-semibold transition-all flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="py-3.5 px-6 border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck size={18} className="text-[var(--color-primary)]" />
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-gray-500">Orders above ₦20,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-lg">🔄</span>
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-gray-500">7-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Buyer Protection
                    </p>
                    <p className="text-gray-500">Secure payment + escrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-8 bg-gray-50 rounded-lg shadow-sm flex items-center p-2 justify-between">
            {(["description", "specifications", "reviews"] as const).map(
              (tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex cursor-pointer items-center justify-center gap-2 p-2 w-1/3 rounded-md transition-colors ${activeTab === tab ? "bg-white shadow-sm" : "hover:bg-gray-100"}`}
                >
                  <div className="text-sm font-bold text-gray-900 capitalize">
                    {tab}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Tab Content */}
          <div className="mt-4">{renderTabContent()}</div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                You May Also Like
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-3">
                      <span className="text-3xl">📦</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primary)] truncate">
                      {p.name}
                    </p>
                    <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
                      ₦{p.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {p.rating} · {p.seller}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
