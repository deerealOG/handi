// app/artisan/(tabs)/profile.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanProfile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>My Profile</Text>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <Image
          source={require("../../../assets/images/profileavatar.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>Emeka Johnson</Text>
        <Text style={styles.profession}>Electrician</Text>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons
            name="star"
            size={18}
            color="#FFD700"
          />
          <Text style={styles.ratingText}>4.8 (45 Reviews)</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionList}>
        <ProfileButton
          icon="account-edit-outline"
          label="Edit Profile"
          onPress={() => router.push("../edit-profile")}
        />
        <ProfileButton
          icon="key-outline"
          label="Change Password"
          onPress={() => router.push("../change-password")}
        />
        <ProfileButton
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => router.push("../help")}
        />
        <ProfileButton
          icon="logout"
          label="Logout"
          color={THEME.colors.error}
          onPress={() => console.log("Logging out...")}
        />
      </View>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
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
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.text,
  },
  profession: {
    color: THEME.colors.muted,
    fontSize: 14,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: THEME.colors.text,
    fontSize: 13,
    marginLeft: 4,
  },
  actionList: {
    marginTop: 10,
  },
  profileButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 14,
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
    fontWeight: "500",
    marginLeft: 10,
  },
});
