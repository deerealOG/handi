import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { THEME } from "../../../constants/theme";

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.secondary,
        tabBarInactiveTintColor: THEME.colors.muted,
        tabBarStyle: {
          backgroundColor: THEME.colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: "#e5e7eb",
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: THEME.typography.sizes.sm,
          fontWeight: "600",
        },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Users */}
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Jobs */}
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Transactions */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Reports */}
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
