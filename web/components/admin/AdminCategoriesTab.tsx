"use client";
import { useNotification } from "@/context/NotificationContext";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

// ============================================
// ============================================
// ADMIN CATEGORIES TAB
// ============================================
export default function AdminCategoriesTab() {
  const { addToast } = useNotification();
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [categories, setCategories] = useState([
    {
      id: "cat1",
      name: "Home Cleaning",
      services: 45,
      providers: 23,
      status: "active" as const,
    },
    {
      id: "cat2",
      name: "Plumbing & Pipe Fitting",
      services: 32,
      providers: 18,
      status: "active" as const,
    },
    {
      id: "cat3",
      name: "Electrical Work",
      services: 28,
      providers: 15,
      status: "active" as const,
    },
    {
      id: "cat4",
      name: "Beauty & Spa",
      services: 38,
      providers: 20,
      status: "active" as const,
    },
    {
      id: "cat5",
      name: "Painting & Decoration",
      services: 22,
      providers: 12,
      status: "active" as const,
    },
    {
      id: "cat6",
      name: "Carpentry",
      services: 18,
      providers: 10,
      status: "active" as const,
    },
    {
      id: "cat7",
      name: "Auto Repair",
      services: 15,
      providers: 8,
      status: "inactive" as const,
    },
    {
      id: "cat8",
      name: "Moving & Logistics",
      services: 12,
      providers: 6,
      status: "active" as const,
    },
  ]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories((prev) => [
      ...prev,
      {
        id: `cat${Date.now()}`,
        name: newCatName.trim(),
        services: 0,
        providers: 0,
        status: "active" as const,
      },
    ]);
    addToast({
      type: "success",
      title: "✅ Category Added",
      message: `"${newCatName}" has been created.`,
    });
    setNewCatName("");
    setShowAddForm(false);
  };

  const toggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status:
                c.status === "active"
                  ? ("inactive" as const)
                  : ("active" as const),
            }
          : c,
      ),
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-full text-md font-semibold hover:bg-purple-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Category Name
            </label>
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              placeholder="e.g. Landscaping"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button
            onClick={handleAddCategory}
            disabled={!newCatName.trim()}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      )}

      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5  bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cat.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
              >
                {cat.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span>{cat.services} services</span>
              <span>{cat.providers} providers</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleStatus(cat.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                  cat.status === "active"
                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {cat.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => {
                  setCategories((prev) => prev.filter((c) => c.id !== cat.id));
                  addToast({
                    type: "error",
                    title: "🗑 Category Removed",
                    message: `"${cat.name}" has been deleted.`,
                  });
                }}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No categories match your search.
        </div>
      )}
    </div>
  );
}
