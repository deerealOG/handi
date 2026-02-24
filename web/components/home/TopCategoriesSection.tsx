"use client";

import Image from "next/image";
import Link from "next/link";

type TopCategoryProvider = {
  name: string;
  category: string;
  img: string;
};

type TopCategoriesSectionProps = {
  topCategoryProviders: TopCategoryProvider[];
};

export default function TopCategoriesSection({
  topCategoryProviders,
}: TopCategoriesSectionProps) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {topCategoryProviders.map((provider, i) => (
            <Link
              key={i}
              href={`/services?category=${encodeURIComponent(provider.category)}`}
              className="group flex flex-col sm:flex-row items-center gap-3 sm:gap-4 hover:bg-gray-100 transition-colors px-4 py-4 rounded-lg"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all rounded-full shrink-0 order-first sm:order-last">
                <Image
                  src={provider.img}
                  alt={provider.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                  {provider.name}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                  {provider.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
