import { useAppTheme } from "@/hooks/use-app-theme";
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
  const { colors } = useAppTheme();

  const renderJob = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: colors.surface }, styles.shadow]}>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.detail, { color: colors.muted }]}>
        Client: <Text style={[styles.bold, { color: colors.text }]}>{item.client}</Text>
      </Text>
      <Text style={[styles.detail, { color: colors.muted }]}>
        Artisan: <Text style={[styles.bold, { color: colors.text }]}>{item.artisan}</Text>
      </Text>

      <Text
        style={[
          styles.status,
          item.status === "Active"
            ? { color: colors.error }
            : item.status === "Completed"
            ? { color: colors.success }
            : { color: colors.error },
        ]}
      >
        {item.status}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.secondary }]}
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
        <Text style={[styles.buttonText, { color: colors.text }]}>
          {item.status === "Dispute" ? "Resolve Dispute" : "View Details"}
        </Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>🧰 Job Management</Text>

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
    padding: THEME.spacing.md,
  },
  header: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.md,
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
    marginBottom: THEME.spacing.xs,
  },
  detail: {
    fontSize: THEME.typography.sizes.base,
  },
  bold: {
    fontWeight: "600",
  },
  status: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: "600",
    marginTop: THEME.spacing.sm,
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
