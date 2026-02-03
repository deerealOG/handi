// components/web/Sidebar.tsx
// Collapsible sidebar navigation for web artisan dashboard

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// Only render on web
if (Platform.OS !== "web") {
  module.exports = { Sidebar: () => null };
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons";
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "home-outline",
    iconFamily: "Ionicons",
    path: "/artisan",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: "briefcase-outline",
    iconFamily: "Ionicons",
    path: "/artisan/jobs",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: "wallet-outline",
    iconFamily: "Ionicons",
    path: "/artisan/wallet",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "calendar-outline",
    iconFamily: "Ionicons",
    path: "/artisan/calendar",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "chatbubble-ellipses-outline",
    iconFamily: "Ionicons",
    path: "/artisan/messages",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "person-outline",
    iconFamily: "Ionicons",
    path: "/artisan/profile",
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: "settings-outline",
    iconFamily: "Ionicons",
    path: "/artisan/settings",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: "help-circle-outline",
    iconFamily: "Ionicons",
    path: "/artisan/help",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  const isActiveRoute = (path: string) => {
    if (path === "/artisan" || path === "/artisan/") {
      return (
        pathname === "/artisan" ||
        pathname === "/artisan/" ||
        pathname === "/artisan/(tabs)"
      );
    }
    return pathname.startsWith(path);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = isActiveRoute(item.path);
    const IconComponent =
      item.iconFamily === "Ionicons" ? Ionicons : MaterialCommunityIcons;

    return (
      <Pressable
        key={item.id}
        style={[
          styles.navItem,
          isActive && { backgroundColor: colors.primaryLight },
          isCollapsed && styles.navItemCollapsed,
        ]}
        onPress={() => router.push(item.path as any)}
      >
        <IconComponent
          name={item.icon as any}
          size={22}
          color={isActive ? colors.primary : colors.muted}
        />
        {!isCollapsed && (
          <Text
            style={[
              styles.navLabel,
              { color: isActive ? colors.primary : colors.text },
              isActive && styles.navLabelActive,
            ]}
          >
            {item.label}
          </Text>
        )}
        {isActive && !isCollapsed && (
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: colors.primary },
            ]}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderRightColor: colors.border },
        isCollapsed && styles.containerCollapsed,
      ]}
    >
      {/* Logo / Brand */}
      <View style={[styles.header, isCollapsed && styles.headerCollapsed]}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="wrench" size={24} color="#fff" />
          </View>
          {!isCollapsed && (
            <Text style={[styles.logoText, { color: colors.text }]}>HANDI</Text>
          )}
        </View>
        <Pressable style={styles.collapseButton} onPress={handleToggle}>
          <Ionicons
            name={isCollapsed ? "chevron-forward" : "chevron-back"}
            size={20}
            color={colors.muted}
          />
        </Pressable>
      </View>

      {/* Main Navigation */}
      <View style={styles.navSection}>
        {!isCollapsed && (
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            MENU
          </Text>
        )}
        {navItems.map(renderNavItem)}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomSection}>
        {!isCollapsed && (
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            SUPPORT
          </Text>
        )}
        {bottomNavItems.map(renderNavItem)}

        {/* User Profile Section */}
        <View style={[styles.userSection, { borderTopColor: colors.border }]}>
          <Image
            source={require("../../assets/images/profileavatar.png")}
            style={styles.userAvatar}
          />
          {!isCollapsed && (
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                Golden Amadi
              </Text>
              <Text style={[styles.userRole, { color: colors.muted }]}>
                Artisan
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: "100%",
    borderRightWidth: 1,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "column",
  },
  containerCollapsed: {
    width: 72,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  headerCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontFamily: THEME.typography.fontFamily.heading,
    fontWeight: "700",
  },
  collapseButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  navSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    position: "relative",
  },
  navItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  navLabel: {
    fontSize: 15,
    marginLeft: 12,
    fontWeight: "500",
  },
  navLabelActive: {
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: "50%",
    width: 4,
    height: 20,
    borderRadius: 2,
    transform: [{ translateY: -10 }],
  },
  bottomSection: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  userRole: {
    fontSize: 12,
  },
});

export default Sidebar;
