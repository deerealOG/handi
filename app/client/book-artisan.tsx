// app/client/book-artisan.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { THEME } from "../../constants/theme";

const SERVICE_TYPES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Gardening",
  "AC Repair",
];

const JOB_SUGGESTIONS: Record<string, string[]> = {
  Plumbing: ["Fix leaking sink", "Unclog drain", "Install new faucet", "Repair toilet"],
  Electrical: ["Install ceiling fan", "Fix light switch", "Replace outlet", "Wiring inspection"],
  Carpentry: ["Repair door hinge", "Assemble furniture", "Fix cabinet", "Install shelves"],
  Cleaning: ["Deep house cleaning", "Office cleaning", "Carpet cleaning", "Window washing"],
  Painting: ["Paint bedroom", "Exterior wall painting", "Touch up paint", "Fence painting"],
  Gardening: ["Lawn mowing", "Hedge trimming", "Weeding", "Planting flowers"],
  "AC Repair": ["AC servicing", "Fix cooling issue", "Clean filters", "Gas refill"],
};

export default function BookArtisan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const artisanName = params.artisan || "Artisan";
  const artisanSkill = params.skill || "Service";

  // ---------- form state ----------
  const [serviceType, setServiceType] = useState<string>(artisanSkill.toString());
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  
  const [jobTitle, setJobTitle] = useState<string>("");
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  
  const [jobDescription, setJobDescription] = useState<string>("");
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("Lekki Phase 1, Lagos");
  const [urgent, setUrgent] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const DESCRIPTION_SUGGESTIONS = [
    "I need a professional to fix...",
    "Looking for someone to install...",
    "Urgent repair needed for...",
    "Maintenance required for...",
    "Installation of new equipment...",
  ];

  // ---------- summary modal ----------
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // ---------- document picker ----------
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!("canceled" in result) && (result as any).uri) {
        setSelectedFile(result as any);
      } else if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.log("File upload error:", err);
    }
  };

  // ---------- date picker handler ----------
  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) setDate(selected);
  };

  // ---------- submit / navigate ----------
  const handleSubmit = () => setShowSummary(true);
  const handleEditDetails = () => setShowSummary(false);
  const handleProceedToPayment = () => {
    setShowSummary(false);
    router.push({
      pathname: "/client/proceed-payment",
      params: {
        serviceType,
        jobTitle,
        jobDescription,
        location,
        date: date.toISOString(),
        urgent: urgent ? "true" : "false",
        price: "5050",
      },
    } as any);
  };

  // ---------- animation for modal (slide + fade) ----------
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSummary) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSummary, fadeAnim, slideAnim]);

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const suggestions = JOB_SUGGESTIONS[serviceType] || [];
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(jobTitle.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: THEME.spacing.xl * 4 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {(showServiceDropdown || showJobSuggestions || showDescriptionSuggestions) && (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 50, backgroundColor: 'transparent' }]}
            activeOpacity={1}
            onPress={() => {
              setShowServiceDropdown(false);
              setShowJobSuggestions(false);
              setShowDescriptionSuggestions(false);
            }}
          />
        )}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Service</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Service type (Custom Dropdown) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Service Type</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowServiceDropdown(!showServiceDropdown)}
          >
            <Text style={styles.dropdownText}>{serviceType}</Text>
            <Ionicons name="chevron-down" size={20} color={THEME.colors.muted} />
          </TouchableOpacity>
          
          {showServiceDropdown && (
            <View style={styles.dropdownList}>
              {SERVICE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setServiceType(type);
                    setShowServiceDropdown(false);
                    setJobTitle(""); // Reset job title when service changes
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    serviceType === type && styles.selectedDropdownItemText
                  ]}>
                    {type}
                  </Text>
                  {serviceType === type && (
                    <Ionicons name="checkmark" size={18} color={THEME.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Job title with AI Suggestions */}
        <View style={[styles.fieldContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Job Title</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="e.g. Fix leaking sink"
              placeholderTextColor={THEME.colors.muted}
              value={jobTitle}
              onChangeText={(text) => {
                setJobTitle(text);
                setShowJobSuggestions(true);
              }}
              onFocus={() => setShowJobSuggestions(true)}
              style={styles.input}
            />
            {jobTitle.length > 0 && (
              <TouchableOpacity onPress={() => setJobTitle("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={16} color={THEME.colors.muted} />
              </TouchableOpacity>
            )}
          </View>
          
          {showJobSuggestions && filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsHeader}>AI Suggestions ✨</Text>
              {filteredSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setJobTitle(suggestion);
                    setShowJobSuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Ionicons name="add-circle-outline" size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Job description */}
        <View style={[styles.fieldContainer, { zIndex: 0 }]}>
          <Text style={styles.label}>Job Description</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Describe the work you need done..."
              placeholderTextColor={THEME.colors.muted}
              value={jobDescription}
              onChangeText={(text) => {
                setJobDescription(text);
                setShowDescriptionSuggestions(true);
              }}
              onFocus={() => setShowDescriptionSuggestions(true)}
              style={styles.textArea}
              multiline
              numberOfLines={4}
            />
          </View>
          
          {showDescriptionSuggestions && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsHeader}>AI Suggestions ✨</Text>
              {DESCRIPTION_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setJobDescription(suggestion);
                    setShowDescriptionSuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Ionicons name="add-circle-outline" size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date & Time */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={THEME.colors.primary} />
            <Text style={styles.dateText}>
              {date.toLocaleDateString("en-NG", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Location */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            placeholder="Enter address"
            placeholderTextColor={THEME.colors.muted}
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
        </View>

        {/* File upload */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Attachments (Optional)</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleFileUpload}
            activeOpacity={0.8}
          >
            {selectedFile ? (
              <View style={styles.filePreview}>
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.fileImage}
                />
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name || "Selected Image"}
                </Text>
                <TouchableOpacity 
                  style={styles.removeFileButton}
                  onPress={() => setSelectedFile(null)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <MaterialCommunityIcons name="cloud-upload-outline" size={32} color={THEME.colors.primary} />
                <Text style={styles.uploadText}>Tap to upload image</Text>
                <Text style={styles.uploadSubText}>Max size 5MB</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Urgent toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Urgent Request</Text>
            <Text style={styles.toggleSubLabel}>Get a response within 15 mins</Text>
          </View>
          <Switch
            value={urgent}
            onValueChange={setUrgent}
            trackColor={{ false: "#E5E7EB", true: THEME.colors.primary }}
            thumbColor={"#fff"}
          />
        </View>

        {/* Price Calculation Info */}
        <View style={styles.priceInfoContainer}>
          <View style={styles.priceInfoHeader}>
            <Ionicons name="information-circle-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.priceInfoTitle}>How price is calculated</Text>
          </View>
          <Text style={styles.priceInfoText}>
            The base fee covers the artisan's transportation and initial assessment. 
            Additional costs for materials and labor hours will be discussed and added 
            to the final bill after the job is completed.
          </Text>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <Text style={styles.continueText}>Review & Book</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* -----------------------------
          Booking Summary Modal
         ----------------------------- */}
      <Modal transparent visible={showSummary} animationType="none">
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowSummary(false)}
          />
          <Animated.View
            style={[styles.summaryCard, { transform: [{ translateY: slideUp }] }]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Booking Summary</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Artisan info */}
              <View style={styles.artisanCard}>
                <Image
                  source={require("../../assets/images/profileavatar.png")}
                  style={styles.avatar}
                />
                <View style={styles.artisanDetails}>
                  <Text style={styles.artisanName}>{artisanName}</Text>
                  <Text style={styles.artisanSkill}>{serviceType}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FACC15" />
                    <Text style={styles.ratingText}>4.9 (120 reviews)</Text>
                  </View>
                </View>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summarySectionTitle}>Job Details</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Title</Text>
                  <Text style={styles.summaryValue}>{jobTitle || "Not specified"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>
                    {date.toLocaleDateString("en-NG", { weekday: 'short', day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>
                    {date.toLocaleTimeString("en-NG", { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Location</Text>
                  <Text style={styles.summaryValue} numberOfLines={1}>{location}</Text>
                </View>
              </View>

              <View style={styles.summarySection}>
                <Text style={styles.summarySectionTitle}>Payment Breakdown</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Base Fee</Text>
                  <Text style={styles.summaryValue}>₦5,000</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service Fee</Text>
                  <Text style={styles.summaryValue}>₦50</Text>
                </View>
                {urgent && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: THEME.colors.primary }]}>Urgent Fee</Text>
                    <Text style={[styles.summaryValue, { color: THEME.colors.primary }]}>₦2,000</Text>
                  </View>
                )}
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Estimate</Text>
                  <Text style={styles.totalValue}>₦{urgent ? "7,050" : "5,050"}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={handleProceedToPayment}
              >
                <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleEditDetails}
              >
                <Text style={styles.cancelButtonText}>Edit Details</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.lg,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  fieldContainer: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: THEME.colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  textArea: {
    backgroundColor: THEME.colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minHeight: 100,
    textAlignVertical: "top",
  },
  
  // Custom Dropdown
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  dropdownText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 4,
    zIndex: 100,
    ...THEME.shadow.card,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.background,
  },
  dropdownItemText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  selectedDropdownItemText: {
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Suggestions
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginTop: 4,
    zIndex: 100,
    ...THEME.shadow.card,
    padding: 8,
  },
  suggestionsHeader: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
    marginLeft: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Date Button
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  dateText: {
    marginLeft: 12,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },

  // Upload
  uploadBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  uploadSubText: {
    marginTop: 4,
    fontSize: 12,
    color: THEME.colors.muted,
  },
  filePreview: {
    alignItems: "center",
    position: "relative",
  },
  fileImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 12,
    color: THEME.colors.text,
    maxWidth: 200,
  },
  removeFileButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: THEME.colors.error,
    borderRadius: 12,
    padding: 4,
  },

  // Toggle
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 24,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  toggleSubLabel: {
    fontSize: 12,
    color: THEME.colors.muted,
    marginTop: 2,
  },

  // Price Info
  priceInfoContainer: {
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  priceInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  priceInfoTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.primary,
  },
  priceInfoText: {
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 20,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Footer
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderColor: THEME.colors.border,
  },
  continueButton: {
    backgroundColor: THEME.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  continueText: {
    color: "white",
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  summaryCard: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  artisanCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  artisanDetails: {
    flex: 1,
  },
  artisanName: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  artisanSkill: {
    fontSize: 14,
    color: THEME.colors.muted,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: THEME.colors.text,
  },
  summarySection: {
    marginBottom: 24,
  },
  summarySectionTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.muted,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  summaryValue: {
    fontSize: 14,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    maxWidth: "60%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  modalFooter: {
    marginTop: 24,
    gap: 12,
  },
  proceedButton: {
    backgroundColor: THEME.colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: THEME.colors.muted,
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});
