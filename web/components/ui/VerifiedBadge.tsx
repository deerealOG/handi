"use client";

import { BadgeCheck, ShieldCheck, Store, Crown } from "lucide-react";
import { useState } from "react";

type BadgeType = "verified" | "official" | "premium" | "certified";

interface VerifiedBadgeProps {
  type?: BadgeType;
  label?: string;
  size?: number;
  className?: string;
}

const BADGE_CONFIG: Record<BadgeType, {
  icon: typeof BadgeCheck;
  color: string;
  bg: string;
  tooltip: string;
}> = {
  verified: {
    icon: BadgeCheck,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    tooltip: "Verified — Identity confirmed by HANDI",
  },
  official: {
    icon: Store,
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    tooltip: "Official Partner — Authorized brand partner",
  },
  premium: {
    icon: Crown,
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
    tooltip: "Premium — Top-rated with excellent track record",
  },
  certified: {
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-50 border-purple-200",
    tooltip: "Certified — Professional credentials verified",
  },
};

/**
 * Shows a compact verified icon that reveals details on hover/click.
 * Use instead of plain text "Verified" badges throughout the platform.
 *
 * Usage: <VerifiedBadge type="verified" />
 *        <VerifiedBadge type="official" />
 *        <VerifiedBadge type="premium" />
 *        <VerifiedBadge type="certified" />
 */
export default function VerifiedBadge({
  type = "verified",
  label,
  size = 16,
  className = "",
}: VerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
    >
      <Icon
        size={size}
        className={`${config.color} fill-current cursor-pointer shrink-0`}
        aria-label={config.tooltip}
      />
      {label && (
        <span className={`text-[10px] font-semibold ml-1 ${config.color}`}>
          {label}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap z-50 shadow-lg ${config.bg}`}
          role="tooltip"
        >
          <div className={`text-gray-800 flex items-center gap-1.5`}>
            <Icon size={14} className={config.color} />
            {config.tooltip}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -translate-y-1" />
          </div>
        </div>
      )}
    </span>
  );
}
