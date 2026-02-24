import { ADMIN_BOOKINGS } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

type StatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "disputed";

const STATUS_FILTERS: StatusFilter[] = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "disputed",
];

const badgeColor = (status: string, colors: any) => {
  if (status === "pending") return { bg: colors.warningLight, fg: colors.warning };
  if (status === "completed") return { bg: colors.successLight, fg: colors.success };
  if (status === "disputed") return { bg: colors.errorLight, fg: colors.error };
  return { bg: colors.primaryLight, fg: colors.primary };
};

export default function AdminBookingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const bookings = useMemo(() => {
    return ADMIN_BOOKINGS.filter((b) => {
      const statusOk = filter === "all" || b.status === filter;
      const query = search.trim().toLowerCase();
      const queryOk =
        !query ||
        b.client.toLowerCase().includes(query) ||
        b.provider.toLowerCase().includes(query) ||
        b.service.toLowerCase().includes(query);
      return statusOk && queryOk;
    });
  }, [filter, search]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>All Bookings</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{ADMIN_BOOKINGS.length} total bookings on the platform</Text>
      </View>

      <View style={styles.searchWrapOuter}>
        <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Ionicons name="search-outline" size={16} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search client or provider"
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {STATUS_FILTERS.map((value) => {
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
        {bookings.map((item) => {
          const badge = badgeColor(item.status, colors);
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <View style={styles.cardHeader}>
                <Text style={[styles.service, { color: colors.text }]}>{item.service}</Text>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.fg }]}>{item.status.replace("_", " ")}</Text>
                </View>
              </View>
              <Text style={[styles.meta, { color: colors.muted }]}>{item.client} | {item.provider}</Text>
              <Text style={[styles.meta, { color: colors.muted }]}>{item.date} at {item.time}</Text>
              <View style={styles.footerRow}>
                <Text style={[styles.amount, { color: colors.text }]}>{item.amount}</Text>
                <TouchableOpacity
                  style={[styles.viewBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/jobModal",
                      params: {
                        id: item.id,
                        title: item.service,
                        client: item.client,
                        artisan: item.provider,
                        status: item.status,
                        description: `${item.service} scheduled for ${item.date} at ${item.time} (${item.amount}).`,
                      },
                    } as any)
                  }
                >
                  <Text style={[styles.viewBtnText, { color: colors.primary }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  subtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  searchWrapOuter: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 8,
  },
  searchWrap: {
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    paddingVertical: 10,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
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
    marginBottom: 6,
  },
  service: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    flex: 1,
    paddingRight: 8,
  },
  statusBadge: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    textTransform: "capitalize",
    fontFamily: THEME.typography.fontFamily.bodyBold,
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
  viewBtn: {
    borderRadius: THEME.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewBtnText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
