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

  const normalizedStatus = String(user.status).toLowerCase();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Text style={[styles.title, { color: colors.text }]}>User Profile</Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.name, { color: colors.secondary }]}>{user.name}</Text>
        <Text style={[styles.detail, { color: colors.text }]}>Role: {user.role}</Text>
        <Text
          style={[
            styles.detail,
            normalizedStatus === "active"
              ? { color: colors.success }
              : normalizedStatus === "suspended"
              ? { color: colors.warning }
              : { color: colors.error },
          ]}
        >
          Status: {String(user.status)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: colors.secondary }]}
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
    borderWidth: 1,
    padding: THEME.spacing.lg,
    ...THEME.shadow.card,
  },
  name: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.sm,
  },
  detail: {
    fontSize: THEME.typography.sizes.base,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  closeButton: {
    marginTop: THEME.spacing.xl,
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    fontWeight: "700",
    color: "#000000",
  },
});
