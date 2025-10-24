// app/client/proceed-payment.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function ProceedPayment() {
  const router = useRouter();
  const { serviceType, jobTitle, location, date, urgent } =
    useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // --- Bottom sheet animation for transfer ---
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openTransferModal = () => {
    setShowTransferModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeTransferModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setShowTransferModal(false));
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handlePay = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method first.");
      return;
    }

    if (selectedMethod === "transfer") {
      openTransferModal();
      return;
    }

    // Simulate loading for wallet or card
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        router.push("/client/(tabs)/bookings");
      }, 2000);
    }, 2000);
  };

  const handleCopyAccount = async () => {
    await Clipboard.setStringAsync("0123456789");
    alert("Account number copied!");
  };

  const handleConfirmTransfer = () => {
    closeTransferModal();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/client/(tabs)/bookings");
      }, 2000);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Proceed to Payment</Text>
      </View>

      {/* Booking Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Service:</Text> {serviceType}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Job Title:</Text> {jobTitle}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Location:</Text> {location}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Date:</Text>{" "}
          {date
            ? new Date(date as string).toLocaleString("en-NG", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Urgent:</Text>{" "}
          {urgent === "true" ? "Yes" : "No"}
        </Text>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethods}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {[
          { id: "wallet", icon: "wallet", label: "Wallet Balance" },
          { id: "card", icon: "credit-card", label: "Credit / Debit Card" },
          { id: "transfer", icon: "bank-transfer", label: "Bank Transfer" },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              selectedMethod === method.id && styles.activeOption,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <MaterialCommunityIcons
              name={method.icon as any}
              size={22}
              color={
                selectedMethod === method.id
                  ? THEME.colors.surface
                  : THEME.colors.primary
              }
            />
            <Text
              style={[
                styles.paymentText,
                selectedMethod === method.id && { color: THEME.colors.surface },
              ]}
            >
              {method.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.detailText}>Service Fee</Text>
          <Text style={styles.bold}>₦5,000</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.detailText}>Platform Fee</Text>
          <Text style={styles.bold}>₦50</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.detailText, { fontWeight: "700" }]}>Total</Text>
          <Text style={[styles.bold, { fontSize: 15 }]}>₦5,050</Text>
        </View>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[styles.payButton, !selectedMethod && { opacity: 0.5 }]}
        onPress={handlePay}
        disabled={!selectedMethod}
      >
        {loading ? (
          <ActivityIndicator color={THEME.colors.surface} />
        ) : (
          <Text style={styles.payText}>Pay ₦5,050</Text>
        )}
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal transparent animationType="fade" visible={showSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name="check-circle"
              size={60}
              color={THEME.colors.primary}
            />
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successText}>
              Your booking has been confirmed.
            </Text>
          </View>
        </View>
      </Modal>

      {/* --- Bank Transfer Bottom Sheet --- */}
      {showTransferModal && (
        <Animated.View
          style={[
            styles.overlay,
            { opacity: fadeAnim },
          ]}
        >
          <Animated.View
            style={[styles.transferSheet, { transform: [{ translateY: slideUp }] }]}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Bank Transfer Details</Text>

            <Text style={styles.detailText}>Send exactly:</Text>
            <Text style={styles.transferAmount}>₦5,050</Text>

            <View style={styles.accountBox}>
              <Text style={styles.accountText}>Account Number: 0123456789</Text>
              <Text style={styles.accountText}>Bank: Zenith Bank</Text>
              <Text style={styles.accountText}>Account Name: HandyFix Ltd</Text>
            </View>

            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAccount}>
              <MaterialCommunityIcons
                name="content-copy"
                size={18}
                color={THEME.colors.surface}
              />
              <Text style={styles.copyText}>Copy Account Number</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton]}
              onPress={handleConfirmTransfer}
            >
              <Text style={styles.confirmText}>I’ve Sent the Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeTransferModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
    marginRight: 22,
  },
  summaryCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...THEME.shadow.base,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 13,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "600",
  },
  paymentMethods: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(28,140,75,0.05)",
    marginBottom: 10,
  },
  activeOption: {
    backgroundColor: THEME.colors.primary,
  },
  paymentText: {
    marginLeft: 10,
    color: THEME.colors.text,
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  payButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  payText: {
    color: THEME.colors.surface,
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    ...THEME.shadow.base,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.text,
    marginTop: 10,
  },
  successText: {
    fontSize: 14,
    color: THEME.colors.muted,
    marginTop: 6,
    textAlign: "center",
  },

  // Transfer bottom sheet
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  transferSheet: {
    backgroundColor: THEME.colors.surface,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 10,
  },
  sheetTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 15,
  },
  transferAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  accountBox: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  accountText: {
    fontSize: 13,
    color: THEME.colors.text,
    marginBottom: 3,
  },
  copyButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  copyText: {
    color: THEME.colors.surface,
    marginLeft: 8,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmText: {
    color: THEME.colors.surface,
    fontWeight: "700",
  },
  cancelText: {
    textAlign: "center",
    color: THEME.colors.muted,
    marginTop: 10,
  },
});
