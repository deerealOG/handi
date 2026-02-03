// ==============================================
// 🎨 DETAILED COLOR PALETTE
// ==============================================

import { Platform } from "react-native";

// Platform-aware font families
// On web, we use CSS font-family names
// On native, we use the Expo font names
const isWeb = Platform.OS === "web";

const FONT_FAMILIES = {
  heading: isWeb ? "'Red Hat Display', sans-serif" : "RedHatDisplay-Bold",
  subheading: isWeb
    ? "'Red Hat Display', sans-serif"
    : "RedHatDisplay-SemiBold",
  body: isWeb ? "'Roboto', sans-serif" : "Roboto-Regular",
  bodyMedium: isWeb ? "'Roboto', sans-serif" : "Roboto-Medium",
  bodyLight: isWeb ? "'Roboto', sans-serif" : "Roboto-Light",
};

export const PALETTE = {
  primary: {
    50: "#F2F9F5", // Very light tint (Backgrounds)
    100: "#E1F2E8", // Light background (Hover states)
    200: "#C3E7D2", // Soft background (Accents)
    300: "#94D6B3", // Borders / UI Elements
    400: "#4ADE80", // [Dark Mode] Primary Brand Color
    500: "#22C55E", // [Dark Mode] Primary Dark / Pressed
    600: "#16A34A", // Success / Vibrant Brand
    700: "#1B7F49", // Deep Green
    800: "#245E37", // [Light Mode] Primary Brand Color
    900: "#1D4B30", // [Light Mode] Primary Dark / Pressed
    950: "#0F291A", // Deepest Text / Contrast
  },
};
export const THEME = {
  // ================================
  // 🎨 COLOR PALETTE - HANDI Brand Colors
  // ================================
  colors: {
    primary: PALETTE.primary[800], // #3a8b55ff - HANDI brand emerald green
    primaryDark: PALETTE.primary[900], // #1D4B30 - Darker shade for pressed buttons
    secondary: "#9db541", // Warm gold accent — highlights, CTA contrast

    background: "#F4F5F7", // App background (light gray - more contrast)
    surface: "#FFFFFF", // Cards, modals, containers
    text: "#1F2937", // Primary text (dark neutral)
    muted: "#6B7280", // Secondary text, placeholders, captions
    border: "#E5E7EB", // Dividers, input borders
    overlay: "rgba(0,0,0,0.45)", // Semi-transparent modal overlay

    error: "#DC2626", // Error & alert color
    success: "#16A34A", // Success state (used for confirmations)

    inputBackground: PALETTE.primary[50] + "0D", // 5% opacity of primary
  },

  // ================================
  // TYPOGRAPHY
  // ================================
  typography: {
    fontFamily: FONT_FAMILIES,

    // Font Sizes - Restored to balanced scale
    sizes: {
      xxs: 10,
      xs: 12,
      sm: 14,
      base: 16,
      md: 18,
      lg: 20, // Reduced from 22 for better fit
      xl: 24, // Reduced from 28
      "2xl": 30, // Reduced from 34
      "3xl": 38, // Reduced from 42
    },

    // 📏 Line Heights — spacing within text blocks
    lineHeights: {
      compact: 1.2,
      normal: 1.5, // Reduced from 1.6 for tighter look
      relaxed: 1.75,
    },

    // Letter Spacing
    letterSpacing: {
      tighter: -0.5,
      tight: -0.25,
      normal: 0,
      wide: 0.5,
      wider: 1.0,
    },
  },

  // ================================
  // SPACING - Balanced White Space
  // ================================
  // Using a 4pt grid system, but with more generous default gaps
  spacing: {
    xxs: 2, // Minimal alignment adjustments
    xs: 4, // Tight grouping (text + icon)
    sm: 8, // Related elements (label + input)
    md: 16, // Standard component padding (Buttons, Inputs, Cards) - Was 12
    lg: 24, // Section separation / Container padding - Was 16/20
    xl: 32, // Major section breaks
    "2xl": 48, // Screen edges or hero spacing
    "3xl": 64, // Large vertical whitespace
  },

  // ================================
  // CORNER RADII
  // ================================
  radius: {
    xs: 6, // Tiny elements
    sm: 10, // Inputs & chips (Softer look)
    md: 16, // Cards, modals
    lg: 24, // Bottom sheets, large buttons
    xl: 32, // Extra large surfaces
    pill: 9999, // Fully rounded
  },

  // ================================
  // ELEVATION SHADOWS
  // ================================
  shadow: {
    base: {
      shadowColor: PALETTE.primary[700],
      shadowOffset: { width: 0, height: 4 }, // Slightly deeper for depth
      shadowOpacity: 0.08,
      shadowRadius: 6, // Softer shadow
      elevation: 3,
    },
    card: {
      shadowColor: PALETTE.primary[700],
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    float: {
      shadowColor: PALETTE.primary[700],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // Expose the full palette for advanced usage
  palette: PALETTE,
};

export const Colors = {
  light: {
    ...THEME.colors,
    // Additional properties for consistency with dark theme
    surfaceElevated: "#F3F4F6", // Slightly darker than surface for elevation
    placeholder: "#9CA3AF", // Placeholder text color
    borderLight: "#D1D5DB", // Lighter/alternate border
    warning: "#F59E0B", // Warning color

    // Utility backgrounds for states
    successLight: "#DCFCE7", // Light green background
    primaryLight: PALETTE.primary[100], // Light primary background
    warningLight: "#FEF3C7", // Light warning background
    errorLight: "#FEE2E2", // Light error background
    star: "#FACC15", // Star/rating color

    tint: THEME.colors.primary,
    icon: THEME.colors.muted,
    tabIconDefault: THEME.colors.muted,
    tabIconSelected: THEME.colors.primary,

    // Button text color on primary background
    onPrimary: "#FFFFFF", // White text on dark green buttons
  },
  dark: {
    // ========================================
    // 🌙 OLED BLACK MODE + BRAND ACCENT
    // ========================================

    // Brand colors - vibrant green for dark backgrounds
    primary: PALETTE.primary[400], // #4ADE80 - HANDI brand mint green
    primaryDark: PALETTE.primary[500], // #22C55E - Darker green for pressed states
    secondary: "#FFC857", // Warm gold accent

    // Background hierarchy - OLED pure black
    background: "#000000", // Pure black (OLED power saving)
    surface: "#121212", // Dark gray for cards (better contrast)
    surfaceElevated: "#1A1A1A", // Subtle elevation for modals

    // Text - pure white and grays
    text: "#FFFFFF", // Pure white text
    muted: "#999999", // Medium gray for secondary text
    placeholder: "#666666", // Darker gray for placeholders

    // Borders - subtle gray
    border: "#222222", // Very dark border
    borderLight: "#333333", // Slightly lighter border

    // Overlay
    overlay: "rgba(0, 0, 0, 0.90)", // Deep overlay for modals

    // Status colors - bright and accessible
    error: "#FF6B6B", // Soft coral red
    success: PALETTE.primary[400], // Brand green for success
    warning: "#FBBF24", // Bright amber

    // Utility backgrounds for states (dark mode versions)
    successLight: "rgba(74, 222, 128, 0.15)", // Dark mode success bg
    primaryLight: "rgba(74, 222, 128, 0.10)", // Dark mode primary bg
    warningLight: "rgba(251, 191, 36, 0.15)", // Dark mode warning bg
    errorLight: "rgba(255, 107, 107, 0.15)", // Dark mode error bg
    star: "#FACC15", // Star/rating color

    // Input styling
    inputBackground: "rgba(255, 255, 255, 0.06)", // Subtle white tint

    // System/Tab colors - brand green accent
    tint: PALETTE.primary[400],
    icon: "#888888",
    tabIconDefault: "#555555",
    tabIconSelected: PALETTE.primary[400],

    // Button text color on primary background
    onPrimary: "#000000", // Black text on bright green buttons
  },
};
