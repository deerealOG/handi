"use client";

import { webVendorService } from "@/lib/api";
import {
  AlertTriangle,
  Box,
  DollarSign,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function VendorProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "",
    categoryName: "", brand: "", stock: "10",
    images: [] as string[], isInstallable: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [statsRes, ordersRes] = await Promise.all([
      webVendorService.getVendors(),
      webVendorService.getVendors(),  
    ]);
    // Try to fetch dashboard stats if vendor
    const dashRes = await fetch("/api/vendors/dashboard/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    }).then(r => r.json()).catch(() => null);
    if (dashRes?.success) setStats(dashRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddProduct = async () => {
    if (!form.name || !form.description || !form.price) {
      return setMessage("Please fill name, description, and price.");
    }
    setSubmitting(true);
    const res = await webVendorService.addProduct({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      categoryName: form.categoryName || undefined,
      brand: form.brand || undefined,
      stock: parseInt(form.stock) || 10,
      images: form.images.length > 0 ? form.images : undefined,
      isInstallable: form.isInstallable,
    });
    setMessage(res.success ? "✅ Product added!" : res.error || "Failed");
    setSubmitting(false);
    if (res.success) {
      setShowForm(false);
      setForm({ name: "", description: "", price: "", categoryName: "", brand: "", stock: "10", images: [], isInstallable: false });
      fetchData();
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your marketplace products and inventory.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Products", value: stats.totalProducts || 0, icon: Package, color: "bg-blue-50 text-blue-600" },
            { label: "Orders", value: stats.totalOrders || 0, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
            { label: "Revenue", value: `₦${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "bg-purple-50 text-purple-600" },
            { label: "Low Stock", value: stats.lowStockProducts || 0, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border-2 border-primary/10">
          <h3 className="font-semibold text-gray-900">New Product</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Product name*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="Category" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            <input type="number" placeholder="Price (₦)*" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            <input type="number" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isInstallable} onChange={(e) => setForm({ ...form, isInstallable: e.target.checked })}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-gray-600">Requires installation?</span>
            </label>
          </div>
          <textarea rows={3} placeholder="Product description*" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          <button onClick={handleAddProduct} disabled={submitting}
            className="w-full py-3 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90">
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      )}

      {/* Products would load here when we have vendor-specific product listing */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Box size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">Your products will appear here.</p>
          <p className="text-xs text-gray-400 mt-1">Add your first product to start selling on the HANDI marketplace.</p>
        </div>
      )}
    </div>
  );
}
