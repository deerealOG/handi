// app/_layout.tsx
import { ThemedStatusBar } from "@/components/ThemedStatusBar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { LikedItemsProvider } from "@/context/LikedItemsContext";
import { LocationProvider } from "@/context/LocationContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
    RedHatDisplay_400Regular,
    RedHatDisplay_500Medium,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_700Bold,
} from "@expo-google-fonts/red-hat-display";
import {
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";

import { LogBox, Platform } from "react-native";

// Prevent the splash screen from auto-hiding before fonts are loaded (native only)
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync();
}

// Ignore the annoying "Unable to activate keep awake" error which is often
// a non-critical development environment issue.
LogBox.ignoreLogs(["Unable to activate keep awake"]);

// Global promise rejection handler to catch "keep awake" and other background errors
if (typeof global !== "undefined") {
  // For environments that support global unhandled rejections
  const prevHandler = (global as any).onunhandledrejection;
  (global as any).onunhandledrejection = (event: any) => {
    if (event?.reason?.message?.includes("keep awake")) {
      // Intentionally ignore Keep Awake activation failures
      return;
    }
    if (prevHandler) prevHandler(event);
  };
}

export default function RootLayout() {
  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    // Red Hat Display fonts for headings
    "RedHatDisplay-Regular": RedHatDisplay_400Regular,
    "RedHatDisplay-Medium": RedHatDisplay_500Medium,
    "RedHatDisplay-SemiBold": RedHatDisplay_600SemiBold,
    "RedHatDisplay-Bold": RedHatDisplay_700Bold,

    // Roboto fonts for body text
    "Roboto-Light": Roboto_300Light,
    "Roboto-Regular": Roboto_400Regular,
    "Roboto-Medium": Roboto_500Medium,
    "Roboto-Bold": Roboto_700Bold,
  });

  // For web: Add a timeout to render even if fonts haven't loaded after 1 second
  // Since fonts are loaded via CSS, we don't need to wait for Expo's font loader
  const [forceRender, setForceRender] = useState(
    Platform.OS === "web" ? false : true,
  );

  useEffect(() => {
    // Web timeout fallback - render quickly, CSS fonts will load async
    if (Platform.OS === "web") {
      const timeout = setTimeout(() => {
        setForceRender(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setForceRender(true);
      // Hide the splash screen after fonts are loaded (native only)
      if (Platform.OS !== "web") {
        SplashScreen.hideAsync().catch((err) => {
          console.warn("Error hiding splash screen:", err);
        });
      }
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are loaded (or forceRender is true on web)
  if (!fontsLoaded && !fontError && !forceRender) {
    return null;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <LikedItemsProvider>
              <LocationProvider>
                <NotificationProvider>
                  <ThemedStatusBar />
                  <Slot />
                </NotificationProvider>
              </LocationProvider>
            </LikedItemsProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
