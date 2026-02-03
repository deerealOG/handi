// app/artisan/join-as-pro.tsx
// Pro Registration form for artisans to join HANDI

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ADDITIONAL_CATEGORIES,
    FEATURED_CATEGORIES,
} from "../../constants/categories";
import { THEME } from "../../constants/theme";
import { NIGERIAN_CITIES } from "../../services/locationService";

// ================================
// Types
// ================================
interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Professional Info
  businessName: string;
  bio: string;
  experience: string; // years

  // Categories & Skills
  selectedCategories: string[];

  // Location
  city: string;
  areas: string[];

  // Documents
  governmentId: string | null;
  certifications: string[];
  portfolioImages: string[];

  // Terms
  acceptedTerms: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  businessName: "",
  bio: "",
  experience: "",
  selectedCategories: [],
  city: "",
  areas: [],
  governmentId: null,
  certifications: [],
  portfolioImages: [],
  acceptedTerms: false,
};

const ALL_CATEGORIES = [...FEATURED_CATEGORIES, ...ADDITIONAL_CATEGORIES];

export default function JoinAsProScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const STEPS = [
    { title: "Personal Info", icon: "person" },
    { title: "Professional", icon: "briefcase" },
    { title: "Services", icon: "grid" },
    { title: "Location", icon: "location" },
    { title: "Documents", icon: "document" },
  ];

  const updateForm = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      updateForm("portfolioImages", [...form.portfolioImages, ...uris]);
    }
  };

  const handlePickDocument = async (type: "id" | "cert") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });

    if (!result.canceled) {
      if (type === "id") {
        updateForm("governmentId", result.assets[0].uri);
      } else {
        updateForm("certifications", [
          ...form.certifications,
          result.assets[0].uri,
        ]);
      }
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (form.selectedCategories.includes(categoryId)) {
      updateForm(
        "selectedCategories",
        form.selectedCategories.filter((c) => c !== categoryId),
      );
    } else if (form.selectedCategories.length < 5) {
      updateForm("selectedCategories", [
        ...form.selectedCategories,
        categoryId,
      ]);
    } else {
      Alert.alert(
        "Limit Reached",
        "You can select up to 5 service categories.",
      );
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!form.firstName || !form.lastName || !form.email || !form.phone) {
          Alert.alert(
            "Missing Information",
            "Please fill in all personal details.",
          );
          return false;
        }
        if (!form.email.includes("@")) {
          Alert.alert("Invalid Email", "Please enter a valid email address.");
          return false;
        }
        return true;
      case 1:
        if (!form.bio || !form.experience) {
          Alert.alert(
            "Missing Information",
            "Please fill in your professional details.",
          );
          return false;
        }
        return true;
      case 2:
        if (form.selectedCategories.length === 0) {
          Alert.alert(
            "No Services Selected",
            "Please select at least one service category.",
          );
          return false;
        }
        return true;
      case 3:
        if (!form.city) {
          Alert.alert("No Location", "Please select your city.");
          return false;
        }
        return true;
      case 4:
        if (!form.governmentId) {
          Alert.alert("ID Required", "Please upload a government-issued ID.");
          return false;
        }
        if (!form.acceptedTerms) {
          Alert.alert(
            "Terms Required",
            "Please accept the terms and conditions.",
          );
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    Alert.alert(
      "Application Submitted! 🎉",
      "Thank you for joining HANDI! We'll review your application and get back to you within 24-48 hours.",
      [{ text: "OK", onPress: () => router.replace("/artisan") }],
    );
  };

  // ================================
  // Step Renderers
  // ================================
  const renderPersonalInfo = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Tell us about yourself. This information will be visible to clients.
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="John"
            placeholderTextColor={colors.muted}
            value={form.firstName}
            onChangeText={(v) => updateForm("firstName", v)}
          />
        </View>
        <View style={styles.inputHalf}>
          <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Doe"
            placeholderTextColor={colors.muted}
            value={form.lastName}
            onChangeText={(v) => updateForm("lastName", v)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          Email Address
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
          placeholder="john@example.com"
          placeholderTextColor={colors.muted}
          value={form.email}
          onChangeText={(v) => updateForm("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
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
    </View>
  );

  const renderProfessionalInfo = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Share your professional background and experience.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          Business Name (Optional)
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
          placeholder="Your business or brand name"
          placeholderTextColor={colors.muted}
          value={form.businessName}
          onChangeText={(v) => updateForm("businessName", v)}
        />
      </View>

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
          placeholder="e.g., 5"
          placeholderTextColor={colors.muted}
          value={form.experience}
          onChangeText={(v) => updateForm("experience", v)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          Bio / About You
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
          placeholder="Describe your skills, experience, and what makes you great at what you do..."
          placeholderTextColor={colors.muted}
          value={form.bio}
          onChangeText={(v) => updateForm("bio", v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderServices = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Select the services you offer (up to 5 categories).
      </Text>

      <Text style={[styles.selectedCount, { color: colors.primary }]}>
        {form.selectedCategories.length}/5 selected
      </Text>

      <View style={styles.categoriesGrid}>
        {ALL_CATEGORIES.slice(0, 20).map((category) => {
          const isSelected = form.selectedCategories.includes(category.id);
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={isSelected ? "#FFFFFF" : colors.text}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  { color: isSelected ? "#FFFFFF" : colors.text },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderLocation = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Select your primary service location.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>City</Text>
        <TouchableOpacity
          style={[
            styles.selectButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setShowCityModal(true)}
        >
          <Text
            style={[
              styles.selectButtonText,
              { color: form.city ? colors.text : colors.muted },
            ]}
          >
            {form.city || "Select your city"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* City List */}
      <View style={styles.cityGrid}>
        {NIGERIAN_CITIES.filter((c) => c.isActive)
          .slice(0, 10)
          .map((city) => (
            <TouchableOpacity
              key={city.id}
              style={[
                styles.cityChip,
                {
                  backgroundColor:
                    form.city === city.name ? colors.primary : colors.surface,
                  borderColor:
                    form.city === city.name ? colors.primary : colors.border,
                },
              ]}
              onPress={() => updateForm("city", city.name)}
            >
              <Text
                style={[
                  styles.cityChipText,
                  { color: form.city === city.name ? "#FFFFFF" : colors.text },
                ]}
              >
                {city.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Upload required documents for verification.
      </Text>

      {/* Government ID */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          Government ID *
        </Text>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => handlePickDocument("id")}
        >
          <Ionicons
            name={form.governmentId ? "checkmark-circle" : "cloud-upload"}
            size={24}
            color={form.governmentId ? colors.success : colors.muted}
          />
          <Text
            style={[
              styles.uploadButtonText,
              { color: form.governmentId ? colors.success : colors.muted },
            ]}
          >
            {form.governmentId
              ? "ID Uploaded ✓"
              : "Upload ID (NIN, Voter's Card, etc.)"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Certifications */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          Certifications (Optional)
        </Text>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => handlePickDocument("cert")}
        >
          <Ionicons name="ribbon" size={24} color={colors.muted} />
          <Text style={[styles.uploadButtonText, { color: colors.muted }]}>
            Upload professional certifications
          </Text>
        </TouchableOpacity>
        {form.certifications.length > 0 && (
          <Text style={[styles.uploadedCount, { color: colors.success }]}>
            {form.certifications.length} file(s) uploaded
          </Text>
        )}
      </View>

      {/* Terms */}
      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => updateForm("acceptedTerms", !form.acceptedTerms)}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: form.acceptedTerms
                ? colors.primary
                : "transparent",
              borderColor: form.acceptedTerms ? colors.primary : colors.border,
            },
          ]}
        >
          {form.acceptedTerms && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={[styles.termsText, { color: colors.muted }]}>
          I agree to the{" "}
          <Text style={{ color: colors.primary }}>Terms of Service</Text> and{" "}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderProfessionalInfo();
      case 2:
        return renderServices();
      case 3:
        return renderLocation();
      case 4:
        return renderDocuments();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Join as Pro
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {STEPS.map((step, index) => (
          <View key={index} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index <= currentStep ? colors.primary : colors.border,
                },
              ]}
            >
              {index < currentStep ? (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              ) : (
                <Text style={styles.progressDotText}>{index + 1}</Text>
              )}
            </View>
            <Text
              style={[
                styles.progressLabel,
                { color: index <= currentStep ? colors.primary : colors.muted },
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          {STEPS[currentStep].title}
        </Text>
        {renderCurrentStep()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handleBack}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
              flex: currentStep > 0 ? 1 : undefined,
            },
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {currentStep === STEPS.length - 1
                ? "Submit Application"
                : "Continue"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  progressDotText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  progressLabel: {
    fontSize: 9,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
  },
  stepTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  stepDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
    marginBottom: THEME.spacing.lg,
  },
  stepContent: {
    paddingBottom: THEME.spacing.xl,
  },
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  inputRow: {
    flexDirection: "row",
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  inputHalf: {
    flex: 1,
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
  selectButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: THEME.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  selectedCount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: THEME.spacing.md,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    gap: THEME.spacing.xs,
  },
  categoryChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.md,
  },
  cityChip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  cityChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  uploadButton: {
    height: 64,
    borderWidth: 1,
    borderRadius: THEME.radius.sm,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
  },
  uploadButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  uploadedCount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: THEME.spacing.xs,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    gap: THEME.spacing.md,
  },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  secondaryButton: {
    height: 52,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.radius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
