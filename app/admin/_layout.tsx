// app/admin/_layout.tsx
// Admin section layout with sidebar

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, usePathname, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";

interface NavItem {
  path: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { path: "/admin", label: "Dashboard", icon: "grid-outline" },
  { path: "/admin/disputes", label: "Disputes", icon: "alert-circle-outline" },
  {
    path: "/admin/verifications",
    label: "Verifications",
    icon: "shield-checkmark-outline",
  },
  { path: "/admin/users", label: "Users", icon: "people-outline" },
  { path: "/admin/settings", label: "Settings", icon: "settings-outline" },
];

function AdminSidebar() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      style={[
        styles.sidebar,
        { backgroundColor: colors.surface, borderRightColor: colors.border },
      ]}
    >
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, { color: colors.primary }]}>HANDI</Text>
        <Text style={[styles.adminBadge, { backgroundColor: colors.error }]}>
          ADMIN
        </Text>
      </View>

      <View style={styles.navSection}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/admin" && pathname.startsWith(item.path));

          return (
            <Pressable
              key={item.path}
              style={[
                styles.navItem,
                isActive && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => router.push(item.path as any)}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colors.primary : colors.muted}
              />
              <Text
                style={[
                  styles.navLabel,
                  { color: isActive ? colors.primary : colors.text },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.logoutButton}
          onPress={() => router.replace("/login")}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AdminLayout() {
  const { colors } = useAppTheme();
  const isWeb = Platform.OS === "web";

  if (isWeb) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AdminSidebar />
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    padding: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    fontWeight: "700",
  },
  adminBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  navSection: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
});
