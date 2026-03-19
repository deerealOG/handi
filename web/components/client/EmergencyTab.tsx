"use client";

import { useActiveEmergencies, webEmergencyService } from "@/hooks/useApi";
import {
  AlertTriangle,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Siren,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const URGENCY_LEVELS = [
  { level: 1, label: "Critical", desc: "Needs immediate attention", color: "bg-red-500", textColor: "text-red-700" },
  { level: 2, label: "Urgent", desc: "Within 2-4 hours", color: "bg-orange-500", textColor: "text-orange-700" },
  { level: 3, label: "Same Day", desc: "Today, flexible timing", color: "bg-yellow-500", textColor: "text-yellow-700" },
];

const EMERGENCY_CATEGORIES = [
  { id: "plumbing", name: "Plumbing", icon: "🔧" },
  { id: "electrical", name: "Electrical", icon: "⚡" },
  { id: "locksmith", name: "Locksmith", icon: "🔑" },
  { id: "gas", name: "Gas Leak", icon: "🔥" },
  { id: "security", name: "Security", icon: "🛡️" },
  { id: "pest", name: "Pest Control", icon: "🐛" },
  { id: "ac", name: "AC/Heating", icon: "❄️" },
  { id: "roofing", name: "Roofing", icon: "🏠" },
];

export default function EmergencyTab() {
  const { data: active, loading, refetch } = useActiveEmergencies();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    categoryId: "",
    categoryName: "",
    description: "",
    address: "",
    city: "",
    urgencyLevel: 1,
  });

  const handleSubmit = async () => {
    if (!form.categoryId || !form.description || !form.address || !form.city) {
      return setMessage("Please fill in all required fields.");
    }
    setSubmitting(true);
    const res = await webEmergencyService.createRequest(form);
    setMessage(
      res.success
        ? `🚨 Emergency submitted! Surge multiplier: ${res.data?.surgeMultiplier}x. Pros are being notified.`
        : res.error || "Failed"
    );
    setSubmitting(false);
    if (res.success) {
      setShowForm(false);
      setForm({ categoryId: "", categoryName: "", description: "", address: "", city: "", urgencyLevel: 1 });
      refetch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Emergency <span className="text-red-500">Services</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Get instant help for urgent home emergencies.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors animate-pulse"
        >
          <Siren size={16} />
          {showForm ? "Cancel" : "Request Emergency"}
        </button>
      </div>

      {message && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* Emergency Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-100 p-6 space-y-5">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-lg">Describe Your Emergency</h3>
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">What type of emergency?</label>
            <div className="grid grid-cols-4 gap-2">
              {EMERGENCY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setForm({ ...form, categoryId: cat.id, categoryName: cat.name })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                    form.categoryId === cat.id ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-red-300"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">How urgent?</label>
            <div className="grid grid-cols-3 gap-3">
              {URGENCY_LEVELS.map((u) => (
                <button
                  key={u.level}
                  onClick={() => setForm({ ...form, urgencyLevel: u.level })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.urgencyLevel === u.level ? `border-current ${u.textColor} bg-opacity-10` : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${u.color}`} />
                    <span className="text-sm font-bold">{u.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{u.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <textarea
            rows={3}
            placeholder="Describe the emergency in detail*"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300 resize-none"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Your address*"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300"
            />
            <input
              placeholder="City*"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            {submitting ? "Submitting..." : "Submit Emergency Request"}
          </button>
        </div>
      )}

      {/* Active Emergencies */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-red-500" size={32} /></div>
      ) : active && active.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Active Emergencies</h3>
          {active.map((req: any) => (
            <div key={req.id} className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-red-500">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{req.categoryName}</h4>
                  <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={12} />{req.city}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{new Date(req.createdAt).toLocaleString()}</span>
                    <span className="font-semibold text-red-500">{req.surgeMultiplier}x rate</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  req.respondedBy ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700 animate-pulse"
                }`}>
                  {req.respondedBy ? "Pro Assigned ✓" : "Finding Pro..."}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-16 text-gray-500">
            <Phone size={48} className="mx-auto mb-3 opacity-30" />
            <p>No active emergencies</p>
            <p className="text-xs text-gray-400 mt-1">Need urgent help? Hit the emergency button above.</p>
          </div>
        )
      )}
    </div>
  );
}
