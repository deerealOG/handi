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

export default function ClientProfile() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            // The AuthContext will handle navigation to /welcome
          },
        },
      ]
    );
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
              {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <Image
            source={require("../../../assets/images/profileavatar.png")}
            style={[styles.avatar, { borderColor: colors.surface }]}
          />
          <Text style={[styles.name, { color: colors.text }]}>Golden Amadi</Text>
          <Text style={[styles.email, { color: colors.muted }]}>golden.amadi@example.com</Text>
          <View style={[styles.badge, { backgroundColor: colors.successLight }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>Client Account</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionList}>
          <ProfileButton
            icon="account-edit-outline"
            label="Edit Profile"
            onPress={() => router.push("/client/profile/edit-profile")}
            colors={colors}
          />
          <ProfileButton
            icon="cog-outline"
            label="Settings"
            onPress={() => router.push("/client/profile/settings")}
            colors={colors}
          />
          <ProfileButton
            icon="shield-check-outline"
            label="Security"
            onPress={() => router.push("/client/profile/security")}
             colors={colors}
          />
          <ProfileButton
            icon="bell-outline"
            label="Notifications"
            onPress={() => router.push("/client/notifications")}
             colors={colors}
          />
          <ProfileButton
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => router.push("/client/profile/help")}
             colors={colors}
          />
          <ProfileButton
            icon="information-outline"
            label="About App"
            onPress={() => router.push("/client/profile/about")}
             colors={colors}
          />
          <ProfileButton
            icon="logout"
            label="Logout"
            color={colors.error}
            onPress={handleLogout}
             colors={colors}
          />
        </View>
        
        <Text style={[styles.versionText, { color: colors.muted }]}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function ProfileButton({
  icon,
  label,
  color,
  onPress,
  colors,
}: {
  icon: any;
  label: string;
  color?: string;
  onPress?: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity style={[styles.profileButton, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={styles.iconLabel}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={color || colors.primary}
        />
        <Text style={[styles.profileText, { color: color || colors.text }]}>
          {label}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={colors.muted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 16,
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
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    paddingVertical: 24,
    marginBottom: 30,
    ...THEME.shadow.base,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  email: {
    color: THEME.colors.muted,
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  actionList: {
    marginTop: 10,
  },
  profileButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...THEME.shadow.base,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileText: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginLeft: 12,
  },
  versionText: {
    textAlign: "center",
    color: THEME.colors.muted,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
});
