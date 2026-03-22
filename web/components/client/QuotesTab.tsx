"use client";

import { useQuoteRequests, webFeatureService } from "@/hooks/useApi";
import {
  Check,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";

export default function QuotesTab() {
  const { data: requests, loading, refetch } = useQuoteRequests();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    categoryId: "", categoryName: "", serviceType: "",
    description: "", address: "", city: "",
    preferredDate: "",
  });

  const handleSubmit = async () => {
    if (!formData.categoryName || !formData.description || !formData.address || !formData.city) {
      return setMessage("Please fill in all required fields.");
    }
    const res = await webFeatureService.requestQuotes(formData);
    setMessage(res.success ? "✅ Quote request submitted! Pros will send their quotes." : res.error || "Failed");
    if (res.success) {
      setShowForm(false);
      setFormData({ categoryId: "", categoryName: "", serviceType: "", description: "", address: "", city: "", preferredDate: "" });
      refetch();
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    const res = await webFeatureService.acceptQuote(quoteId);
    setMessage(res.success ? "✅ Quote accepted!" : res.error || "Failed");
    if (res.success) refetch();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Get <span className="text-(--color-secondary)">Quotes</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Compare quotes from multiple pros before booking.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Request Quotes"}
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* Request Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border-2 border-(--color-primary)/10">
          <h3 className="font-semibold text-gray-900">Describe your project</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Service category (e.g. Plumbing)*"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value, categoryId: e.target.value.toLowerCase() })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <input
              placeholder="Service type (e.g. Pipe repair)"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <input
              placeholder="Address*"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <input
              placeholder="City*"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
          </div>
          <textarea maxLength={500}
            placeholder="Describe the work needed in detail*"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-(--color-primary) resize-none"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:opacity-90"
          >
            Submit Quote Request
          </button>
        </div>
      )}

      {/* Quote Requests List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-(--color-primary)" size={32} /></div>
      ) : !requests?.length ? (
        <div className="text-center py-16 text-gray-500">
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p>No quote requests yet.</p>
          <p className="text-xs text-gray-400 mt-1">Request quotes to compare pricing from multiple professionals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <div key={req.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{req.categoryName} — {req.serviceType || "General"}</h4>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{req.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{req.city}</span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  req.status === "OPEN" ? "bg-green-100 text-green-700" :
                  req.status === "CLOSED" ? "bg-gray-100 text-gray-500" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Quotes received */}
              {req.quotes?.length > 0 ? (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-xs text-gray-400 mb-2">{req.quotes.length} quote{req.quotes.length > 1 ? "s" : ""} received</p>
                  {req.quotes.map((q: any) => (
                    <div key={q.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-(--color-primary-light) rounded-full flex items-center justify-center">
                          <Star size={14} className="text-(--color-primary)" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">₦{q.amount?.toLocaleString()}</p>
                          {q.estimatedDuration && <p className="text-xs text-gray-400">{q.estimatedDuration} hours est.</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {q.status === "PENDING" && req.status === "OPEN" && (
                          <button
                            onClick={() => handleAcceptQuote(q.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-(--color-primary) text-white text-xs font-semibold rounded-full hover:opacity-90"
                          >
                            <Check size={12} /> Accept
                          </button>
                        )}
                        {q.status === "ACCEPTED" && (
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><Check size={12} /> Accepted</span>
                        )}
                        {q.message && (
                          <span className="text-xs text-gray-400 flex items-center gap-1"><MessageSquare size={12} />{q.message.slice(0, 30)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={14} />
                  <span>Waiting for professionals to respond...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
