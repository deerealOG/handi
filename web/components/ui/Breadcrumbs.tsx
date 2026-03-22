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
    <div className="w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap hide-scrollbar gap-1"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-(--color-primary) dark:hover:text-(--color-primary) transition-colors shrink-0"
            aria-label="Home"
          >
            <Home size={14} />
          </Link>

          {activeItems.map((item, index) => {
            const isLast = index === activeItems.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight size={12} className="text-gray-400 dark:text-gray-500 shrink-0 mx-0.5" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 dark:text-gray-400 hover:text-(--color-primary) dark:hover:text-(--color-primary) transition-colors truncate max-w-[140px] sm:max-w-none"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`truncate ${isLast ? "text-gray-900 dark:text-white font-semibold max-w-[180px] sm:max-w-none" : "max-w-[140px] sm:max-w-none"}`}
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
