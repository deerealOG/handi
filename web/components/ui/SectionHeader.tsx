import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  centered?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  linkText,
  linkHref,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-6 ${centered ? "flex-col text-center gap-2" : ""}`}
    >
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {linkText && linkHref && !centered && (
        <Link
          href={linkHref}
          className="flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm hover:underline"
        >
          {linkText}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
