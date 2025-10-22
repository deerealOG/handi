import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";


export default function AdminUserModal() {
    const router = useRouter();

    const params = useLocalSearchParams();

    const user = {
        id: params.id || "N/A",
        name: params.name || "Unknown User",
        role: params.role || "Unknown Role",
        status: params.status || "N/A",
    };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 User Profile</Text>

      <View style={[styles.card, styles.shadow]}>
  <Text style={styles.name}>{user.name}</Text>
  <Text style={styles.detail}>Role: {user.role}</Text>
  <Text
    style={[
      styles.detail,
      user.status === "Active" ? styles.active : styles.suspended,
    ]}
  >
    Status: {user.status}
  </Text>
</View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
    textAlign: "center",
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
  },
  name: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    color: THEME.colors.admin,
    marginBottom: THEME.spacing.sm,
  },
  detail: {
    fontSize: THEME.typography.sizes.base,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  active: {
    color: THEME.colors.success,
  },
  suspended: {
    color: THEME.colors.danger,
  },
  closeButton: {
    marginTop: THEME.spacing.xl,
    backgroundColor: THEME.colors.admin,
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    color: THEME.colors.white,
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
