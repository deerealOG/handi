import { useAppTheme } from "@/hooks/use-app-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function JobModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useAppTheme();

  // Example of dynamic job data via params
  const job = {
    id: params.id || "N/A",
    title: params.title || "Untitled Job",
    client: params.client || "Unknown Client",
    artisan: params.artisan || "Unknown Artisan",
    status: params.status || "N/A",
    description:
      params.description ||
      "No additional details provided for this job.",
  };

  const isDispute = job.status === "Dispute";

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>🧰 Job Details</Text>

      <View style={[styles.card, { backgroundColor: colors.surface }, styles.shadow]}>
        <Text style={[styles.jobTitle, { color: colors.secondary }]}>{job.title}</Text>
        <Text style={[styles.detail, { color: colors.text }]}>
          Client: <Text style={styles.bold}>{job.client}</Text>
        </Text>
        <Text style={[styles.detail, { color: colors.text }]}>
          Artisan: <Text style={styles.bold}>{job.artisan}</Text>
        </Text>
        <Text style={[styles.detail, { color: colors.text }]}>
          Status:{" "}
          <Text
            style={[
              styles.bold,
              job.status === "Completed"
                ? { color: colors.success }
                : isDispute
                ? { color: colors.error }
                : { color: colors.error },
            ]}
          >
            {job.status}
          </Text>
        </Text>
        <Text style={[styles.desc, { color: colors.muted }]}>{job.description}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          isDispute ? { backgroundColor: colors.error } : { backgroundColor: colors.success },
        ]}
      >
        <Text style={[styles.actionText, { color: '#FFFFFF' }]}>
          {isDispute ? "Resolve Dispute" : "Mark as Completed"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: colors.secondary }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.closeText, { color: colors.text }]}>Close</Text>
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
    textAlign: "center",
    marginBottom: THEME.spacing.lg,
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
  },
  jobTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    marginBottom: THEME.spacing.sm,
  },
  detail: {
    fontSize: THEME.typography.sizes.base,
    marginBottom: 4,
  },
  desc: {
    marginTop: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.base,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
  },
  actionButton: {
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: THEME.spacing.lg,
  },
  actionText: {
    fontWeight: "700",
  },
  closeButton: {
    marginTop: THEME.spacing.lg,
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
