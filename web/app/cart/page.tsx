"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockApi";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  // Resolve cart items to full product/service data
  const resolvedItems = useMemo(() => {
    return cartItems.map((item) => {
      if (item.type === "product") {
        const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
        return {
          ...item,
          name: product?.name ?? "Unknown Product",
          provider: product?.seller ?? "Unknown Seller",
          price: product?.price ?? 0,
          maxStock: product?.quantity ?? 99,
          inStock: product?.inStock ?? false,
        };
      } else {
        const service = MOCK_SERVICES.find((s) => s.id === item.id);
        return {
          ...item,
          name: service?.name ?? "Unknown Service",
          provider: service?.provider ?? "Unknown Provider",
          price: service?.price ?? 0,
          maxStock: undefined, // services don't have stock limits
          inStock: true,
        };
      }
    });
  }, [cartItems]);

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            <ShoppingCart className="inline mr-2" size={24} />
            Your Cart ({cartItems.length})
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Browse our services and add items to your cart.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-(--color-primary) text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
            >
              Browse Services <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-3">
              {resolvedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-(--color-primary-light) rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-2xl">
                      {item.type === "product" ? "📦" : "🔧"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">{item.provider}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-(--color-primary)">
                        ₦{item.price.toLocaleString()}
                      </p>
                      {item.maxStock !== undefined && (
                        <span className="text-xs text-gray-400">
                          ({item.maxStock} in stock)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1,
                          item.maxStock,
                        )
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.maxStock,
                        )
                      }
                      disabled={
                        item.maxStock !== undefined &&
                        item.quantity >= item.maxStock
                      }
                      className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${
                        item.maxStock !== undefined &&
                        item.quantity >= item.maxStock
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service Fee (5%)</span>
                    <span className="font-medium">
                      ₦{serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-(--color-primary)">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full mt-6 bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <Link
                  href="/services"
                  className="block text-center mt-3 text-sm text-(--color-primary) hover:underline"
                >
                  Continue Browsing
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
