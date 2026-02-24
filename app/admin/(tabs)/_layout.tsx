import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useAppTheme } from "@/hooks/use-app-theme";
import { THEME } from "../../../constants/theme";

const ADMIN_ACCENT = THEME.colors.admin;

export default function AdminTabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ADMIN_ACCENT,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          ...THEME.shadow.card,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          fontFamily: THEME.typography.fontFamily.bodyMedium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="disputes"
        options={{
          title: "Disputes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="warning-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="payouts"
        options={{
          href: null,
          title: "Payouts",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="withdrawals"
        options={{
          href: null,
          title: "Withdrawals",
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="wallets"
        options={{
          href: null,
          title: "Wallets",
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          href: null,
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          href: null,
          title: "Reports",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
