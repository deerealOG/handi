// app/artisan/(tabs)/profile.tsx
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanProfile() {
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
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>

      {/* Profile Info */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <Image
          source={require("../../../assets/images/profileavatar.png")}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: colors.text }]}>Emeka Johnson</Text>
        <Text style={[styles.profession, { color: colors.muted }]}>Electrician</Text>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons
            name="star"
            size={18}
            color="#FACC15"
          />
          <Text style={[styles.ratingText, { color: colors.text }]}>4.8 (45 Reviews)</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionList}>
        <ProfileButton
          icon="account-edit-outline"
          label="Edit Profile"
            onPress={() => router.push("../edit-profile")}
            colors={colors}
        />
        <ProfileButton
          icon="cog-outline"
          label="Settings"
          onPress={() => router.push("../settings")}
          colors={colors}
        />
        <ProfileButton
          icon="briefcase-outline"
          label="Portfolio"
          onPress={() => router.push("../portfolio")}
          colors={colors}
        />
        <ProfileButton
          icon="star-outline"
          label="Reviews"
          onPress={() => router.push("../reviews")}
          colors={colors}
        />
        <ProfileButton
          icon="key-outline"
          label="Change Password"
          onPress={() => router.push("../change-password")}
          colors={colors}
        />
        <ProfileButton
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => router.push("../help")}
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
