"use client";

import { useHomeProfile, webFeatureService } from "@/hooks/useApi";
import {
  Bath,
  BedDouble,
  Building,
  CalendarDays,
  Home,
  Layers,
  Loader2,
  MapPin,
  Ruler,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";

const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Townhouse", "Duplex", "Bungalow", "Villa", "Other"];

export default function HomeProfileTab() {
  const { data: profile, loading, refetch } = useHomeProfile();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nickname: "",
    propertyType: "",
    squareFootage: "",
    yearBuilt: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        nickname: profile.nickname || "",
        propertyType: profile.propertyType || "",
        squareFootage: profile.squareFootage?.toString() || "",
        yearBuilt: profile.yearBuilt?.toString() || "",
        bedrooms: profile.bedrooms?.toString() || "",
        bathrooms: profile.bathrooms?.toString() || "",
        floors: profile.floors?.toString() || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        notes: profile.notes || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const data: any = { ...form };
    if (data.squareFootage) data.squareFootage = parseFloat(data.squareFootage);
    if (data.yearBuilt) data.yearBuilt = parseInt(data.yearBuilt);
    if (data.bedrooms) data.bedrooms = parseInt(data.bedrooms);
    if (data.bathrooms) data.bathrooms = parseInt(data.bathrooms);
    if (data.floors) data.floors = parseInt(data.floors);

    const res = await webFeatureService.updateHomeProfile(data);
    setMessage(res.success ? "✅ Home profile saved!" : res.error || "Failed");
    setSaving(false);
    if (res.success) refetch();
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-(--color-primary)" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My <span className="text-(--color-secondary)">Home Profile</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Help us provide better service recommendations for your property.
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        {/* Nickname + Property Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Home size={14} /> Home Nickname
            </label>
            <input
              placeholder="e.g. My Lagos House"
              value={form.nickname}
              onChange={(e) => update("nickname", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Building size={14} /> Property Type
            </label>
            <select
              value={form.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary) bg-white"
            >
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Ruler size={14} /> Area (sqft)
            </label>
            <input
              type="number"
              placeholder="1200"
              value={form.squareFootage}
              onChange={(e) => update("squareFootage", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <CalendarDays size={14} /> Year Built
            </label>
            <input
              type="number"
              placeholder="2015"
              value={form.yearBuilt}
              onChange={(e) => update("yearBuilt", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <BedDouble size={14} /> Bedrooms
            </label>
            <input
              type="number"
              placeholder="3"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Bath size={14} /> Bathrooms
            </label>
            <input
              type="number"
              placeholder="2"
              value={form.bathrooms}
              onChange={(e) => update("bathrooms", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
        </div>

        {/* Floors */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Layers size={14} /> Floors
            </label>
            <input
              type="number"
              placeholder="2"
              value={form.floors}
              onChange={(e) => update("floors", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} /> Address
            </label>
            <input
              placeholder="123 Main Street"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5">City</label>
            <input
              placeholder="Lagos"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5">State</label>
            <input
              placeholder="Lagos"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5">Notes</label>
          <textarea
            rows={3}
            placeholder="Any special details about your property..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Home Profile"}
        </button>
      </div>
    </div>
  );
}
