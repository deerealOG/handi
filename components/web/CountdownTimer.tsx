// components/web/CountdownTimer.tsx
// Launch countdown timer for HANDI - March 15, 2026

import { Colors, THEME } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface CountdownTimerProps {
  variant?: "hero" | "footer";
}

const LAUNCH_DATE = new Date("2026-03-15T00:00:00");

export default function CountdownTimer({
  variant = "hero",
}: CountdownTimerProps) {
  const colors = Colors.light;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isFooter = variant === "footer";

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <View
      style={[
        styles.timeBox,
        isFooter && styles.timeBoxFooter,
        {
          backgroundColor: isFooter ? "rgba(255,255,255,0.1)" : colors.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.timeValue,
          isFooter && styles.timeValueFooter,
          { color: isFooter ? "#FACC15" : "#FFFFFF" },
        ]}
      >
        {String(value).padStart(2, "0")}
      </Text>
      <Text
        style={[
          styles.timeLabel,
          isFooter && styles.timeLabelFooter,
          { color: isFooter ? "#FFFFFF" : "rgba(255,255,255,0.9)" },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  const Separator = () => (
    <Text
      style={[
        styles.separator,
        isFooter && styles.separatorFooter,
        { color: isFooter ? "#FFFFFF" : colors.primary },
      ]}
    >
      :
    </Text>
  );

  return (
    <View style={[styles.container, isFooter && styles.containerFooter]}>
      {!isFooter && (
        <>
          <Text style={[styles.launchTitle, { color: colors.primary }]}>
            🚀 Launching Soon!
          </Text>
          <Text style={[styles.launchDate, { color: colors.text }]}>
            March 15, 2026
          </Text>
        </>
      )}

      {isFooter && (
        <Text style={styles.footerTitle}>🚀 Launching March 15, 2026</Text>
      )}

      <View style={[styles.timerRow, isFooter && styles.timerRowFooter]}>
        <TimeBox value={timeLeft.days} label="Days" />
        <Separator />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <Separator />
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <Separator />
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </View>

      {!isFooter && (
        <Text style={[styles.tagline, { color: colors.muted }]}>
          Be the first to experience HANDI - Nigeria&apos;s premier service platform
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: "#FFFFFF",
  },
  containerFooter: {
    paddingVertical: THEME.spacing.lg,
    backgroundColor: "transparent",
  },
  launchTitle: {
    fontSize: Platform.OS === "web" ? 28 : 22,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  launchDate: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  footerTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: "#FACC15",
    marginBottom: THEME.spacing.md,
    textAlign: "center",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.xs,
  },
  timerRowFooter: {
    gap: THEME.spacing.xs,
  },
  timeBox: {
    minWidth: Platform.OS === "web" ? 80 : 65,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: "center",
  },
  timeBoxFooter: {
    minWidth: 50,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.sm,
  },
  timeValue: {
    fontSize: Platform.OS === "web" ? 32 : 24,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  timeValueFooter: {
    fontSize: 18,
  },
  timeLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  timeLabelFooter: {
    fontSize: 10,
  },
  separator: {
    fontSize: 28,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  separatorFooter: {
    fontSize: 18,
  },
  tagline: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.xl,
    textAlign: "center",
    maxWidth: 400,
    lineHeight: 24,
  },
});
