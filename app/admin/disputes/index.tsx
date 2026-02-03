// app/admin/disputes/index.tsx
// Admin Dispute List

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

interface Dispute {
  id: string;
  bookingId: string;
  clientName: string;
  artisanName: string;
  reason: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  filedAt: string;
  amount: string;
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: "1",
    bookingId: "booking-001",
    clientName: "John Adebayo",
    artisanName: "Golden Amadi",
    reason: "Incomplete work",
    status: "OPEN",
    filedAt: "2026-01-27",
    amount: "₦15,000",
  },
  {
    id: "2",
    bookingId: "booking-002",
    clientName: "Chioma Eze",
    artisanName: "Tunde Bakare",
    reason: "Damaged property",
    status: "UNDER_REVIEW",
    filedAt: "2026-01-26",
    amount: "₦45,000",
  },
  {
    id: "3",
    bookingId: "booking-003",
    clientName: "Emeka Okonkwo",
    artisanName: "Ibrahim Musa",
    reason: "Overcharging",
    status: "OPEN",
    filedAt: "2026-01-25",
    amount: "₦8,000",
  },
];

const statusColors = {
  OPEN: "#EF4444",
  UNDER_REVIEW: "#F59E0B",
  RESOLVED: "#10B981",
};

export default function DisputeListScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [filter, setFilter] = useState<
    "ALL" | "OPEN" | "UNDER_REVIEW" | "RESOLVED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDisputes = MOCK_DISPUTES.filter((d) => {
    const matchesFilter = filter === "ALL" || d.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderDispute = ({ item }: { item: Dispute }) => (
    <Pressable
      style={[styles.disputeCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/admin/disputes/${item.id}`)}
    >
      <View style={styles.disputeHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status] + "20" },
          ]}
        >
          <Text
            style={{
              color: statusColors[item.status],
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {item.status.replace("_", " ")}
          </Text>
        </View>
        <Text style={[styles.disputeDate, { color: colors.muted }]}>
          {item.filedAt}
        </Text>
      </View>

      <Text style={[styles.disputeReason, { color: colors.text }]}>
        {item.reason}
      </Text>

      <View style={styles.partiesRow}>
        <View style={styles.party}>
          <Ionicons name="person-outline" size={14} color={colors.muted} />
          <Text style={[styles.partyName, { color: colors.text }]}>
            {item.clientName}
          </Text>
          <Text style={[styles.partyRole, { color: colors.muted }]}>
            Client
          </Text>
        </View>
        <Ionicons name="swap-horizontal" size={16} color={colors.border} />
        <View style={styles.party}>
          <Ionicons name="construct-outline" size={14} color={colors.muted} />
          <Text style={[styles.partyName, { color: colors.text }]}>
            {item.artisanName}
          </Text>
          <Text style={[styles.partyRole, { color: colors.muted }]}>
            Artisan
          </Text>
        </View>
      </View>

      <View style={[styles.disputeFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.amountLabel, { color: colors.muted }]}>
          Disputed Amount
        </Text>
        <Text style={[styles.amount, { color: colors.primary }]}>
          {item.amount}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Disputes</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {filteredDisputes.length} disputes found
        </Text>
      </View>

      <View style={styles.toolbar}>
        <View
          style={[styles.searchContainer, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search disputes..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
        >
          {(["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED"] as const).map(
            (status) => (
              <Pressable
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && { backgroundColor: colors.primary },
                  filter !== status && { backgroundColor: colors.surface },
                ]}
                onPress={() => setFilter(status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: filter === status ? "#fff" : colors.text },
                  ]}
                >
                  {status === "ALL" ? "All" : status.replace("_", " ")}
                </Text>
              </Pressable>
            ),
          )}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDisputes}
        keyExtractor={(item) => item.id}
        renderItem={renderDispute}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: THEME.typography.fontFamily.heading,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  toolbar: {
    padding: 24,
    gap: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filters: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
  },
  list: {
    padding: 24,
    paddingTop: 0,
    gap: 16,
  },
  disputeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  disputeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  disputeDate: {
    fontSize: 12,
  },
  disputeReason: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  partiesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  party: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  partyName: {
    fontSize: 13,
    fontWeight: "500",
  },
  partyRole: {
    fontSize: 11,
  },
  disputeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  amountLabel: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
});
