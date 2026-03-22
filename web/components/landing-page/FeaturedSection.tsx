// FeaturedSection — Composes all split sections for backward compatibility
"use client";

import CategoriesSection from "./CategoriesSection";
import FlashDealsSection from "./FlashDealsSection";
import PromoSection from "./PromoSection";
import RecommendedServicesSection from "./RecommendedServicesSection";
import TrendingProductsSection from "./TrendingProductsSection";

interface FeaturedSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
}

export default function FeaturedSection({ }: FeaturedSectionProps) {
  return (
    <>
      <RecommendedServicesSection />
      <TrendingProductsSection />
      <FlashDealsSection />
      <PromoSection />
      <CategoriesSection />
    </>
  );
}
