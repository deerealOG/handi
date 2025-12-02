import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => router.replace("/auth/login" as any),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>My Profile</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileCard}>
          <Image
            source={require("../../../assets/images/profileavatar.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>Golden Amadi</Text>
          <Text style={styles.email}>golden.amadi@example.com</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Client Account</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionList}>
          <ProfileButton
            icon="account-edit-outline"
            label="Edit Profile"
            onPress={() => router.push("/client/profile/edit-profile")}
          />
          <ProfileButton
            icon="shield-check-outline"
            label="Security"
            onPress={() => router.push("/client/profile/security")}
          />
          <ProfileButton
            icon="bell-outline"
            label="Notifications"
            onPress={() => router.push("/client/notifications")}
          />
          <ProfileButton
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => router.push("/client/profile/help")}
          />
          <ProfileButton
            icon="information-outline"
            label="About App"
            onPress={() => router.push("/client/profile/about")}
          />
          <ProfileButton
            icon="logout"
            label="Logout"
            color={THEME.colors.error}
            onPress={handleLogout}
          />
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function ProfileButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: any;
  label: string;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.profileButton} onPress={onPress}>
      <View style={styles.iconLabel}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={color || THEME.colors.primary}
        />
        <Text style={[styles.profileText, { color: color || THEME.colors.text }]}>
          {label}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={THEME.colors.muted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 20,
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
