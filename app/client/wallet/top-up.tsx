import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function TopUpScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [amount, setAmount] = useState("");
  const [showGateway, setShowGateway] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatAmountToWords = (value: string): string => {
    const num = parseInt(value.replace(/,/g, ""), 10);
    if (isNaN(num)) return "";
    
    // Simple helper for demo purposes. Ideally use a library like 'number-to-words'
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + formatAmountToWords((num % 100).toString()) : '');
    if (num < 1000000) return formatAmountToWords(Math.floor(num / 1000).toString()) + ' Thousand' + (num % 1000 !== 0 ? ' ' + formatAmountToWords((num % 1000).toString()) : '');
    
    return `${(num / 1000000).toFixed(2)} Million`;
  };

  const handleTopUp = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setShowGateway(true);
    setLoading(true);

    // Simulate payment gateway processing
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setShowGateway(false);
        alert(`Successfully topped up ₦${amount}`);
        router.back();
      }, 1000);
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FAFAFA' ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Top Up Wallet</Text>
        <View style={{ width: 40 }} />
      </View>


      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.muted }]}>Enter Amount</Text>
          <View style={styles.inputWrapper}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>₦</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
          {amount ? (
            <Text style={[styles.amountWords, { color: colors.primary }]}>
              {formatAmountToWords(amount)} Naira
            </Text>
          ) : null}
        </View>

        <View style={styles.quickAmounts}>
          {["1000", "2000", "5000", "10000"].map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.quickAmountChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setAmount(amt)}
            >
              <Text style={[styles.quickAmountText, { color: colors.text }]}>₦{amt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }, !amount && styles.submitButtonDisabled]}
          onPress={handleTopUp}
          disabled={!amount}
        >
          <Text style={styles.submitButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Payment Gateway Simulation Modal */}
      <Modal visible={showGateway} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.gatewayContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.gatewayHeader}>
              <Text style={[styles.gatewayTitle, { color: colors.text }]}>Secure Payment Gateway</Text>
              <TouchableOpacity onPress={() => setShowGateway(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.gatewayContent}>
              {loading ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.text }]}>Processing Payment...</Text>
                </View>
              ) : (
                <View style={styles.successState}>
                  <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                  <Text style={[styles.successText, { color: colors.success }]}>Payment Successful</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 16,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    fontSize: 40,
    fontFamily: THEME.typography.fontFamily.heading,
    marginRight: 8,
  },
  input: {
    fontSize: 40,
    fontFamily: THEME.typography.fontFamily.heading,
    minWidth: 100,
  },
  amountWords: {
    marginTop: 8,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  quickAmounts: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 48,
    flexWrap: "wrap",
  },
  quickAmountChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickAmountText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Gateway Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  gatewayContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "60%",
    padding: 24,
  },
  gatewayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  gatewayTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  gatewayContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingState: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  successState: {
    alignItems: "center",
    gap: 16,
  },
  successText: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
