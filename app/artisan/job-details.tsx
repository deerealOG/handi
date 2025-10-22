import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Animated,
    Easing,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function JobDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const slideAnim = new Animated.Value(0);

  const job = {
    id,
    title: "Fix Electrical Wiring",
    description:
      "Client reported frequent power outages due to faulty wiring in the living room. Requires inspection and rewiring.",
    date: "Oct 22, 2025 • 10:00 AM",
    location: "Lekki Phase 1, Lagos",
    client: {
      name: "Golden Amadi",
      avatar: require("../../assets/images/profileavatar.png"),
      contact: "goldenamadi@gmail.com",
    },
    status: "In Progress",
    fee: "₦5,000",
  };

  const animateModal = (toValue: number) => {
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleMarkComplete = () => {
    setShowCompleteModal(true);
    animateModal(1);
  };

  const handleCancelJob = () => {
    setShowCancelModal(true);
    animateModal(1);
  };

 const confirmComplete = () => {
  setShowCompleteModal(false);
  animateModal(0);
  router.push("/artisan/job-success");
};


  const confirmCancel = () => {
    setShowCancelModal(false);
    animateModal(0);
    alert("❌ Job canceled.");
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* --- Client Info --- */}
      <View style={styles.clientCard}>
        <Image source={job.client.avatar} style={styles.avatar} />
        <View>
          <Text style={styles.clientName}>{job.client.name}</Text>
          <Text style={styles.clientContact}>{job.client.contact}</Text>
        </View>
      </View>

      {/* --- Job Overview --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Overview</Text>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={18}
            color={THEME.colors.primary}
          />
          <Text style={styles.infoText}>{job.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={18}
            color={THEME.colors.primary}
          />
          <Text style={styles.infoText}>{job.location}</Text>
        </View>
        <Text style={styles.description}>{job.description}</Text>
      </View>

      {/* --- Status --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: "#FFF3CD" },
          ]}
        >
          <Text style={{ color: "#ff9800", fontWeight: "600" }}>
            {job.status}
          </Text>
        </View>
      </View>

      {/* --- Payment --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="cash"
            size={18}
            color={THEME.colors.primary}
          />
          <Text style={styles.infoText}>{job.fee}</Text>
        </View>
      </View>

      {/* --- Buttons --- */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: THEME.colors.primary }]}
          onPress={handleMarkComplete}
        >
          <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Mark Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#D32F2F" }]}
          onPress={handleCancelJob}
        >
          <MaterialCommunityIcons name="cancel" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Cancel Job</Text>
        </TouchableOpacity>
      </View>

      {/* --- Mark Complete Modal --- */}
      <Modal transparent visible={showCompleteModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalCard, { transform: [{ translateY: slideUp }] }]}
          >
            <Text style={styles.modalTitle}>Confirm Completion</Text>
            <Text style={styles.modalText}>
              Are you sure you have completed this job?
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: THEME.colors.primary }]}
                onPress={confirmComplete}
              >
                <Text style={styles.modalButtonText}>Yes, Complete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCompleteModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: THEME.colors.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* --- Cancel Job Modal --- */}
      <Modal transparent visible={showCancelModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalCard, { transform: [{ translateY: slideUp }] }]}
          >
            <Text style={styles.modalTitle}>Cancel Job</Text>
            <Text style={styles.modalText}>
              Do you really want to cancel this job? This action cannot be undone.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#D32F2F" }]}
                onPress={confirmCancel}
              >
                <Text style={styles.modalButtonText}>Yes, Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: THEME.colors.primary }]}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: THEME.colors.text },
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    ...THEME.shadow.base,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  clientName: { fontWeight: "700", fontSize: 16, color: THEME.colors.text },
  clientContact: { fontSize: 13, color: THEME.colors.muted },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: THEME.colors.text,
    marginBottom: 6,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoText: { marginLeft: 6, color: THEME.colors.text, fontSize: 13 },
  description: {
    color: THEME.colors.muted,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  buttonRow: { marginTop: 10, gap: 10 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
  },
  actionButtonText: { color: "#fff", fontWeight: "600", marginLeft: 8 },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: THEME.colors.text },
  modalText: {
    fontSize: 14,
    color: THEME.colors.muted,
    marginVertical: 10,
    lineHeight: 20,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: THEME.colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1.3,
    borderColor: THEME.colors.primary,
  },
});
