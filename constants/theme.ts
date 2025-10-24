// constants/theme.ts



const COLORS = {
  // Role-based branding
  client: "#3B82F6",   // Blue
  artisan: "#10B981",  // Green
  admin: "#9333EA",    // Purple

  // Core palette
  primary: "#1C8C4B",
  secondary: "#5856D6",

  // Neutrals & UI
  background: "#FFFFFF",
  surface: "#F2F2F2",
  text: "#000000",
  muted: "#8E8E93",

  // Status
  success: "#34C759",
  danger: "#FF3B30",
  warning: "#FF9500",

  // Basics
  white: "#FFFFFF",
  black: "#000000",
};

export const THEME = {
  colors: COLORS,

  typography: {
    fontFamily: 'Inter',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 22,
      title: 26,
    },
  
  weights: {
  regular: "400" as const,
  medium: "500" as const,
  bold: "700" as const,
},

  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },

  shadow: {
    base: {
      shadowColor: "rgba(28,140,75,0.60)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    ArtisanCardShadow: {
      shadowColor: "rgba(28,140,75,0.50)",
      shadowOffset: { width: 0, height: 2 },      
      elevation: 3, 
  },
}};
