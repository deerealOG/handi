// app/contact.tsx
// Contact Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import { submitContactForm } from "@/services/mockApi";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

const CONTACT_INFO = [
  {
    icon: "email",
    title: "Email Us",
    detail: "support@handiapp.com.ng",
    action: "mailto:support@handiapp.com.ng",
  },
  {
    icon: "phone",
    title: "Call Us",
    detail: "+234 800 HANDI (42634)",
    action: "tel:+2348004263",
  },
  {
    icon: "map-marker",
    title: "Visit Us",
    detail: "14 Adeola Odeku Street, Victoria Island, Lagos",
    action: null,
  },
  {
    icon: "clock",
    title: "Business Hours",
    detail: "Mon - Fri: 8AM - 6PM, Sat: 9AM - 3PM",
    action: null,
  },
];

export default function ContactPage() {
  const { colors } = useAppTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      const msg = "Please fill in all required fields.";
      if (Platform.OS === "web") {
        alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitContactForm({
        email,
        name,
        message: `Subject: ${subject}\n\n${message}`,
        type: "contact",
      });

      const alertMsg = result.message;
      if (Platform.OS === "web") {
        alert(alertMsg);
      } else {
        Alert.alert("Success", alertMsg);
      }

      if (result.success) {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch {
      const msg = "Something went wrong. Please try again.";
      if (Platform.OS === "web") {
        alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>Contact Us</Text>
        <Text style={styles.heroSubtitle}>
          We&apos;d love to hear from you. Get in touch with our team.
        </Text>
      </View>

      {/* Contact Info Cards */}
      <View style={styles.contactInfoSection}>
        {CONTACT_INFO.map((info, index) => (
          <View
            key={index}
            style={[styles.contactCard, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.contactIcon,
                { backgroundColor: `${THEME.colors.primary}15` },
              ]}
            >
              <Icon
                name={info.icon as any}
                size={24}
                color={THEME.colors.primary}
              />
            </View>
            <Text style={[styles.contactTitle, { color: colors.text }]}>
              {info.title}
            </Text>
            <Text style={[styles.contactDetail, { color: colors.muted }]}>
              {info.detail}
            </Text>
          </View>
        ))}
      </View>

      {/* Contact Form */}
      <View style={styles.formSection}>
        <Text style={[styles.formTitle, { color: colors.text }]}>
          Send Us a Message
        </Text>

        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text },
              ]}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.formField}>
            <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text },
              ]}
              placeholder="your@email.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.surface, color: colors.text },
            ]}
            placeholder="What is this about?"
            placeholderTextColor={colors.muted}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.formField}>
          <Text style={[styles.label, { color: colors.text }]}>Message *</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: colors.surface, color: colors.text },
            ]}
            placeholder="Tell us how we can help..."
            placeholderTextColor={colors.muted}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Sending..." : "Send Message"}
          </Text>
        </TouchableOpacity>
      </View>

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
  heroSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 48 : 32,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },
  contactInfoSection: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  contactCard: {
    width: Platform.OS === "web" ? 250 : "100%",
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.md,
  },
  contactTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.xs,
  },
  contactDetail: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
  },
  formSection: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  formTitle: {
    fontSize: THEME.typography.sizes["2xl"],
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  formRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: THEME.spacing.md,
  },
  formField: {
    flex: 1,
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: THEME.spacing.xs,
  },
  input: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  textArea: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: "center",
    marginTop: THEME.spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
