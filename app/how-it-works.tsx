// app/how-it-works.tsx
// How It Works Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { THEME } from "../constants/theme";

const CUSTOMER_STEPS = [
  {
    step: 1,
    icon: "account-plus",
    title: "Sign Up",
    description:
      "Create your account in minutes. Provide basic details and verify your email.",
  },
  {
    step: 2,
    icon: "magnify",
    title: "Browse Services",
    description:
      "Explore our wide range of services and products from trusted providers.",
  },
  {
    step: 3,
    icon: "calendar-check",
    title: "Book an Appointment",
    description:
      "Choose your preferred date, time, and provider. Confirm your booking.",
  },
  {
    step: 4,
    icon: "check-circle",
    title: "Get the Job Done",
    description:
      "Receive professional service and pay securely through our platform.",
  },
];

const PROVIDER_STEPS = [
  {
    step: 1,
    icon: "account-plus",
    title: "Register as Provider",
    description:
      "Sign up as a service provider and complete your business profile.",
  },
  {
    step: 2,
    icon: "shield-check",
    title: "Complete Verification",
    description:
      "Submit required documents for verification to build trust with customers.",
  },
  {
    step: 3,
    icon: "briefcase",
    title: "List Your Services",
    description:
      "Add your services, set prices, availability, and upload portfolio images.",
  },
  {
    step: 4,
    icon: "currency-usd",
    title: "Start Earning",
    description:
      "Accept bookings, provide great service, and grow your business with HANDI.",
  },
];

