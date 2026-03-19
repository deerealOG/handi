"use client";

import { MapPin, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "toggle" | "range";
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  /** Current search location shown as a default pill */
  currentLocation?: string;
  /** Search input — FilterBar wraps it to add the filter icon inside */
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

/**
 * Search bar with integrated filter icon + dropdown panel + active filter pills.
 * The filter icon sits inside the search bar (like Navbar).
 * Active filters and current location are shown as pills below.
 */
export default function FilterBar({
  fields,
  values,
  onChange,
  onClear,
  currentLocation,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const locationField = fields.find((f) => f.key === "location");

  const activeFilters = Object.entries(values).filter(
    ([k, v]) => v && k !== "location",
  );
  const activeCount = activeFilters.length + (values.location ? 1 : 0);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setLocationOpen(false);
      }
    }
    if (open || locationOpen) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [open, locationOpen]);

  // Label for active filter tag
  const getLabel = (key: string, val: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return val;
    if (field.type === "toggle") return field.label;
    if (field.type === "range") {
      if (key.endsWith("_min")) return `Min: ₦${Number(val).toLocaleString()}`;
      if (key.endsWith("_max")) return `Max: ₦${Number(val).toLocaleString()}`;
    }
    const opt = field.options?.find((o) => o.value === val);
    return `${field.label}: ${opt?.label || val}`;
  };

  const displayLocation = values.location || currentLocation || "";

  return (
    <div ref={panelRef} className="relative space-y-2">
      {/* ── Search bar with filter icon inside ── */}
      <div className="relative flex items-center">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent shadow-sm"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors cursor-pointer ${
            open || activeCount > 0
              ? "text-(--color-primary) bg-(--color-primary-light)"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
          title="Filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* ── Active filter pills + location pill ── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Location pill — clickable to change */}
        {(displayLocation || locationField) && (
          <div className="relative">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full cursor-pointer transition-colors ${
                values.location
                  ? "bg-(--color-primary-light) text-(--color-primary)"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MapPin size={10} />
              {displayLocation || "Set Location"}
              <svg
                width="8"
                height="8"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>
            {locationOpen && locationField?.options && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[140px] animate-fadeIn">
                {currentLocation && (
                  <button
                    onClick={() => {
                      onChange("location", "");
                      setLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer ${
                      !values.location
                        ? "text-(--color-primary) font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    📍 {currentLocation} (Your Location)
                  </button>
                )}
                {locationField.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange("location", opt.value);
                      setLocationOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer ${
                      values.location === opt.value
                        ? "text-(--color-primary) font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active filter tags */}
        {activeFilters.map(([key, val]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-(--color-primary-light) text-(--color-primary) text-[11px] font-medium rounded-full"
          >
            {getLabel(key, val)}
            <button
              onClick={() => onChange(key, "")}
              className="hover:bg-(--color-primary)/10 rounded-full p-0.5 cursor-pointer"
            >
              <X size={9} />
            </button>
          </span>
        ))}

        {/* Clear all if multiple active */}
        {activeCount > 1 && (
          <button
            onClick={onClear}
            className="text-[11px] text-red-500 font-medium hover:underline cursor-pointer px-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Dropdown filter panel ── */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-900">
              <SlidersHorizontal size={16} />
              <span className="font-semibold text-sm">Filter & Sort</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {field.label}
                </label>

                {field.type === "select" && (
                  <select
                    value={values[field.key] || ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent cursor-pointer"
                  >
                    <option value="">
                      {field.placeholder || `All ${field.label}`}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "toggle" && (
                  <button
                    onClick={() =>
                      onChange(field.key, values[field.key] ? "" : "true")
                    }
                    className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-colors cursor-pointer ${
                      values[field.key]
                        ? "bg-(--color-primary-light) border-(--color-primary) text-(--color-primary)"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {values[field.key] ? "✓ " : ""}
                    {field.placeholder || `${field.label} Only`}
                  </button>
                )}

                {field.type === "range" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={values[`${field.key}_min`] || ""}
                      onChange={(e) =>
                        onChange(`${field.key}_min`, e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                    <span className="text-gray-400 text-xs shrink-0">–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={values[`${field.key}_max`] || ""}
                      onChange={(e) =>
                        onChange(`${field.key}_max`, e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 bg-(--color-primary) text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
