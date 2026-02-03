import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BenefitsSection from "@/components/sections/BenefitsSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";
import HeroSection from "@/components/sections/HeroSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ReadySection from "@/components/sections/ReadySection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <Navbar activeTab="home" />
      <HeroSection />
      <CategoriesSection />
      <ReadySection />
      <BenefitsSection />
      <NewsletterSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
