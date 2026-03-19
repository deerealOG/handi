"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    if (!pathname || pathname === "/") return [];

    const segments = pathname.split("/").filter((v) => v.length > 0);

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      let label = segment.replace(/-/g, " ");
      label = label.replace(/\b\w/g, (c) => c.toUpperCase());

      // Try to gracefully handle UUIDs/long hashes
      if (segment.length > 20 || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(segment)) {
        label = "Details";
      }

      return {
        label,
        href: index === segments.length - 1 ? undefined : href,
      };
    });
  };

  const activeItems = items || generateBreadcrumbs();

  if (activeItems.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-100 py-3 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link
            href="/"
            className="flex justify-center items-center hover:text-blue-600 transition-colors pr-1"
            aria-label="Home"
          >
            <Home size={14} className="mb-0.5" />
          </Link>

          {activeItems.map((item, index) => {
            const isLast = index === activeItems.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight size={14} className="mx-2 mt-0.5 text-gray-400 shrink-0" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors max-w-[120px] sm:max-w-none truncate"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`truncate ${isLast ? "text-gray-900 font-semibold max-w-[150px] sm:max-w-none" : "max-w-[120px] sm:max-w-none"}`}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
