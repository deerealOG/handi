import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

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
  {
    id: "5",
    title: "Payment to Sarah Jones",
    date: "Oct 15, 2025",
    amount: "- ₦4,500",
    type: "debit",
    status: "Success",
  },
  {
    id: "6",
    title: "Top Up via Paystack",
    date: "Oct 10, 2025",
    amount: "+ ₦50,000",
    type: "credit",
    status: "Success",
  },
  {
    id: "7",
    title: "Payment to Mike Obi",
    date: "Oct 5, 2025",
    amount: "- ₦6,000",
    type: "debit",
    status: "Success",
  },
  {
    id: "8",
    title: "Withdrawal to Bank",
    date: "Oct 1, 2025",
    amount: "- ₦15,000",
    type: "debit",
    status: "Success",
  },
];

export default function TransactionHistoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {TRANSACTIONS.map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View
              style={[
                styles.iconBox,
                item.type === "credit" ? styles.creditIcon : styles.debitIcon,
              ]}
            >
              <MaterialCommunityIcons
                name={item.type === "credit" ? "arrow-bottom-left" : "arrow-top-right"}
                size={20}
                color={item.type === "credit" ? THEME.colors.primary : THEME.colors.error}
              />
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text
                style={[
                  styles.amountText,
                  item.type === "credit"
                    ? { color: THEME.colors.primary }
                    : { color: THEME.colors.text },
                ]}
              >
                {item.amount}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  item.status === "Pending" && { color: "#CA8A04" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    padding: THEME.spacing.lg,
    paddingBottom: 100,
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
