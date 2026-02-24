// components/JoinTeamModal.tsx
// Modal for internship and team applications

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface JoinTeamModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  portfolio: string;
  motivation: string;
}

const ROLES = [
  { id: "developer", label: "Software Developer", icon: "code-slash" },
  { id: "designer", label: "UI/UX Designer", icon: "color-palette" },
  { id: "marketing", label: "Marketing", icon: "megaphone" },
  { id: "sales", label: "Sales & Partnerships", icon: "handshake" },
  { id: "support", label: "Customer Support", icon: "headset" },
  { id: "operations", label: "Operations", icon: "settings" },
  { id: "intern", label: "Intern (Any Department)", icon: "school" },
];

// ================================
// Component
// ================================
export function JoinTeamModal({ visible, onClose }: JoinTeamModalProps) {
  const { colors } = useAppTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    portfolio: "",
    motivation: "",
  });

  const updateForm = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.role || !form.motivation) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    if (!form.email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    Alert.alert(
      "Application Submitted! 🎉",
      "Thank you for your interest in joining the HANDI team! We&apos;ll review your application and get back to you soon.",
      [{ text: "OK", onPress: onClose }],
    );

    // Reset form
    setForm({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      experience: "",
      portfolio: "",
      motivation: "",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Join Our Team
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.description, { color: colors.muted }]}>
            We&apos;re always looking for talented individuals to join our mission of
            transforming home services in Nigeria. 🇳🇬
          </Text>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Full Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Your full name"
              placeholderTextColor={colors.muted}
              value={form.fullName}
              onChangeText={(v) => updateForm("fullName", v)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email Address *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.muted}
              value={form.email}
              onChangeText={(v) => updateForm("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="+234 800 000 0000"
              placeholderTextColor={colors.muted}
              value={form.phone}
              onChangeText={(v) => updateForm("phone", v)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Role Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Role *</Text>
            <View style={styles.rolesGrid}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleChip,
                    {
                      backgroundColor:
                        form.role === role.id ? colors.primary : colors.surface,
                      borderColor:
                        form.role === role.id ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => updateForm("role", role.id)}
                >
                  <Ionicons
                    name={role.icon as any}
                    size={16}
                    color={form.role === role.id ? "#FFFFFF" : colors.text}
                  />
                  <Text
                    style={[
                      styles.roleChipText,
                      {
                        color: form.role === role.id ? "#FFFFFF" : colors.text,
                      },
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Experience */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Years of Experience
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="e.g., 2 years"
              placeholderTextColor={colors.muted}
              value={form.experience}
              onChangeText={(v) => updateForm("experience", v)}
            />
          </View>

          {/* Portfolio */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Portfolio/LinkedIn URL
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="https://..."
              placeholderTextColor={colors.muted}
              value={form.portfolio}
              onChangeText={(v) => updateForm("portfolio", v)}
              autoCapitalize="none"
            />
          </View>

          {/* Motivation */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Why do you want to join HANDI? *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Tell us what excites you about HANDI and why you&apos;d be a great fit..."
              placeholderTextColor={colors.muted}
              value={form.motivation}
              onChangeText={(v) => updateForm("motivation", v)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
  },
  description: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
    marginBottom: THEME.spacing.lg,
  },
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: THEME.spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.sm,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    gap: THEME.spacing.xs,
  },
  roleChipText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  footer: {
    flexDirection: "row",
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    gap: THEME.spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  submitButton: {
    flex: 2,
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default JoinTeamModal;
