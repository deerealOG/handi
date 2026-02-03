import { useAppTheme } from "@/hooks/use-app-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";


export default function AdminUserModal() {
    const router = useRouter();
    const { colors } = useAppTheme();

    const params = useLocalSearchParams();

    const user = {
        id: params.id || "N/A",
        name: params.name || "Unknown User",
        role: params.role || "Unknown Role",
        status: params.status || "N/A",
    };



  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>👤 User Profile</Text>

      <View style={[styles.card, { backgroundColor: colors.surface }, styles.shadow]}>
  <Text style={[styles.name, { color: colors.secondary }]}>{user.name}</Text>
  <Text style={[styles.detail, { color: colors.text }]}>Role: {user.role}</Text>
  <Text
    style={[
      styles.detail,
      user.status === "Active" ? { color: colors.success } : { color: colors.error },
    ]}
  >
    Status: {user.status}
  </Text>
</View>

      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: colors.secondary }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.closeText, { color: '#000000' }]}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.lg,
    textAlign: "center",
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
  },
  name: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.sm,
  },
  detail: {
    fontSize: THEME.typography.sizes.base,
    marginBottom: 4,
  },
  closeButton: {
    marginTop: THEME.spacing.xl,
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    fontWeight: "700",
  },
  shadow: {
    shadowColor: "rgba(147,51,234,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
