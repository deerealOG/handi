import { ADMIN_DISPUTES } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

type DisputeFilter = "all" | "open" | "in-review" | "resolved";

const statusColor = (status: string, colors: any) => {
  if (status === "open") return { bg: colors.errorLight, fg: colors.error };
  if (status === "resolved") return { bg: colors.successLight, fg: colors.success };
  return { bg: colors.warningLight, fg: colors.warning };
};

const priorityColor = (priority: string, colors: any) => {
  if (priority === "high") return colors.error;
  if (priority === "medium") return colors.warning;
  return colors.primary;
};

export default function AdminDisputesScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<DisputeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const disputes = useMemo(() => {
    return filter === "all"
      ? ADMIN_DISPUTES
      : ADMIN_DISPUTES.filter((d) => d.status === filter);
  }, [filter]);

  const selected = disputes.find((d) => d.id === selectedId) || ADMIN_DISPUTES.find((d) => d.id === selectedId) || null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Disputes</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {(["all", "open", "in-review", "resolved"] as DisputeFilter[]).map((value) => {
          const active = value === filter;
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.filterPill,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter(value)}
            >
              <Text style={[styles.filterText, { color: active ? colors.onPrimary : colors.text }]}>{value}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {disputes.map((item) => {
          const badge = statusColor(item.status, colors);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setSelectedId(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.caseId, { color: colors.text }]}>Dispute #{item.id.toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.fg }]}>{item.status}</Text>
                </View>
              </View>

              <Text style={[styles.service, { color: colors.text }]}>{item.service}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>{item.client} vs {item.provider}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>{item.category} | {item.date}</Text>

              <View style={styles.footerRow}>
                <Text style={[styles.amount, { color: colors.text }]}>{item.amount}</Text>
                <Text style={[styles.priority, { color: priorityColor(item.priority, colors) }]}>{item.priority} priority</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelectedId(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}> 
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Dispute Details</Text>
              <TouchableOpacity onPress={() => setSelectedId(null)}>
                <Ionicons name="close" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {selected && (
              <>
                <Text style={[styles.modalCase, { color: colors.text }]}>#{selected.id.toUpperCase()} | {selected.status}</Text>
                <Text style={[styles.modalItem, { color: colors.text }]}>{selected.service}</Text>
                <Text style={[styles.modalMeta, { color: colors.muted }]}>Client: {selected.client}</Text>
                <Text style={[styles.modalMeta, { color: colors.muted }]}>Provider: {selected.provider}</Text>
                <Text style={[styles.modalMeta, { color: colors.muted }]}>Category: {selected.category}</Text>
                <Text style={[styles.modalMeta, { color: colors.muted }]}>Amount: {selected.amount}</Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.secondaryAction, { borderColor: colors.border }]}
                    onPress={() => {
                      setSelectedId(null);
                      router.push({
                        pathname: "/admin/disputes/[id]",
                        params: { id: selected.id },
                      } as any);
                    }}
                  >
                    <Text style={[styles.secondaryActionText, { color: colors.text }]}>Escalate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryAction, { backgroundColor: colors.success }]}
                    onPress={() => setSelectedId(null)}
                  >
                    <Text style={[styles.primaryActionText, { color: colors.onPrimary }]}>Resolve</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  filterRow: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 8,
    paddingBottom: 8,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 36,
    justifyContent: "center",
  },
  filterText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textTransform: "capitalize",
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  caseId: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  statusBadge: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
    textTransform: "capitalize",
  },
  service: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 3,
  },
  meta: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 2,
  },
  footerRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  priority: {
    fontSize: 10,
    textTransform: "capitalize",
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  modalCase: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: 8,
  },
  modalItem: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
  },
  modalMeta: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  modalActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    paddingVertical: 9,
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  primaryAction: {
    flex: 1,
    borderRadius: THEME.radius.pill,
    paddingVertical: 9,
    alignItems: "center",
  },
  primaryActionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
