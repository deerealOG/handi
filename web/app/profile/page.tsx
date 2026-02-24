"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
    ArrowLeft,
    Bell,
    Camera,
    ChevronRight,
    Globe,
    Lock,
    LogOut,
    Mail,
    MapPin,
    Moon,
    Phone,
    Shield,
    Trash2,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: user?.address || "",
  });
  const [saving, setSaving] = useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    // Simulated save delay
    await new Promise((r) => setTimeout(r, 600));
    updateUser(editData);
    setIsEditing(false);
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const settingsItems = [
    {
      label: "Notification Preferences",
      icon: Bell,
      description: "Manage push, email and SMS notifications",
      href: "/dashboard",
    },
    {
      label: "Security & Password",
      icon: Lock,
      description: "Change password, enable 2FA",
      href: "/dashboard",
    },
    {
      label: "Privacy Settings",
      icon: Shield,
      description: "Control your data and visibility",
      href: "/privacy",
    },
    {
      label: "Language & Region",
      icon: Globe,
      description: "English • West Africa (GMT+1)",
      href: "/dashboard",
    },
    {
      label: "Appearance",
      icon: Moon,
      description: "Toggle dark mode and theme",
      href: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Header */}
      <section className="bg-linear-to-br from-(--color-primary) to-(--color-primary-dark) text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-4xl uppercase shadow-lg overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt=""
                    width={112}
                    height={112}
                    className="rounded-2xl object-cover"
                  />
                ) : (
                  `${user.firstName?.[0]}${user.lastName?.[0]}`
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-white text-(--color-primary) rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/70 mt-1 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail size={14} /> {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                  {user.userType} Account
                </span>
                {user.profileComplete && (
                  <span className="px-3 py-1 bg-green-400/20 text-green-100 rounded-full text-xs font-semibold">
                    ✓ Profile Complete
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2.5 bg-white text-(--color-primary) rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personal Information */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-(--color-primary)" />
              Personal Information
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) =>
                      setEditData({ ...editData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) =>
                      setEditData({ ...editData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">
                    {user.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-sm text-gray-900">{user.email}</p>
                <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded-full">
                  Cannot be changed
                </span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Phone Number
              </label>
              {isEditing ? (
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    placeholder="08012345678"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {user.phone || "Not set"}
                  </p>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    placeholder="123 Main St, Lagos"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {user.address || "Not set"}
                  </p>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm text-gray-900">
                  {user.bio || "No bio added yet."}
                </p>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-(--color-primary) text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </section>

        {/* Settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              Account Settings
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {settingsItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-(--color-primary-light) group-hover:text-(--color-primary) transition-colors">
                  <item.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-50">
            <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium"
            >
              <LogOut size={18} className="text-gray-500" />
              Sign Out
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-medium">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
