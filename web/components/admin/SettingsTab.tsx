"use client";
import type { AdminRole } from "./types";
import { useNotification } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { AlertTriangle, Bell, ChevronRight, Mail, MessageSquare, Moon, Power, Shield, Sun, Trash2 } from "lucide-react";
import { useState } from "react";


// ============================================
// SETTINGS TAB
// ============================================

const ToggleSwitch = ({
  on,
  onToggle,
  disabled,
}: {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={disabled ? undefined : onToggle}
    className={`relative w-10 h-5 rounded-full transition-colors ${
      on ? "bg-purple-600" : "bg-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
        on ? "translate-x-5" : ""
      }`}
    />
  </button>
);
export default function SettingsTab({
  onLogout,
  adminRole,
}: {
  onLogout: () => void;
  adminRole?: AdminRole;
}) {
  const { isDark, toggleDarkMode } = useTheme();
  const { addToast } = useNotification();
  const isSuperAdmin = adminRole === "super_admin";

  const [commissionRate, setCommissionRate] = useState(10);
  const [minWithdrawal, setMinWithdrawal] = useState(5000);
  const [platformName, setPlatformName] = useState("HANDI");
  const [supportEmail, setSupportEmail] = useState("support@handi.ng");
  const [supportPhone, setSupportPhone] = useState("+234 800 000 0000");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [saving, setSaving] = useState(false);

  // Platform policies (Super Admin only)
  const [refundPolicy, setRefundPolicy] = useState("Full refund within 7 days of service completion. Partial refund available up to 14 days.");
  const [cancellationPolicy, setCancellationPolicy] = useState("Free cancellation up to 24 hours before scheduled service. Late cancellations incur a 20% fee.");
  const [privacyPolicy, setPrivacyPolicy] = useState("We collect only necessary data to facilitate services. All payment data is encrypted and processed through Paystack.");
  const [providerTerms, setProviderTerms] = useState("Providers must maintain a minimum 4.0 rating. Response time within 2 hours. Background verification required.");

  // Admin password reset
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  // Delete admin
  const [showDeleteAdmin, setShowDeleteAdmin] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAdmin, setDeletingAdmin] = useState(false);

  const handleSave = () => {
    if (!isSuperAdmin) {
      addToast({
        type: "error",
        title: "🚫 Access Denied",
        message: "Only Super Admins can modify settings.",
      });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({
        type: "success",
        title: "✅ Settings Saved",
        message: "Platform settings have been updated successfully.",
      });
    }, 800);
  };



  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast({ type: "error", title: "Missing Fields", message: "Please fill in all password fields." });
      return;
    }
    if (newPassword.length < 8) {
      addToast({ type: "error", title: "Weak Password", message: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ type: "error", title: "Mismatch", message: "New password and confirmation do not match." });
      return;
    }
    setResettingPassword(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setResettingPassword(false);
    setShowResetPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    addToast({ type: "success", title: "✅ Password Reset", message: "Your admin password has been reset successfully." });
  };

  const handleDeleteAdmin = async () => {
    if (deleteConfirmText !== "DELETE ADMIN") return;
    setDeletingAdmin(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setDeletingAdmin(false);
    setShowDeleteAdmin(false);
    setDeleteConfirmText("");
    addToast({ type: "success", title: "Admin Deleted", message: "The admin account has been permanently removed." });
    onLogout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
        <button
          onClick={handleSave}
          disabled={!isSuperAdmin || saving}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${
            isSuperAdmin && !saving
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      {!isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-700">
            Settings are view-only. Contact a Super Admin to make changes.
          </p>
        </div>
      )}

      {/* Commission Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Commission Settings
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Default Commission Rate (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              disabled={!isSuperAdmin}
              className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 ${
                !isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Minimum Withdrawal (₦)
            </label>
            <input
              type="number"
              value={minWithdrawal}
              onChange={(e) => setMinWithdrawal(Number(e.target.value))}
              disabled={!isSuperAdmin}
              className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 ${
                !isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
              disabled={!isSuperAdmin}
              className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 ${
                !isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Session Timeout (min)
            </label>
            <input
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              disabled={!isSuperAdmin}
              className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 ${
                !isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Notification Settings
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Send email alerts for disputes, provider signups, etc.
                </p>
              </div>
            </div>
            <ToggleSwitch
              on={emailNotif}
              onToggle={() => setEmailNotif(!emailNotif)}
              disabled={!isSuperAdmin}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  SMS Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Send SMS for urgent alerts and escalations.
                </p>
              </div>
            </div>
            <ToggleSwitch
              on={smsNotif}
              onToggle={() => setSmsNotif(!smsNotif)}
              disabled={!isSuperAdmin}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Push Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Browser push notifications for real-time alerts.
                </p>
              </div>
            </div>
            <ToggleSwitch
              on={pushNotif}
              onToggle={() => setPushNotif(!pushNotif)}
              disabled={!isSuperAdmin}
            />
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Platform Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-sm text-gray-500">Platform Name</span>
            {isSuperAdmin ? (
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="text-sm font-medium text-gray-900 text-right bg-transparent outline-none w-40"
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {platformName}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-sm text-gray-500">Support Email</span>
            {isSuperAdmin ? (
              <input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="text-sm font-medium text-gray-900 text-right bg-transparent outline-none w-48"
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {supportEmail}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <span className="text-sm text-gray-500">Support Phone</span>
            {isSuperAdmin ? (
              <input
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="text-sm font-medium text-gray-900 text-right bg-transparent outline-none w-48"
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {supportPhone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance & Backup */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">System</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Maintenance Mode
              </p>
              <p className="text-xs text-gray-500">
                Temporarily disable the platform for users.
              </p>
            </div>
            <ToggleSwitch
              on={maintenanceMode}
              onToggle={() => {
                setMaintenanceMode(!maintenanceMode);
                addToast({
                  type: maintenanceMode ? "success" : "warning",
                  title: maintenanceMode
                    ? "Platform Online"
                    : "⚠️ Maintenance Mode",
                  message: maintenanceMode
                    ? "Platform is now live."
                    : "Platform is now in maintenance mode.",
                });
              }}
              disabled={!isSuperAdmin}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Backup</p>
              <p className="text-xs text-gray-500">
                Automatically backup database daily.
              </p>
            </div>
            <ToggleSwitch
              on={autoBackup}
              onToggle={() => setAutoBackup(!autoBackup)}
              disabled={!isSuperAdmin}
            />
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
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
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${isDark ? "bg-purple-600" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDark ? "translate-x-6" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ===== PLATFORM POLICIES ===== */}
      {isSuperAdmin && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-purple-600" /> Platform Policies
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Edit platform policies directly. Changes take effect immediately after saving.
          </p>
          <div className="space-y-4">
            {[
              { key: "refund", label: "Refund Policy", value: refundPolicy, setter: setRefundPolicy, placeholder: "E.g., Full refund within 7 days of service..." },
              { key: "cancellation", label: "Cancellation Policy", value: cancellationPolicy, setter: setCancellationPolicy, placeholder: "E.g., Free cancellation up to 24 hours before..." },
              { key: "privacy", label: "Privacy Policy Summary", value: privacyPolicy, setter: setPrivacyPolicy, placeholder: "E.g., We collect only necessary data..." },
              { key: "provider", label: "Provider Terms", value: providerTerms, setter: setProviderTerms, placeholder: "E.g., Providers must maintain 4.0+ rating..." },
            ].map((policy) => (
              <div key={policy.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {policy.label}
                </label>
                <textarea
                  rows={3}
                  value={policy.value}
                  onChange={(e) => policy.setter(e.target.value)}
                  placeholder={policy.placeholder}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== ADMIN AUDIT TRAIL (Super Admin Only) ===== */}
      {isSuperAdmin && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-orange-500" /> Admin Action Audit Trail
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Review and undo recent admin actions. As Super Admin, you can reverse actions by lower-level admins.
          </p>
          <div className="space-y-2">
            {[
              { id: 1, admin: "Moderator (John)", action: "Suspended provider DavidFix Plumbing", time: "15 min ago", undoable: true },
              { id: 2, admin: "Support Agent (Ada)", action: "Resolved dispute #D103 — Full Refund issued", time: "1 hr ago", undoable: true },
              { id: 3, admin: "Finance Manager (Silas)", action: "Approved withdrawal of ₦45,000 to GTBank ****5678", time: "2 hrs ago", undoable: false },
              { id: 4, admin: "Content Manager (Kemi)", action: "Deleted category 'Gardening Services'", time: "3 hrs ago", undoable: true },
              { id: 5, admin: "Super Admin (You)", action: "Updated commission rate to 10%", time: "1 day ago", undoable: false },
            ].map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{log.admin}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{log.action}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{log.time}</p>
                </div>
                {log.undoable && (
                  <button
                    onClick={() => {
                      addToast({
                        type: "warning",
                        title: "↩️ Action Undone",
                        message: `Reversed: "${log.action}" by ${log.admin}`,
                      });
                    }}
                    className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-semibold hover:bg-orange-200 transition cursor-pointer shrink-0"
                  >
                    Undo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== ADMIN SECURITY / DANGER ZONE ===== */}
      <div className="mt-2">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Admin Security
        </h3>
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden divide-y divide-red-50">
          {/* Reset Password */}
          <button
            onClick={() => setShowResetPassword(!showResetPassword)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">Reset Admin Password</span>
              <p className="text-xs text-gray-500 mt-0.5">Change password if compromised</p>
            </div>
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${showResetPassword ? "rotate-90" : ""}`} />
          </button>

          {/* Reset Password Form */}
          {showResetPassword && (
            <div className="px-5 py-4 bg-orange-50/30 space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-300"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min. 8 characters)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-300"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                onClick={handleResetPassword}
                disabled={resettingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {resettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* Delete Admin Account (Super Admin only) */}
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setShowDeleteAdmin(!showDeleteAdmin)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <Trash2 size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-red-600">Delete Admin Account</span>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently remove an admin from the platform</p>
                </div>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${showDeleteAdmin ? "rotate-90" : ""}`} />
              </button>

              {/* Delete Confirmation */}
              {showDeleteAdmin && (
                <div className="px-5 py-4 bg-red-50/30 space-y-3">
                  <div className="bg-red-100 border border-red-200 rounded-xl p-3">
                    <p className="text-xs text-red-700 font-medium">⚠️ This action is permanent and cannot be undone. All admin data, audit logs, and permissions will be lost.</p>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    Type <span className="font-bold text-red-600">DELETE ADMIN</span> to confirm:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE ADMIN"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-300"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowDeleteAdmin(false); setDeleteConfirmText(""); }}
                      className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAdmin}
                      disabled={deleteConfirmText !== "DELETE ADMIN" || deletingAdmin}
                      className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {deletingAdmin ? "Deleting..." : "Delete Forever"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <Power size={18} /> Log Out
      </button>
    </div>
  );
}
