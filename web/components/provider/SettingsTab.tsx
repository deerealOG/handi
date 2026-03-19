"use client";
import {
  Bell,
  CreditCard,
  Globe,
  Key,
  Lock,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useNotification } from "@/context/NotificationContext";

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
      checked ? "bg-emerald-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default function SettingsTab() {
  const { isDark, toggleDarkMode } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [reviewNotifs, setReviewNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState("en");
  const { addToast } = useNotification();
  const [showProfilePublicly, setShowProfilePublicly] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);



  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      {/* Account */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={18} className="text-gray-500" />
          Account
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Address</p>
                <p className="text-xs text-gray-500">provider@example.com</p>
              </div>
            </div>
            <button onClick={() => addToast({ type: "info", title: "Email", message: "Change request sent to support" })} className="text-xs text-emerald-600 font-medium hover:underline cursor-pointer">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Smartphone size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone Number</p>
                <p className="text-xs text-gray-500">+234 801 234 5678</p>
              </div>
            </div>
            <button onClick={() => addToast({ type: "info", title: "Phone", message: "Phone number change request sent" })} className="text-xs text-emerald-600 font-medium hover:underline cursor-pointer">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Language</p>
                <p className="text-xs text-gray-500">Preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English</option>
              <option value="yo">Yorùbá</option>
              <option value="ig">Igbo</option>
              <option value="ha">Hausa</option>
              <option value="pcm">Pidgin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={18} className="text-gray-500" />
          Notifications
        </h3>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive booking updates via email", checked: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
            { label: "SMS Alerts", desc: "Get text messages for new bookings", checked: smsNotifs, toggle: () => setSmsNotifs(!smsNotifs) },
            { label: "Booking Alerts", desc: "Notifications for new booking requests", checked: bookingNotifs, toggle: () => setBookingNotifs(!bookingNotifs) },
            { label: "Review Notifications", desc: "Get notified when customers leave reviews", checked: reviewNotifs, toggle: () => setReviewNotifs(!reviewNotifs) },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between py-2 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Toggle checked={item.checked} onChange={item.toggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-gray-500" />
          Payment Settings
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-linear-to-r from-red-500 to-orange-400 rounded-md flex items-center justify-center text-white text-[8px] font-bold">
                GTB
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">GTBank **** 4521</p>
                <p className="text-xs text-gray-500">Savings Account</p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Default</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-linear-to-r from-blue-500 to-blue-700 rounded-md flex items-center justify-center text-white text-[8px] font-bold">
                FBN
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">First Bank **** 7832</p>
                <p className="text-xs text-gray-500">Current Account</p>
              </div>
            </div>
            <button onClick={() => addToast({ type: "success", title: "Bank Account", message: "Default bank account updated" })} className="text-xs text-emerald-600 font-medium hover:underline cursor-pointer">
              Set Default
            </button>
          </div>
          <button onClick={() => addToast({ type: "info", title: "Bank Account", message: "Bank account form coming soon" })} className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer">
            + Add Bank Account
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-gray-500" />
          Security
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Key size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Change Password</p>
                <p className="text-xs text-gray-500">Last changed 30 days ago</p>
              </div>
            </div>
            <button onClick={() => addToast({ type: "success", title: "Password", message: "Password reset link sent to your email" })} className="text-xs text-emerald-600 font-medium hover:underline cursor-pointer">
              Update
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Extra security for your account</p>
              </div>
            </div>
            <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {isDark ? <Moon size={18} className="text-gray-500" /> : <Sun size={18} className="text-yellow-500" />}
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Dark Mode</p>
            <p className="text-xs text-gray-500">{isDark ? "Dark theme is active" : "Light theme is active"}</p>
          </div>
          <Toggle checked={isDark} onChange={toggleDarkMode} />
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-gray-500" />
          Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Profile Publicly</p>
              <p className="text-xs text-gray-500">Allow clients to find you in search</p>
            </div>
            <Toggle checked={showProfilePublicly} onChange={() => {
              setShowProfilePublicly(!showProfilePublicly);
              addToast({
                type: "success",
                title: "Privacy Updated",
                message: showProfilePublicly ? "Profile hidden from public search" : "Profile is now public"
              });
            }} />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Phone Number</p>
              <p className="text-xs text-gray-500">Display number on your profile</p>
            </div>
            <Toggle checked={showPhoneNumber} onChange={() => {
              setShowPhoneNumber(!showPhoneNumber);
              addToast({
                type: "success",
                title: "Privacy Updated",
                message: showPhoneNumber ? "Phone number hidden" : "Phone number is now visible"
              });
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
