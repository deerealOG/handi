"use client";

import { useAuth } from "@/context/AuthContext";
import { DollarSign, Package, ShoppingBag, Store, TrendingUp } from "lucide-react";

export default function VendorDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex-1 lg:pl-64 flex flex-col min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Store Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.firstName}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-900">₦245K</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">New Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">14</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Active Products</p>
              <h3 className="text-2xl font-bold text-gray-900">32</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Store size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Store Views</p>
              <h3 className="text-2xl font-bold text-gray-900">1.2K</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <button className="text-sm font-semibold text-(--color-primary) hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map((order) => (
                <div key={order} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Order #ORD-{Math.floor(Math.random() * 9000) + 1000}</p>
                      <p className="text-xs text-gray-500">2 items • ₦{Math.floor(Math.random() * 50) + 10},000</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
              <button className="text-sm font-semibold text-(--color-primary) hover:underline">Manage</button>
            </div>
            <div className="divide-y divide-gray-50">
              {['Solar Panel 200W', 'Inverter Battery 220Ah', 'Water Pump 1HP'].map((product, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{product}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <TrendingUp size={12} className="text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">{Math.floor(Math.random() * 50) + 10} sold this week</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">₦{Math.floor(Math.random() * 100) + 20},000</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
