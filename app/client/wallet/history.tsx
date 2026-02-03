import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";
import { walletService } from "../../../services/walletService";
import { WalletTransaction } from "../../../types/wallet";

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const walletRes = await walletService.getMyWallet();
      if (walletRes.data) {
        const txnRes = await walletService.getTransactions(walletRes.data.id);
        if (txnRes.data) {
          setTransactions(txnRes.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getIconName = (type: string) => {
    if (type === 'TOPUP' || type === 'REFUND') return 'arrow-bottom-left';
    return 'arrow-top-right';
  };

  const isCredit = (amount: number) => amount >= 0;

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={THEME.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: THEME.colors.muted, marginTop: 40 }}>
              No transactions found
            </Text>
          ) : (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                <View
                  style={[
                    styles.iconBox,
                    isCredit(item.amount) ? styles.creditIcon : styles.debitIcon,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getIconName(item.type)}
                    size={20}
                    color={isCredit(item.amount) ? THEME.colors.primary : THEME.colors.error}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.description}</Text>
                  <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString()}</Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text
                    style={[
                      styles.amountText,
                      isCredit(item.amount)
                        ? { color: THEME.colors.primary }
                        : { color: THEME.colors.text },
                    ]}
                  >
                    {isCredit(item.amount) ? '+' : ''}₦{Math.abs(item.amount).toLocaleString()}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "PENDING" && { color: "#CA8A04" },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
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
