// hooks/use-platform.ts
// Platform detection hook for conditional rendering

import { Platform, useWindowDimensions } from "react-native";

export interface PlatformInfo {
  isWeb: boolean;
  isMobile: boolean;
  isNative: boolean;
  isDesktopWeb: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
}

export function usePlatform(): PlatformInfo {
  const { width, height } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
  const isNative = isMobile;

  // Consider desktop web if width > 768px
  const isDesktopWeb = isWeb && width > 768;

  // Consider tablet if width between 600-1024 on native, or similar on web
  const isTablet =
    (isMobile && width >= 600 && width <= 1024) ||
    (isWeb && width >= 600 && width <= 1024);

  return {
    isWeb,
    isMobile,
    isNative,
    isDesktopWeb,
    isTablet,
    screenWidth: width,
    screenHeight: height,
  };
}

// Simple utility for platform-specific values
export function platformSelect<T>(options: {
  web?: T;
  native?: T;
  default: T;
}): T {
  if (Platform.OS === "web" && options.web !== undefined) {
    return options.web;
  }
  if (
    (Platform.OS === "ios" || Platform.OS === "android") &&
    options.native !== undefined
  ) {
    return options.native;
  }
  return options.default;
}

export default usePlatform;
