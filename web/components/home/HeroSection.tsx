"use client";

import { CATEGORY_IMAGES, HERO_SLIDES } from "@/data/landingData";
import { SERVICE_CATEGORIES } from "@/data/mockApi";
import {
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Menu,
    Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface HeroSectionProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  router: any;
}

export default function HeroSection({
  selectedCategory,
  setSelectedCategory,
  router,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroHover, setHeroHover] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-4">
        {/* LEFT SIDEBAR */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <Menu size={16} className="text-gray-600" />
              <span className="font-semibold text-sm text-gray-900">
                Top Categories
              </span>
            </div>
            <nav className="divide-y divide-gray-50">
              {SERVICE_CATEGORIES.slice(0, 7).map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id,
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                    selectedCategory === category.id
                      ? "bg-(--color-primary-light) text-(--color-primary) font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={
                        CATEGORY_IMAGES[category.id] ||
                        "/images/categories/electrical.jpg"
                      }
                      alt={category.label}
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="truncate">{category.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* CENTER - Hero Slider */}
        <div className="flex-1 min-w-0">
          {/* Mobile Search Bar */}
          <div className="lg:hidden mb-4 relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services, providers..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  router.push(
                    `/services?q=${encodeURIComponent(e.currentTarget.value.trim())}`,
                  );
                }
              }}
              className="w-full pl-10 pr-4 py-3 bg-white shadow-sm rounded-full text-sm outline-none border border-gray-100 focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          {/* Mobile Category Toggle */}
          <div className="lg:hidden hidden mb-4">
            <button
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              className="w-full flex items-center justify-between bg-white rounded-full shadow-sm px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Menu size={18} className="text-(--color-primary)" />
                <span className="font-medium text-gray-900 text-sm">
                  {selectedCategory
                    ? SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)
                        ?.label
                    : "All Categories"}
                </span>
              </div>
              {showMobileCategories ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {showMobileCategories && (
              <div className="mt-2 bg-white rounded-xl shadow-sm max-h-64 overflow-y-auto">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === cat.id ? null : cat.id,
                      );
                      setShowMobileCategories(false);
                    }}
                    className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm border-b border-gray-50 ${
                      selectedCategory === cat.id
                        ? "bg-(--color-primary-light) text-(--color-primary) font-medium"
                        : ""
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={
                          CATEGORY_IMAGES[cat.id] ||
                          "/images/categories/electrical.jpg"
                        }
                        alt={cat.label}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hero Slider */}
          <div
            className="relative rounded-xl overflow-hidden shadow-lg group"
            onMouseEnter={() => setHeroHover(true)}
            onMouseLeave={() => setHeroHover(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {HERO_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`min-w-full  h-[385px] bg-linear-to-r ${slide.bg} flex flex-col md:flex-row items-center`}
                >
                  <div className="flex-1 p-8 md:p-10 lg:p-16 flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-xl md:text-4xl font-bold text-white mb-3 leading-tight whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="text-white/90 mb-6 max-w-md text-sm">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.href}
                      className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors mx-auto md:mx-0"
                    >
                      {slide.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className="md:flex md:w-64 lg:w-120 lg:h-full h-full items-end justify-center relative">
                    <div className="w-full md:h-50 lg:h-full lg:w-full h-full bg-linear-to-b from-white/10 to-transparent rounded-t-full flex flex-col relative top-0 lg:top-10">
                      <Image
                        src={slide.img}
                        alt="Hero"
                        width={480}
                        height={480}
                        className="w-full lg:h-full lg:w-full h-50 object-contain"
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hover Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity duration-300 ${
                heroHover ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity duration-300 ${
                heroHover ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronRight size={22} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