export default function HowItWorksPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<"customer" | "provider">(
    "customer",
  );

  const steps = activeTab === "customer" ? CUSTOMER_STEPS : PROVIDER_STEPS;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation Header */}
      <WebNavbar activeTab="how-it-works" />

      {/* Hero Section */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.heroSection, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          How It <Text style={styles.heroHighlight}>Works</Text>
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
          HANDI makes it easy to find and book professional services.
          {"\n"}Follow these simple steps to get started.
        </Text>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "customer" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("customer")}
          >
            <Icon
              name="account"
              size={20}
              color={activeTab === "customer" ? "#FFFFFF" : THEME.colors.text}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "customer" && styles.tabButtonTextActive,
              ]}
            >
              For Customers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "provider" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("provider")}
          >
            <Icon
              name="briefcase"
              size={20}
              color={activeTab === "provider" ? "#FFFFFF" : THEME.colors.text}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "provider" && styles.tabButtonTextActive,
              ]}
            >
              For Providers
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Steps Section */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(800)}
        style={styles.stepsSection}
      >
        <Text style={[styles.stepsTitle, { color: colors.text }]}>
          {activeTab === "customer"
            ? "Getting Started as a Customer"
            : "Getting Started as a Provider"}
        </Text>
        <Text style={[styles.stepsSubtitle, { color: colors.muted }]}>
          {activeTab === "customer"
            ? "4 simple steps to find and book the services you need"
            : "4 simple steps to start growing your business with HANDI"}
        </Text>

        <View style={styles.stepsGrid}>
          {steps.map((step, index) => (
            <View key={step.step} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepIconContainer}>
                <Icon
                  name={step.icon as any}
                  size={32}
                  color={THEME.colors.primary}
                />
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {step.title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.muted }]}>
                {step.description}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={[styles.ctaTitle, { color: colors.text }]}>
          Ready to Get Started?
        </Text>
        <Text style={[styles.ctaSubtitle, { color: colors.muted }]}>
          {activeTab === "customer"
            ? "Join thousands of customers finding trusted service providers on HANDI."
            : "Join our network of trusted professionals and grow your business."}
        </Text>
        <View style={styles.ctaButtons}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() =>
              router.push(
                activeTab === "customer"
                  ? ("/auth/register-client" as any)
                  : ("/auth/register-provider" as any),
              )
            }
          >
            <Text style={styles.ctaPrimaryText}>
              {activeTab === "customer" ? "Sign Up Now" : "Become a Provider"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() =>
              router.push(
                activeTab === "customer" ? ("/services" as any) : ("/" as any),
              )
            }
          >
            <Text style={styles.ctaSecondaryText}>
              {activeTab === "customer" ? "Browse Services" : "Learn More"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={[styles.benefitsTitle, { color: colors.text }]}>
          Why Choose HANDI?
        </Text>
        <Text style={[styles.benefitsSubtitle, { color: colors.muted }]}>
          Experience the difference with our trusted platform
        </Text>

        <View style={styles.benefitsGrid}>
          <View style={styles.benefitCard}>
            <View style={[styles.benefitIconContainer]}>
              <Icon
                name="shield-check"
                size={28}
                color={THEME.colors.primary}
              />
            </View>
            <Text style={[styles.benefitTitle, { color: colors.text }]}>
              Verified Providers
            </Text>
            <Text style={[styles.benefitText, { color: colors.muted }]}>
              All providers are thoroughly vetted and verified for your safety.
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIconContainer]}>
              <Icon name="lock" size={28} color={THEME.colors.primary} />
            </View>
            <Text style={[styles.benefitTitle, { color: colors.text }]}>
              Secure Payments
            </Text>
            <Text style={[styles.benefitText, { color: colors.muted }]}>
              Pay securely through our protected payment system.
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIconContainer]}>
              <Icon name="headset" size={28} color={THEME.colors.primary} />
            </View>
            <Text style={[styles.benefitTitle, { color: colors.text }]}>
              24/7 Support
            </Text>
            <Text style={[styles.benefitText, { color: colors.muted }]}>
              Our support team is always available to help you.
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIconContainer]}>
              <Icon name="star" size={28} color={THEME.colors.primary} />
            </View>
            <Text style={[styles.benefitTitle, { color: colors.text }]}>
              Quality Guaranteed
            </Text>
            <Text style={[styles.benefitText, { color: colors.muted }]}>
              We stand behind the quality of every service booked.
            </Text>
          </View>
        </View>
      </View>

      {/* ========================================
          FAQ SECTION
      ======================================== */}
      <View style={styles.faqSection}>
        <Text style={[styles.faqTitle, { color: colors.text }]}>
          Frequently Asked Questions
        </Text>
        <Text style={[styles.faqSubtitle, { color: colors.muted }]}>
          Get answers to common questions about how HANDI works
        </Text>

        <View style={styles.faqList}>
          {/* FAQ Item 1 */}
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>
              How do I know if a service provider is reliable?
            </Text>
            <Text style={[styles.faqAnswer, { color: colors.muted }]}>
              All service providers on HANDI are verified through our
              comprehensive screening process. You can also read reviews from
              other customers, view their ratings, and check their portfolio
              before booking.
            </Text>
          </View>

          {/* FAQ Item 2 */}
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>
              What if I need to cancel or reschedule my appointment?
            </Text>
            <Text style={[styles.faqAnswer, { color: colors.muted }]}>
              You can easily cancel or reschedule appointments through your
              dashboard. Our flexible cancellation policy allows changes up to
              24 hours before your appointment without any fees.
            </Text>
          </View>

          {/* FAQ Item 3 */}
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>
              How do payments work?
            </Text>
            <Text style={[styles.faqAnswer, { color: colors.muted }]}>
              Payments are processed securely through our platform. For
              customers, payment is taken when you book. For providers, payments
              are automatically transferred to your account after service
              completion.
            </Text>
          </View>

          {/* FAQ Item 4 */}
          <View style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>
              Is there customer support available?
            </Text>
            <Text style={[styles.faqAnswer, { color: colors.muted }]}>
              Yes! Our customer support team is available 24/7 through chat,
              email, and phone. We&apos;re here to help with any questions or issues
              you might have.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Navigation
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: Platform.OS === "web" ? 24 : 60,
    paddingBottom: THEME.spacing.md,
    backgroundColor: "#3c4a3e",
  },
  navLogo: {
    width: 70,
    height: 70,
  },
  navLinks: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navButtons: {
    flexDirection: "row",
    gap: THEME.spacing.lg,
    alignItems: "center",
  },
  navLinkText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },
  navLinkActive: {
    color: THEME.colors.secondary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
  },
  signUpButtonText: {
    color: "#1F2937",
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#FFF9F0",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 42 : 28,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.md,
  },
  heroHighlight: {
    color: "#9db541",
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    backgroundColor: "#FFFFFF",
    padding: THEME.spacing.xs,
    borderRadius: 50,
    ...THEME.shadow.card,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabButtonText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },

  // Steps Section
  stepsSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  stepsTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  stepsSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  stepsGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
    maxWidth: 1000,
  },
  stepCard: {
    width: Platform.OS === "web" ? 220 : "100%",
    padding: THEME.spacing.xl,
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    position: "relative",
    ...THEME.shadow.card,
  },
  stepNumber: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.md,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  stepTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
  },
  stepDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 20,
  },

  // CTA Section
  ctaSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#9db541",
  },
  ctaTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },
  ctaButtons: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.md,
  },
  ctaPrimary: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    alignItems: "center",
  },
  ctaPrimaryText: {
    color: "#FFFFFF",
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },
  ctaSecondary: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  ctaSecondaryText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
  },

  // Benefits Section
  benefitsSection: {
    alignItems: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#FFFFFF",
  },
  benefitsTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  benefitsSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
    maxWidth: 1000,
  },
  benefitCard: {
    width: Platform.OS === "web" ? 220 : "100%",
    padding: THEME.spacing.xl,
    backgroundColor: "#F9FAFB",
    borderRadius: THEME.radius.lg,
    alignItems: "center",
  },
  benefitIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
    backgroundColor: "#E8F5E9",
  },
  benefitTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: THEME.spacing.sm,
  },
  benefitText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: 20,
  },

  // FAQ Section
  faqSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  faqTitle: {
    fontSize:
      Platform.OS === "web"
        ? THEME.typography.sizes["2xl"]
        : THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  faqSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
    maxWidth: 500,
  },
  faqList: {
    width: "100%",
    maxWidth: 800,
    gap: THEME.spacing.md,
  },
  faqItem: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
    ...THEME.shadow.card,
  },
  faqQuestion: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  faqAnswer: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 24,
  },

  // Footer
  footer: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    backgroundColor: "#1F2937",
  },
  footerMain: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing["2xl"],
    marginBottom: THEME.spacing["2xl"],
  },
  footerBrand: {
    maxWidth: 300,
  },
  footerLogo: {
    width: 60,
    height: 60,
    marginBottom: THEME.spacing.md,
  },
  footerBrandText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  footerLinks: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.xl,
  },
  footerColumn: {
    minWidth: 120,
  },
  footerColumnTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
  },
  footerLink: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#9CA3AF",
    marginBottom: THEME.spacing.sm,
  },
  footerPayment: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.md,
    paddingVertical: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginBottom: THEME.spacing.lg,
  },
  footerPaymentLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#FFFFFF",
  },
  footerPaymentIcons: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
  },
  paymentIcon: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: "#9CA3AF",
    backgroundColor: "#374151",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 4,
  },
  footerBottom: {
    alignItems: "center",
    paddingTop: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  footerCopyright: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#9CA3AF",
    marginBottom: THEME.spacing.xs,
  },
  footerCompany: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#6B7280",
  },
});
