// app/client/(tabs)/profile.tsx
// Redesigned to match web ClientProfileTab

import { useAuth } from "@/app/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "account-edit-outline", label: "Edit Profile", route: "/client/profile/edit-profile", color: "#3B82F6", bg: "#DBEAFE" },
      { icon: "cog-outline", label: "Settings", route: "/client/profile/settings", color: "#6B7280", bg: "#F3F4F6" },
      { icon: "shield-check-outline", label: "Security", route: "/client/profile/security", color: "#16A34A", bg: "#DCFCE7" },
      { icon: "bell-outline", label: "Notifications", route: "/client/notifications", color: "#F59E0B", bg: "#FEF3C7" },
    ],
  },
  {
    title: "Activity",
    items: [
      { icon: "message-text-outline", label: "Messages", route: "/client/chat", color: "#8B5CF6", bg: "#F3E8FF" },
      { icon: "heart-outline", label: "Saved Items", route: "/client/liked-items", color: "#EF4444", bg: "#FEE2E2" },
      { icon: "calendar-check-outline", label: "My Bookings", route: "/client/(tabs)/bookings", color: "#0EA5E9", bg: "#E0F2FE" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle-outline", label: "Help & Support", route: "/client/profile/help", color: "#0891B2", bg: "#CFFAFE" },
      { icon: "file-document-outline", label: "Terms of Service", route: "/client/terms", color: "#6B7280", bg: "#F3F4F6" },
      { icon: "lock-outline", label: "Privacy Policy", route: "/client/privacy", color: "#6B7280", bg: "#F3F4F6" },
      { icon: "information-outline", label: "About", route: "/client/profile/about", color: "#6B7280", bg: "#F3F4F6" },
    ],
  },
];

export default function ClientProfile() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { logout, user, userType } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => { await logout(); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatarRing, { borderColor: colors.primary }]}>
            <Image source={require("../../../assets/images/profileavatar.png")} style={styles.avatar} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || "User"}
          </Text>
          <Text style={[styles.email, { color: colors.muted }]}>{user?.email || "No email set"}</Text>
          {user?.phone && <Text style={[styles.phone, { color: colors.muted }]}>{user.phone}</Text>}
          <View style={[styles.badge, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {userType ? `${userType.charAt(0).toUpperCase()}${userType.slice(1)} Account` : "Account"}
            </Text>
          </View>
        </View>

        {/* Grouped Menu Sections */}
        {MENU_SECTIONS.map((section, sIdx) => (
          <View key={sIdx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity key={iIdx} style={[styles.menuItem, iIdx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                  onPress={() => router.push(item.route as any)}>
                  <View style={[styles.menuIconCircle, { backgroundColor: item.bg }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.error }]} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.muted }]}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
  backButton: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  headerTitle: { fontSize: 20, fontFamily: THEME.typography.fontFamily.heading },

  // Profile Card
  profileCard: { alignItems: "center", marginHorizontal: 16, borderRadius: 20, paddingVertical: 24, paddingHorizontal: 16, borderWidth: 1, marginBottom: 8, ...THEME.shadow.base },
  avatarRing: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 18, fontFamily: THEME.typography.fontFamily.heading, marginBottom: 4 },
  email: { fontSize: 14, fontFamily: THEME.typography.fontFamily.body, marginBottom: 2 },
  phone: { fontSize: 13, fontFamily: THEME.typography.fontFamily.body, marginBottom: 10 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 50 },
  badgeText: { fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading },

  // Grouped Sections
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 12, fontFamily: THEME.typography.fontFamily.subheading, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 4 },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", ...THEME.shadow.base },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 14, gap: 12 },
  menuIconCircle: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: THEME.typography.fontFamily.bodyMedium },

  // Logout
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, marginHorizontal: 16, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5 },
  logoutText: { fontSize: 15, fontFamily: THEME.typography.fontFamily.subheading },
  versionText: { textAlign: "center", fontSize: 12, marginTop: 16, marginBottom: 30 },
});
