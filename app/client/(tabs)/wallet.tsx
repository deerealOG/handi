// app/client/(tabs)/wallet.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";

// ========================================
// MOCK DATA
// ========================================
const TRANSACTIONS = [
  {
    id: "1",
    title: "Top Up via Paystack",
    date: "Today, 10:23 AM",
    amount: "+ ₦20,000",
    type: "credit",
    status: "Success",
  },
  {
    id: "2",
    title: "Payment to Golden Amadi",
    date: "Yesterday, 4:15 PM",
    amount: "- ₦5,000",
    type: "debit",
    status: "Success",
  },
  {
    id: "3",
    title: "Withdrawal to Bank",
    date: "Oct 20, 2025",
    amount: "- ₦10,000",
    type: "debit",
    status: "Pending",
  },
  {
    id: "4",
    title: "Refund for Cancelled Job",
    date: "Oct 18, 2025",
    amount: "+ ₦3,000",
    type: "credit",
    status: "Success",
  },
];

// ========================================
// WALLET SCREEN
// ========================================
export default function WalletScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#1F2937' ? "dark-content" : "light-content"} backgroundColor={colors.background} />

      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Wallet</Text>
        <TouchableOpacity 
          style={[styles.historyBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push("/client/wallet/history")}
        >
          <MaterialCommunityIcons name="history" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- Virtual Card --- */}
        <View style={styles.cardContainer}>
          <View style={[styles.cardBackground, { backgroundColor: colors.primary }]}>
            {/* Decorative Circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            
            <View style={styles.cardContent}>
              <View style={styles.cardTop}>
                <Text style={styles.cardLabel}>Total Balance</Text>
                <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                  <Ionicons 
                    name={balanceVisible ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                  />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.balance}>
                {balanceVisible ? "₦45,200.00" : "₦ ••••••••"}
              </Text>

              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardValue}>Golden Amadi</Text>
                </View>
                <View style={styles.chip} />
              </View>
            </View>
          </View>
        </View>

        {/* --- Quick Actions --- */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push("/client/wallet/top-up")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push("/client/wallet/withdraw")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="arrow-up" size={24} color={colors.error} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push("/client/wallet/transfer")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary + '15' }]}>
              <Ionicons name="swap-horizontal" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Transfer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push("/client/wallet/cards")}
          >
             <View style={[styles.actionIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="card-outline" size={24} color={colors.text} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Cards</Text>
          </TouchableOpacity>
        </View>

        {/* --- Transaction History --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/client/wallet/history")}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {TRANSACTIONS.map((item) => (
            <View key={item.id} style={[styles.transactionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[
                styles.iconBox,
                { backgroundColor: item.type === "credit" ? colors.primaryLight : colors.errorLight }
              ]}>
                <MaterialCommunityIcons 
                  name={item.type === "credit" ? "arrow-bottom-left" : "arrow-top-right"} 
                  size={20} 
                  color={item.type === "credit" ? colors.primary : colors.error} 
                />
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.transactionDate, { color: colors.muted }]}>{item.date}</Text>
              </View>

              <View style={styles.amountContainer}>
                <Text style={[
                  styles.amountText,
                  { color: item.type === "credit" ? colors.primary : colors.text }
                ]}>
                  {item.amount}
                </Text>
                <Text style={[
                  styles.statusText,
                  { color: item.status === "Pending" ? colors.secondary : colors.success }
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 50,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  headerTitle: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes["2xl"],
    color: THEME.colors.text,
  },
  historyBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },

  // Virtual Card
  cardContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 32,
  },
  cardBackground: {
    height: 200,
    backgroundColor: THEME.colors.primary,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    ...THEME.shadow.card,
  },
  circle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circle2: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginBottom: 4,
  },
  balance: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: 32,
    color: "white",
    marginVertical: 10,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardValue: {
    fontFamily: THEME.typography.fontFamily.subheading,
    color: "white",
    fontSize: 16,
  },
  chip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  // Actions
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 32,
  },
  actionItem: {
    alignItems: "center",
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: 12,
    color: THEME.colors.text,
  },

  // Transactions
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.lg,
    color: THEME.colors.text,
  },
  seeAllText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.primary,
  },
  transactionList: {
    paddingHorizontal: THEME.spacing.lg,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: "#DCFCE7",
  },
  debitIcon: {
    backgroundColor: "#FEE2E2",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    fontSize: 14,
    color: THEME.colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 12,
    color: THEME.colors.muted,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: 14,
    marginBottom: 2,
  },
  statusText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 10,
    color: THEME.colors.success,
  },
});
