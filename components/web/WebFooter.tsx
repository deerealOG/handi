// components/web/WebFooter.tsx
// Shared responsive footer component for web pages

import { APP_CONFIG } from "@/constants/config";
import { THEME } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
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
};

export default function WebFooter() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );

  // Listen for window size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth > BREAKPOINTS.tablet;
  const isMobile = windowWidth <= BREAKPOINTS.mobile;

  const footerColumns = [
    {
      title: "Company",
      links: [
        { label: "About Us", route: "/about" },
        { label: "Blog", route: "/blog" },
        { label: "Careers", route: "/careers" },
        { label: "Contact", route: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Electrical", route: "/services?category=electrical" },
        { label: "Plumbing", route: "/services?category=plumbing" },
        { label: "Beauty & Wellness", route: "/services?category=beauty" },
        { label: "Cleaning", route: "/services?category=cleaning" },
        { label: "View All Services", route: "/services" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", route: "/help" },
        { label: "FAQ", route: "/faq" },
        { label: "Safety Guidelines", route: "/safety" },
        { label: "Terms of Service", route: "/terms" },
        { label: "Privacy Policy", route: "/privacy" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Features", route: "/features" },
        { label: "For Businesses", route: "/business-solutions" },
        { label: "Become a Provider", route: "/become-provider" },
        { label: "How It Works", route: "/how-it-works" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "twitter", url: APP_CONFIG.SOCIAL.TWITTER },
    { icon: "facebook", url: APP_CONFIG.SOCIAL.FACEBOOK },
    { icon: "instagram", url: APP_CONFIG.SOCIAL.INSTAGRAM },
    { icon: "linkedin", url: APP_CONFIG.SOCIAL.LINKEDIN },
  ];

  const handleSocialPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening social link:", error);
    }
  };

  return (
    <View style={[styles.footer, { backgroundColor: THEME.colors.text }]}>
      {/* Main Footer Content */}
      <View style={[styles.footerMain, !isDesktop && styles.footerMainMobile]}>
        {/* Brand Section */}
        <View
          style={[styles.footerBrand, !isDesktop && styles.footerBrandMobile]}
        >
          <Image
            source={require("../../assets/images/handi-logo-dark.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={[styles.footerBrandText, { color: colors.muted }]}>
            Connecting service professionals with customers. Book appointments,
            discover new products, and transform your experience with HANDI.
          </Text>

          {/* Social Links */}
          <View style={styles.socialLinks}>
            {socialLinks.map((social) => (
              <TouchableOpacity
                key={social.icon}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: colors.surfaceElevated || colors.surface,
                  },
                ]}
                onPress={() => handleSocialPress(social.url)}
              >
                <Icon
                  name={social.icon as any}
                  size={18}
                  color={colors.muted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Links Columns */}
        <View
          style={[styles.footerLinks, isMobile && styles.footerLinksMobile]}
        >
          {footerColumns.map((column) => (
            <View
              key={column.title}
              style={[
                styles.footerColumn,
                isMobile && styles.footerColumnMobile,
              ]}
            >
              <Text
                style={[
                  styles.footerColumnTitle,
                  { color: THEME.colors.surface },
                ]}
              >
                {column.title}
              </Text>
              {column.links.map((link) => (
                <TouchableOpacity
                  key={link.label}
                  onPress={() => router.push(link.route as any)}
                  style={styles.footerLinkTouchable}
                >
                  <Text
                    style={[
                      styles.footerLink,
                      { color: THEME.colors.surface + "80" },
                    ]}
                  >
                    {link.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Copyright */}
      <View style={[styles.footerBottom, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerCopyright, { color: colors.muted }]}>
          Copyright {new Date().getFullYear()} ©HANDI. All Rights Reserved
        </Text>
        <Text style={[styles.footerCompany, { color: colors.muted }]}>
          HANDI Limited is a registered company in Nigeria
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.lg,
  },
  footerMain: {
    flexDirection: "row",
    gap: THEME.spacing["2xl"],
    marginBottom: THEME.spacing["2xl"],
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  footerMainMobile: {
    flexDirection: "column",
  },
  footerBrand: {
    maxWidth: 280,
    flexShrink: 0,
  },
  footerBrandMobile: {
    maxWidth: "100%",
    marginBottom: THEME.spacing.lg,
  },
  footerLogo: {
    width: 120,
    height: 48,
    marginBottom: THEME.spacing.md,
  },
  footerBrandText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: THEME.typography.sizes.sm * THEME.typography.lineHeights.normal,
    marginBottom: THEME.spacing.lg,
  },
  socialLinks: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLinks: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.xl,
  },
  footerLinksMobile: {
    gap: THEME.spacing.lg,
  },
  footerColumn: {
    minWidth: 140,
  },
  footerColumnMobile: {
    minWidth: "45%",
    marginBottom: THEME.spacing.md,
  },
  footerColumnTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.md,
    fontWeight: "bold",
  },
  footerLinkTouchable: {
    paddingVertical: THEME.spacing.xs,
  },
  footerLink: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  footerBottom: {
    alignItems: "center",
    paddingTop: THEME.spacing.lg,
    borderTopWidth: 1,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  footerCopyright: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.xs,
    textAlign: "center",
  },
  footerCompany: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },
});
