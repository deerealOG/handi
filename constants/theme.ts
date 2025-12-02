export const THEME = {
  // ================================
  // 🎨 COLOR PALETTE - HANDI Brand Colors
  // ================================
  colors: {
    primary: "#378952",          // HANDI brand emerald green — main identity color
    primaryDark: "#28663D",      // Darker shade for pressed buttons or focus
    secondary: "#FFC857",        // Warm gold accent — highlights, CTA contrast

    background: "#F9FAFB",       // App background (light gray)
    surface: "#FFFFFF",          // Cards, modals, containers
    text: "#1F2937",             // Primary text (dark neutral)
    muted: "#6B7280",            // Secondary text, placeholders, captions
    border: "#E5E7EB",           // Dividers, input borders
    overlay: "rgba(0,0,0,0.45)", // Semi-transparent modal overlay

    error: "#DC2626",            // Error & alert color
    success: "#16A34A",          // Success state (used for confirmations)
    
    inputBackground: "rgba(55, 137, 82, 0.05)", // 5% opacity of primary (#378952)
  },

  // ================================
  // TYPOGRAPHY 
  // ================================
  typography: {
    fontFamily: {
      heading: "Outfit-Bold",         // Modern, geometric, friendly
      subheading: "Outfit-SemiBold",  // High legibility for UI elements
      body: "PlusJakartaSans-Regular",// Excellent readability for small text
      bodyMedium: "PlusJakartaSans-Medium", 
      bodyLight: "PlusJakartaSans-Light",
    },

    // Font Sizes - Restored to balanced scale
    sizes: {
      xxs: 10,
      xs: 12,
      sm: 14,
      base: 16,
      md: 18,
      lg: 20,    // Reduced from 22 for better fit
      xl: 24,    // Reduced from 28
      "2xl": 30, // Reduced from 34
      "3xl": 38, // Reduced from 42
    },

    // 📏 Line Heights — spacing within text blocks
    lineHeights: {
      compact: 1.2,
      normal: 1.5,   // Reduced from 1.6 for tighter look
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
    xxs: 2,   // Minimal alignment adjustments
    xs: 4,    // Tight grouping (text + icon)
    sm: 8,    // Related elements (label + input)
    md: 16,   // Standard component padding (Buttons, Inputs, Cards) - Was 12
    lg: 24,   // Section separation / Container padding - Was 16/20
    xl: 32,   // Major section breaks
    "2xl": 48, // Screen edges or hero spacing
    "3xl": 64, // Large vertical whitespace
  },

  // ================================
  // CORNER RADII
  // ================================
  radius: {
    xs: 6,       // Tiny elements
    sm: 10,      // Inputs & chips (Softer look)
    md: 16,      // Cards, modals
    lg: 24,      // Bottom sheets, large buttons
    xl: 32,      // Extra large surfaces
    pill: 9999,  // Fully rounded
  },

  // ================================
  // ELEVATION SHADOWS
  // ================================
  shadow: {
    base: {
      shadowColor: "#378952",
      shadowOffset: { width: 0, height: 4 }, // Slightly deeper for depth
      shadowOpacity: 0.08,
      shadowRadius: 6, // Softer shadow
      elevation: 3,
    },
    card: {
      shadowColor: "#378952",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    float: {
      shadowColor: "#378952",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    }
  },
};

export const Colors = {
  light: {
    text: THEME.colors.text,
    background: THEME.colors.background,
    tint: THEME.colors.primary,
    icon: THEME.colors.muted,
    tabIconDefault: THEME.colors.muted,
    tabIconSelected: THEME.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: THEME.colors.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: THEME.colors.primary,
  },
};