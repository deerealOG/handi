"use client";

import { useAuth } from "@/context/AuthContext";
import { Check, Eye, EyeOff, Loader2, Mail, Lock, Phone, User as UserIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const CLIENT_STEPS = ["Account Type", "Basic Info", "Profile Details"];

export default function ClientSignup() {
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  
  const [step, setStep] = useState<number>(1); // Skip step 0 (Account Type)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    userType: "client" as const,
    city: "",
    state: "",
    address: "",
    otpMethod: "email" as "email" | "sms",
  });
  
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locationDetectedRef = useRef(false);

  useEffect(() => {
    if (step === 2 && !locationDetectedRef.current && !formData.city && !formData.state) {
      locationDetectedRef.current = true;
      detectLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "User-Agent": "HANDI-App" } }
          );
          const data = await res.json();
          const addr = data?.address || {};
          const city = addr.city || addr.town || addr.village || addr.county || "";
          const state = addr.state || "";
          setFormData((f) => ({ ...f, city, state, address: `${city}${city && state ? ", " : ""}${state}` }));
        } catch {
          setLocationError("Could not detect your location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError("Location access denied. Please enter manually.");
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
  const NIGERIAN_PHONE_REGEX = /^0[789]\d{9}$/;

  const markTouched = (field: string) => setFieldTouched((t) => ({ ...t, [field]: true }));

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const validateField = (field: string, value: string): string => {
    if (!fieldTouched[field]) return "";
    switch (field) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (!NAME_REGEX.test(value.trim())) return "Min 2 characters, letters only";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (!NAME_REGEX.test(value.trim())) return "Min 2 characters, letters only";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhoneVal = value.replace(/[\s-]/g, "");
        if (!NIGERIAN_PHONE_REGEX.test(cleanPhoneVal)) return "Enter a valid Nigerian number (e.g. 08012345678)";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (passwordStrength(value) < 3) return "Password needs uppercase, number & special character";
        return "";
      default:
        return "";
    }
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

  const cleanPhone = formData.phone.replace(/[\s-]/g, "");
  const canProceedStep1 =
    NAME_REGEX.test(formData.firstName.trim()) &&
    NAME_REGEX.test(formData.lastName.trim()) &&
    EMAIL_REGEX.test(formData.email) &&
    NIGERIAN_PHONE_REGEX.test(cleanPhone) &&
    formData.password.length >= 8 &&
    passwordStrength(formData.password) >= 3 &&
    agreed;

  const nextStep = () => {
    setError("");
    if (step === 1) {
      setFieldTouched({ firstName: true, lastName: true, email: true, phone: true, password: true });
      if (!canProceedStep1) {
        setError("Please fix errors and agree to terms.");
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const result = await signup(formData);
    setLoading(false);

    if (result.success) {
      const encodedEmail = encodeURIComponent(formData.email);
      router.push(`/auth/verify-otp?email=${encodedEmail}&method=${formData.otpMethod}`);
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <div className="w-full">
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Information</h3>
            <p className="text-sm text-gray-500">Create your client account</p>
          </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <div className="relative">
            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              onBlur={() => markTouched("firstName")}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="John" />
          </div>
          {validateField("firstName", formData.firstName) && <p className="mt-1 text-xs text-red-500">{validateField("firstName", formData.firstName)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <div className="relative">
            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              onBlur={() => markTouched("lastName")}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="Doe" />
          </div>
          {validateField("lastName", formData.lastName) && <p className="mt-1 text-xs text-red-500">{validateField("lastName", formData.lastName)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => markTouched("email")}
            autoComplete="off"
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="john@example.com" />
        </div>
        {validateField("email", formData.email) && <p className="mt-1 text-xs text-red-500">{validateField("email", formData.email)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="relative">
          <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="tel" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            onBlur={() => markTouched("phone")}
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="08012345678" />
        </div>
        {validateField("phone", formData.phone) && <p className="mt-1 text-xs text-red-500">{validateField("phone", formData.phone)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type={showPassword ? "text" : "password"} value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onBlur={() => markTouched("password")}
            autoComplete="new-password"
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="Create password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {validateField("password", formData.password) ? (
          <p className="mt-1 text-xs text-red-500">{validateField("password", formData.password)}</p>
        ) : formData.password.length > 0 && (
          <div className="mt-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Password strength:</span>
              <span className={strengthColors[Math.min(strength, 3)].replace("bg-", "text-")}>
                {strengthLabels[Math.min(strength, 3)]}
              </span>
            </div>
            <div className="flex h-1.5 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`flex-1 rounded-full ${i < strength ? strengthColors[Math.min(strength, 3)] : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <button type="button" onClick={() => setAgreed(!agreed)}
          className={`mt-0.5 w-5 h-5 rounded border flexitems-center justify-center shrink-0 transition-colors ${agreed ? "bg-(--color-primary) border-(--color-primary)" : "border-gray-300 bg-white"}`}>
          {agreed && <Check size={14} className="text-white" />}
        </button>
        <p className="text-xs text-gray-600 leading-tight">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-(--color-primary) hover:underline font-medium">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-(--color-primary) hover:underline font-medium">Privacy Policy</Link>.
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

      <button onClick={nextStep} disabled={!agreed}
        className="w-full bg-(--color-primary) text-white py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-6">
        Continue
      </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Location Details</h3>
            <p className="text-sm text-gray-500">Add details so providers can find you</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <button type="button" onClick={detectLocation} disabled={locationLoading} className="text-xs font-medium text-(--color-primary) hover:underline flex items-center gap-1">
                {locationLoading ? <><Loader2 size={12} className="animate-spin" /> Detecting...</> : <><MapPin size={12} /> Auto-detect</>}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="City" />
              <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="State" />
            </div>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary)" placeholder="Full Address" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How would you like to receive your OTP code?</label>
            <div className="flex gap-4">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="otpMethod" value="email" checked={formData.otpMethod === "email"} onChange={(e) => setFormData({ ...formData, otpMethod: "email" as "email" | "sms" })} className="w-4 h-4 text-(--color-primary)" />
                 <span className="text-sm text-gray-700">Email Address</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="otpMethod" value="sms" checked={formData.otpMethod === "sms"} onChange={(e) => setFormData({ ...formData, otpMethod: "sms" as "email" | "sms" })} className="w-4 h-4 text-(--color-primary)" />
                 <span className="text-sm text-gray-700">SMS (Phone)</span>
               </label>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={handleSubmit} disabled={loading || !formData.city || !formData.state || !formData.address}
              className="flex-1 bg-(--color-primary) text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Signup"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
