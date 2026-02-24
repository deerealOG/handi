"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
    Bell,
    ChevronRight,
    Globe,
    HelpCircle,
    Lock,
    LogOut,
    Moon,
    Shield,
    Smartphone,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [isLoggedIn, user, router]);

  const handleSave = () => {
    updateUser(formData);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isLoggedIn) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-gray-500 mb-8">Manage your account preferences</p>

          {saved && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 flex items-center gap-2">
              ✅ Profile updated successfully!
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Profile Information
              </h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-[var(--color-primary)] font-medium hover:underline"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold">
                  {user?.firstName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user?.userType} Account
                  </p>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <SettingsRow
                    icon={<User size={18} />}
                    label="Name"
                    value={`${user?.firstName} ${user?.lastName}`}
                  />
                  <SettingsRow
                    icon={<Globe size={18} />}
                    label="Email"
                    value={user?.email || ""}
                  />
                  <SettingsRow
                    icon={<Smartphone size={18} />}
                    label="Phone"
                    value={user?.phone || "Not set"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Preferences</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <SettingsLink
                icon={<Bell size={18} />}
                label="Notifications"
                description="Email and push notifications"
              />
              <SettingsLink
                icon={<Moon size={18} />}
                label="Appearance"
                description="Light mode"
              />
              <SettingsLink
                icon={<Globe size={18} />}
                label="Language"
                description="English"
              />
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Security</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <SettingsLink
                icon={<Lock size={18} />}
                label="Change Password"
                description="Last changed 30 days ago"
              />
              <SettingsLink
                icon={<Shield size={18} />}
                label="Two-Factor Authentication"
                description="Not enabled"
              />
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Support</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <SettingsLink
                icon={<HelpCircle size={18} />}
                label="Help & FAQ"
                description="Get help with your account"
                href="/faq"
              />
              <SettingsLink
                icon={<Shield size={18} />}
                label="Privacy Policy"
                description="How we handle your data"
                href="/privacy"
              />
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SettingsRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-gray-400">{icon}</span>
      <div className="flex-1">
        <span className="text-xs text-gray-500">{label}</span>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function SettingsLink({
  icon,
  label,
  description,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <span className="text-gray-400">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  );

  if (href) {
    const Link = require("next/link").default;
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
