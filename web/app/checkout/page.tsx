"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockApi";
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Landmark,
    Lock,
    MapPin,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type PaymentMethod = "card" | "bank" | "wallet";

interface DeliveryInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note: string;
}

export default function CheckoutPage() {
  const { user, isLoggedIn } = useAuth();
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<
    "delivery" | "payment" | "review" | "success"
  >("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.phone || "",
    address: "",
    city: "Lagos",
    state: "Lagos",
    note: "",
  });
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [processing, setProcessing] = useState(false);
  const [orderId] = useState(
    () => `HANDI-${Date.now().toString(36).toUpperCase()}`,
  );

  // Resolve cart items
  const resolvedItems = useMemo(() => {
    return cartItems.map((item) => {
      if (item.type === "product") {
        const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
        return {
          ...item,
          name: product?.name ?? "Unknown Product",
          provider: product?.seller ?? "Unknown Seller",
          price: product?.price ?? 0,
        };
      } else {
        const service = MOCK_SERVICES.find((s) => s.id === item.id);
        return {
          ...item,
          name: service?.name ?? "Unknown Service",
          provider: service?.provider ?? "Unknown Provider",
          price: service?.price ?? 0,
        };
      }
    });
  }, [cartItems]);

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const serviceFee = Math.round(subtotal * 0.05);
  const deliveryFee = 1500;
  const total = subtotal + serviceFee + deliveryFee;

  const canProceedDelivery =
    deliveryInfo.fullName.trim() &&
    deliveryInfo.phone.trim() &&
    deliveryInfo.address.trim() &&
    deliveryInfo.city.trim();

  const canProceedPayment =
    paymentMethod === "wallet" ||
    paymentMethod === "bank" ||
    (paymentMethod === "card" &&
      cardDetails.number.trim() &&
      cardDetails.expiry.trim() &&
      cardDetails.cvv.trim() &&
      cardDetails.name.trim());

  const handlePlaceOrder = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setStep("success");
    clearCart();
  };

  // Redirect if no items
  if (cartItems.length === 0 && step !== "success") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Nothing to checkout
          </h2>
          <p className="text-gray-500 mb-6">Add items to your cart first.</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-(--color-primary) text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
          >
            Browse Services
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn && step !== "success") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Lock size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Please log in first
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to checkout.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-(--color-primary) text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
          >
            Log In
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Success state
  if (step === "success") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-1">Thank you for your order.</p>
          <p className="text-sm text-gray-400 mb-6">
            Order ID:{" "}
            <span className="font-mono font-semibold text-gray-700">
              {orderId}
            </span>
          </p>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">
              What happens next?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <p>
                  You&apos;ll receive a confirmation email with your order
                  details.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <p>
                  Your service provider will contact you to confirm the
                  schedule.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <p>Track your order status from your dashboard.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-(--color-primary) text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const steps = [
    { id: "delivery", label: "Delivery", num: 1 },
    { id: "payment", label: "Payment", num: 2 },
    { id: "review", label: "Review", num: 3 },
  ];

  const stepOrder = ["delivery", "payment", "review"] as const;
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              if (currentStepIndex > 0) {
                setStep(stepOrder[currentStepIndex - 1]);
              } else {
                router.push("/cart");
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStepIndex >= i
                    ? "bg-(--color-primary) text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStepIndex > i ? "✓" : s.num}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  currentStepIndex >= i ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 ${
                    currentStepIndex > i
                      ? "bg-(--color-primary)"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Form Area */}
          <div className="flex-1">
            {/* ====== DELIVERY STEP ====== */}
            {step === "delivery" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin size={20} className="text-(--color-primary)" />{" "}
                  Delivery Information
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Where should we deliver your order?
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.fullName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.address}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="123 Main Street, Lekki Phase 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      State
                    </label>
                    <select
                      value={deliveryInfo.state}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none cursor-pointer focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    >
                      {[
                        "Lagos",
                        "Abuja",
                        "Rivers",
                        "Ogun",
                        "Oyo",
                        "Kano",
                        "Kaduna",
                        "Enugu",
                        "Delta",
                        "Edo",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Delivery Note (optional)
                    </label>
                    <textarea
                      value={deliveryInfo.note}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          note: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none resize-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="E.g. Call before arriving, gate code 1234..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  disabled={!canProceedDelivery}
                  className={`w-full mt-6 py-3 rounded-full font-semibold text-sm transition-colors ${
                    canProceedDelivery
                      ? "bg-(--color-primary) text-white hover:opacity-90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* ====== PAYMENT STEP ====== */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <CreditCard size={20} className="text-(--color-primary)" />{" "}
                  Payment Method
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  How would you like to pay?
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      id: "card" as PaymentMethod,
                      label: "Debit Card",
                      icon: CreditCard,
                    },
                    {
                      id: "bank" as PaymentMethod,
                      label: "Bank Transfer",
                      icon: Landmark,
                    },
                    {
                      id: "wallet" as PaymentMethod,
                      label: "Wallet",
                      icon: Wallet,
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === m.id
                          ? "border-(--color-primary) bg-(--color-primary)/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <m.icon
                        size={24}
                        className={
                          paymentMethod === m.id
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }
                      />
                      <span
                        className={`text-xs font-medium ${paymentMethod === m.id ? "text-(--color-primary)" : "text-gray-500"}`}
                      >
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Card Details Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                          placeholder="JOHN DOE"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
                    <p className="font-medium mb-2">
                      Bank Transfer Instructions
                    </p>
                    <p>
                      After placing your order, you&apos;ll receive bank
                      transfer details via email and SMS. Payment must be
                      completed within 24 hours.
                    </p>
                    <p className="mt-2 text-xs text-blue-600">
                      Supported banks: GTBank, Access Bank, First Bank, UBA,
                      Zenith Bank
                    </p>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div className="p-4 bg-green-50 rounded-xl text-sm text-green-800">
                    <p className="font-medium mb-1">HANDI Wallet</p>
                    <p>
                      Your wallet balance:{" "}
                      <span className="font-bold">₦25,000</span>
                    </p>
                    {total > 25000 && (
                      <p className="mt-2 text-red-600 text-xs">
                        ⚠️ Insufficient balance. Please top up or choose another
                        payment method.
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setStep("review")}
                  disabled={!canProceedPayment}
                  className={`w-full mt-6 py-3 rounded-full font-semibold text-sm transition-colors ${
                    canProceedPayment
                      ? "bg-(--color-primary) text-white hover:opacity-90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Review Order
                </button>
              </div>
            )}

            {/* ====== REVIEW STEP ====== */}
            {step === "review" && (
              <div className="space-y-4">
                {/* Delivery Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={16} className="text-(--color-primary)" />{" "}
                      Delivery
                    </h3>
                    <button
                      onClick={() => setStep("delivery")}
                      className="text-xs text-(--color-primary) font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {deliveryInfo.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {deliveryInfo.address}, {deliveryInfo.city},{" "}
                    {deliveryInfo.state}
                  </p>
                  <p className="text-sm text-gray-500">{deliveryInfo.phone}</p>
                  {deliveryInfo.note && (
                    <p className="text-xs text-gray-400 mt-1">
                      Note: {deliveryInfo.note}
                    </p>
                  )}
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard
                        size={16}
                        className="text-(--color-primary)"
                      />{" "}
                      Payment
                    </h3>
                    <button
                      onClick={() => setStep("payment")}
                      className="text-xs text-(--color-primary) font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 capitalize">
                    {paymentMethod === "card"
                      ? `Debit Card ending ****${cardDetails.number.slice(-4)}`
                      : paymentMethod === "bank"
                        ? "Bank Transfer"
                        : "HANDI Wallet"}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Items ({resolvedItems.length})
                  </h3>
                  <div className="space-y-3">
                    {resolvedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.provider} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    processing
                      ? "bg-gray-300 text-gray-500 cursor-wait"
                      : "bg-(--color-primary) text-white hover:opacity-90"
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Place Order • ₦{total.toLocaleString()}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={14} />
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            )}
          </div>

          {/* Right - Order Summary Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm max-h-48 overflow-y-auto mb-4">
                {resolvedItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-500 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-gray-100 my-3" />
              <div className="space-y-2 text-sm">
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium">
                    ₦{deliveryFee.toLocaleString()}
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
