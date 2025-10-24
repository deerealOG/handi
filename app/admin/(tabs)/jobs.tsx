import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../../constants/theme";



const mockJobs = [
  {
    id: "1",
    title: "Fix Leaking Pipe",
    client: "Sarah Johnson",
    artisan: "David Okafor",
    status: "Active",
  },
  {
    id: "2",
    title: "Electrical Wiring",
    client: "Emma Brown",
    artisan: "Chidi Umeh",
    status: "Completed",
  },
  {
    id: "3",
    title: "Air Conditioner Repair",
    client: "John Doe",
    artisan: "Aisha Bello",
    status: "Dispute",
  },
];

export default function AdminJobs() {
  const router = useRouter();
  const renderJob = ({ item }: any) => (
    <View style={[styles.card, styles.shadow]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.detail}>
        Client: <Text style={styles.bold}>{item.client}</Text>
      </Text>
      <Text style={styles.detail}>
        Artisan: <Text style={styles.bold}>{item.artisan}</Text>
      </Text>

      <Text
        style={[
          styles.status,
          item.status === "Active"
            ? styles.active
            : item.status === "Completed"
            ? styles.completed
            : styles.dispute,
        ]}
      >
        {item.status}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/admin/jobModal",
            params: {
              id: item.id,
              title: item.title,
              client: item.client,
              artisan: item.artisan,
              status: item.status,
              description: "General maintenance and inspection work.",
            },
          })
        }
      >
        <Text style={styles.buttonText}>
          {item.status === "Dispute" ? "Resolve Dispute" : "View Details"}
        </Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧰 Job Management</Text>

      <FlatList
        data={mockJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
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
  header: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  detail: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.base,
  },
  bold: {
    color: THEME.colors.text,
    fontWeight: "600",
  },
  status: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: "600",
    marginTop: THEME.spacing.sm,
  },
  active: {
    color: THEME.colors.error,
  },
  completed: {
    color: THEME.colors.success,
  },
  dispute: {
    color: THEME.colors.error,
  },
  button: {
    backgroundColor: THEME.colors.secondary,
    borderRadius: THEME.radius.md,
    paddingVertical: 6,
    marginTop: THEME.spacing.sm,
  },
  buttonText: {
    textAlign: "center",
    color: THEME.colors.surface,
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
