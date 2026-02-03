// components/web/WebHeader.tsx
// Top header for web artisan dashboard

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// Only render on web
if (Platform.OS !== "web") {
  module.exports = { WebHeader: () => null };
}

interface WebHeaderProps {
  title?: string;
  showSearch?: boolean;
}

export function WebHeader({
  title = "Dashboard",
  showSearch = true,
}: WebHeaderProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      {/* Left: Title */}
      <View style={styles.leftSection}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      {/* Center: Search */}
      {showSearch && (
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search jobs, clients..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Right: Actions */}
      <View style={styles.rightSection}>
        {/* Notifications */}
        <Pressable
          style={[styles.iconButton, { backgroundColor: colors.background }]}
          onPress={() => router.push("/artisan/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.text}
          />
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </Pressable>

        {/* Messages */}
        <Pressable
          style={[styles.iconButton, { backgroundColor: colors.background }]}
          onPress={() => router.push("/artisan/messages")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={colors.text}
          />
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>5</Text>
          </View>
        </Pressable>

        {/* Profile Dropdown */}
        <Pressable
          style={styles.profileButton}
          onPress={() => router.push("/artisan/profile")}
        >
          <Image
            source={require("../../assets/images/profileavatar.png")}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              Golden Amadi
            </Text>
            <View style={styles.statusRow}>
              <View
                style={[styles.statusDot, { backgroundColor: colors.success }]}
              />
              <Text style={[styles.statusText, { color: colors.muted }]}>
                Online
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={16} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    fontWeight: "700",
  },
  searchContainer: {
    flex: 2,
    maxWidth: 400,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    outlineStyle: "none",
  } as any,
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 8,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    marginRight: 4,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
  },
});

export default WebHeader;
