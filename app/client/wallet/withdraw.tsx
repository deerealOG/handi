import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";
import { walletService } from "../../../services/walletService";
import { Wallet } from "../../../types/wallet";

const numberToWords = (num: number): string => {
  if (num === 0) return "";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
  if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
  if (num < 1000000000) return numberToWords(Math.floor(num / 1000000)) + " Million" + (num % 1000000 !== 0 ? " " + numberToWords(num % 1000000) : "");
  return "Amount too large";
};

export default function WithdrawScreen() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [amountInWords, setAmountInWords] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Confirmation flow
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Mock withdrawal password - in production this would be verified server-side
  const CORRECT_PASSWORD = "1234";

  useEffect(() => {
    walletService.getMyWallet().then(res => {
      if (res.data) setWallet(res.data);
    });
  }, []);

  const handleAmountChange = (text: string) => {
    setAmount(text);
    const val = parseInt(text.replace(/,/g, ""), 10);
    if (!isNaN(val)) {
      setAmountInWords(numberToWords(val) + " Naira");
    } else {
      setAmountInWords("");
    }
  };

  const BANKS = ["Access Bank", "GTBank", "Zenith Bank", "UBA", "First Bank", "Fidelity Bank", "Kuda Bank", "OPay", "PalmPay"];

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (wallet && numAmount > wallet.balance) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit account number");
      return;
    }
    if (!selectedBank) {
      Alert.alert("Error", "Please select a bank");
      return;
    }
    // Show confirmation modal instead of immediate withdrawal
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    if (withdrawalPassword !== CORRECT_PASSWORD) {
      setPasswordError("Incorrect withdrawal password");
      return;
    }
    setPasswordError("");
    setLoading(true);
    
    try {
      if (!wallet) return;

      const numAmount = parseFloat(amount.replace(/,/g, ""));
      const res = await walletService.requestWithdrawal(wallet.id, numAmount, {
        bankName: selectedBank,
        accountNumber,
        accountName: 'Provided Account' // Mock
      });

      if (res.success) {
        setShowConfirmModal(false);
        setWithdrawalPassword("");
        
        Alert.alert(
          "Withdrawal Request Successful",
          `Your withdrawal of ₦${amount} to ${selectedBank} (${accountNumber}) has been requested.`,
          [
            { text: "OK", onPress: () => router.back() }
          ]
        );
      } else {
        Alert.alert("Error", res.error || "Withdrawal failed");
      }
    } catch {
      Alert.alert("Error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Funds</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>₦{wallet?.balance.toLocaleString() ?? '0.00'}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={THEME.colors.muted}
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
              {amountInWords ? <Text style={styles.amountWords}>{amountInWords}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234567890"
                placeholderTextColor={THEME.colors.muted}
                keyboardType="numeric"
                maxLength={10}
                value={accountNumber}
                onChangeText={setAccountNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank</Text>
              <TouchableOpacity 
                style={styles.selectBank}
                onPress={() => setShowBankModal(true)}
              >
                <Text style={[styles.selectBankText, selectedBank && { color: THEME.colors.text }]}>
                  {selectedBank || "Select Bank"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={THEME.colors.muted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, (!amount || !accountNumber || !selectedBank) && styles.submitButtonDisabled]} 
            onPress={handleWithdraw}
            disabled={!amount || !accountNumber || !selectedBank}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Withdraw Funds</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bank Selection Modal */}
      <Modal visible={showBankModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowBankModal(false)}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {BANKS.map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={styles.bankOption}
                  onPress={() => {
                    setSelectedBank(bank);
                    setShowBankModal(false);
                  }}
                >
                  <Text style={styles.bankOptionText}>{bank}</Text>
                  {selectedBank === bank && <Ionicons name="checkmark" size={20} color={THEME.colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Withdrawal Confirmation Modal */}
      <Modal visible={showConfirmModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Withdrawal</Text>
              <TouchableOpacity onPress={() => {
                setShowConfirmModal(false);
                setWithdrawalPassword("");
                setPasswordError("");
              }}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.confirmDetails}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Amount</Text>
                <Text style={styles.confirmValue}>₦{amount}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Bank</Text>
                <Text style={styles.confirmValue}>{selectedBank}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Account</Text>
                <Text style={styles.confirmValue}>{accountNumber}</Text>
              </View>
            </View>
            
            <View style={styles.passwordSection}>
              <Text style={styles.passwordLabel}>Enter Withdrawal Password</Text>
              <TextInput
                style={[styles.passwordInput, passwordError && styles.passwordInputError]}
                placeholder="Enter 4-digit PIN"
                placeholderTextColor={THEME.colors.muted}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={withdrawalPassword}
                onChangeText={(text) => {
                  setWithdrawalPassword(text);
                  setPasswordError("");
                }}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            
            <TouchableOpacity 
              style={[styles.confirmButton, !withdrawalPassword && styles.submitButtonDisabled]}
              onPress={handleConfirmWithdrawal}
              disabled={!withdrawalPassword || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Confirm Withdrawal</Text>}
            </TouchableOpacity>
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
    paddingTop: 50,
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
    paddingTop: 20,
  },
  balanceCard: {
    backgroundColor: THEME.colors.primary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    marginBottom: 8,
  },
  balanceValue: {
    color: "white",
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: 28,
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  input: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  selectBank: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectBankText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.muted,
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
  amountWords: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  bankOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  bankOptionText: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  confirmModalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  confirmDetails: {
    backgroundColor: THEME.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmLabel: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  confirmValue: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  passwordSection: {
    marginBottom: 24,
  },
  passwordLabel: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  passwordInput: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
    textAlign: "center",
    letterSpacing: 10,
  },
  passwordInputError: {
    borderColor: THEME.colors.error,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 8,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
