// ==============================================
// 🎨 SHARED THEME - Platform Independent
// ==============================================

// Color palette - matches mobile app exactly
export const PALETTE = {
  primary: {
    50: "#F2F9F5",
    100: "#E1F2E8",
    200: "#C3E7D2",
    300: "#94D6B3",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#1B7F49",
    800: "#245E37", // Light mode primary
    900: "#1D4B30",
    950: "#0F291A",
  },
};

export const COLORS = {
  primary: PALETTE.primary[800], // #245E37 - HANDI brand emerald green
  primaryDark: PALETTE.primary[900],
  secondary: "#9db541", // Warm gold accent

  background: "#F4F5F7",
  surface: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E5E7EB",
  overlay: "rgba(0,0,0,0.45)",

  error: "#DC2626",
  success: "#16A34A",
  warning: "#F59E0B",
  star: "#FACC15",
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};

export const TYPOGRAPHY = {
  sizes: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 38,
  },
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999,
};

// CSS custom properties for Tailwind
export const CSS_VARS = {
  "--color-primary": COLORS.primary,
  "--color-primary-dark": COLORS.primaryDark,
  "--color-secondary": COLORS.secondary,
  "--color-background": COLORS.background,
  "--color-surface": COLORS.surface,
  "--color-text": COLORS.text,
  "--color-muted": COLORS.muted,
  "--color-border": COLORS.border,
  "--color-error": COLORS.error,
  "--color-success": COLORS.success,
  "--color-warning": COLORS.warning,
  "--color-star": COLORS.star,
};
