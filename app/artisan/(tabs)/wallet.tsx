import { PROVIDER_TRANSACTIONS } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanEarningsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Earnings</Text>

        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}> 
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Earnings</Text>
            <TouchableOpacity onPress={() => setShowBalance((p) => !p)}>
              <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceValue}>{showBalance ? "NGN 380,000" : "NGN ***"}</Text>
          <View style={styles.balanceStats}>
            <View>
              <Text style={styles.balanceStatLabel}>This Month</Text>
              <Text style={styles.balanceStatValue}>{showBalance ? "NGN 125,000" : "***"}</Text>
            </View>
            <View>
              <Text style={styles.balanceStatLabel}>Pending</Text>
              <Text style={styles.balanceStatValue}>{showBalance ? "NGN 35,000" : "***"}</Text>
            </View>
            <View>
              <Text style={styles.balanceStatLabel}>Withdrawn</Text>
              <Text style={styles.balanceStatValue}>{showBalance ? "NGN 220,000" : "***"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/artisan/transaction-receipt" as any)}
          >
            <Ionicons name="arrow-down-outline" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push("/artisan/settings" as any)}
          >
            <Ionicons name="card-outline" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Bank Details</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction History</Text>
          {PROVIDER_TRANSACTIONS.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={[styles.txRow, { borderBottomColor: colors.border }]}
              onPress={() => router.push("/artisan/transaction-receipt" as any)}
            >
              <View style={styles.txLeft}>
                <View
                  style={[
                    styles.txIcon,
                    {
                      backgroundColor:
                        tx.type === "credit" ? colors.successLight : colors.errorLight,
                    },
                  ]}
                >
                  <Ionicons
                    name={tx.type === "credit" ? "arrow-down-outline" : "arrow-up-outline"}
                    size={13}
                    color={tx.type === "credit" ? colors.success : colors.error}
                  />
                </View>
                <View>
                  <Text style={[styles.txTitle, { color: colors.text }]}>{tx.title}</Text>
                  <Text style={[styles.txDate, { color: colors.muted }]}>{tx.date}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.type === "credit" ? colors.success : colors.error },
                ]}
              >
                {tx.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 48,
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
    gap: 14,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  balanceCard: {
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.lg,
    ...THEME.shadow.card,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceLabel: {
    color: "#E5E7EB",
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  balanceValue: {
    color: "#FFFFFF",
    fontSize: 28,
    marginTop: 4,
    marginBottom: 10,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  balanceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceStatLabel: {
    color: "#E5E7EB",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
  },
  balanceStatValue: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  actionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  txIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  txTitle: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  txDate: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  txAmount: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
