import { useAppTheme } from "@/hooks/use-app-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function JobModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useAppTheme();

  const job = {
    id: params.id || "N/A",
    title: params.title || "Untitled Job",
    client: params.client || "Unknown Client",
    artisan: params.artisan || "Unknown Artisan",
    status: params.status || "N/A",
    description: params.description || "No additional details provided for this job.",
  };

  const normalizedStatus = String(job.status).toLowerCase();
  const isDispute = normalizedStatus.includes("dispute");
  const isCompleted = normalizedStatus.includes("complete");

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Job Details</Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.jobTitle, { color: colors.secondary }]}>{job.title}</Text>
        <Text style={[styles.detail, { color: colors.text }]}>Client: <Text style={styles.bold}>{job.client}</Text></Text>
        <Text style={[styles.detail, { color: colors.text }]}>Artisan: <Text style={styles.bold}>{job.artisan}</Text></Text>
        <Text style={[styles.detail, { color: colors.text }]}>Status: <Text
          style={[
            styles.bold,
            isCompleted
              ? { color: colors.success }
              : isDispute
              ? { color: colors.error }
              : { color: colors.warning },
          ]}
        >{String(job.status)}</Text></Text>
        <Text style={[styles.desc, { color: colors.muted }]}>{job.description}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          isDispute
            ? { backgroundColor: colors.error }
            : { backgroundColor: colors.success },
        ]}
        onPress={() => {
          Alert.alert(
            isDispute ? "Dispute marked for resolution" : "Booking marked completed",
          );
          router.back();
        }}
      >
        <Text style={styles.actionText}>
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
    borderWidth: 1,
    padding: THEME.spacing.lg,
    ...THEME.shadow.card,
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
    textTransform: "capitalize",
  },
  actionButton: {
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: THEME.spacing.lg,
  },
  actionText: {
    fontWeight: "700",
    color: "#FFFFFF",
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
});
