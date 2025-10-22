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

export default function BookArtisan() {
  const router = useRouter();

  const [serviceType, setServiceType] = useState("Plumbing");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState("Lekki Phase 1, Lagos");
  const [urgent, setUrgent] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);

  // --- File Upload ---
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.log("File upload error:", error);
    }
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

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
}
  

 // --- Modal Slide Animation ---
const slideAnim = useRef(new Animated.Value(0)).current; // For slide-up card
const fadeAnim = useRef(new Animated.Value(0)).current;  // For background fade

useEffect(() => {
  if (showSummary) {
    // Animate fade-in and slide-up together
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
    // Animate fade-out and slide-down
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
}, [showSummary, slideAnim, fadeAnim]);

const slideUp = slideAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [300, 0], // slides up from bottom
});


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
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

      {/* Service Type */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Service type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(itemValue) => setServiceType(itemValue)}
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

      {/* Job Title */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          placeholder="Fix leaking sink"
          value={jobTitle}
          onChangeText={setJobTitle}
          style={styles.input}
          placeholderTextColor={THEME.colors.muted}
        />
      </View>

      {/* Job Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Job Description</Text>
        <TextInput
          placeholder="Describe the work you need done..."
          value={jobDescription}
          onChangeText={setJobDescription}
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholderTextColor={THEME.colors.muted}
        />
      </View>

      {/* Date & Time */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Date & Time{" "}
          <Text style={{ color: THEME.colors.muted, fontSize: 12 }}>
            (Pick a date and time)
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
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          placeholderTextColor={THEME.colors.muted}
        />
      </View>

      {/* File Upload */}
      <View style={styles.fieldContainer}>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleFileUpload}
          activeOpacity={0.8}
        >
          {selectedFile ? (
            <Image
              source={{ uri: selectedFile.uri }}
              style={{ width: 80, height: 80, borderRadius: 10 }}
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="upload"
                size={28}
                color={THEME.colors.primary}
              />
              <Text style={styles.uploadText}>
                Size must be less than 1mb. JPG, PNG
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Urgent Toggle */}
      <View style={styles.toggleRow}>
        <Switch
          value={urgent}
          onValueChange={setUrgent}
          thumbColor={urgent ? THEME.colors.primary : "#ccc"}
        />
        <Text style={styles.toggleLabel}>Urgent Request</Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
        <Text style={styles.continueText}>Continue to Summary</Text>
      </TouchableOpacity>

      
{/* --- Booking Summary Modal --- */}
{/* --- Booking Summary Modal --- */}
<Modal
  animationType="none"
  transparent
  visible={showSummary}
  onRequestClose={() => setShowSummary(false)}
>
  <Animated.View
    style={[
      styles.modalOverlay,
      { opacity: fadeAnim },
    ]}
  >
    <Animated.View
      style={[
        styles.summaryCard,
        { transform: [{ translateY: slideUp }] },
      ]}
    >
      {/* Header Handle */}
      <View style={styles.modalHeader}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>Booking Summary</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Artisan Info */}
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Job Details */}
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
            <Text
              style={[styles.detailText, { flex: 1}]}
              numberOfLines={3}
            >
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Payment Breakdown */}
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

      {/* Sticky Footer */}
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
            <Text style={[styles.modalButtonText, { color: THEME.colors.white }]}>
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




const styles = StyleSheet.create({
  // ===== Container & Layout =====
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ===== Header =====
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
    marginRight: 22,
  },

  // ===== Form Fields =====
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: THEME.radius.md,
  },
  picker: {
    color: THEME.colors.text,
  },
  input: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: THEME.radius.md,
    padding: 12,
    color: THEME.colors.text,
  },
  textArea: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: THEME.radius.md,
    padding: 12,
    textAlignVertical: "top",
    color: THEME.colors.text,
    minHeight: 100,
  },

  // ===== Date & Time =====
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28,140,75,0.05)",
    padding: 12,
    borderRadius: THEME.radius.md,
  },
  dateText: {
    marginLeft: 8,
    color: THEME.colors.text,
  },

  // ===== Upload Box =====
  uploadBox: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: THEME.radius.md,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  uploadText: {
    color: THEME.colors.muted,
    marginTop: 6,
    fontSize: 12,
  },

  // ===== Urgent Toggle =====
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  toggleLabel: {
    marginLeft: 8,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.sm,
  },

  // ===== Continue Button =====
  continueButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.base,
    fontWeight: "600",
  },

 modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  justifyContent: "flex-end",
  alignItems: "center",
},
summaryCard: {
  backgroundColor: THEME.colors.white,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 20,
  width: "100%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 8,
},
modalHeader: {
  alignItems: "center",
  marginBottom: 12,
},
modalHandle: {
  width: 50,
  height: 5,
  borderRadius: 2.5,
  backgroundColor: "#ddd",
  marginBottom: 10,
},
modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: THEME.colors.text,
},
artisanInfo: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
},
avatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 12,
},
artisanName: {
  fontWeight: "600",
  color: THEME.colors.text,
  fontSize: 16,
},
artisanSkill: {
  color: THEME.colors.muted,
  fontSize: 13,
},
section: {
  marginBottom: 16,
},
sectionTitle: {
  fontWeight: "700",
  color: THEME.colors.text,
  fontSize: 15,
  marginBottom: 6,
},
detailText: {
  fontSize: 13,
  color: THEME.colors.text,
  marginBottom: 3,
  lineHeight: 18,
},
boldText: {
  fontWeight: "600",
},
breakdownRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 4,
},
modalButtonsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 18,
},
modalButton: {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: "center",
  marginHorizontal: 5,
},
editButton: {
  backgroundColor: "transparent",
  borderWidth: 0.5,
  borderColor: THEME.colors.primary,
},
modalButtonText: {
  fontSize: THEME.typography.sizes.base,
  fontWeight: "600",
},
divider: {
  height: 1,
  backgroundColor: "#eee",
  marginVertical: 12,
},

detailRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 6,
  gap: 8,
},

footer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: THEME.colors.white,
  borderTopWidth: 1,
  borderColor: "#eee",
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 6,
},

totalRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

totalLabel: {
  fontSize: THEME.typography.sizes.base,
  fontWeight: "600",
  color: THEME.colors.text,
},

totalValue: {
  fontSize: 18,
  fontWeight: "700",
  color: THEME.colors.primary,
},

});
