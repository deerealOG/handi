// ==============================================
// 🎨 HANDI COLOR PALETTE & THEME
// ==============================================

import { Platform } from "react-native";

// Platform-aware font families
const isWeb = Platform.OS === "web";

const FONT_FAMILIES = {
  heading: isWeb ? "'Red Hat Display', sans-serif" : "RedHatDisplay-Bold",
  subheading: isWeb
    ? "'Red Hat Display', sans-serif"
    : "RedHatDisplay-SemiBold",
  body: isWeb ? "'Roboto', sans-serif" : "Roboto-Regular",
  bodyMedium: isWeb ? "'Roboto', sans-serif" : "Roboto-Medium",
  bodyBold: isWeb ? "'Roboto', sans-serif" : "Roboto-Bold",
  bodyLight: isWeb ? "'Roboto', sans-serif" : "Roboto-Light",
};

// ==============================================
// 🎨 FULL COLOR PALETTE WITH LABELS
// ==============================================
export const PALETTE = {
  // Primary Green (HANDI Brand)
  primary: {
    50: "#F0FDF4", // Lightest Tint - Subtle backgrounds
    100: "#DCFCE7", // Light Tint - Hover states, badges
    200: "#BBF7D0", // Soft - Tag backgrounds, chips
    300: "#86EFAC", // Medium Light - Borders, dividers
    400: "#4ADE80", // Vibrant - Dark mode primary
    500: "#22C55E", // Bright - Success states
    600: "#16A34A", // Standard - Icons, links
    700: "#15803D", // Deep - Emphasis
    800: "#368951", // HANDI Primary (Light Mode) ← Brand Color
    900: "#14532D", // Dark - Pressed states
    950: "#052E16", // Darkest - High contrast text
  },

  // Secondary Gold (Accent)
  secondary: {
    50: "#FFFBEB", // Lightest Gold
    100: "#FEF3C7", // Light Gold - Badges
    200: "#FDE68A", // Soft Gold
    300: "#FCD34D", // Medium Gold
    400: "#FBBF24", // Vibrant Gold
    500: "#F59E0B", // Standard Gold
    600: "#9DB541", // HANDI Secondary ← Accent Color
    700: "#B45309", // Deep Gold
    800: "#92400E", // Dark Gold
    900: "#78350F", // Darkest Gold
  },

  // Neutral Grays
  neutral: {
    50: "#FAFAFA", // Page Background (alt)
    100: "#F4F5F7", // App Background ← Main BG
    200: "#E5E7EB", // Borders, dividers
    300: "#D1D5DB", // Disabled states
    400: "#9CA3AF", // Placeholder text
    500: "#6B7280", // Muted text ← Secondary text
    600: "#4B5563", // Body text
    700: "#374151", // Headings
    800: "#1F2937", // Primary text ← Main text
    900: "#111827", // High contrast
    950: "#030712", // Darkest
  },

  // Status Colors
  error: {
    50: "#FEF2F2", // Light error background
    100: "#FEE2E2", // Error badge bg
    500: "#EF4444", // Standard error
    600: "#DC2626", // Error text ← Main error
    700: "#B91C1C", // Dark error
  },

  success: {
    50: "#F0FDF4", // Light success background
    100: "#DCFCE7", // Success badge bg
    500: "#22C55E", // Standard success
    600: "#16A34A", // Success text ← Main success
    700: "#15803D", // Dark success
  },

  warning: {
    50: "#FFFBEB", // Light warning background
    100: "#FEF3C7", // Warning badge bg
    500: "#F59E0B", // Standard warning ← Main warning
    600: "#D97706", // Warning text
    700: "#B45309", // Dark warning
  },

  // Special
  star: "#FACC15", // Rating stars
  white: "#FFFFFF", // Pure white
  black: "#000000", // Pure black
};

