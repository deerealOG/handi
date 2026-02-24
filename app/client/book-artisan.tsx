// app/client/book-artisan.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { bookingService } from "@/services/bookingService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
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
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const artisanName = params.artisan || "Professional";
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
  const [uploadedFiles, setUploadedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const DESCRIPTION_SUGGESTIONS = [
    "I need a professional to fix...",
    "Looking for someone to install...",
    "Urgent repair needed for...",
    "Maintenance required for...",
    "Installation of new equipment...",
  ];

  // ---------- summary modal ----------
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

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

  // ---------- document picker ----------
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!("canceled" in result) && (result as any).uri) {
        setUploadedFiles([...uploadedFiles, result as any]);
      } else if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadedFiles([...uploadedFiles, result.assets[0]]);
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
  const handleProceed = useCallback(async () => {
    if (!serviceType || !jobTitle || !jobDescription || !location || !date) {
      Alert.alert("Incomplete Information", "Please fill in all required fields");
      return;
    }

    try {
      // Format the date and time for the booking
      const scheduledDate = date.toISOString().split('T')[0];
      const scheduledTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Create booking with required fields
      await bookingService.createBooking({
        artisanId: params.artisanId as string,
        categoryId: params.categoryId as string,
        categoryName: params.categoryName as string || serviceType,
        serviceType,
        description: `${jobTitle}: ${jobDescription}`,
        scheduledDate,
        scheduledTime,
        address: location,
        city: location.split(',').pop()?.trim() || 'Lagos', // Extract city from location or default to Lagos
        estimatedPrice: 0, // Free service
        images: uploadedFiles.map(file => file.uri)
      });

      // Navigate to success screen
      router.replace({
        pathname: "/client/booking-success",
        params: {
          artisanName: params.artisan,
          serviceType,
          date: date.toLocaleDateString(),
          time: scheduledTime
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    }
  }, [serviceType, jobTitle, jobDescription, location, date, uploadedFiles, params, router]);
  const handleProceedToPayment = handleProceed; // Alias for compatibility with existing code
  const handleEditDetails = () => setShowSummary(false); // Function to handle edit details

  // Toggle summary modal
  const toggleSummary = () => setShowSummary(!showSummary);

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
            style={styles.overlay}
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
            <Ionicons name="arrow-back" size={24} color={colors.text} />
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
            <Ionicons name="chevron-down" size={20} color={colors.muted} />
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
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
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
              placeholderTextColor={colors.placeholder}
              value={jobTitle}
              onChangeText={(text) => {
                setJobTitle(text);
                setShowJobSuggestions(text.length > 0);
              }}
              onFocus={() => setShowJobSuggestions(true)}
              style={styles.input}
            />
            {jobTitle.length > 0 && (
              <TouchableOpacity onPress={() => setJobTitle("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={16} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          {showJobSuggestions && filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsHeader}>AI Suggestions </Text>
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
                  <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
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
              placeholderTextColor={colors.placeholder}
              value={jobDescription}
              onChangeText={(text) => {
                setJobDescription(text);
                setShowDescriptionSuggestions(text.length > 0);
              }}
              onFocus={() => setShowDescriptionSuggestions(true)}
              style={styles.textArea}
              multiline
              numberOfLines={4}
            />
          </View>

          {showDescriptionSuggestions && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsHeader}>AI Suggestions </Text>
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
                  <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
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
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateText}>
              {date.toLocaleDateString("en-NG", {
                weekday: "short",
                month: "short",
                day: "numeric",
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
            placeholderTextColor={colors.placeholder}
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
            {uploadedFiles[0] ? (
              <View style={styles.filePreview}>
                <Image
                  source={{ uri: uploadedFiles[0].uri }}
                  style={styles.fileImage}
                />
                <Text style={styles.fileName} numberOfLines={1}>
                  {uploadedFiles[0].name || "Selected Image"}
                </Text>
                <TouchableOpacity
                  style={styles.removeFileButton}
                  onPress={() => setUploadedFiles([])}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <MaterialCommunityIcons name="cloud-upload-outline" size={32} color={colors.primary} />
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
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={"#fff"}
          />
        </View>

        {/* Price Calculation Info */}
        <View style={styles.priceInfoContainer}>
          <View style={styles.priceInfoHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.priceInfoTitle}>How price is calculated</Text>
          </View>
          <Text style={styles.priceInfoText}>
            Pricing is currently in beta. Your booking will be created for free, and the professional will confirm any pricing later.
          </Text>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={toggleSummary}>
          <Text style={styles.continueText}>Review & Book</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
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
                    <Ionicons name="star" size={14} color={colors.star} />
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
                <Text style={styles.summarySectionTitle}>Cost</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Beta Pricing</Text>
                  <Text style={styles.summaryValue}>Free</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₦0</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.proceedButton}
                onPress={handleProceedToPayment}
              >
                <Text style={styles.proceedButtonText}>Confirm Booking</Text>
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

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 30,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: colors.text,
  },
  fieldContainer: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  textArea: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: "top",
  },

  // Custom Dropdown
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: colors.text,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderBottomColor: colors.background,
  },
  dropdownItemText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: colors.text,
  },
  selectedDropdownItemText: {
    color: colors.primary,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Suggestions
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    zIndex: 100,
    ...THEME.shadow.card,
    padding: 8,
  },
  suggestionsHeader: {
    fontSize: 12,
    color: colors.primary,
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
    backgroundColor: colors.surfaceElevated,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Date Button
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    marginLeft: 12,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: colors.text,
  },

  // Upload
  uploadBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: colors.text,
  },
  uploadSubText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
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
    color: colors.text,
    maxWidth: 200,
  },
  removeFileButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 4,
  },

  // Toggle
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: colors.text,
  },
  toggleSubLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },

  // Price Info
  priceInfoContainer: {
    backgroundColor: colors.primaryLight,
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
    color: colors.primary,
  },
  priceInfoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Footer
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  continueButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  continueText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  summaryCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: colors.text,
  },
  artisanCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
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
    color: colors.text,
    marginBottom: 4,
  },
  artisanSkill: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
  },
  summarySection: {
    marginBottom: 24,
  },
  summarySectionTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: colors.muted,
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
    color: colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    maxWidth: "60%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: colors.primary,
  },
  modalFooter: {
    marginTop: 24,
    gap: 12,
  },
  proceedButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  proceedButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.muted,
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});
