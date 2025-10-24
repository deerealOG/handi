export const THEME = {
  // ================================
  // 🎨 COLOR PALETTE
  // ================================
  colors: {
    primary: "#1C8C4B",          // Brand emerald green — main identity color
    primaryDark: "#146e3bff",      // Darker shade for pressed buttons or focus
    secondary: "#FFC857",        // Warm gold accent — highlights, CTA contrast

    background: "#F9FAFB",       // App background (light gray)
    surface: "#FFFFFF",          // Cards, modals, containers
    text: "#1F2937",             // Primary text (dark neutral)
    muted: "#6B7280",            // Secondary text, placeholders, captions
    border: "#E5E7EB",           // Dividers, input borders
    overlay: "rgba(0,0,0,0.45)", // Semi-transparent modal overlay

    error: "#DC2626",            // Error & alert color
    success: "#16A34A",          // Success state (used for confirmations)
  },

  // ================================
  // TYPOGRAPHY 
  // ================================
  typography: {
    fontFamily: {
      heading: "Urbanist-Bold",       // Used for major headers & buttons
      subheading: "Urbanist-SemiBold",// Used for section titles, tab headers
      body: "Inter-Regular",          // Used for paragraphs, labels, inputs
      bodyMedium: "Inter-Medium",     // Slightly heavier body text (like names, prices)
      bodyLight: "Inter-Light",       // Subtle text, timestamps, captions
    },

    // Font Sizes 
    sizes: {
      xs: 11,    // Captions, timestamps
      sm: 13,    // Small labels, chip text
      base: 15,  // Default readable text
      md: 17,    // Section subtitles
      lg: 20,    // Card titles or modal headers
      xl: 24,    // Page headers
      "2xl": 30, // Splash / Hero titles
    },

    // 📏 Line Heights — spacing within text blocks
    lineHeights: {
      compact: 1.1,  // For buttons, tight labels
      normal: 1.4,   // Default paragraph spacing
      relaxed: 1.6,  // Long-form content or modal descriptions
    },
  },

  // ================================
  // SPACING
  // ================================
  spacing: {
    xs: 4,   // Micro padding
    sm: 8,   // Small spacing (chips, labels)
    md: 12,  // Form field gaps
    lg: 20,  // Section gaps, card padding
    xl: 32,  // Screen padding or hero areas
  },

  // ================================
  // CORNER RADII
  // ================================
  radius: {
    sm: 6,       // Inputs & chips
    md: 12,      // Cards, modals
    lg: 20,      // Bottom sheets, large buttons
    pill: 9999,  // Fully rounded (toggles, badges)
  },

  // ================================
  // ELEVATION SHADOWS
  // ================================
  shadow: {
    base: {
      shadowColor: "#1C8C4B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3, // Android shadow
    },
    card: {
      shadowColor: "#1C8C4B",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
  },
};