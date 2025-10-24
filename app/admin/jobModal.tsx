import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function JobModal() {
  const router = useRouter();
  const params = useLocalSearchParams();

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
    <View style={styles.container}>
      <Text style={styles.title}>🧰 Job Details</Text>

      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.detail}>
          Client: <Text style={styles.bold}>{job.client}</Text>
        </Text>
        <Text style={styles.detail}>
          Artisan: <Text style={styles.bold}>{job.artisan}</Text>
        </Text>
        <Text style={styles.detail}>
          Status:{" "}
          <Text
            style={[
              styles.bold,
              job.status === "Completed"
                ? styles.completed
                : isDispute
                ? styles.dispute
                : styles.active,
            ]}
          >
            {job.status}
          </Text>
        </Text>
        <Text style={styles.desc}>{job.description}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          isDispute ? styles.resolveBtn : styles.completeBtn,
        ]}
      >
        <Text style={styles.actionText}>
          {isDispute ? "Resolve Dispute" : "Mark as Completed"}
        </Text>
      </TouchableOpacity>

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
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    color: THEME.colors.text,
    textAlign: "center",
    marginBottom: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
  },
  jobTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: "700",
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.sm,
  },
  detail: {
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.base,
    marginBottom: 4,
  },
  desc: {
    color: THEME.colors.muted,
    marginTop: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.base,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
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
  actionButton: {
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: THEME.spacing.lg,
  },
  resolveBtn: {
    backgroundColor: THEME.colors.error,
  },
  completeBtn: {
    backgroundColor: THEME.colors.success,
  },
  actionText: {
    color: THEME.colors.surface,
    fontWeight: "700",
  },
  closeButton: {
    marginTop: THEME.spacing.lg,
    backgroundColor: THEME.colors.secondary,
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    color: THEME.colors.surface,
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
