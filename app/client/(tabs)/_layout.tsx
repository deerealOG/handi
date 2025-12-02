// app/client/(tabs)/_layout.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { THEME } from "../../../constants/theme";

export default function ClientTabs() {
  return (
    <Tabs
      // ⚙️ General Tab Navigator Configuration
      screenOptions={{
        headerShown: false, // Hide headers on all tab screens
        tabBarShowLabel: true, // Show labels under icons
        tabBarActiveTintColor: THEME.colors.primary, // Active tab color from theme
        tabBarInactiveTintColor: THEME.colors.muted, // Inactive tab color
        tabBarStyle: {
          backgroundColor: THEME.colors.surface, // Use themed surface color
          borderTopColor: THEME.colors.border, // Subtle divider line
          height: 60,
          paddingBottom: THEME.spacing.xs,
          paddingTop: THEME.spacing.xs,
          ...THEME.shadow.card, // Light shadow for elevation
        },
        tabBarLabelStyle: {
          fontSize: THEME.typography.sizes.sm, // Label font size from theme
          fontFamily: THEME.typography.fontFamily.bodyMedium, // Consistent font
          lineHeight: THEME.typography.sizes.sm * THEME.typography.lineHeights.normal,
        },
      }}
    >
      {/* 🏠 HOME TAB */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 🔍 EXPLORE TAB */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "magnify-plus" : "magnify"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 📅 BOOKINGS TAB */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "calendar-check" : "calendar-check-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 💳 WALLET TAB */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "wallet" : "wallet-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 👤 PROFILE TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />


    </Tabs>
  );
}
