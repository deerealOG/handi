"use client";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

// ============================================
// ADMIN SERVICES TAB
// ============================================
export default function AdminServicesTab() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const categories = [
    {
      id: "c1",
      name: "Home Cleaning",
      services: 45,
      providers: 23,
      avgPrice: "₦12,000",
      status: "active",
    },
    {
      id: "c2",
      name: "Plumbing",
      services: 32,
      providers: 18,
      avgPrice: "₦15,000",
      status: "active",
    },
    {
      id: "c3",
      name: "Electrical",
      services: 28,
      providers: 15,
      avgPrice: "₦18,000",
      status: "active",
    },
    {
      id: "c4",
      name: "Painting",
      services: 20,
      providers: 12,
      avgPrice: "₦25,000",
      status: "active",
    },
    {
      id: "c5",
      name: "Beauty & Spa",
      services: 38,
      providers: 20,
      avgPrice: "₦8,000",
      status: "active",
    },
    {
      id: "c6",
      name: "Catering",
      services: 15,
      providers: 10,
      avgPrice: "₦30,000",
      status: "active",
    },
    {
      id: "c7",
      name: "Moving & Logistics",
      services: 12,
      providers: 8,
      avgPrice: "₦40,000",
      status: "active",
    },
    {
      id: "c8",
      name: "Tech Support",
      services: 22,
      providers: 14,
      avgPrice: "₦10,000",
      status: "draft",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Service Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage platform services and categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
          <button
            //onClick show add service category form straight.
            className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {categories.length}
          </p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {categories.reduce((s, c) => s + c.services, 0)}
          </p>
          <p className="text-xs text-gray-500">Total Services</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {categories.reduce((s, c) => s + c.providers, 0)}
          </p>
          <p className="text-xs text-gray-500">Active Providers</p>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            : "flex flex-col gap-3"
        }
      >
        {categories.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-2xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
              viewMode === "grid"
                ? "flex flex-col justify-between"
                : "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            }`}
          >
            <div
              className={
                viewMode === "grid"
                  ? "mb-3"
                  : "flex-1 flex flex-col sm:flex-row sm:items-center gap-4"
              }
            >
              <div
                className={
                  viewMode === "grid"
                    ? "flex items-start justify-between mb-2"
                    : "flex flex-col sm:w-1/3"
                }
              >
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                  {c.name}
                </h3>
                {viewMode === "grid" && (
                  <span
                    className={`shrink-0 ml-2 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium capitalize ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.status}
                  </span>
                )}
              </div>
              <div
                className={
                  viewMode === "grid"
                    ? "space-y-1 sm:space-y-2 text-[10px] sm:text-xs text-gray-500"
                    : "flex-1 grid grid-cols-3 gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500"
                }
              >
                <div
                  className={
                    viewMode === "grid"
                      ? "flex justify-between"
                      : "flex flex-col"
                  }
                >
                  <span
                    className={
                      viewMode === "list" ? "text-gray-400 mb-0.5" : ""
                    }
                  >
                    Services
                  </span>
                  <span className="font-medium text-gray-900">
                    {c.services}
                  </span>
                </div>
                <div
                  className={
                    viewMode === "grid"
                      ? "flex justify-between"
                      : "flex flex-col"
                  }
                >
                  <span
                    className={
                      viewMode === "list" ? "text-gray-400 mb-0.5" : ""
                    }
                  >
                    Providers
                  </span>
                  <span className="font-medium text-gray-900">
                    {c.providers}
                  </span>
                </div>
                <div
                  className={
                    viewMode === "grid"
                      ? "flex justify-between"
                      : "flex flex-col"
                  }
                >
                  <span
                    className={
                      viewMode === "list" ? "text-gray-400 mb-0.5" : ""
                    }
                  >
                    Avg. Price
                  </span>
                  <span className="font-medium text-gray-900">
                    {c.avgPrice}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={
                viewMode === "grid"
                  ? "flex flex-col sm:flex-row gap-2 mt-auto pt-2 border-t border-gray-50"
                  : "flex flex-row items-center gap-2 sm:w-48 justify-end"
              }
            >
              {viewMode === "list" && (
                <span
                  className={`shrink-0 mr-2 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium capitalize ${
                    c.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.status}
                </span>
              )}
              <button
                className={`py-1.5 bg-gray-50 text-gray-700 rounded-full text-[10px] sm:text-xs font-medium hover:bg-gray-100 whitespace-nowrap ${viewMode === "grid" ? "w-full" : "px-4"}`}
              >
                Edit
              </button>
              <button
                className={`py-1.5 bg-purple-50 text-purple-700 rounded-full text-[10px] sm:text-xs font-medium hover:bg-purple-100 whitespace-nowrap ${viewMode === "grid" ? "w-full" : "px-4"}`}
              >
                Services
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
