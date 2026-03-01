"use client";
import { useTheme } from "@/context/ThemeContext";
import {
  AlertCircle,
    Award,
    Ban,
    Bell,
    Briefcase,
    Camera,
    Check,
    CheckCircle,
    ChevronRight,
    Clock,
    Eye,
    HelpCircle,
    Image as ImageIcon,
    Info,
    MapPin,
    Moon,
    Plus,
    Power,
    Shield,
    Sun,
    Trash2,
    X
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

// ============================================
// PROFILE TAB
// ============================================
export default function ProfileTab({
  user,
  updateUser,
  onLogout,
  setShowNotifications,
  setShowSupport,
  setShowTransactions,
}: {
  user: any;
  updateUser: (u: any) => void;
  onLogout: () => void;
  setShowNotifications: (v: boolean) => void;
  setShowSupport: (v: boolean) => void;
  setShowTransactions: (v: boolean) => void;
}) {
  const { isDark, toggleDarkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deactivateConfirmText, setDeactivateConfirmText] = useState("");
  const [deactivateDuration, setDeactivateDuration] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [certifications, setCertifications] = useState([
    { name: "NABTEB Certificate", status: "verified" as const },
    { name: "Safety Training", status: "pending" as const },
  ]);
  const [pastWork, setPastWork] = useState([
    "/images/placeholder-work-1.jpg",
    "/images/placeholder-work-2.jpg",
    "/images/placeholder-work-3.jpg",
  ]);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateUser({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleWorkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setPastWork((prev) => [...prev, reader.result as string]);
    reader.readAsDataURL(file);
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
            updateUser({
              address:
                data.display_name ||
                `${pos.coords.latitude}, ${pos.coords.longitude}`,
            });
          } catch {
            updateUser({
              address: `${pos.coords.latitude}, ${pos.coords.longitude}`,
            });
          }
          setLocationLoading(false);
        },
        () => {
          alert("Location access denied.");
          setLocationLoading(false);
        },
      );
    } else {
      alert("Geolocation not supported.");
      setLocationLoading(false);
    }
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      console.log("API: DELETE /api/providers/me");
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
    }
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  const handleDeactivateAccount = async () => {
    try {
      console.log(
        `API: POST /api/providers/me/deactivate { duration: "${deactivateDuration}" }`,
      );
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(e);
    }
    setShowDeactivateConfirm(false);
    setDeactivateConfirmText("");
    setDeactivateDuration("");
    alert("Your provider account has been deactivated.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Cover Photo */}
      <div className="relative w-full h-40 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-2xl overflow-hidden group">
        {coverPhoto && (
          <Image src={coverPhoto} alt="Cover" fill className="object-cover" />
        )}
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/40 text-white text-xs font-medium rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
        >
          <Camera size={14} /> Change Cover
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-sm p-6 text-center -mt-12 relative z-10">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt=""
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700 border-4 border-white shadow-lg">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-(--color-primary) text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          {/* Verified Badge */}
          <div
            className="absolute top-1 right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
            title="Verified Provider"
          >
            <CheckCircle size={12} className="text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-gray-500">
          {user.providerSubType === "business"
            ? "Business Provider"
            : "Individual Provider"}
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">4.8</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-500">Jobs</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">98%</p>
            <p className="text-xs text-gray-500">Response</p>
          </div>
        </div>
        <button
          onClick={() => setShowProfilePreview(true)}
          className="mt-4 px-6 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
        >
          <Eye size={16} /> Preview Profile
        </button>
      </div>

      {/* Certifications & Verification */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Award size={18} className="text-emerald-600" /> Certifications
          </h3>
          <button
            onClick={() => certInputRef.current?.click()}
            className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1  cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
          <input
            ref={certInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={() => {
              setCertifications((prev) => [
                ...prev,
                { name: "New Certificate", status: "pending" as const },
              ]);
            }}
            className="hidden"
          />
        </div>
        {certifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No certifications added yet
          </p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${cert.status === "verified" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                  >
                    {cert.status === "verified" ? (
                      <Check size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cert.name}
                    </p>
                    <p
                      className={`text-xs ${cert.status === "verified" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {cert.status === "verified"
                        ? "✓ Verified"
                        : "⏳ Pending Review"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setCertifications((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    )
                  }
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Work Gallery */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon size={18} className="text-emerald-600" /> Past Work
            Gallery
          </h3>
          <button
            onClick={() => workInputRef.current?.click()}
            className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Photo
          </button>
          <input
            ref={workInputRef}
            type="file"
            accept="image/*"
            onChange={handleWorkUpload}
            className="hidden"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {pastWork.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
            >
              <Image
                src={img}
                alt={`Work ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() =>
                  setPastWork((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => workInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
          >
            <Plus size={20} />
            <span className="text-[10px]">Add</span>
          </button>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-600" /> Work Experience
          </h3>
          <button
            onClick={() => {
              const newExp = {
                id: `exp_${Date.now()}`,
                title: "New Role",
                company: "Company Name",
                duration: "2024 - Present",
                description: "Describe your role and responsibilities",
              };
              updateUser({ experience: [...(user.experience || []), newExp] });
            }}
            className="text-xs font-medium text-(--color-primary) hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {!user.experience || user.experience.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No work experience added yet. Add your professional history.
          </p>
        ) : (
          <div className="space-y-3">
            {user.experience.map((exp: any, i: number) => (
              <div
                key={exp.id || i}
                className="p-4 bg-gray-50 rounded-xl relative group"
              >
                <div className="space-y-2">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = { ...updated[i], title: e.target.value };
                      updateUser({ experience: updated });
                    }}
                    className="w-full text-sm font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none pb-0.5 transition-colors"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = { ...updated[i], company: e.target.value };
                      updateUser({ experience: updated });
                    }}
                    className="w-full text-xs text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none pb-0.5 transition-colors"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = { ...updated[i], duration: e.target.value };
                      updateUser({ experience: updated });
                    }}
                    className="w-full text-[10px] text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none pb-0.5 transition-colors"
                    placeholder="Duration"
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...user.experience];
                      updated[i] = {
                        ...updated[i],
                        description: e.target.value,
                      };
                      updateUser({ experience: updated });
                    }}
                    rows={2}
                    className="w-full text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-(--color-primary) focus:outline-none resize-none transition-colors"
                    placeholder="Description"
                  />
                </div>
                <button
                  onClick={() =>
                    updateUser({
                      experience: user.experience.filter(
                        (_: any, idx: number) => idx !== i,
                      ),
                    })
                  }
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next of Kin / Emergency Contact */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Shield size={18} className="text-emerald-600" /> Next of Kin /
          Emergency Contact
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Required for security. This information is kept private and only used
          in emergencies.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user.nextOfKin?.name || ""}
              placeholder="e.g. Adaeze Okonkwo"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Relationship
            </label>
            <select
              defaultValue={user.nextOfKin?.relationship || ""}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            >
              <option value="">Select...</option>
              <option>Spouse</option>
              <option>Parent</option>
              <option>Sibling</option>
              <option>Child</option>
              <option>Friend</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={user.nextOfKin?.phone || ""}
              placeholder="+234 xxx xxx xxxx"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Address
            </label>
            <input
              type="text"
              defaultValue={user.nextOfKin?.address || ""}
              placeholder="e.g. 12 Main Street, Lagos"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          Save Emergency Contact
        </button>
      </div>

      {/* CAC Certificate (Business only) */}
      {user.providerSubType === "business" && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" /> CAC Business
            Certificate
          </h3>
          {!user.cacCertificate ? (
            <div className="text-center py-6 bg-orange-50 rounded-xl border border-orange-200">
              <AlertCircle size={32} className="text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-800">
                CAC Certificate Required
              </p>
              <p className="text-xs text-orange-600 mt-1 max-w-xs mx-auto">
                Business providers must upload a valid CAC certificate within 30
                days. Failure to comply may result in account suspension.
              </p>
              <button className="mt-4 px-5 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors cursor-pointer">
                Upload CAC Certificate
              </button>
              {user.cacGracePeriodEnd && (
                <p className="text-[10px] text-orange-500 mt-2">
                  Grace period expires:{" "}
                  {new Date(user.cacGracePeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user.cacCertificate.status === "verified"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {user.cacCertificate.status === "verified" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.cacCertificate.fileName}
                  </p>
                  <p
                    className={`text-xs ${user.cacCertificate.status === "verified" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {user.cacCertificate.status === "verified"
                      ? "✓ Verified"
                      : "⏳ Under Review"}
                  </p>
                </div>
              </div>
              <button className="text-xs text-(--color-primary) font-medium hover:underline cursor-pointer">
                Replace
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map Preview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-emerald-600" /> Location Preview
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          This map shows your service area. Clients can see your approximate
          location.
        </p>
        <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(user.address || "Lagos, Nigeria")}`}
              title="Provider Location"
              allowFullScreen
            />
          ) : (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                user.address?.includes("Lagos")
                  ? "3.3,6.4,3.5,6.6"
                  : user.address?.includes("Abuja")
                    ? "7.4,9.0,7.6,9.1"
                    : "3.0,6.0,4.0,7.0"
              }&layer=mapnik`}
              title="Provider Location"
            />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <MapPin size={12} /> {user.address || "Location not set"}
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
            <span className="ml-2 text-[10px] text-amber-500">
              (Set NEXT_PUBLIC_GOOGLE_MAPS_KEY for Google Maps)
            </span>
          )}
        </p>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Provider Information</h3>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer"
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "First Name", value: user.firstName, key: "firstName" },
            { label: "Last Name", value: user.lastName, key: "lastName" },
            { label: "Email", value: user.email, key: "email" },
            { label: "Phone", value: user.phone, key: "phone" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.value}
                disabled={!editing}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              />
            </div>
          ))}
        </div>
        {user.providerSubType === "business" && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Business Name
            </label>
            <input
              type="text"
              defaultValue={user.businessName || ""}
              disabled={!editing}
              placeholder="Your business name"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />
          </div>
        )}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Bio
          </label>
          <textarea
            defaultValue={user.bio || ""}
            disabled={!editing}
            rows={3}
            placeholder="Tell clients about your experience..."
            className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none disabled:opacity-60"
          />
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={user.address || ""}
              disabled={!editing}
              placeholder="e.g. Lekki, Lagos"
              className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />
            {editing && (
              <button
                onClick={handleUseLocation}
                disabled={locationLoading}
                className="px-3 py-2.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <MapPin size={14} />
                {locationLoading ? "Locating..." : "Use Location"}
              </button>
            )}
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
            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? "bg-emerald-600" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDark ? "translate-x-6" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
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
            icon: Info,
            label: "About HANDI",
            action: () => setShowAbout(true),
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowDeactivateConfirm(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-yellow-50 transition-colors border-b border-gray-50"
        >
          <div className="flex items-center gap-3">
            <Ban size={18} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">
              Deactivate Account
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-red-500" />
            <span className="text-sm font-medium text-red-600">
              Delete Account
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <Power size={18} /> Log Out
      </button>

      {/* Delete Confirm — Typed */}
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
              This action is permanent. All your data, services, and earnings
              history will be permanently removed.
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

      {/* Deactivate Confirm — Typed */}
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
              Your account and services will be hidden from clients. You can
              reactivate anytime by logging back in.
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

      {/* Profile Preview Modal */}
      {showProfilePreview && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => setShowProfilePreview(false)}
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-lg w-full shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover */}
            <div className="relative w-full h-32 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-t-2xl overflow-hidden">
              {coverPhoto && (
                <Image
                  src={coverPhoto}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {/* Avatar + Info */}
            <div className="px-6 pb-6 -mt-10 relative z-10">
              <div className="relative w-20 h-20 mx-auto mb-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt=""
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-700 border-4 border-white shadow-lg">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield size={10} className="text-white" />
                </div>
              </div>
              <h3 className="text-center text-lg font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-4">
                {user.providerSubType === "business"
                  ? "Business Provider"
                  : "Individual Provider"}{" "}
                • Lagos, Nigeria
              </p>
              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">45</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">98%</p>
                  <p className="text-xs text-gray-500">Response</p>
                </div>
              </div>
              {user.bio && (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {user.bio}
                </p>
              )}
              {/* Certs */}
              {certifications.filter((c) => c.status === "verified").length >
                0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {certifications
                      .filter((c) => c.status === "verified")
                      .map((c, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1"
                        >
                          <Check size={12} /> {c.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              {/* Past Work */}
              {pastWork.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Past Work
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {pastWork.slice(0, 6).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowProfilePreview(false)}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// HELPERS
// ============================================
function statusStyle(
  status: "pending" | "upcoming" | "completed" | "cancelled",
) {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-700";
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
  }
}
