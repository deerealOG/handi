// components/web/WebNavbar.tsx
// Shared responsive navigation component for web pages

import { APP_CONFIG } from "@/constants/config";
import { THEME } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

interface WebNavbarProps {
  activeTab?: string;
}

export default function WebNavbar({ activeTab }: WebNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, theme } = useAppTheme();
  const { toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );

  // Listen for window size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
      // Close mobile menu when switching to desktop
      if (window.width > BREAKPOINTS.tablet) {
        setMobileMenuOpen(false);
      }
    });

    return () => subscription?.remove();
  }, []);

  const navLinks = [
    { id: "home", label: "HOME", route: "/landing" },
    { id: "services", label: "SERVICES", route: "/services" },
    { id: "products", label: "PRODUCTS", route: "/products" },
    { id: "providers", label: "PROVIDERS", route: "/providers" },
    { id: "how-it-works", label: "HOW IT WORKS", route: "/how-it-works" },
  ];

  const getActiveTab = () => {
    if (activeTab) return activeTab;
    if (pathname === "/" || pathname === "/landing") return "home";
    const match = navLinks.find(
      (link) => pathname.startsWith(link.route) && link.route !== "/",
    );
    return match?.id || "home";
  };

  const currentTab = getActiveTab();

  // Responsive layout detection
  const isDesktop = Platform.OS === "web" && windowWidth > BREAKPOINTS.tablet;
  const isTablet =
    Platform.OS === "web" &&
    windowWidth > BREAKPOINTS.mobile &&
    windowWidth <= BREAKPOINTS.tablet;

  // Handle APK download
  const handleDownloadApp = async () => {
    try {
      const url = APP_CONFIG.APK_DOWNLOAD_URL;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to Play Store
        await Linking.openURL(APP_CONFIG.PLAY_STORE_URL);
      }
    } catch (error) {
      console.error("Error opening download link:", error);
    }
  };

  return (
    <View style={[styles.navHeader, { backgroundColor: colors.primary }]}>
      {/* Logo */}
      <TouchableOpacity
        onPress={() => router.push("/" as any)}
        style={styles.logoContainer}
      >
        <Image
          source={require("../../assets/images/handi-logo-dark.png")}
          style={[styles.navLogo, isTablet && styles.navLogoTablet]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Desktop Navigation Links */}
      {isDesktop ? (
        <>
          <View style={styles.navLinks}>
            {navLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                onPress={() => router.push(link.route as any)}
                style={styles.navLinkTouchable}
              >
                <Text
                  style={[
                    styles.navLinkText,
                    { color: colors.surface },
                    currentTab === link.id && [
                      styles.navLinkActive,
                      { color: colors.secondary },
                    ],
                  ]}
                >
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.navButtons}>
            {/* Download App */}
            <TouchableOpacity
              style={[
                styles.downloadButton,
                {
                  borderColor: colors.secondary,
                  backgroundColor: `${colors.secondary}15`,
                },
              ]}
              onPress={handleDownloadApp}
              accessibilityLabel="Download HANDI app"
            >
              <Icon name="download" size={18} color={colors.secondary} />
              <Text
                style={[styles.downloadButtonText, { color: colors.secondary }]}
              >
                Download App
              </Text>
            </TouchableOpacity>

            {/* Get Started - Download App */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                {
                  backgroundColor: colors.secondary,
                  ...THEME.shadow.base,
                },
              ]}
              onPress={handleDownloadApp}
            >
              <Text
                style={[styles.signUpButtonText, { color: THEME.colors.text }]}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* Mobile/Tablet Menu Button */
        <View style={styles.mobileNav}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            accessibilityLabel={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <Icon
              name={mobileMenuOpen ? "close" : "menu"}
              size={28}
              color={colors.surface}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Mobile Menu Dropdown */}
      {!isDesktop && mobileMenuOpen && (
        <View
          style={[
            styles.mobileMenu,
            {
              backgroundColor: colors.primary,
              ...THEME.shadow.float,
            },
          ]}
        >
          {navLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.mobileMenuItem}
              onPress={() => {
                router.push(link.route as any);
                setMobileMenuOpen(false);
              }}
            >
              <Text
                style={[
                  styles.mobileMenuText,
                  { color: colors.surface },
                  currentTab === link.id && { color: colors.secondary },
                ]}
              >
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View
            style={[
              styles.mobileMenuDivider,
              { backgroundColor: `${colors.surface}30` },
            ]}
          />

          {/* Download App */}
          <TouchableOpacity
            style={[
              styles.mobileDownloadButton,
              {
                borderColor: colors.secondary,
                backgroundColor: `${colors.secondary}15`,
              },
            ]}
            onPress={() => {
              handleDownloadApp();
              setMobileMenuOpen(false);
            }}
          >
            <Icon name="download" size={18} color={colors.secondary} />
            <Text
              style={[styles.downloadButtonText, { color: colors.secondary }]}
            >
              Download App
            </Text>
          </TouchableOpacity>

          {/* Get Started Button */}
          <TouchableOpacity
            style={[
              styles.mobileSignUpButton,
              {
                backgroundColor: colors.secondary,
                ...THEME.shadow.base,
              },
            ]}
            onPress={() => {
              handleDownloadApp();
              setMobileMenuOpen(false);
            }}
          >
            <Text
              style={[styles.signUpButtonText, { color: THEME.colors.text }]}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: Platform.OS === "web" ? THEME.spacing.md : 60,
    paddingBottom: THEME.spacing.md,
    position: "relative",
    zIndex: 100,
    backgroundColor: THEME.colors.primary,
  },
  logoContainer: {
    padding: THEME.spacing.xs,
  },
  navLogo: {
    width: 120,
    height: 48,
  },
  navLogoTablet: {
    width: 100,
    height: 40,
  },
  navLinks: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navLinkTouchable: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.xs,
  },
  navButtons: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    alignItems: "center",
  },
  navLinkText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
    letterSpacing: THEME.typography.letterSpacing.wide,
  },
  navLinkActive: {
    fontFamily: THEME.typography.fontFamily.subheading,
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.secondary,
    paddingBottom: THEME.spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  downloadButtonText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.sm,
  },
  signUpButton: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.primary,
  },
  signUpButtonText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },

  // Mobile
  mobileNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
  },
  menuButton: {
    padding: THEME.spacing.sm,
  },
  mobileMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
    zIndex: 99,
  },
  mobileMenuItem: {
    paddingVertical: THEME.spacing.md,
  },
  mobileMenuText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
    letterSpacing: THEME.typography.letterSpacing.wide,
  },
  mobileMenuDivider: {
    height: 1,
    marginVertical: THEME.spacing.md,
  },
  mobileDownloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    marginBottom: THEME.spacing.md,
  },
  mobileSignUpButton: {
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    marginTop: THEME.spacing.sm,
  },
});
