// app/client/proceed-payment.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../constants/theme";

const BANKS = [
  { id: "1", name: "GTBank", logo: "bank" },
  { id: "2", name: "Zenith Bank", logo: "bank" },
  { id: "3", name: "First Bank", logo: "bank" },
  { id: "4", name: "UBA", logo: "bank" },
  { id: "5", name: "Access Bank", logo: "bank" },
];

export default function ProceedPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { serviceType, jobTitle, location, date, urgent, price } = params;

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"selection" | "bank_selection" | "confirmation" | "pin" | "otp" | "success">("selection");
  
  // Bank Transfer State
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  
  // PIN & OTP State
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (method === "transfer") {
      setStep("bank_selection");
    } else {
      setStep("confirmation");
    }
  };

  const handleBankSelect = (bank: any) => {
    setSelectedBank(bank);
    setShowBankDropdown(false);
  };

  const handleProceedToPin = () => {
    if (selectedMethod === "transfer" && !selectedBank) {
      Alert.alert("Select Bank", "Please select a bank to proceed.");
      return;
    }
    setStep("pin");
  };

  const handlePinSubmit = () => {
    if (pin.length < 4) {
      Alert.alert("Invalid PIN", "Please enter a 4-digit PIN.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter the OTP sent to your phone.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 2000);
  };

  const handleFinish = () => {
    router.push("/client/bookings" as any);
  };

  const renderHeader = (title: string, backAction?: () => void) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={backAction || (() => router.back())}>
        <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  const renderPaymentSelection = () => (
    <View>
      {renderHeader("Select Payment Method")}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total to Pay</Text>
        <Text style={styles.summaryAmount}>₦{price || "5,050"}</Text>
        <Text style={styles.summarySubtitle}>Includes service & platform fees</Text>
      </View>

      <Text style={styles.sectionTitle}>Payment Methods</Text>
      <View style={styles.methodsContainer}>
        {[
          { id: "wallet", icon: "wallet-outline", label: "Wallet Balance", balance: "₦25,000" },
          { id: "card", icon: "card-outline", label: "Credit / Debit Card" },
          { id: "transfer", icon: "swap-horizontal-outline", label: "Bank Transfer" },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardSelected
            ]}
            onPress={() => handleMethodSelect(method.id)}
          >
            <View style={[
              styles.iconContainer,
              selectedMethod === method.id && styles.iconContainerSelected
            ]}>
              <Ionicons 
                name={method.icon as any} 
                size={24} 
                color={selectedMethod === method.id ? THEME.colors.surface : THEME.colors.primary} 
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>{method.label}</Text>
              {method.balance && (
                <Text style={styles.methodBalance}>Balance: {method.balance}</Text>
              )}
            </View>
            <Ionicons 
              name={selectedMethod === method.id ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={selectedMethod === method.id ? THEME.colors.primary : THEME.colors.muted} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBankSelection = () => (
    <View>
      {renderHeader("Bank Transfer", () => setStep("selection"))}
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Select Your Bank</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowBankDropdown(!showBankDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedBank ? selectedBank.name : "Choose a bank"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={THEME.colors.muted} />
        </TouchableOpacity>

        {showBankDropdown && (
          <View style={styles.dropdownList}>
            {BANKS.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={styles.dropdownItem}
                onPress={() => handleBankSelect(bank)}
              >
                <View style={styles.bankRow}>
                  <MaterialCommunityIcons name={bank.logo as any} size={20} color={THEME.colors.primary} />
                  <Text style={styles.dropdownItemText}>{bank.name}</Text>
                </View>
                {selectedBank?.id === bank.id && (
                  <Ionicons name="checkmark" size={18} color={THEME.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedBank && (
          <View style={styles.bankDetailsCard}>
            <Text style={styles.bankDetailsTitle}>Transfer Details</Text>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Bank Name</Text>
              <Text style={styles.bankDetailValue}>{selectedBank.name}</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Account Number</Text>
              <View style={styles.copyRow}>
                <Text style={styles.bankDetailValue}>1234567890</Text>
                <TouchableOpacity onPress={() => Clipboard.setStringAsync("1234567890")}>
                  <Ionicons name="copy-outline" size={16} color={THEME.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Account Name</Text>
              <Text style={styles.bankDetailValue}>Handi App Ltd</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.bankDetailRow}>
              <Text style={styles.bankDetailLabel}>Amount</Text>
              <Text style={[styles.bankDetailValue, { color: THEME.colors.primary, fontWeight: '700' }]}>
                ₦{price || "5,050"}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.primaryButton, !selectedBank && styles.disabledButton]}
          onPress={handleProceedToPin}
          disabled={!selectedBank}
        >
          <Text style={styles.primaryButtonText}>I have made the transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmation = () => (
    <View>
      {renderHeader("Confirm Payment", () => setStep("selection"))}
      <View style={styles.contentContainer}>
        <View style={styles.confirmCard}>
          <View style={styles.confirmIconContainer}>
            <Ionicons name="shield-checkmark-outline" size={40} color={THEME.colors.primary} />
          </View>
          <Text style={styles.confirmTitle}>Secure Payment</Text>
          <Text style={styles.confirmText}>
            You are about to pay <Text style={styles.boldAmount}>₦{price || "5,050"}</Text> via {selectedMethod === "wallet" ? "Wallet" : "Card"}.
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{serviceType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>Emeka Johnson</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setStep("pin")}
        >
          <Text style={styles.primaryButtonText}>Confirm & Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPin = () => (
    <View>
      {renderHeader("Enter PIN", () => setStep(selectedMethod === "transfer" ? "bank_selection" : "confirmation"))}
      <View style={styles.contentContainer}>
        <Text style={styles.pinTitle}>Enter Transaction PIN</Text>
        <Text style={styles.pinSubtitle}>Please enter your 4-digit PIN to authorize this transaction.</Text>
        
        <TextInput
          style={styles.pinInput}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          value={pin}
          onChangeText={setPin}
          placeholder="****"
          placeholderTextColor={THEME.colors.muted}
        />

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handlePinSubmit}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Authorize</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOtp = () => (
    <View>
      {renderHeader("Verification", () => setStep("pin"))}
      <View style={styles.contentContainer}>
        <Text style={styles.pinTitle}>Enter OTP</Text>
        <Text style={styles.pinSubtitle}>We sent a 4-digit code to your phone number ending in **89.</Text>
        
        <TextInput
          style={styles.pinInput}
          keyboardType="numeric"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
          placeholder="0000"
          placeholderTextColor={THEME.colors.muted}
        />

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleOtpSubmit}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Verify & Complete</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark" size={50} color="white" />
        </View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successMessage}>
          Your booking has been confirmed successfully. You can track your artisan now.
        </Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleFinish}
        >
          <Text style={styles.primaryButtonText}>View Booking</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {step === "selection" && renderPaymentSelection()}
        {step === "bank_selection" && renderBankSelection()}
        {step === "confirmation" && renderConfirmation()}
        {step === "pin" && renderPin()}
        {step === "otp" && renderOtp()}
        {step === "success" && renderSuccess()}
      </ScrollView>
    </View>
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
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginLeft: 16,
  },
  contentContainer: {
    paddingHorizontal: THEME.spacing.lg,
  },
  
  // Summary Card
  summaryCard: {
    backgroundColor: THEME.colors.primary,
    marginHorizontal: THEME.spacing.lg,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
    ...THEME.shadow.card,
  },
  summaryTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 8,
  },
  summaryAmount: {
    color: "white",
    fontSize: 36,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 8,
  },
  summarySubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Methods
  sectionTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginLeft: THEME.spacing.lg,
    marginBottom: 16,
  },
  methodsContainer: {
    paddingHorizontal: THEME.spacing.lg,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  methodCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: "#F0FDF4",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconContainerSelected: {
    backgroundColor: THEME.colors.primary,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  methodBalance: {
    fontSize: 12,
    color: THEME.colors.muted,
    marginTop: 2,
  },

  // Dropdown
  label: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: THEME.colors.text,
  },
  dropdownList: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 16,
    ...THEME.shadow.card,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: THEME.colors.text,
  },

  // Bank Details
  bankDetailsCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  bankDetailsTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.muted,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  bankDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  bankDetailLabel: {
    fontSize: 14,
    color: THEME.colors.muted,
  },
  bankDetailValue: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Buttons
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: THEME.colors.muted,
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Confirmation
  confirmCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    ...THEME.shadow.card,
  },
  confirmIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: THEME.colors.muted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  boldAmount: {
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: THEME.colors.muted,
  },
  detailValue: {
    fontSize: 14,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // PIN & OTP
  pinTitle: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  pinSubtitle: {
    fontSize: 14,
    color: THEME.colors.muted,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  pinInput: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 20,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    marginBottom: 32,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Success
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 600,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...THEME.shadow.card,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: THEME.colors.muted,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
});
