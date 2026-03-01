"use client";

import { useTheme } from "@/context/ThemeContext";
import {
    Ban,
    Bell,
    Camera,
    ChevronRight,
    Clock,
    CreditCard,
    HelpCircle,
    Info,
    Power,
    MapPin,
    Moon,
    Shield,
    Sun,
    Trash2,
    Upload,
    User,
    X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ClientProfileTab({
  user,
  updateUser,
  logout,
  router,
  onLogout,
  setShowNotifications,
  setShowSupport,
  setShowTransactions,
}: {
  user: any;
  updateUser: (u: any) => void;
  logout: () => void;
  router: any;
  onLogout: () => void;
  setShowNotifications: (v: boolean) => void;
  setShowSupport: (v: boolean) => void;
  setShowTransactions: (v: boolean) => void;
}) {
  const { isDark, toggleDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    bio: user.bio || "",
    address: user.address || "",
    dob: "",
    gender: "",
    language: "English",
  });
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser(editData);
    setIsEditing(false);
    setSaving(false);
  };

  const handleUseLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            );
            const data = await res.json();
            const addr =
              data.display_name ||
              `${pos.coords.latitude}, ${pos.coords.longitude}`;
            setEditData((prev) => ({ ...prev, address: addr }));
          } catch {
            setEditData((prev) => ({
              ...prev,
              address: `${pos.coords.latitude}, ${pos.coords.longitude}`,
            }));
          }
          setLocationLoading(false);
        },
        () => {
          alert("Location access denied. Please enable location services.");
          setLocationLoading(false);
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deactivateConfirmText, setDeactivateConfirmText] = useState("");
  const [deactivateDuration, setDeactivateDuration] = useState("");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const handleLogout = () => {
    onLogout();
  };

  const handleDeleteAccount = async () => {
    try {
      console.log("API: DELETE /api/users/me");
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
    }
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
    logout();
    router.push("/");
  };

  const handleDeactivateAccount = async () => {
    try {
      console.log(
        `API: POST /api/users/me/deactivate { duration: "${deactivateDuration}" }`,
      );
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
    }
    setShowDeactivateConfirm(false);
    setDeactivateConfirmText("");
    setDeactivateDuration("");
    alert("Your account has been deactivated.");
  };

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      action: () => setIsEditing(!isEditing),
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => setShowNotifications(true),
    },
    {
      icon: Clock,
      label: "Transaction History",
      action: () => setShowTransactions(true),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => setShowSupport(true),
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      action: () => setShowPaymentMethods(true),
    },
    {
      icon: Shield,
      label: "Security Settings",
      action: () => setShowSecurity(true),
    },
    { icon: Info, label: "About HANDI", action: () => setShowAbout(true) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-3xl uppercase overflow-hidden mx-auto">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt=""
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              `${user.firstName?.[0]}${user.lastName?.[0]}`
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-(--color-primary) text-white rounded-full flex items-center justify-center shadow-lg">
            <Camera size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
        <span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">
          {user.userType} Account
        </span>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Edit Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={editData.firstName}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={editData.lastName}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              placeholder="08012345678"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                placeholder="Lagos, Nigeria"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
              <button
                onClick={handleUseLocation}
                disabled={locationLoading}
                className="px-3 py-2.5 bg-(--color-primary-light) text-(--color-primary) text-xs font-semibold rounded-xl hover:bg-(--color-primary) hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1"
                title="Use my current location"
              >
                <MapPin size={14} />
                {locationLoading ? "Locating..." : "Use Location"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Bio
            </label>
            <textarea
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={editData.dob}
                onChange={(e) =>
                  setEditData({ ...editData, dob: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Gender
              </label>
              <select
                value={editData.gender}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Preferred Language
            </label>
            <select
              value={editData.language}
              onChange={(e) =>
                setEditData({ ...editData, language: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            >
              <option>English</option>
              <option>Yoruba</option>
              <option>Igbo</option>
              <option>Hausa</option>
              <option>Pidgin</option>
            </select>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              ID Verification (Upload Document)
            </label>
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-(--color-primary) transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Upload ID (NIN, Passport, Driver&apos;s License)
              </span>
              <input type="file" accept="image/*,.pdf" className="hidden" />
            </label>
          </div>

          {/* Camera Verification */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Selfie Verification
            </label>
            <button className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl w-full hover:border-(--color-primary) transition-colors">
              <Camera size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Take a selfie for verification
              </span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-(--color-primary) text-white rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <item.icon size={18} />
            </div>
            <span className="text-sm font-medium text-gray-900 flex-1">
              {item.label}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-500">{isDark ? "On" : "Off"}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? "bg-(--color-primary)" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDark ? "translate-x-6" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ⚠️ Danger Zone */}
      <div className="mt-2">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Danger Zone
        </h3>
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden divide-y divide-red-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Power size={18} />
            </div>
            <span className="text-sm font-medium text-red-600 flex-1">
              Logout
            </span>
          </button>
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-yellow-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Ban size={18} />
            </div>
            <span className="text-sm font-medium text-yellow-700 flex-1">
              Deactivate Account
            </span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Trash2 size={18} />
            </div>
            <span className="text-sm font-medium text-red-600 flex-1">
              Delete Account
            </span>
          </button>
        </div>
      </div>

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteConfirmText("");
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Delete Account?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action is permanent. All your data, bookings, and payment
              history will be lost.
            </p>
            <p className="text-xs text-gray-600 font-medium mb-2">
              Type{" "}
              <span className="font-bold text-red-600">delete my account</span>{" "}
              to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete my account"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "delete my account"}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      {showDeactivateConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowDeactivateConfirm(false);
            setDeactivateConfirmText("");
            setDeactivateDuration("");
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-yellow-600 mb-2">
              Deactivate Account?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Your account will be hidden and services paused. You can
              reactivate anytime by logging in.
            </p>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                How long?
              </label>
              <select
                value={deactivateDuration}
                onChange={(e) => setDeactivateDuration(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-300"
              >
                <option value="">Select duration</option>
                <option value="1 week">1 Week</option>
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="until-reactivate">Until I reactivate</option>
              </select>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-2">
              Type{" "}
              <span className="font-bold text-yellow-600">
                deactivate my account
              </span>{" "}
              to confirm:
            </p>
            <input
              type="text"
              value={deactivateConfirmText}
              onChange={(e) => setDeactivateConfirmText(e.target.value)}
              placeholder="deactivate my account"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  setDeactivateConfirmText("");
                  setDeactivateDuration("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={
                  deactivateConfirmText !== "deactivate my account" ||
                  !deactivateDuration
                }
                className="flex-1 py-2.5 bg-yellow-500 text-white rounded-full text-sm font-semibold hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecurity && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowSecurity(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Shield size={20} className="text-(--color-primary)" />
                Security Settings
              </h3>
              <button
                onClick={() => setShowSecurity(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Change Password */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Change Password
                </h4>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
                  />
                  <button className="w-full py-2 bg-(--color-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 mt-1">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? "bg-(--color-primary)" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${twoFactorEnabled ? "left-5.5" : "left-0.5"}`}
                    />
                  </button>
                </div>
                {twoFactorEnabled && (
                  <p className="text-xs text-green-600 mt-2 bg-green-50 p-2 rounded-lg">
                    ✓ Two-factor authentication is enabled. A code will be sent
                    to your phone on login.
                  </p>
                )}
              </div>

              {/* Login Notifications */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Login Notifications
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <button
                    onClick={() => setLoginAlerts(!loginAlerts)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${loginAlerts ? "bg-(--color-primary)" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${loginAlerts ? "left-5.5" : "left-0.5"}`}
                    />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Active Sessions
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      device: "Chrome on Windows",
                      location: "Lagos, NG",
                      current: true,
                    },
                    {
                      device: "HANDI App on iPhone",
                      location: "Lagos, NG",
                      current: false,
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white rounded-lg p-2.5"
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {s.device}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {s.location}
                        </p>
                      </div>
                      {s.current ? (
                        <span className="text-xs text-green-600 font-medium">
                          Current
                        </span>
                      ) : (
                        <button className="text-xs text-red-500 font-medium hover:underline">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSecurity(false)}
              className="w-full mt-4 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentMethods && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowPaymentMethods(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={20} className="text-(--color-primary)" />
                Payment Methods
              </h3>
              <button
                onClick={() => setShowPaymentMethods(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Saved Cards */}
            <div className="space-y-3 mb-5">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="absolute top-3 right-3 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                  VISA
                </div>
                <p className="text-xs text-white/60 mb-3">Card Number</p>
                <p className="text-sm font-mono tracking-wider mb-4">
                  •••• •••• •••• 4532
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-white/50">CARDHOLDER</p>
                    <p className="text-xs font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50">EXPIRES</p>
                    <p className="text-xs font-medium">12/28</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  MC
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    •••• 8821
                  </p>
                  <p className="text-xs text-gray-500">Expires 08/27</p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Default
                </span>
              </div>
            </div>

            {/* Bank Accounts */}
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Bank Accounts
            </h4>
            <div className="space-y-2 mb-5">
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-(--color-primary-light) flex items-center justify-center text-(--color-primary) font-bold text-xs">
                  GT
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">GTBank</p>
                  <p className="text-xs text-gray-500">•••• 1234</p>
                </div>
              </div>
            </div>

            {/* Add New */}
            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-(--color-primary) hover:text-(--color-primary) transition-colors mb-3">
              + Add New Payment Method
            </button>

            <button
              onClick={() => setShowPaymentMethods(false)}
              className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showAbout && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">About HANDI</h3>
              <button
                onClick={() => setShowAbout(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>
            <div className="text-center mb-4">
              <Image
                src="/images/handi-logo-dark.png"
                alt="HANDI"
                width={120}
                height={40}
                className="h-10 w-auto mx-auto mb-3"
              />
              <p className="text-sm text-gray-600 leading-relaxed">
                HANDI is Nigeria&apos;s leading on-demand service marketplace
                connecting you with verified, trusted professionals for all your
                home and business needs.
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-gray-900 mb-1">Our Mission</p>
                <p>
                  To make quality services accessible to everyone through
                  technology, trust, and transparency.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-gray-900 mb-1">Features</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Verified service providers</li>
                  <li>✓ Secure in-app payments</li>
                  <li>✓ Real-time booking & tracking</li>
                  <li>✓ Ratings & reviews</li>
                  <li>✓ Money-back guarantee</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-gray-900 mb-1">Contact</p>
                <p>Email: support@handiapp.com.ng</p>
                <p>Phone: +234 800 000 0000</p>
              </div>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full mt-4 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
