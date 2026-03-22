"use client";

import { useAuth } from "@/context/AuthContext";
import {
    AlertTriangle,
    Calendar,
    Camera,
    CheckCircle,
    Clock,
    MapPin,
    MessageCircle,
    MessageSquare,
    Phone,
    Shield,
    Star,
    Trophy,
    X,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  providerName: string;
  price: number;
  serviceId?: string;
}

const PLATFORM_FEE_RATE = 0.05; // 5%
const VAT_RATE = 0.075; // 7.5%

// Mock providers for the selection step
const MOCK_PROVIDERS = [
  {
    id: "p1",
    name: "SparkleClean NG",
    rating: 4.9,
    completedJobs: 342,
    responseTime: "< 30 min",
    price: 1.0,
    badge: "Top Rated",
    badgeColor: "bg-yellow-100 text-yellow-700",
    avatar: "S",
    distance: 5.2,
  },
  {
    id: "p2",
    name: "ProFix Solutions",
    rating: 4.7,
    completedJobs: 218,
    responseTime: "< 15 min",
    price: 1.1,
    badge: "Fast Response",
    badgeColor: "bg-blue-100 text-blue-700",
    avatar: "P",
    distance: 12.8,
  },
  {
    id: "p3",
    name: "HomeFirst Services",
    rating: 4.8,
    completedJobs: 156,
    responseTime: "< 45 min",
    price: 0.95,
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-700",
    avatar: "H",
    distance: 24.5,
  },
];

