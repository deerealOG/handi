import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanJobs() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const handleTabSwitch = (tab: "ongoing" | "completed") => {
    if (tab === activeTab) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 30,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(tab);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={styles.container}>
      {/* --- Header Section --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>

      {/* --- Job Stats --- */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#E8F5E9" }]}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFF3E0" }]}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Ongoing</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#E3F2FD" }]}>
          <Text style={styles.statNumber}>9</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* --- Tab Header --- */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ongoing" && styles.activeTabButton,
          ]}
          onPress={() => handleTabSwitch("ongoing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ongoing" && styles.activeTabText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "completed" && styles.activeTabButton,
          ]}
          onPress={() => handleTabSwitch("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- Animated Tab Content --- */}
      <Animated.View
        style={{
          flex: 1,
          //opacity: fadeAnim,
          //transform: [{ translateY: translateAnim }],
        }}
      >
        {activeTab === "ongoing" ? <OngoingJobs /> : <CompletedJobs />}
      </Animated.View>
    </View>
  );
}

/* ---------------------------------------------
   ONGOING JOBS COMPONENT
--------------------------------------------- */
function OngoingJobs() {
  const router = useRouter();
  const jobs = [
    {
      id: "1",
      title: "Fix Electrical Wiring",
      client: "Golden Amadi",
      date: "Oct 22, 2025 • 10:00 AM",
      status: "In Progress",
      avatar: require("../../../assets/images/profileavatar.png"),
    },
    {
      id: "2",
      title: "Plumbing Leak Repair",
      client: "Ada Lovelace",
      date: "Oct 25, 2025 • 02:30 PM",
      status: "Scheduled",
      avatar: require("../../../assets/images/profileavatar.png"),
    },
  ];

  return (
    <ScrollView style={styles.tabContainer}>
      {jobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <Image source={job.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.clientName}>{job.client}</Text>
              <Text style={styles.dateText}>{job.date}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    job.status === "In Progress"
                      ? "#FFE4B5"
                      : "rgba(28,140,75,0.1)",
                },
              ]}
            >
              <Text
                style={{
                  color:
                    job.status === "In Progress"
                      ? "#ff9800"
                      : THEME.colors.primary,
                  fontWeight: "600",
                }}
              >
                {job.status}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push(`/artisan/job-details?id=${job.id}`)}
          >
            <MaterialCommunityIcons
              name="eye"
              size={18}
              color={THEME.colors.surface}
            />
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

/* ---------------------------------------------
   COMPLETED JOBS COMPONENT
--------------------------------------------- */
function CompletedJobs() {
  const jobs = [
    {
      id: "3",
      title: "Paint Living Room",
      client: "John Doe",
      date: "Sept 10, 2025 • 3:00 PM",
      status: "Completed",
      avatar: require("../../../assets/images/profileavatar.png"),
    },
  ];

  return (
    <ScrollView style={styles.tabContainer}>
      {jobs.map((job) => (
        <TouchableOpacity 
          key={job.id} 
          style={styles.jobCard}
          onPress={() => router.push({ pathname: "/artisan/job-details", params: { id: job.id } })}
        >
          <View style={styles.jobHeader}>
            <Image source={job.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.clientName}>{job.client}</Text>
              <Text style={styles.dateText}>{job.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: "#E6F4EA" }]}>
              <Text style={{ color: THEME.colors.primary, fontWeight: "600" }}>
                {job.status}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/* ---------------------------------------------
   STYLES
--------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: THEME.spacing.sm,
    marginTop: THEME.spacing.xl,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 5,
  },
  statNumber: { 
    fontWeight: "700",
    fontSize: 16, color: THEME.colors.text 
  },
  statLabel: { 
    fontSize: 12, 
    color: THEME.colors.muted, 
    marginTop: 2 },

  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    backgroundColor: "#f2f2f2",
    marginHorizontal: THEME.spacing.xs,
  },
  activeTabButton: { 
    backgroundColor: THEME.colors.primary 
  },
  tabText: { 
  
    color: THEME.colors.muted,
    fontWeight: "600" },
  activeTabText: { 
    color: THEME.colors.surface 
  },

  tabContainer: { 
    flex: 1, 
    padding: 12 
  },
  jobCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    ...THEME.shadow.base,
  },
  jobHeader: { 
    flexDirection: "row", 
    alignItems: "center" },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12 
  },
  jobTitle: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: THEME.colors.text },
  clientName: { 
    fontSize: 13, 
    color: THEME.colors.muted, 
    marginVertical: 2 
  },
  dateText: { 
    fontSize: 12, 
    color: THEME.colors.muted 
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.primary,
    borderWidth: 0.8,
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  viewButtonText: {
    color: THEME.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
});
