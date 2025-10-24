import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanHomeScreen() {
  const [isOnline, setIsOnline] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const modalSlide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade and slide animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);


  // Modal slide animation
  useEffect(() => {
    Animated.timing(modalSlide, {
      toValue: showModal ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showModal, modalSlide]);

  const slideUp = modalSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [250, 0],
  });

  const handleAcceptPress = (job: any) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    setTimeout(() => {
      alert(`✅ You’ve successfully accepted the job: "${selectedJob.title}"`);
    }, 300);
  };

  const renderJobCard = ({ item }: any) => (
    <Animated.View
      style={[
        styles.jobCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.jobIconContainer}>
        <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={THEME.colors.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
      </View>

      <View style={styles.jobAmountContainer}>
        <Text style={styles.jobAmount}>{item.amount}</Text>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptPress(item)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )

  type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

  const availableJobs: {
    id: string;
    title: string;
    location: string;
    amount: string;
    icon: IconName;
  }[] = [

      {
      id: "1",
      title: "Fix leaking kitchen sink",
      location: "Victoria Island, Lagos",
      amount: "₦5,000",
      icon: "wrench-outline",
    },
    {
      id: "2",
      title: "Electrical socket installation",
      location: "Yaba, Lagos",
      amount: "₦7,500",
      icon: "flash-outline",
    },
    {
      id: "3",
      title: "Repaint 2-bedroom apartment",
      location: "Surulere, Lagos",
      amount: "₦15,000",
      icon: "format-paint",
    },
  ];


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.nameText}>Golden Amadi</Text>
        </View>
        <Image
          source={require("../../../assets/images/profileavatar.png")}
          style={styles.avatar}
        />
      </View>

      {/* Online Toggle */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            {isOnline ? "You're Online" : "You're Offline"}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            thumbColor={isOnline ? THEME.colors.primary : "#ccc"}
            trackColor={{ false: "#ccc", true: "rgba(28,140,75,0.4)" }}
          />
        </View>
        <Text style={styles.statusSubText}>
          {isOnline
            ? "Clients can now see your profile and send requests."
            : "You are currently invisible to clients."}
        </Text>
      </View>

      {/* Earnings Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: "#E8F5E9" }]}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={28}
            color={THEME.colors.primary}
          />
          <View>
            <Text style={styles.summaryLabel}>Earnings</Text>
            <Text style={styles.summaryValue}>₦35,000</Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: "#FFF4E5" }]}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={28}
            color="#F57C00"
          />
          <View>
            <Text style={styles.summaryLabel}>Jobs Completed</Text>
            <Text style={styles.summaryValue}>12</Text>
          </View>
        </View>
      </View>

      {/* Active Jobs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Job</Text>
        <View style={styles.activeJobCard}>
          <View>
            <Text style={styles.activeJobTitle}>Bathroom Pipe Repair</Text>
            <Text style={styles.activeJobLocation}>Lekki Phase 1, Lagos</Text>
          </View>
          <Text style={styles.activeJobAmount}>₦8,000</Text>
        </View>
      </View>

      {/* Available Jobs */}
      <View style={styles.availableJobContainer}>
        <Text style={styles.availableJobTitle}>Available Jobs</Text>

        <FlatList
          data={availableJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
      <Modal transparent visible={showModal} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContainer, { transform: [{ translateY: slideUp }] }]}
          >
            <Text style={styles.modalTitle}>Accept Job?</Text>
            <Text style={styles.modalText}>
              Do you want to accept this job request?
            </Text>

            {selectedJob && (
              <View style={styles.modalJobDetails}>
                <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
                <Text style={styles.modalJobInfo}>{selectedJob.location}</Text>
                <Text style={styles.modalJobAmount}>{selectedJob.amount}</Text>
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.modalButtonText}>Yes, Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: THEME.colors.primary }]}>
                  Cancel
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
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 20,
    paddingTop: 20,
  },
  availableJobContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 20,
  },
  availableJobTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginVertical: THEME.spacing.md,
  },
  welcomeText: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginTop: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  nameText: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius:15,
  },

  statusCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    ...THEME.shadow.base,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: THEME.typography.sizes.base,
    marginBottom: THEME.spacing.xs,
  },
  statusSubText: {
    fontSize: 13,
    color: THEME.colors.muted,
    marginTop: 6,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 4,
    gap: 10,
  },
  summaryLabel: {
    color: THEME.colors.muted,
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.text,
  },

  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginVertical: THEME.spacing.md,
  },
  activeJobCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...THEME.shadow.base,
  },
  activeJobTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginTop: THEME.spacing.xs,
    color: THEME.colors.text,
  },
  activeJobLocation: {
    fontSize: 13,
    color: THEME.colors.muted,
  },
  activeJobAmount: {
    fontWeight: "700",
    color: THEME.colors.primary,
    fontSize: 15,
  },

  jobCard: {
    flexDirection: "row",
    backgroundColor: THEME.colors.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
    ...THEME.shadow.card,
  },

  jobIconContainer: {
    backgroundColor: "rgba(28,140,75,0.08)",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  jobLocation: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
    marginTop: 2,
  },
  jobAmountContainer: {
    alignItems: "flex-end",
  },
  jobAmount: {
    fontWeight: "700",
    color: THEME.colors.primary,
    fontSize: 15,
    marginBottom: 6,
  },
  acceptButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acceptButtonText: {
    color: THEME.colors.surface,
    fontSize: 12,
    fontWeight: "600",
  },
   // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    color: THEME.colors.muted,
    marginBottom: 15,
  },
  modalJobDetails: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  modalJobTitle: {
    fontWeight: "600",
    fontSize: 15,
    color: THEME.colors.text,
  },
  modalJobInfo: {
    color: THEME.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  modalJobAmount: {
    color: THEME.colors.primary,
    fontWeight: "700",
    marginTop: 4,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: THEME.colors.primary,
  },
  cancelButton: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  modalButtonText: {
    fontWeight: "600",
    color: THEME.colors.surface,
  },
})