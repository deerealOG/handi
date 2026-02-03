import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useAppTheme } from "@/hooks/use-app-theme";

export default function AdminTabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
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
            <Ionicons name="grid-outline" color={color} size={22} />
          ),
        }}
      />

      {/* Users */}
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={22} />
          ),
        }}
      />

      {/* Disputes - NEW */}
      <Tabs.Screen
        name="disputes"
        options={{
          title: "Disputes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" color={color} size={22} />
          ),
        }}
      />

      {/* Payouts - NEW */}
      <Tabs.Screen
        name="payouts"
        options={{
          title: "Payouts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={22} />
          ),
        }}
      />

      {/* Withdrawals - NEW */}
      <Tabs.Screen
        name="withdrawals"
        options={{
          title: "Withdrawals",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" color={color} size={22} />
          ),
        }}
      />

      {/* Jobs */}
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={22} />
          ),
        }}
      />

      {/* Reports - Hidden for now, accessible via more menu */}
      <Tabs.Screen
        name="transactions"
        options={{
          href: null, // Hide from tab bar
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="wallets"
        options={{
          title: "Wallets",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="apps-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          href: null, // Hide from tab bar
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
