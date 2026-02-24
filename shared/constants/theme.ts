// ==============================================
// 🎨 HANDI SHARED COLOR PALETTE
// Web-compatible version (no React Native dependencies)
// ==============================================

// Full Color Palette with Labels
export const PALETTE = {
  // Primary Green (HANDI Brand)
  primary: {
    50: "#F0FDF4", // Lightest Tint
    100: "#DCFCE7", // Light Tint
    200: "#BBF7D0", // Soft
    300: "#86EFAC", // Medium Light
    400: "#4ADE80", // Vibrant (Dark Mode)
    500: "#22C55E", // Bright
    600: "#16A34A", // Standard
    700: "#15803D", // Deep
    800: "#368951", // HANDI Primary ← Brand Color
    900: "#14532D", // Dark
    950: "#052E16", // Darkest
  },

  // Secondary Gold (Accent)
  secondary: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#9DB541", // HANDI Secondary ← Accent
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Neutral Grays
  neutral: {
    50: "#FAFAFA", // Alt Background
    100: "#F4F5F7", // App Background
    200: "#E5E7EB", // Borders
    300: "#D1D5DB", // Disabled
    400: "#9CA3AF", // Placeholder
    500: "#6B7280", // Muted Text
    600: "#4B5563", // Body Text
    700: "#374151", // Headings
    800: "#1F2937", // Primary Text
    900: "#111827", // High Contrast
    950: "#030712", // Darkest
  },

  // Status Colors
  error: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
  },

  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
  },

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },

  // Special
  star: "#FACC15",
  white: "#FFFFFF",
  black: "#000000",
};

// Theme Colors
export const THEME_COLORS = {
  primary: PALETTE.primary[800], // #368951
  primaryLight: PALETTE.primary[100],
  primaryDark: PALETTE.primary[900],
  secondary: PALETTE.secondary[600], // #9DB541

  background: PALETTE.neutral[100],
  surface: PALETTE.white,
  text: PALETTE.neutral[800],
  muted: PALETTE.neutral[500],
  border: PALETTE.neutral[200],

  error: PALETTE.error[600],
  success: PALETTE.success[600],
  warning: PALETTE.warning[500],
  star: PALETTE.star,

  // Role Colors
  client: PALETTE.primary[800],
  artisan: "#3B82F6",
  business: "#8B5CF6",
  admin: "#EF4444",
};

// Web CSS Variables mapping
export const CSS_VARIABLES = {
  "--color-primary": THEME_COLORS.primary,
  "--color-primary-light": THEME_COLORS.primaryLight,
  "--color-primary-dark": THEME_COLORS.primaryDark,
  "--color-secondary": THEME_COLORS.secondary,
  "--color-background": THEME_COLORS.background,
  "--color-surface": THEME_COLORS.surface,
  "--color-text": THEME_COLORS.text,
  "--color-muted": THEME_COLORS.muted,
  "--color-border": THEME_COLORS.border,
  "--color-error": THEME_COLORS.error,
  "--color-success": THEME_COLORS.success,
  "--color-warning": THEME_COLORS.warning,
  "--color-star": THEME_COLORS.star,
};
