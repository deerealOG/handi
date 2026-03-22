"use client";

import { useEffect, useRef, RefObject } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "fade";

/**
 * Custom hook: scroll-reveal animation that fires ONCE.
 * Uses IntersectionObserver — when element enters viewport the first time,
 * it fades/slides in, then never re-animates (even on scroll back up).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  direction: RevealDirection = "up",
  delay: number = 0
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    // Set initial hidden state
    el.style.opacity = "0";
    el.style.willChange = "opacity, transform";
    switch (direction) {
      case "up": el.style.transform = "translateY(40px)"; break;
      case "down": el.style.transform = "translateY(-40px)"; break;
      case "left": el.style.transform = "translateX(40px)"; break;
      case "right": el.style.transform = "translateX(-40px)"; break;
      case "fade": el.style.transform = "scale(0.95)"; break;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0) translateX(0) scale(1)";
          // Clean up willChange after animation
          setTimeout(() => { el.style.willChange = "auto"; }, (delay + 0.8) * 1000);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(el);

    // Failsafe: force show after 3s if observer fails
    const fallback = setTimeout(() => {
      if (!hasAnimated.current && el) {
        hasAnimated.current = true;
        el.style.transition = "opacity 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [direction, delay]);

  return ref;
}

/**
 * Wrapper component for scroll-reveal on children.
 * Animates ONCE when it scrolls into view, then stays visible.
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
