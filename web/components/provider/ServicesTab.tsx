"use client";
import { useNotification } from "@/context/NotificationContext";
import {
    Briefcase,
    LayoutGrid,
    List,
    Plus,
    Search,
    Star,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { MOCK_SERVICES } from "./data";

// ============================================
// SERVICES TAB
// ============================================
export default function ServicesTab() {
  const [services, setServices] = useState(
    MOCK_SERVICES.map((s) => ({ ...s, status: s.status || "active" })),
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "price-high" | "price-low" | "rating" | "bookings"
  >("name");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Add form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const { addToast } = useNotification();

  const startEditing = (svc: (typeof services)[0]) => {
    if (editingService === svc.id) {
      setEditingService(null);
      return;
    }
    setEditingService(svc.id);
    setEditName(svc.name);
    setEditPrice(String(parseInt(svc.price.replace(/[^0-9]/g, "")) || 0));
    setEditCategory(svc.category);
  };

  const handleSaveEdit = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              name: editName,
              price: `₦${Number(editPrice).toLocaleString()}`,
              category: editCategory,
            }
          : s,
      ),
    );
    addToast({
      type: "success",
      title: "✅ Changes Saved",
      message: `Service "${editName}" has been updated.`,
    });
    setEditingService(null);
  };

  const handleCreate = () => {
    if (!newName.trim() || !newCategory || !newPrice) {
      addToast({
        type: "error",
        title: "❌ Missing Fields",
        message: "Please fill in name, category, and price.",
      });
      return;
    }
    const svc = {
      id: `ps-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      price: `₦${Number(newPrice).toLocaleString()}`,
      status: "active" as const,
      bookings: 0,
      rating: 0,
    };
    setServices((prev) => [svc, ...prev]);
    addToast({
      type: "success",
      title: "✅ Service Created",
      message: `"${svc.name}" is now live.`,
    });
    setNewName("");
    setNewCategory("");
    setNewPrice("");
    setNewDuration("");
    setNewDescription("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const svc = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    addToast({
      type: "error",
      title: "🗑️ Service Deleted",
      message: `"${svc?.name || "Service"}" has been removed.`,
    });
  };

  const handlePauseResume = (id: string) => {
    const svc = services.find((s) => s.id === id);
    const isPausing = svc?.status === "active";
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s,
      ),
    );
    addToast({
      type: isPausing ? "warning" : "success",
      title: isPausing ? "⏸️ Service Paused" : "▶️ Service Resumed",
      message: `"${svc?.name}" is now ${isPausing ? "paused" : "active"}.`,
    });
  };

  const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, "")) || 0;

  const filtered = services
    .filter((s) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-high":
          return parsePrice(b.price) - parsePrice(a.price);
        case "price-low":
          return parsePrice(a.price) - parsePrice(b.price);
        case "rating":
          return b.rating - a.rating;
        case "bookings":
          return b.bookings - a.bookings;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Services</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {services.length} services listed
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-(--color-primary) text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search services by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-full bg-white outline-none focus:ring-2 focus:ring-(--color-primary)/30"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-xs border border-gray-200 rounded-full px-3 py-2 bg-white text-gray-600 hover:border-(--color-primary) outline-none"
        >
          <option value="name">Sort: Name A-Z</option>
          <option value="price-high">Price: High → Low</option>
          <option value="price-low">Price: Low → High</option>
          <option value="rating">Rating: Best</option>
          <option value="bookings">Most Bookings</option>
        </select>
        <div className="hidden sm:flex flex-row items-center bg-gray-100 rounded-lg p-1 ml-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-emerald-600"
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
                ? "bg-white shadow-sm text-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-dashed border-emerald-700">
          <h3 className="font-semibold text-gray-900 mb-4">New Service</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. House Painting"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="">Select category</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Construction">Construction</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Price (₦)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[5000, 10000, 15000, 20000, 30000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNewPrice(String(amt))}
                    className={`px-3 py-2 text-xs font-medium border rounded-full transition-colors ${
                      newPrice === String(amt)
                        ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    ₦{amt / 1000}k
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-20 px-3 py-2 bg-gray-50 rounded-full text-xs border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="e.g. 2-3 hours"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe your service..."
              className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 bg-(--color-primary) text-white rounded-full text-sm font-semibold hover:bg-emerald-600 cursor-pointer transition-colors"
            >
              Create Service
            </button>
          </div>
        </div>
      )}

      {/* Service Cards */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            : "flex flex-col gap-3"
        }
      >
        {filtered.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl shadow-sm p-3 sm:p-5 hover:shadow-md transition-shadow flex ${viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row gap-4"}`}
          >
            <div
              className={
                viewMode === "grid"
                  ? "flex-1 mb-3"
                  : "flex-1 flex flex-col sm:flex-row gap-4 w-full"
              }
            >
              <div
                className={
                  viewMode === "grid"
                    ? "flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1"
                    : "flex-1 sm:w-1/3 shrink-0"
                }
              >
                <h3
                  className={`font-semibold text-gray-900 line-clamp-1 ${viewMode === "grid" ? "text-xs sm:text-base" : "text-sm sm:text-lg mb-1"}`}
                >
                  {service.name}
                </h3>
                <span
                  className={`text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full w-fit ${
                    service.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  } ${viewMode === "list" ? "mb-1 block" : ""}`}
                >
                  {service.status}
                </span>
                {viewMode === "list" && (
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-0">
                    {service.category}
                  </p>
                )}
              </div>
              {viewMode === "grid" && (
                <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
                  {service.category}
                </p>
              )}

              <div
                className={
                  viewMode === "grid"
                    ? "flex flex-wrap items-center gap-x-2 gap-y-1 mt-auto"
                    : "flex-1 sm:w-1/3 flex flex-col sm:justify-center"
                }
              >
                {viewMode === "list" && (
                  <span className="text-[10px] text-gray-400 mb-0.5">
                    Price
                  </span>
                )}
                <span
                  className={`font-bold text-gray-900 ${viewMode === "grid" ? "text-sm sm:text-lg" : "text-base sm:text-xl"}`}
                >
                  {service.price}
                </span>
              </div>

              {viewMode === "list" && (
                <div className="flex-1 sm:w-1/3 flex flex-col sm:justify-center">
                  <span className="text-[10px] text-gray-400 mb-0.5">
                    Stats
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] sm:text-sm text-gray-700 flex items-center gap-1 font-medium">
                      <Star
                        size={12}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      {service.rating}
                    </span>
                    <span className="text-[11px] sm:text-sm text-gray-700 font-medium">
                      {service.bookings} bkgs
                    </span>
                  </div>
                </div>
              )}
            </div>

            {viewMode === "grid" && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-auto">
                <span className="hidden text-[10px] sm:text-xs text-gray-500 items-center gap-0.5">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  {service.rating}
                </span>
                <span className="hidden text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                  {service.bookings} bookings
                </span>
              </div>
            )}

            <div
              className={`flex gap-1.5 sm:gap-2 ${viewMode === "grid" ? "pt-3 border-t border-gray-100 mt-auto" : "flex-row sm:flex-col sm:w-28 shrink-0 justify-center"}`}
            >
              <button
                onClick={() => startEditing(service)}
                className={`flex items-center justify-center px-1.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                  editingService === service.id
                    ? "bg-(--color-primary) text-white border-(--color-primary)"
                    : "border-gray-200 hover:bg-gray-50"
                } ${viewMode === "grid" ? "flex-1" : "w-full flex-1 sm:flex-none"}`}
              >
                {editingService === service.id ? "Close" : "Edit"}
              </button>
              <button
                onClick={() => handlePauseResume(service.id)}
                className={`flex items-center justify-center px-1.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                  service.status === "active"
                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                } ${viewMode === "grid" ? "flex-1" : "w-full flex-1 sm:flex-none"}`}
              >
                {service.status === "active" ? "Pause" : "Resume"}
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className={`flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-lg cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${viewMode === "list" ? "flex-1 sm:flex-none" : ""}`}
                title="Delete"
              >
                <Trash2
                  size={14}
                  className={viewMode === "grid" ? "sm:hidden" : "sm:hidden"}
                />
                <span
                  className={
                    viewMode === "grid"
                      ? "hidden sm:inline"
                      : "hidden sm:inline"
                  }
                >
                  Delete
                </span>
              </button>
            </div>

            {/* Edit Form (inline) — controlled */}
            {editingService === service.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-slideDown">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Price
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[5000, 10000, 15000, 20000, 30000, 50000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEditPrice(String(amt))}
                          className={`px-2.5 py-1.5 text-[10px] font-medium border rounded-full transition-colors ${
                            editPrice === String(amt)
                              ? "border-(--color-primary) text-(--color-primary) bg-(--color-primary-light)"
                              : "border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary) hover:bg-(--color-primary-light)"
                          }`}
                        >
                          ₦{amt / 1000}k
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="Custom"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-16 px-2 py-1.5 bg-gray-50 rounded-full text-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-(--color-primary)"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Construction">Construction</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Painting">Painting</option>
                    <option value="Moving">Moving</option>
                    <option value="Gardening">Gardening</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(service.id)}
                    className="px-4 py-2 text-xs font-semibold bg-(--color-primary) text-white rounded-full hover:opacity-90 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {search
                ? "No services match your search."
                : "No services listed yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
