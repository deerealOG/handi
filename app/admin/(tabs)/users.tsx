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
  const renderUser = ({ item }: any) => (
    <View style={[styles.card, styles.shadow]}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Active" ? styles.active : styles.suspended,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.role}>
        Role:{" "}
        <Text
          style={{
            color:
              item.role === "Artisan"
                ? THEME.colors.artisan
                : THEME.colors.client,
          }}
        >
          {item.role}
        </Text>
      </Text>

      <TouchableOpacity
  style={styles.button}
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
  <Text style={styles.buttonText}>View Profile</Text>
</TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 User Management</Text>

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
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.title,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.white,
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
    color: THEME.colors.text,
  },
  status: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: "600",
  },
  active: {
    color: THEME.colors.success,
  },
  suspended: {
    color: THEME.colors.danger,
  },
  role: {
    color: THEME.colors.muted,
    marginTop: 6,
    fontSize: THEME.typography.sizes.base,
  },
  button: {
    backgroundColor: THEME.colors.admin,
    borderRadius: THEME.radius.md,
    paddingVertical: 6,
    marginTop: THEME.spacing.sm,
  },
  buttonText: {
    textAlign: "center",
    color: THEME.colors.white,
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
