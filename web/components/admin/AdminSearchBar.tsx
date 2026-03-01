"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface AdminSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  className?: string;
}

export default function AdminSearchBar({
  placeholder = "Search...",
  value,
  onChange,
  filters,
  activeFilter = "all",
  onFilterChange,
  className = "",
}: AdminSearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
          >
            <X size={14} className="text-gray-400" />
          </button>
        )}
        {filters && filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
              showFilters || activeFilter !== "all"
                ? "bg-purple-100 text-purple-600"
                : "hover:bg-gray-200 text-gray-400"
            }`}
          >
            <SlidersHorizontal size={14} />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      {filters && (showFilters || activeFilter !== "all") && (
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange?.(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f.id
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
              {f.count !== undefined && (
                <span
                  className={`ml-1.5 ${
                    activeFilter === f.id ? "text-purple-200" : "text-gray-400"
                  }`}
                >
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
