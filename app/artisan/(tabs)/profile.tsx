import { useAuth } from "@/context/AuthContext";
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
import { THEME } from "../../../constants/theme";

const CERTIFICATIONS = [
  { name: "NABTEB Certificate", status: "verified" },
  { name: "Safety Training", status: "pending" },
];

const OVERFLOW_ITEMS = [
  { id: "wallet", label: "Wallet & Earnings", icon: "wallet-outline" as const },
  {
    id: "edit-profile",
    label: "Edit Profile",
    icon: "create-outline" as const,
  },
  { id: "portfolio", label: "Portfolio", icon: "images-outline" as const },
  {
    id: "promote",
    label: "Promote Services",
    icon: "megaphone-outline" as const,
  },
  { id: "reviews", label: "Reviews", icon: "star-outline" as const },
];

const SETTINGS_ITEMS = [
  {
    id: "notifications",
    label: "Notifications",
    icon: "notifications-outline" as const,
  },
  {
    id: "messages",
    label: "Messages",
    icon: "chatbubble-ellipses-outline" as const,
  },
  {
    id: "transactions",
    label: "Transaction History",
    icon: "time-outline" as const,
  },
  {
    id: "support",
    label: "Help & Support",
    icon: "help-circle-outline" as const,
  },
];

export default function ArtisanProfileScreen() {
  const { colors } = useAppTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const overflowRouteMap: Record<string, string> = {
    wallet: "/artisan/(tabs)/wallet",
    "edit-profile": "/artisan/edit-profile",
    portfolio: "/artisan/portfolio",
    promote: "/artisan/promote",
    reviews: "/artisan/reviews",
  };

  const settingsRouteMap: Record<string, string> = {
    notifications: "/artisan/notifications",
    messages: "/artisan/messages",
    transactions: "/artisan/transaction-receipt",
    support: "/artisan/help",
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.cover}>
          <View
            style={[styles.coverGradient, { backgroundColor: colors.primary }]}
          />
        </View>

        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Image
            source={require("../../../assets/images/profileavatar.png")}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName || "Provider"} {user?.lastName || ""}
          </Text>
          <Text style={[styles.role, { color: colors.muted }]}>
            Service Provider
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                4.8
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Rating
              </Text>
            </View>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: colors.text }]}>45</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Jobs
              </Text>
            </View>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                98%
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Response
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Certifications
          </Text>
          {CERTIFICATIONS.map((cert) => (
            <View
              key={cert.name}
              style={[styles.certRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.certLeft}>
                <MaterialCommunityIcons
                  name={
                    cert.status === "verified"
                      ? "check-decagram"
                      : "clock-outline"
                  }
                  size={16}
                  color={
                    cert.status === "verified" ? colors.success : colors.warning
                  }
                />
                <Text style={[styles.certName, { color: colors.text }]}>
                  {cert.name}
                </Text>
              </View>
              <Text
                style={[
                  styles.certStatus,
                  {
                    color:
                      cert.status === "verified"
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {cert.status}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Access
          </Text>
          {OVERFLOW_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => {
                const route = overflowRouteMap[item.id];
                if (route) {
                  router.push(route as any);
                }
              }}
            >
              <View style={styles.settingLeft}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Settings
          </Text>
          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => {
                const route = settingsRouteMap[item.id];
                if (route) {
                  router.push(route as any);
                }
              }}
            >
              <View style={styles.settingLeft}>
                <Ionicons name={item.icon} size={18} color={colors.muted} />
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.errorLight }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 30,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
    gap: 14,
  },
  cover: {
    height: 110,
    borderRadius: THEME.radius.xl,
    overflow: "hidden",
  },
  coverGradient: {
    flex: 1,
  },
  profileCard: {
    marginTop: -42,
    borderWidth: 1,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 8,
  },
  name: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  role: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  statsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  statCol: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
  },
  certRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  certLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  certName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  certStatus: {
    fontSize: 10,
    textTransform: "capitalize",
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  logoutButton: {
    borderRadius: THEME.radius.pill,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  logoutText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
