import { useAppTheme } from "@/hooks/use-app-theme";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

const mockUsers = [
  { id: "1", name: "Sarah Johnson", role: "Client", status: "Active" },
  { id: "2", name: "David Okafor", role: "Artisan", status: "Suspended" },
  { id: "3", name: "Emma Brown", role: "Client", status: "Active" },
  { id: "4", name: "Chidi Umeh", role: "Artisan", status: "Active" },
];

export default function AdminUsers() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const renderUser = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: colors.surface }, styles.shadow]}>
      <View style={styles.row}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Active" ? { color: colors.success } : { color: colors.error },
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={[styles.role, { color: colors.muted }]}>
        Role:{" "}
        <Text
          style={{
            color:
              item.role === "Artisan"
                ? colors.primary
                : colors.primary,
          }}
        >
          {item.role}
        </Text>
      </Text>

      <TouchableOpacity
  style={[styles.button, { backgroundColor: colors.secondary }]}
  onPress={() =>
    router.push({
      pathname: "/admin/modal",
      params: {
        id: item.id,
        name: item.name,
        role: item.role,
        status: item.status,
      },
    })
  }
>
  <Text style={[styles.buttonText, { color: colors.text }]}>View Profile</Text>
</TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>👥 User Management</Text>

      <FlatList
        data={mockUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.md,
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "600",
  },
  status: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: "600",
  },
  role: {
    marginTop: 6,
    fontSize: THEME.typography.sizes.base,
  },
  button: {
    borderRadius: THEME.radius.md,
    paddingVertical: 6,
    marginTop: THEME.spacing.sm,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  shadow: {
    shadowColor: "rgba(147,51,234,0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
