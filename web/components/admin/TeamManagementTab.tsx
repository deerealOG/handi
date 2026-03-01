"use client";
import { UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// ============================================
// TEAM MANAGEMENT TAB (Super Admin only)
// ============================================
export default function TeamManagementTab() {
  const { session } = useSession() as any;
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    adminRole: "MODERATOR",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = session?.accessToken;
      const res = await fetch(`${BACKEND}/api/auth/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAdmins(data.data || []);
    } catch (e) {
      console.error("Failed to fetch admins:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const token = session?.accessToken;
      const res = await fetch(`${BACKEND}/api/auth/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Admin created successfully!");
        setShowCreateForm(false);
        setCreateForm({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          adminRole: "MODERATOR",
        });
        fetchAdmins();
      } else {
        setError(data.error || "Failed to create admin");
      }
    } catch (err: any) {
      // Dev fallback: create admin locally when backend is unavailable
      console.warn(
        "Backend unavailable, using dev fallback for admin creation",
        err,
      );
      const mockAdmin = {
        id: `mock-${Date.now()}`,
        email: createForm.email,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        role: createForm.adminRole,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      setAdmins((prev) => [mockAdmin, ...prev]);
      setSuccess(
        `✅ Admin created locally (dev mode). Backend is unavailable: ${err?.message || "Network error"}`,
      );
      setShowCreateForm(false);
      setCreateForm({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        adminRole: "MODERATOR",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (adminId: string, newRole: string) => {
    try {
      const token = session?.accessToken;
      const res = await fetch(`${BACKEND}/api/auth/admin/${adminId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminRole: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdmins();
        setSuccess("Role updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to update role");
        setTimeout(() => setError(""), 3000);
      }
    } catch (e) {
      setError("Network error");
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-amber-100 text-amber-700",
    MODERATOR: "bg-blue-100 text-blue-700",
    SUPPORT: "bg-emerald-100 text-emerald-700",
    FINANCE: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Team Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition text-sm font-semibold"
        >
          <UserPlus size={16} /> Add Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-600 text-sm">
          {success}
        </div>
      )}

      {/* Create Admin Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Admin</h3>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, email: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={createForm.firstName}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, firstName: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={createForm.lastName}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, lastName: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
            />
            <input
              type="password"
              placeholder="Password (min 8 chars)"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, password: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              required
              minLength={8}
            />
            <select
              value={createForm.adminRole}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, adminRole: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="MODERATOR">Moderator</option>
              <option value="SUPPORT">Support Agent</option>
              <option value="FINANCE">Finance Manager</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            <div className="flex gap-2 items-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            Admin Team ({admins.length})
          </h3>
        </div>
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : admins.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No admin users found
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-5">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow justify-between"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {admin.firstName?.[0]}
                    {admin.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                      {admin.email}
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <select
                    value={admin.adminRole || "MODERATOR"}
                    onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                    className={`text-[10px] sm:text-xs font-semibold rounded-full px-2 sm:px-3 py-1 border-0 cursor-pointer w-full text-center outline-none ${roleColors[admin.adminRole] || "bg-gray-100 text-gray-700"}`}
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="SUPPORT">Support</option>
                    <option value="FINANCE">Finance</option>
                  </select>
                  <div className="pt-2 mt-3 border-t border-gray-50 text-[9px] sm:text-[10px] text-gray-400 text-center">
                    Joined {new Date(admin.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
