"use client";

import { webProductService } from "@/lib/api";
import {
  Box,
  Building2,
  CheckCircle,
  Loader2,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function TradePurchasingTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showOrder, setShowOrder] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await webProductService.getProducts({ trade: true });
    if (res.success && res.data) {
      setProducts(res.data);
    } else {
      // Fallback mock trade products
      setProducts([
        { id: "tp1", name: "Industrial Wire Bundle (100m)", category: "Electrical", price: 45000, tradePrice: 38000, minQuantity: 5, stock: 200, image: "/images/categories/electrician.webp" },
        { id: "tp2", name: "PVC Pipe Set (2 inch, 20pcs)", category: "Plumbing", price: 32000, tradePrice: 26500, minQuantity: 3, stock: 150, image: "/images/categories/plumbing.webp" },
        { id: "tp3", name: "Heavy-Duty Extension Board (10 outlets)", category: "Electrical", price: 18000, tradePrice: 14500, minQuantity: 10, stock: 500, image: "/images/categories/electrician.webp" },
        { id: "tp4", name: "Paint Primer (20L Commercial)", category: "Construction", price: 28000, tradePrice: 22000, minQuantity: 4, stock: 80, image: "/images/categories/construction.webp" },
        { id: "tp5", name: "Safety Equipment Kit", category: "Tools", price: 55000, tradePrice: 44000, minQuantity: 2, stock: 60, image: "/images/categories/technology.webp" },
        { id: "tp6", name: "LED Bulb Pack (50 units)", category: "Electrical", price: 35000, tradePrice: 28000, minQuantity: 5, stock: 300, image: "/images/categories/electrician.webp" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateCart = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((p: any) => p.id === id);
    return sum + (p?.tradePrice || p?.price || 0) * qty;
  }, 0);

  const cartItemCount = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={22} className="text-primary" />
            Trade Purchasing
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Bulk buying portal for verified professionals. Access exclusive trade pricing.
          </p>
        </div>
        {cartItemCount > 0 && (
          <button
            onClick={() => setShowOrder(true)}
            className="relative flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90"
          >
            <ShoppingCart size={16} />
            ₦{cartTotal.toLocaleString()}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          </button>
        )}
      </div>

      {/* Benefits Banner */}
      <div className="bg-linear-to-r from-primary/5 to-emerald-50 rounded-2xl p-5 flex flex-wrap gap-6">
        {[
          { icon: Package, label: "Bulk Discounts", desc: "Up to 25% off retail" },
          { icon: Truck, label: "Free Delivery", desc: "On orders over ₦100,000" },
          { icon: CheckCircle, label: "Net 30 Terms", desc: "For verified traders" },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <b.icon size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{b.label}</p>
              <p className="text-[10px] text-gray-500">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search trade products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")}><X size={14} /></button>
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Box size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">No trade products found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: any) => {
            const savings = p.price && p.tradePrice ? Math.round((1 - p.tradePrice / p.price) * 100) : 0;
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-32 bg-gray-100">
                  {p.image && (
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  )}
                  {savings > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SAVE {savings}%
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    TRADE
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{p.category} · Min order: {p.minQuantity || 1}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">₦{(p.tradePrice || p.price).toLocaleString()}</span>
                    {p.price !== p.tradePrice && (
                      <span className="text-xs text-gray-400 line-through">₦{p.price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{p.stock} in stock</span>
                    <div className="flex items-center gap-2">
                      {cart[p.id] ? (
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full">
                          <button onClick={() => updateCart(p.id, -1)} className="p-1.5 hover:bg-gray-200 rounded-full">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-8 text-center">{cart[p.id]}</span>
                          <button onClick={() => updateCart(p.id, 1)} className="p-1.5 hover:bg-gray-200 rounded-full">
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateCart(p.id, p.minQuantity || 1)}
                          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:opacity-90"
                        >
                          Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Summary Modal */}
      {showOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowOrder(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Trade Order Summary</h3>
              <button onClick={() => setShowOrder(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Object.entries(cart).map(([id, qty]) => {
                const p = products.find((p: any) => p.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">₦{(p.tradePrice || p.price).toLocaleString()} × {qty}</p>
                    </div>
                    <span className="font-bold text-gray-900">₦{((p.tradePrice || p.price) * qty).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total ({cartItemCount} items)</span>
              <span className="text-xl font-bold text-primary">₦{cartTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={() => {
                setMessage("✅ Trade order submitted! You will receive an invoice within 24 hours.");
                setCart({});
                setShowOrder(false);
              }}
              className="w-full py-3 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90"
            >
              Submit Trade Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
