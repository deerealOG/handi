"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  variant?: "hero" | "footer";
}

const LAUNCH_DATE = new Date("2026-03-15T00:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const difference = LAUNCH_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function CountdownTimer({
  variant = "hero",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isFooter = variant === "footer";

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div
      className={`flex flex-col items-center rounded-xl ${
        isFooter
          ? "bg-white/10 px-3 py-2 min-w-[50px]"
          : "bg-[var(--color-primary)] px-4 py-3 min-w-[80px]"
      }`}
    >
      <span
        className={`font-heading font-bold ${
          isFooter ? "text-lg text-yellow-400" : "text-3xl text-white"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className={`uppercase tracking-wider ${
          isFooter ? "text-[10px] text-white" : "text-xs text-white/90"
        }`}
      >
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <span
      className={`font-heading font-bold ${
        isFooter ? "text-lg text-white" : "text-2xl text-[var(--color-primary)]"
      }`}
    >
      :
    </span>
  );

  if (isFooter) {
    return (
      <div className="flex flex-col items-center py-6">
        <p className="text-yellow-400 font-semibold mb-4">
          🚀 Launching March 15, 2026
        </p>
        <div className="flex items-center gap-1">
          <TimeBox value={timeLeft.days} label="Days" />
          <Separator />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <Separator />
          <TimeBox value={timeLeft.minutes} label="Mins" />
          <Separator />
          <TimeBox value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12 px-6 bg-white">
      <h2 className="text-2xl lg:text-3xl font-heading text-[var(--color-primary)] mb-1">
        🚀 Launching Soon!
      </h2>
      <p className="text-lg font-semibold text-[var(--color-text)] mb-8">
        March 15, 2026
      </p>

      <div className="flex items-center gap-2">
        <TimeBox value={timeLeft.days} label="Days" />
        <Separator />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <Separator />
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>

      <p className="text-[var(--color-muted)] text-center mt-8 max-w-md">
        Be the first to experience HANDI - Nigeria&apos;s premier service
        platform
      </p>
    </div>
  );
}
