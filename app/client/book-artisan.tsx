// app/client/book-artisan.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
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
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

/**
 * BookArtisan screen
 * - Uses THEME tokens for consistent design
 * - Shows a form, file upload, datepicker and animated summary modal
 */
export default function BookArtisan() {
  const router = useRouter();

  // ---------- form state ----------
  const [serviceType, setServiceType] = useState<string>("Plumbing");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("Lekki Phase 1, Lagos");
  const [urgent, setUrgent] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  // ---------- summary modal ----------
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // ---------- document picker ----------
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      // Expo DocumentPicker on newer SDKs returns .canceled or .uri depending on options
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
      },
    });
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: THEME.spacing.xl * 2 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header: back icon + centered title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Request Service</Text>
      </View>

      {/* Service type (picker) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Service type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(v) => setServiceType(v as string)}
            style={styles.picker}
            dropdownIconColor={THEME.colors.primary}
            mode={Platform.OS === "android" ? "dialog" : "dropdown"}
          >
            <Picker.Item label="Plumbing" value="Plumbing" />
            <Picker.Item label="Electrical" value="Electrical" />
            <Picker.Item label="Carpentry" value="Carpentry" />
            <Picker.Item label="Cleaning" value="Cleaning" />
            <Picker.Item label="Painting" value="Painting" />
          </Picker>
        </View>
      </View>

      {/* Job title */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          placeholder="Fix leaking sink"
          placeholderTextColor={THEME.colors.muted}
          value={jobTitle}
          onChangeText={setJobTitle}
          style={styles.input}
        />
      </View>

      {/* Job description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Job Description</Text>
        <TextInput
          placeholder="Describe the work you need done..."
          placeholderTextColor={THEME.colors.muted}
          value={jobDescription}
          onChangeText={setJobDescription}
          style={styles.textArea}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Date & Time */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Date & Time{" "}
          <Text style={{ color: THEME.colors.muted, fontSize: 12 }}>
            (pick date & time)
          </Text>
        </Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={THEME.colors.primary}
          />
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
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleFileUpload}
          activeOpacity={0.8}
        >
          {selectedFile ? (
            <Image
              source={{ uri: selectedFile.uri }}
              style={{ width: 80, height: 80, borderRadius: THEME.radius.sm }}
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="upload"
                size={28}
                color={THEME.colors.primary}
              />
              <Text style={styles.uploadText}>
                Size must be less than 1MB — JPG / PNG
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Urgent toggle */}
      <View style={styles.toggleRow}>
        <Switch
          value={urgent}
          onValueChange={setUrgent}
          thumbColor={urgent ? THEME.colors.primary : "#ccc"}
        />
        <Text style={styles.toggleLabel}>Urgent Request</Text>
      </View>

      {/* Continue to summary */}
      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
        <Text style={styles.continueText}>Continue to Summary</Text>
      </TouchableOpacity>

      {/* -----------------------------
          Booking Summary Modal (animated)
         ----------------------------- */}
      <Modal transparent visible={showSummary} animationType="none">
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View
            style={[styles.summaryCard, { transform: [{ translateY: slideUp }] }]}
          >
            {/* handle + title */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Booking Summary</Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 140 }}
            >
              {/* Artisan info */}
              <View style={styles.artisanInfo}>
                <Image
                  source={require("../../assets/images/profileavatar.png")}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.artisanName}>Emeka Johnson</Text>
                  <Text style={styles.artisanSkill}>{serviceType}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Job details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Details</Text>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="briefcase-outline"
                    size={18}
                    color={THEME.colors.primary}
                  />
                  <Text style={styles.detailText}>
                    {jobTitle.trim() ? jobTitle : "No title provided"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={18}
                    color={THEME.colors.primary}
                  />
                  <Text style={[styles.detailText, { flex: 1 }]} numberOfLines={3}>
                    {jobDescription.trim()
                      ? jobDescription
                      : "No description provided"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="calendar-outline"
                    size={18}
                    color={THEME.colors.primary}
                  />
                  <Text style={styles.detailText}>
                    {date.toLocaleString("en-NG", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={18}
                    color={THEME.colors.primary}
                  />
                  <Text style={styles.detailText}>
                    {location.trim() ? location : "No location specified"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={18}
                    color={urgent ? THEME.colors.primary : THEME.colors.muted}
                  />
                  <Text style={styles.detailText}>
                    {urgent ? "Urgent Request" : "Normal Request"}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Payment breakdown */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Breakdown</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.detailText}>Service Fee:</Text>
                  <Text style={styles.boldText}>₦5,000</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.detailText}>Platform Fee:</Text>
                  <Text style={styles.boldText}>₦50</Text>
                </View>
              </View>
            </ScrollView>

            {/* Sticky footer */}
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>₦5,050</Text>
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: THEME.colors.primary }]}
                  onPress={handleProceedToPayment}
                >
                  <Text style={[styles.modalButtonText, { color: THEME.colors.surface }]}>
                    Proceed to Payment
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.editButton]}
                  onPress={handleEditDetails}
                >
                  <Text style={[styles.modalButtonText, { color: THEME.colors.primary }]}>
                    Edit Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </ScrollView>
  );
}

/* ========================
   THEMED STYLES
   ======================== */
const styles = StyleSheet.create({
  // container
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
  },

  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginRight: 22,
  },

  // fields
  fieldContainer: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  pickerWrapper: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    overflow: "hidden",
  },
  picker: {
    color: THEME.colors.text,
  },
  input: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },
  textArea: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    textAlignVertical: "top",
    minHeight: 100,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // date
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
  },
  dateText: {
    marginLeft: THEME.spacing.sm,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyLight,
  },

  // upload
  uploadBox: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing.lg,
  },
  uploadText: {
    color: THEME.colors.muted,
    marginTop: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyLight,
  },

  // toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  toggleLabel: {
    marginLeft: THEME.spacing.sm,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // continue button
  continueButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: THEME.spacing.md,
    alignItems: "center",
    marginBottom: THEME.spacing.xl,
  },
  continueText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // modal overlay + card
  modalOverlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  summaryCard: {
    backgroundColor: THEME.colors.surface,
    width: "100%",
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
    ...THEME.shadow.base,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  modalHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },

  // artisan info
  artisanInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: THEME.spacing.md,
  },
  artisanName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  artisanSkill: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // details + payment
  section: {
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.sm,
  },
  detailText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
  boldText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.xs,
  },

  // divider
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.md,
  },

  // footer (sticky)
  footer: {
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderColor: THEME.colors.border,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.sm,
  },
  totalLabel: {
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  totalValue: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: "center",
    marginHorizontal: THEME.spacing.xs,
  },
  editButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  modalButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