export default function BookingModal({
  isOpen,
  onClose,
  serviceName,
  providerName,
  price,
  serviceId: _serviceId,
}: BookingModalProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"provider" | "form" | "confirm" | "success">(
    "provider",
  );
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    notes: "",
    phone: "",
    urgency: "normal" as "normal" | "urgent" | "emergency",
    paymentMethod: "card",
    photos: [] as string[],
    propertyType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  if (!isOpen) return null;

  if (!isLoggedIn) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-(--color-primary-light) rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Sign in to Book
          </h3>
          <p className="text-gray-500 mb-6">
            Please log in or create an account to book this service.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="flex-1 py-3 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="flex-1 py-3 bg-(--color-primary) text-white rounded-full font-medium hover:opacity-90 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use the selected provider's price multiplier, or default to the original
  const effectivePrice = selectedProvider
    ? Math.round(price * selectedProvider.price)
    : price;
  const currentProviderName = selectedProvider
    ? selectedProvider.name
    : providerName;

  // Price breakdown
  const platformFee = Math.round(effectivePrice * PLATFORM_FEE_RATE);
  const subtotal = effectivePrice;
  const vat = Math.round((subtotal + platformFee) * VAT_RATE);
  const total = subtotal + platformFee + vat;
  const urgencyExtra =
    formData.urgency === "urgent"
      ? Math.round(effectivePrice * 0.15)
      : formData.urgency === "emergency"
        ? Math.round(effectivePrice * 0.3)
        : 0;
  const grandTotal = total + urgencyExtra;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result as string);
        if (newPhotos.length === files.length) {
          setFormData({
            ...formData,
            photos: [...formData.photos, ...newPhotos].slice(0, 4),
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setBookingRef(`#HND${Date.now().toString().slice(-6)}`);
    setIsSubmitting(false);
    setStep("success");
  };

  const resetAndClose = () => {
    setStep("provider");
    setSelectedProvider(null);
    setFormData({
      date: "",
      time: "",
      address: "",
      notes: "",
      phone: "",
      urgency: "normal",
      paymentMethod: "card",
      photos: [],
      propertyType: "",
    });
    onClose();
  };

  const stepTitle = () => {
    switch (step) {
      case "provider":
        return "Select Provider";
      case "form":
        return "Book Service";
      case "confirm":
        return "Confirm Booking";
      case "success":
        return "Booking Confirmed!";
    }
  };

  // Progress indicator
  const stepIndex =
    step === "provider" ? 0 : step === "form" ? 1 : step === "confirm" ? 2 : 3;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4"
      onClick={resetAndClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{stepTitle()}</h3>
            {step !== "success" && (
              <p className="text-sm text-gray-500 mt-0.5">{serviceName}</p>
            )}
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Step Progress */}
        {step !== "success" && (
          <div className="px-6 pt-4">
            <div className="flex items-center gap-1">
              {["Provider", "Details", "Confirm"].map((label, i) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`h-1 w-full rounded-full transition-colors ${
                      i <= stepIndex
                        ? "bg-(--color-primary)"
                        : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-medium ${
                      i <= stepIndex ? "text-(--color-primary)" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Provider Selection Step */}
        {step === "provider" && (
          <div className="p-6 space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              Choose a provider for <strong>{serviceName}</strong>
            </p>
            {MOCK_PROVIDERS.map((provider) => {
              const isTooFar = provider.distance > 20;

              return (
              <div
                key={provider.id}
                onClick={() => !isTooFar && setSelectedProvider(provider)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isTooFar
                    ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                    : selectedProvider?.id === provider.id
                      ? "border-(--color-primary) bg-(--color-primary-light) shadow-sm cursor-pointer"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-lg font-bold shrink-0">
                    {provider.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">
                        {provider.name}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${provider.badgeColor}`}
                      >
                        {provider.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Star
                          size={11}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        {provider.rating}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={11} />
                        {provider.distance}km
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Trophy size={11} />
                        {provider.completedJobs} jobs
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock size={11} />
                        {provider.responseTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-(--color-primary)">
                        ₦{Math.round(price * provider.price).toLocaleString()}
                      </p>
                      {isTooFar && (
                        <span className="text-[10px] text-red-500 font-semibold px-2 py-0.5 bg-red-50 rounded-full">
                          Too far (Max 20km)
                        </span>
                      )}
                      {selectedProvider?.id === provider.id && (
                        <CheckCircle
                          size={18}
                          className="text-(--color-primary)"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )})}

            <button
              onClick={() => {
                if (selectedProvider) setStep("form");
              }}
              disabled={!selectedProvider}
              className="w-full py-3 bg-(--color-primary) text-white rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Continue with {selectedProvider?.name || "Selected Provider"}
            </button>
          </div>
        )}

        {/* Form Step */}
        {step === "form" && (
          <div className="p-6 space-y-4">
            {/* Selected Provider Mini-Card */}
            {selectedProvider && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {selectedProvider.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedProvider.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ₦{effectivePrice.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setStep("provider")}
                  className="text-xs text-(--color-primary) font-medium hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Details Section (Component 4) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Service Details
              </label>
              <div className="grid grid-cols-1 gap-3">
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyType: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none appearance-none"
                >
                  <option value="">Property Type (Optional)</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="office">Office</option>
                  <option value="commercial">Commercial Space</option>
                </select>
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "normal" as const,
                    label: "Normal",
                    icon: Clock,
                    extra: "",
                    color: "border-gray-200",
                    activeColor:
                      "border-(--color-primary) bg-(--color-primary-light)",
                  },
                  {
                    id: "urgent" as const,
                    label: "Urgent",
                    icon: Zap,
                    extra: "+15%",
                    color: "border-gray-200",
                    activeColor: "border-orange-500 bg-orange-50",
                  },
                  {
                    id: "emergency" as const,
                    label: "Emergency",
                    icon: AlertTriangle,
                    extra: "+30%",
                    color: "border-gray-200",
                    activeColor: "border-red-500 bg-red-50",
                  },
                ].map((u) => {
                  const Icon = u.icon;
                  return (
                    <button
                      key={u.id}
                      onClick={() =>
                        setFormData({ ...formData, urgency: u.id })
                      }
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-colors text-xs ${
                        formData.urgency === u.id ? u.activeColor : u.color
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-medium">{u.label}</span>
                      {u.extra && (
                        <span className="text-[10px] text-gray-400">
                          {u.extra}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Service Address
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  placeholder="e.g. 080xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Upload Photos{" "}
                <span className="text-gray-400">(optional, max 4)</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {formData.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={photo}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          photos: formData.photos.filter((_, j) => j !== i),
                        })
                      }
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.photos.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
                  >
                    <Camera size={16} />
                    <span className="text-[9px]">Add</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <div className="relative">
                <MessageSquare
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <textarea maxLength={500}
                  placeholder="Describe the job details or special requirements..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "card", label: "Card", icon: "💳" },
                  { id: "transfer", label: "Transfer", icon: "🏦" },
                  { id: "wallet", label: "Wallet", icon: "👛" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: method.id })
                    }
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-colors ${
                      formData.paymentMethod === method.id
                        ? "border-(--color-primary) bg-(--color-primary-light)"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-xs font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("confirm")}
              disabled={!formData.date || !formData.time || !formData.address}
              className="w-full py-3 bg-(--color-primary) text-white rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Review
            </button>
          </div>
        )}

        {/* Confirm Step — with price transparency */}
        {step === "confirm" && (
          <div className="p-6 space-y-4">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-900">{serviceName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium text-gray-900">
                  {currentProviderName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString("en-NG", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-900">
                  {formData.time}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">
                  {formData.address}
                </span>
              </div>
              {formData.phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">
                    {formData.phone}
                  </span>
                </div>
              )}
              {formData.propertyType && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Property</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formData.propertyType}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Urgency</span>
                <span
                  className={`font-medium capitalize ${formData.urgency === "emergency" ? "text-red-600" : formData.urgency === "urgent" ? "text-orange-600" : "text-gray-900"}`}
                >
                  {formData.urgency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium text-gray-900 capitalize">
                  {formData.paymentMethod}
                </span>
              </div>
              {formData.photos.length > 0 && (
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">Photos</span>
                  <span className="font-medium text-gray-900">
                    {formData.photos.length} uploaded
                  </span>
                </div>
              )}
            </div>

            {formData.notes && (
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-medium text-blue-700 mb-1">Notes:</p>
                <p className="text-sm text-blue-600">{formData.notes}</p>
              </div>
            )}

            {/* Price Breakdown — Transparent */}
            <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Shield size={14} className="text-emerald-600" />
                Price Breakdown
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="text-gray-900">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Platform Fee{" "}
                    <span className="text-gray-400">
                      ({(PLATFORM_FEE_RATE * 100).toFixed(0)}%)
                    </span>
                  </span>
                  <span className="text-gray-900">
                    ₦{platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    VAT{" "}
                    <span className="text-gray-400">
                      ({(VAT_RATE * 100).toFixed(1)}%)
                    </span>
                  </span>
                  <span className="text-gray-900">₦{vat.toLocaleString()}</span>
                </div>
                {urgencyExtra > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">
                      {formData.urgency === "emergency"
                        ? "Emergency"
                        : "Urgency"}{" "}
                      Surcharge
                    </span>
                    <span className="text-orange-600">
                      + ₦{urgencyExtra.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t border-emerald-200 pt-2 mt-1 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-(--color-primary)">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("form")}
                className="flex-1 py-3 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-(--color-primary) text-white rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₦${grandTotal.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Step (Component 5 — Enhanced) */}
        {step === "success" && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-500 mb-4">
              Your booking for <strong>{serviceName}</strong> with{" "}
              <strong>{currentProviderName}</strong> has been confirmed.
              You&apos;ll receive a confirmation email shortly.
            </p>

            {/* Reference details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left space-y-1">
              <p className="text-sm text-gray-600">
                <strong>Reference:</strong> {bookingRef}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong>{" "}
                {formData.date
                  ? new Date(formData.date).toLocaleDateString("en-NG", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount Paid:</strong> ₦{grandTotal.toLocaleString()}
              </p>
            </div>

            {/* Provider contact info */}
            {selectedProvider && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-xs font-semibold text-blue-700 mb-2">
                  Provider Contact
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold">
                    {selectedProvider.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedProvider.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {selectedProvider.rating} ·{" "}
                      {selectedProvider.completedJobs} jobs completed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Three action buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  resetAndClose();
                  router.push("/dashboard");
                }}
                className="w-full py-3 bg-(--color-primary) text-white rounded-full font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar size={16} /> View Booking
              </button>
              <button
                onClick={() => {
                  resetAndClose();
                  // In production, this would open a chat with the provider
                }}
                className="w-full py-3 border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> Message Provider
              </button>
              <button
                onClick={() => {
                  resetAndClose();
                  router.push("/services");
                }}
                className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
              >
                Book Another Service
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
