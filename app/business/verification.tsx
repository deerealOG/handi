// app/business/verification.tsx
// Business Verification Logic

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { businessService } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

type VerificationStep = "welcome" | "cac" | "tin" | "address" | "review";

export default function BusinessVerificationScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<VerificationStep>("welcome");
  const [loading, setLoading] = useState(false);

  // Form State
  const [cacNumber, setCacNumber] = useState("");
  const [cacDoc, setCacDoc] = useState<string | null>(null);

  const [tinNumber, setTinNumber] = useState("");
  const [tinDoc, setTinDoc] = useState<string | null>(null);

  const [utilityDoc, setUtilityDoc] = useState<string | null>(null);

  const pickImage = async (setter: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!cacNumber || !cacDoc || !tinNumber || !tinDoc || !utilityDoc) {
      Alert.alert("Error", "Please complete all fields and uploads");
      return;
    }

    try {
      setLoading(true);
      await businessService.submitVerification(user?.id || "business_001", {
        cacNumber,
        cacDocumentUrl: cacDoc,
        tinNumber,
        tinDocumentUrl: tinDoc,
        utilityBillUrl: utilityDoc,
      });

      Alert.alert("Success", "Verification submitted successfully", [
        { text: "OK", onPress: () => router.replace("/business") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to submit verification");
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContent}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}
      >
        <MaterialCommunityIcons
          name="shield-check"
          size={48}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Business Verification
      </Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        To operate as a verified business on HANDI, we need to validate your
        corporate credentials.
      </Text>

      <View style={styles.requirementsList}>
        <Text style={[styles.requirementsTitle, { color: colors.text }]}>
          Required Documents:
        </Text>
        {[
          "CAC Registration Certificate",
          "Tax Identification Number (TIN)",
          "Recent Utility Bill (Proof of Address)",
        ].map((item, index) => (
          <View key={index} style={styles.requirementItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.requirementText, { color: colors.muted }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={() => setCurrentStep("cac")}
      >
        <Text style={styles.primaryButtonText}>Start Verification</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderCAC = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Corporate Registration
      </Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Enter your CAC registration details.
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>RC Number</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="RC123456"
        placeholderTextColor={colors.muted}
        value={cacNumber}
        onChangeText={setCacNumber}
      />

      <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>
        Upload CAC Certificate
      </Text>
      <TouchableOpacity
        style={[styles.uploadBox, { borderColor: colors.border }]}
        onPress={() => pickImage(setCacDoc)}
      >
        {cacDoc ? (
          <Image source={{ uri: cacDoc }} style={styles.uploadedImage} />
        ) : (
          <>
            <Ionicons
              name="cloud-upload-outline"
              size={40}
              color={colors.muted}
            />
            <Text style={[styles.uploadText, { color: colors.muted }]}>
              Tap to Upload Image
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor:
              cacNumber && cacDoc ? colors.primary : colors.muted,
          },
        ]}
        disabled={!cacNumber || !cacDoc}
        onPress={() => setCurrentStep("tin")}
      >
        <Text style={styles.primaryButtonText}>Next</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderTIN = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Tax Information
      </Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Provide your Tax Identification Number.
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>TIN Number</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="1234-5678-9012"
        placeholderTextColor={colors.muted}
        keyboardType="number-pad"
        value={tinNumber}
        onChangeText={setTinNumber}
      />

      <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>
        Upload TIN Proof
      </Text>
      <TouchableOpacity
        style={[styles.uploadBox, { borderColor: colors.border }]}
        onPress={() => pickImage(setTinDoc)}
      >
        {tinDoc ? (
          <Image source={{ uri: tinDoc }} style={styles.uploadedImage} />
        ) : (
          <>
            <Ionicons
              name="cloud-upload-outline"
              size={40}
              color={colors.muted}
            />
            <Text style={[styles.uploadText, { color: colors.muted }]}>
              Tap to Upload Document
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep("cac")}
        >
          <Text style={{ color: colors.text }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              flex: 1,
              backgroundColor:
                tinNumber && tinDoc ? colors.primary : colors.muted,
            },
          ]}
          disabled={!tinNumber || !tinDoc}
          onPress={() => setCurrentStep("address")}
        >
          <Text style={styles.primaryButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddress = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Address Verification
      </Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Upload a recent utility bill (Electricity, Water, or Waste) showing your
        business address.
      </Text>

      <TouchableOpacity
        style={[styles.uploadBox, { borderColor: colors.border, height: 200 }]}
        onPress={() => pickImage(setUtilityDoc)}
      >
        {utilityDoc ? (
          <Image source={{ uri: utilityDoc }} style={styles.uploadedImage} />
        ) : (
          <>
            <Ionicons
              name="document-text-outline"
              size={50}
              color={colors.muted}
            />
            <Text style={[styles.uploadText, { color: colors.muted }]}>
              Tap to Upload Utility Bill
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep("tin")}
        >
          <Text style={{ color: colors.text }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              flex: 1,
              backgroundColor: utilityDoc ? colors.primary : colors.muted,
            },
          ]}
          disabled={!utilityDoc}
          onPress={() => setCurrentStep("review")}
        >
          <Text style={styles.primaryButtonText}>Review</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Review Submission
      </Text>
      <Text style={[styles.stepDescription, { color: colors.muted }]}>
        Please confirm your details before submitting.
      </Text>

      <View
        style={[
          styles.reviewCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.muted }]}>
            RC Number
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {cacNumber}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.muted }]}>TIN</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {tinNumber}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.muted }]}>
            Documents
          </Text>
          <Text style={[styles.reviewValue, { color: colors.success }]}>
            3 Uploaded
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep("address")}
        >
          <Text style={{ color: colors.text }}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { flex: 1, backgroundColor: colors.primary },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Submit Verification</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        {currentStep === "welcome" && renderWelcome()}
        {currentStep === "cac" && renderCAC()}
        {currentStep === "tin" && renderTIN()}
        {currentStep === "address" && renderAddress()}
        {currentStep === "review" && renderReview()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 50,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  stepContent: {
    marginTop: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 10,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  requirementsList: {
    width: "100%",
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 15,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    gap: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  uploadBox: {
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
  backButton: {
    padding: 16,
  },
  reviewCard: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
