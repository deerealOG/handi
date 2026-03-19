"use client";

import { useEffect, useRef, useState, RefObject } from "react";

/**
 * Custom hook that adds scroll-reveal animation to elements.
 * Elements fade/slide in from the specified direction as they enter the viewport.
 *
 * Usage:
 *   const ref = useScrollReveal<HTMLDivElement>("up", 0.15);
 *   <div ref={ref} className="scroll-reveal"> ... </div>
 *
 * Directions: "up" | "down" | "left" | "right" | "fade"
 */
export type RevealDirection = "up" | "down" | "left" | "right" | "fade";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  direction: RevealDirection = "up",
  delay: number = 0
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply initial hidden styles
    if (!isVisible) {
      el.style.opacity = "0";
      switch (direction) {
        case "up": el.style.transform = "translateY(40px)"; break;
        case "down": el.style.transform = "translateY(-40px)"; break;
        case "left": el.style.transform = "translateX(40px)"; break;
        case "right": el.style.transform = "translateX(-40px)"; break;
        case "fade": el.style.transform = "scale(0.95)"; break;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Apply animation
          el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0) translateX(0) scale(1)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "50px" } // Increased margin so it triggers earlier
    );

    observer.observe(el);

    // Failsafe: if the observer fails or user scrolls too fast, show content after 2s
    const fallbackTimeout = setTimeout(() => {
      if (!isVisible && el) {
        setIsVisible(true);
        el.style.transition = "opacity 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, [direction, delay, isVisible]);

  return ref;
}

/**
 * Wrapper component for scroll-reveal on children.
 * Use when you can't easily pass a ref.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
}) {
  const ref = useScrollReveal<HTMLDivElement>(direction, delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
