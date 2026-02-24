"use client";

import { useAuth } from "@/context/AuthContext";
import { SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    ArrowLeft,
    ArrowRight,
    Award,
    Briefcase,
    Building2,
    Check,
    Eye,
    EyeOff,
    ImageIcon,
    Lock,
    Mail,
    MapPin,
    Phone,
    Plus,
    Shield,
    Trash2,
    Upload,
    User as UserIcon,
    Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CLIENT_STEPS = ["Account Type", "Basic Info", "Profile Details"];
const PROVIDER_STEPS = [
  "Account Type",
  "Basic Info",
  "Profile Details",
  "Certifications & Work",
];

export default function SignupPage() {
  const { signup, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    userType: "client" as "client" | "provider",
    providerSubType: "individual" as "individual" | "business",
    bio: "",
    skills: [] as string[],
    businessName: "",
    address: "",
    preferredCategories: [] as string[],
    nin: "",
    businessRegNumber: "",
    certifications: [] as { name: string; fileName: string }[],
    pastWorkImages: [] as string[],
  });
  const certInputRef = useRef<HTMLInputElement>(null);
  const pastWorkInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setFieldTouched((t) => ({ ...t, [field]: true }));

  // Validation helpers
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
  const NIGERIAN_PHONE_REGEX = /^0[789]\d{9}$/;

  const validateField = (field: string, value: string): string => {
    if (!fieldTouched[field]) return "";
    switch (field) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (!NAME_REGEX.test(value.trim()))
          return "Min 2 characters, letters only";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (!NAME_REGEX.test(value.trim()))
          return "Min 2 characters, letters only";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhoneVal = value.replace(/[\s-]/g, "");
        if (!NIGERIAN_PHONE_REGEX.test(cleanPhoneVal))
          return "Enter a valid Nigerian number (e.g. 08012345678)";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (passwordStrength(value) < 3)
          return "Password needs uppercase, number & special character";
        return "";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, isLoading, router]);

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  const canProceedStep0 = true;
  const cleanPhone = formData.phone.replace(/[\s-]/g, "");
  const canProceedStep1 =
    NAME_REGEX.test(formData.firstName.trim()) &&
    NAME_REGEX.test(formData.lastName.trim()) &&
    EMAIL_REGEX.test(formData.email) &&
    NIGERIAN_PHONE_REGEX.test(cleanPhone) &&
    formData.password.length >= 8 &&
    passwordStrength(formData.password) >= 3 &&
    agreed;

  const STEPS =
    formData.userType === "provider" ? PROVIDER_STEPS : CLIENT_STEPS;

  const nextStep = () => {
    setError("");
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setFieldTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        password: true,
      });
      if (!canProceedStep1) {
        setError("Please fix the errors above and agree to terms.");
        return;
      }
      setStep(2);
    } else if (step === 2 && formData.userType === "provider") {
      setStep(3);
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const result = await signup(formData);
    setLoading(false);

    if (result.success) {
      const encodedEmail = encodeURIComponent(formData.email);
      router.push(`/auth/verify-otp?email=${encodedEmail}`);
    } else {
      setError(result.error || "Signup failed");
    }
  };

  const handleSkipAndSubmit = async () => {
    setFormData((f) => ({
      ...f,
      bio: "",
      skills: [],
      businessName: "",
      address: "",
      preferredCategories: [],
    }));
    setError("");
    setLoading(true);

    const result = await signup({
      ...formData,
      bio: "",
      skills: [],
      businessName: "",
      address: "",
      preferredCategories: [],
    });
    setLoading(false);

    if (result.success) {
      const encodedEmail = encodeURIComponent(formData.email);
      router.push(`/auth/verify-otp?email=${encodedEmail}`);
    } else {
      setError(result.error || "Signup failed");
    }
  };

  const toggleCategory = (catId: string) => {
    setFormData((f) => ({
      ...f,
      preferredCategories: f.preferredCategories.includes(catId)
        ? f.preferredCategories.filter((c) => c !== catId)
        : [...f.preferredCategories, catId],
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const skillOptions = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "AC Repair",
    "Pest Control",
    "Gardening",
    "Moving",
    "Beauty",
    "Cooking",
    "Tutoring",
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-(--color-primary) items-center justify-center p-12 relative overflow-hidden">
        <button
          className="absolute top-10 left-20 text-white flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft />
          Go back to HANDI
        </button>
        <div className="relative z-10 text-white max-w-md text-center">
          <div className="w-40 h-40 rounded-2xl flex items-center justify-center mx-auto ">
            <Image
              src="/images/handi-logo-dark.png"
              alt="HANDI"
              width={150}
              height={150}
            />
          </div>

          <p className="text-white/80 text-lg mb-8">
            Sign up to access thousands of verified service providers and manage
            your bookings.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-white/70">Providers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm text-white/70">Bookings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4.9★</p>
              <p className="text-sm text-white/70">Rating</p>
            </div>
          </div>
        </div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Right Panel - Wizard */}
      <div className="flex-1 flex items-start justify-center p-4 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-md py-8 mt-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create Account
          </h1>
          <p className="text-gray-500 mb-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-(--color-primary) font-medium hover:underline"
            >
              Log in
            </Link>
          </p>

          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      i < step
                        ? "bg-(--color-primary) text-white"
                        : i === step
                          ? "bg-(--color-primary) text-white ring-4 ring-(--color-primary-light)"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 whitespace-nowrap ${
                      i <= step
                        ? "text-(--color-primary) font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-12px] ${
                      i < step ? "bg-(--color-primary)" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ====== STEP 0: Account Type ====== */}
          {step === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  How would you like to use HANDI?
                </h3>
                <p className="text-sm text-gray-500">
                  Choose your account type to get started
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setFormData({ ...formData, userType: "client" })
                  }
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    formData.userType === "client"
                      ? "border-(--color-primary) bg-(--color-primary-light)"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserIcon
                    size={28}
                    className={
                      formData.userType === "client"
                        ? "text-(--color-primary)"
                        : "text-gray-400"
                    }
                  />
                  <h4 className="font-semibold mt-3 text-gray-900">
                    I need services
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Find and book verified professionals
                  </p>
                </button>

                <button
                  onClick={() =>
                    setFormData({ ...formData, userType: "provider" })
                  }
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    formData.userType === "provider"
                      ? "border-(--color-primary) bg-(--color-primary-light)"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Wrench
                    size={28}
                    className={
                      formData.userType === "provider"
                        ? "text-(--color-primary)"
                        : "text-gray-400"
                    }
                  />
                  <h4 className="font-semibold mt-3 text-gray-900">
                    I provide services
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Grow your business and earn more
                  </p>
                </button>
              </div>

              {/* Provider sub-type */}
              {formData.userType === "provider" && (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-sm font-medium text-gray-700">
                    What type of provider?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          providerSubType: "individual",
                        })
                      }
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.providerSubType === "individual"
                          ? "border-(--color-primary) bg-(--color-primary-light)"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Briefcase
                        size={22}
                        className={
                          formData.providerSubType === "individual"
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }
                      />
                      <h5 className="font-medium mt-2 text-sm text-gray-900">
                        Individual
                      </h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Freelancer / Specialist
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          providerSubType: "business",
                        })
                      }
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.providerSubType === "business"
                          ? "border-(--color-primary) bg-(--color-primary-light)"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2
                        size={22}
                        className={
                          formData.providerSubType === "business"
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }
                      />
                      <h5 className="font-medium mt-2 text-sm text-gray-900">
                        Business
                      </h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Company / Agency
                      </p>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={nextStep}
                disabled={!canProceedStep0}
                className="w-full bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* ====== STEP 1: Basic Info ====== */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Your Information
                </h3>
                <p className="text-sm text-gray-500">
                  Fill in your basic details
                </p>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      onBlur={() => markTouched("firstName")}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) ${
                        validateField("firstName", formData.firstName)
                          ? "ring-2 ring-red-400"
                          : ""
                      }`}
                      placeholder="e.g. Chinedu"
                    />
                  </div>
                  {validateField("firstName", formData.firstName) && (
                    <p className="mt-1 text-xs text-red-500">
                      {validateField("firstName", formData.firstName)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    onBlur={() => markTouched("lastName")}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) ${
                      validateField("lastName", formData.lastName)
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                    placeholder="e.g. Okonkwo"
                  />
                  {validateField("lastName", formData.lastName) && (
                    <p className="mt-1 text-xs text-red-500">
                      {validateField("lastName", formData.lastName)}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onBlur={() => markTouched("email")}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) ${
                      validateField("email", formData.email)
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {validateField("email", formData.email) && (
                  <p className="mt-1 text-xs text-red-500">
                    {validateField("email", formData.email)}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onBlur={() => markTouched("phone")}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) ${
                      validateField("phone", formData.phone)
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                    placeholder="08012345678"
                  />
                </div>
                {validateField("phone", formData.phone) && (
                  <p className="mt-1 text-xs text-red-500">
                    {validateField("phone", formData.phone)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                    placeholder="Min 8 chars, uppercase + number + special"
                    onBlur={() => markTouched("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < strength
                              ? strengthColors[strength - 1]
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {strengthLabels[strength - 1] || "Too short"}
                    </p>
                  </div>
                )}
                {validateField("password", formData.password) && (
                  <p className="mt-1 text-xs text-red-500">
                    {validateField("password", formData.password)}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-(--color-primary)"
                />
                <span className="text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-(--color-primary) hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-(--color-primary) hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceedStep1}
                  className="flex-1 bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ====== STEP 2: Profile Details ====== */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {formData.userType === "client"
                    ? "Personalize Your Experience"
                    : "Set Up Your Provider Profile"}
                </h3>
                <p className="text-sm text-gray-500">
                  {formData.userType === "client"
                    ? "Help us find the best services for you"
                    : "Complete your profile to start receiving bookings"}
                </p>
              </div>

              {/* Client Profile Fields */}
              {formData.userType === "client" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address (optional)
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                        placeholder="e.g. 15 Admiralty Way, Lekki, Lagos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            formData.preferredCategories.includes(cat.id)
                              ? "bg-(--color-primary) text-white border-(--color-primary)"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Provider Profile Fields */}
              {formData.userType === "provider" && (
                <>
                  {/* Business-specific: Business Name + RC Number */}
                  {formData.providerSubType === "business" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Business Name
                        </label>
                        <div className="relative">
                          <Building2
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                businessName: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                            placeholder="e.g. ABC Plumbing Ltd"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RC Number / Business Registration
                          <span className="text-gray-400 text-xs ml-1">
                            (optional — skip if unavailable)
                          </span>
                        </label>
                        <div className="relative">
                          <Shield
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            value={formData.businessRegNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                businessRegNumber: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                            placeholder="e.g. RC123456"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Individual-specific: NIN */}
                  {formData.providerSubType === "individual" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        National Identification Number (NIN)
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Shield
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={formData.nin}
                          onChange={(e) => {
                            const val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11);
                            setFormData({ ...formData, nin: val });
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) ${
                            formData.nin && formData.nin.length !== 11
                              ? "ring-2 ring-red-400"
                              : ""
                          }`}
                          placeholder="Enter your 11-digit NIN"
                          maxLength={11}
                        />
                      </div>
                      {formData.nin && formData.nin.length !== 11 && (
                        <p className="mt-1 text-xs text-red-500">
                          NIN must be exactly 11 digits
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
                      placeholder="Tell clients about your experience and what you offer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            formData.skills.includes(skill)
                              ? "bg-(--color-primary) text-white border-(--color-primary)"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                        placeholder="e.g. Lekki, Lagos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            formData.preferredCategories.includes(cat.id)
                              ? "bg-(--color-primary) text-white border-(--color-primary)"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                {formData.userType === "provider" ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSkipAndSubmit}
                      disabled={loading}
                      className="px-5 py-3 rounded-full border border-gray-200 text-gray-500 font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                      Skip for now
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Complete Signup <Check size={18} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ====== STEP 3: Certifications & Work (Provider Only) ====== */}
          {step === 3 && formData.userType === "provider" && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Certifications & Past Work
                </h3>
                <p className="text-sm text-gray-500">
                  Upload certifications and showcase your best work to build
                  trust with clients
                </p>
              </div>

              {/* Certifications Upload */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-(--color-primary)" />
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Certifications
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => certInputRef.current?.click()}
                    className="text-xs font-medium text-(--color-primary) hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Certificate
                  </button>
                  <input
                    ref={certInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((f) => ({
                          ...f,
                          certifications: [
                            ...f.certifications,
                            {
                              name: file.name.replace(/\.[^.]+$/, ""),
                              fileName: file.name,
                            },
                          ],
                        }));
                      }
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </div>

                {formData.certifications.length === 0 ? (
                  <div
                    onClick={() => certInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-(--color-primary) hover:bg-(--color-primary-light) transition-colors"
                  >
                    <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload certificates
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, JPG, or PNG up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Award size={14} className="text-(--color-primary)" />
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">
                            {cert.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((f) => ({
                              ...f,
                              certifications: f.certifications.filter(
                                (_, i) => i !== idx,
                              ),
                            }))
                          }
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Work Images */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={18} className="text-(--color-primary)" />
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Past Work
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => pastWorkInputRef.current?.click()}
                    className="text-xs font-medium text-(--color-primary) hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Image
                  </button>
                  <input
                    ref={pastWorkInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFormData((f) => ({
                          ...f,
                          pastWorkImages: [...f.pastWorkImages, url],
                        }));
                      }
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </div>

                {formData.pastWorkImages.length === 0 ? (
                  <div
                    onClick={() => pastWorkInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-(--color-primary) hover:bg-(--color-primary-light) transition-colors"
                  >
                    <ImageIcon
                      size={24}
                      className="text-gray-400 mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-500">
                      Click or drag photos of your work
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG or PNG, up to 10MB each
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.pastWorkImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          src={img}
                          alt={`Work ${idx + 1}`}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover w-full h-24"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((f) => ({
                              ...f,
                              pastWorkImages: f.pastWorkImages.filter(
                                (_, i) => i !== idx,
                              ),
                            }))
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSkipAndSubmit}
                  disabled={loading}
                  className="px-5 py-3 rounded-full border border-gray-200 text-gray-500 font-medium hover:bg-gray-100 transition-colors text-sm"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Complete Signup <Check size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