// ==============================================
// 🎨 THEME CONFIGURATION
// ==============================================
export const THEME = {
  colors: {
    // Brand Colors
    primary: PALETTE.primary[800], // #368951 - HANDI Green
    primaryLight: PALETTE.primary[100], // Light green for backgrounds
    primaryDark: PALETTE.primary[900], // Dark green for pressed states
    secondary: PALETTE.secondary[600], // #9DB541 - Accent gold-green

    // Backgrounds
    background: PALETTE.neutral[100], // #F4F5F7 - App background
    surface: PALETTE.white, // #FFFFFF - Cards, containers
    surfaceElevated: PALETTE.neutral[50], // #FAFAFA - Elevated cards

    // Text
    text: PALETTE.neutral[800], // #1F2937 - Primary text
    muted: PALETTE.neutral[500], // #6B7280 - Secondary text
    placeholder: PALETTE.neutral[400], // #9CA3AF - Placeholder

    // Borders
    border: PALETTE.neutral[200], // #E5E7EB - Standard border
    borderLight: PALETTE.neutral[300], // #D1D5DB - Light border

    // Overlays
    overlay: "rgba(0, 0, 0, 0.45)", // Modal overlay

    // Status Colors
    error: PALETTE.error[600], // #DC2626
    errorLight: PALETTE.error[100], // Light error bg
    success: PALETTE.success[600], // #16A34A
    successLight: PALETTE.success[100], // Light success bg
    warning: PALETTE.warning[500], // #F59E0B
    warningLight: PALETTE.warning[100], // Light warning bg
    star: PALETTE.star, // #FACC15

    // Input Fields - No primary tint, clean white
    inputBackground: PALETTE.white, // Clean white input background
    inputBorder: PALETTE.neutral[200], // Standard gray border
    inputFocusBorder: PALETTE.primary[800], // Primary on focus

    // Dashboard Role Colors
    client: PALETTE.primary[800], // Green for clients
    artisan: "#3B82F6", // Blue for artisans/providers
    business: "#8B5CF6", // Purple for business
    admin: "#EF4444", // Red for admin
  },

  typography: {
    fontFamily: FONT_FAMILIES,
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
    lineHeights: {
      compact: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tighter: -0.5,
      tight: -0.25,
      normal: 0,
      wide: 0.5,
      wider: 1.0,
    },
  },

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    full:50,
    pill: 9999,
  },

  shadow: {
    base: {
      shadowColor: PALETTE.neutral[900],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    card: {
      shadowColor: PALETTE.neutral[900],
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    float: {
      shadowColor: PALETTE.neutral[900],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  palette: PALETTE,
};

// ==============================================
// 🌙 LIGHT & DARK MODE COLORS
// ==============================================
export const Colors = {
  light: {
    ...THEME.colors,
    tint: THEME.colors.primary,
    icon: THEME.colors.muted,
    tabIconDefault: THEME.colors.muted,
    tabIconSelected: THEME.colors.primary,
    onPrimary: PALETTE.white,
  },
  dark: {
    // Brand Colors (Brighter for dark bg)
    primary: PALETTE.primary[400], // #4ADE80 - Vibrant green
    primaryLight: "rgba(74, 222, 128, 0.18)",
    primaryDark: PALETTE.primary[500], // #22C55E
    secondary: "#FFC857", // Warm gold

    // Backgrounds — slightly lifted for better card contrast
    background: "#0A0A0A", // Near-black but not pure (avoids OLED banding)
    surface: "#1A1A1A", // Visible card separation from bg
    surfaceElevated: "#242424", // Distinct elevated surfaces

    // Text — bright enough to stand out
    text: "#F5F5F5", // Slightly off-white (easier on eyes than pure white)
    muted: "#A8A8A8", // Brighter secondary text
    placeholder: "#777777", // Visible placeholder

    // Borders — more visible
    border: "#2E2E2E", // Visible against surface
    borderLight: "#3A3A3A", // Clearly visible dividers

    // Overlay
    overlay: "rgba(0, 0, 0, 0.85)",

    // Status Colors (brighter for dark bg)
    error: "#FF6B6B",
    errorLight: "rgba(255, 107, 107, 0.18)",
    success: PALETTE.primary[400],
    successLight: "rgba(74, 222, 128, 0.18)",
    warning: "#FBBF24",
    warningLight: "rgba(251, 191, 36, 0.18)",
    star: PALETTE.star,

    // Input Fields — more visible
    inputBackground: "rgba(255, 255, 255, 0.08)",
    inputBorder: "#3A3A3A",
    inputFocusBorder: PALETTE.primary[400],

    // Dashboard Role Colors
    client: PALETTE.primary[400],
    artisan: "#60A5FA", // Lighter blue
    business: "#A78BFA", // Lighter purple
    admin: "#F87171", // Lighter red

    // System
    tint: PALETTE.primary[400],
    icon: "#999999",
    tabIconDefault: "#777777",
    tabIconSelected: PALETTE.primary[400],
    onPrimary: PALETTE.black,
  },
};
