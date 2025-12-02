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
  const [amount, setAmount] = useState("");
  const [showGateway, setShowGateway] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatAmountToWords = (value: string) => {
    const num = parseInt(value.replace(/,/g, ""), 10);
    if (isNaN(num)) return "";
    
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} Million`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} Thousand`;
    if (num >= 100) return `${num} Hundred`;
    return num.toString();
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Up Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={THEME.colors.muted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
          {amount ? (
            <Text style={styles.amountWords}>
              {formatAmountToWords(amount)} Naira
            </Text>
          ) : null}
        </View>

        <View style={styles.quickAmounts}>
          {["1000", "2000", "5000", "10000"].map((amt) => (
            <TouchableOpacity
              key={amt}
              style={styles.quickAmountChip}
              onPress={() => setAmount(amt)}
            >
              <Text style={styles.quickAmountText}>₦{amt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, !amount && styles.submitButtonDisabled]} 
          onPress={handleTopUp}
          disabled={!amount}
        >
          <Text style={styles.submitButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Payment Gateway Simulation Modal */}
      <Modal visible={showGateway} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.gatewayContainer}>
            <View style={styles.gatewayHeader}>
              <Text style={styles.gatewayTitle}>Secure Payment Gateway</Text>
              <TouchableOpacity onPress={() => setShowGateway(false)}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.gatewayContent}>
              {loading ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator size="large" color={THEME.colors.primary} />
                  <Text style={styles.loadingText}>Processing Payment...</Text>
                </View>
              ) : (
                <View style={styles.successState}>
                  <Ionicons name="checkmark-circle" size={64} color={THEME.colors.success} />
                  <Text style={styles.successText}>Payment Successful</Text>
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
    color: THEME.colors.muted,
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
    color: THEME.colors.text,
    marginRight: 8,
  },
  input: {
    fontSize: 40,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    minWidth: 100,
  },
  amountWords: {
    marginTop: 8,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.primary,
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
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  quickAmountText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  submitButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  
  // Gateway Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  gatewayContainer: {
    backgroundColor: THEME.colors.surface,
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
    color: THEME.colors.text,
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
    color: THEME.colors.text,
  },
  successState: {
    alignItems: "center",
    gap: 16,
  },
  successText: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.success,
  },
});
