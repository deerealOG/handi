// app/client/checkout.tsx
// Multi-step checkout — mirrors web /checkout (delivery → payment → review → success)

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
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
import { THEME } from "../../constants/theme";

// ── Types ────────────────────────────────────────────────────────
type Step = "delivery" | "payment" | "review" | "success";
type PaymentMethod = "card" | "bank" | "wallet";

interface DeliveryInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note: string;
}

// ── Mock cart for demo ───────────────────────────────────────────
const CART_ITEMS = [
  {
    id: "c1",
    name: "Deep House Cleaning",
    provider: "CleanPro Services",
    price: 15000,
    qty: 1,
  },
  {
    id: "c2",
    name: "AC Installation Kit",
    provider: "CoolTech Nigeria",
    price: 8500,
    qty: 2,
  },
];
const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
const serviceFee = Math.round(subtotal * 0.05);
const deliveryFee = 1500;
const total = subtotal + serviceFee + deliveryFee;

// ── Component ────────────────────────────────────────────────────
export default function CheckoutScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [step, setStep] = useState<Step>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const orderId = `HANDI-${Date.now().toString(36).toUpperCase()}`;

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    fullName: "",
    phone: "",
    address: "",
    city: "Lagos",
    state: "Lagos",
    note: "",
  });
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const canDelivery =
    delivery.fullName.trim() &&
    delivery.phone.trim() &&
    delivery.address.trim() &&
    delivery.city.trim();
  const canPayment =
    paymentMethod === "wallet" ||
    paymentMethod === "bank" ||
    (paymentMethod === "card" &&
      card.number.trim() &&
      card.expiry.trim() &&
      card.cvv.trim() &&
      card.name.trim());

  const stepOrder: Step[] = ["delivery", "payment", "review"];
  const stepIndex = stepOrder.indexOf(step);

  const goBack = () => {
    if (stepIndex > 0) setStep(stepOrder[stepIndex - 1]);
    else router.back();
  };

  const placeOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setStep("success");
  };

  // ── Success Screen ─────────────────────────────────────────────
  if (step === "success") {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar
          barStyle={
            colors.text === "#FAFAFA" ? "light-content" : "dark-content"
          }
        />
        <View style={styles.successContainer}>
          <View
            style={[
              styles.successCircle,
              { backgroundColor: colors.successLight },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={56}
              color={colors.success}
            />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Order Placed Successfully!
          </Text>
          <Text style={[styles.successSub, { color: colors.muted }]}>
            Thank you for your order.
          </Text>
          <Text style={[styles.orderIdText, { color: colors.muted }]}>
            Order ID:{" "}
            <Text style={[styles.orderIdBold, { color: colors.text }]}>
              {orderId}
            </Text>
          </Text>

          {/* Next steps */}
          <View
            style={[styles.nextStepsCard, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.nextStepsTitle, { color: colors.text }]}>
              What happens next?
            </Text>
            {[
              "You will receive a confirmation with your order details.",
              "Your service provider will contact you to confirm the schedule.",
              "Track your order status from your dashboard.",
            ].map((txt, i) => (
              <View key={i} style={styles.stepRow}>
                <View
                  style={[styles.stepNum, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.muted }]}>
                  {txt}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/client/(tabs)")}
          >
            <Text style={styles.primaryBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: colors.border }]}
            onPress={() => router.push("/client/(tabs)/explore")}
          >
            <Text style={[styles.outlineBtnText, { color: colors.text }]}>
              Continue Browsing
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Checkout ──────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          onPress={goBack}
          style={[
            styles.backBtn,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Checkout
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {["Delivery", "Payment", "Review"].map((label, i) => (
          <React.Fragment key={label}>
            <View style={styles.stepDotWrap}>
              <View
                style={[
                  styles.stepDot,
                  stepIndex >= i
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.border },
                ]}
              >
                <Text style={styles.stepDotText}>
                  {stepIndex > i ? "✓" : i + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  { color: stepIndex >= i ? colors.text : colors.muted },
                ]}
              >
                {label}
              </Text>
            </View>
            {i < 2 && (
              <View
                style={[
                  styles.stepLine,
                  stepIndex > i
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.border },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── DELIVERY ──────────────────────────── */}
          {step === "delivery" && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Delivery Information
                </Text>
              </View>
              <Text style={[styles.sectionSub, { color: colors.muted }]}>
                Where should we deliver your order?
              </Text>

              <Field
                label="Full Name *"
                value={delivery.fullName}
                onChangeText={(v) => setDelivery({ ...delivery, fullName: v })}
                placeholder="John Doe"
                colors={colors}
              />
              <Field
                label="Phone Number *"
                value={delivery.phone}
                onChangeText={(v) => setDelivery({ ...delivery, phone: v })}
                placeholder="+234 800 000 0000"
                keyboardType="phone-pad"
                colors={colors}
              />
              <Field
                label="Address *"
                value={delivery.address}
                onChangeText={(v) => setDelivery({ ...delivery, address: v })}
                placeholder="123 Main Street, Lekki Phase 1"
                colors={colors}
              />
              <Field
                label="City *"
                value={delivery.city}
                onChangeText={(v) => setDelivery({ ...delivery, city: v })}
                placeholder="Lagos"
                colors={colors}
              />
              <Field
                label="Delivery Note (optional)"
                value={delivery.note}
                onChangeText={(v) => setDelivery({ ...delivery, note: v })}
                placeholder="E.g. Call before arriving..."
                multiline
                colors={colors}
              />

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: canDelivery
                      ? colors.primary
                      : colors.border,
                  },
                ]}
                disabled={!canDelivery}
                onPress={() => setStep("payment")}
              >
                <Text style={styles.primaryBtnText}>Continue to Payment</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── PAYMENT ───────────────────────────── */}
          {step === "payment" && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Payment Method
                </Text>
              </View>
              <Text style={[styles.sectionSub, { color: colors.muted }]}>
                How would you like to pay?
              </Text>

              {/* Method selector */}
              <View style={styles.methodRow}>
                {(
                  [
                    {
                      id: "card" as PaymentMethod,
                      label: "Debit Card",
                      icon: "card-outline" as const,
                    },
                    {
                      id: "bank" as PaymentMethod,
                      label: "Bank Transfer",
                      icon: "business-outline" as const,
                    },
                    {
                      id: "wallet" as PaymentMethod,
                      label: "Wallet",
                      icon: "wallet-outline" as const,
                    },
                  ] as const
                ).map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.methodCard,
                      {
                        borderColor:
                          paymentMethod === m.id
                            ? colors.primary
                            : colors.border,
                      },
                      paymentMethod === m.id && {
                        backgroundColor: colors.primaryLight,
                      },
                    ]}
                    onPress={() => setPaymentMethod(m.id)}
                  >
                    <Ionicons
                      name={m.icon}
                      size={24}
                      color={
                        paymentMethod === m.id ? colors.primary : colors.muted
                      }
                    />
                    <Text
                      style={[
                        styles.methodLabel,
                        {
                          color:
                            paymentMethod === m.id
                              ? colors.primary
                              : colors.muted,
                        },
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Card form */}
              {paymentMethod === "card" && (
                <View
                  style={[
                    styles.subCard,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Field
                    label="Card Number"
                    value={card.number}
                    onChangeText={(v) => setCard({ ...card, number: v })}
                    placeholder="0000 0000 0000 0000"
                    keyboardType="numeric"
                    colors={colors}
                  />
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Field
                        label="Expiry"
                        value={card.expiry}
                        onChangeText={(v) => setCard({ ...card, expiry: v })}
                        placeholder="MM/YY"
                        colors={colors}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Field
                        label="CVV"
                        value={card.cvv}
                        onChangeText={(v) => setCard({ ...card, cvv: v })}
                        placeholder="123"
                        keyboardType="numeric"
                        secureTextEntry
                        colors={colors}
                      />
                    </View>
                  </View>
                  <Field
                    label="Name on Card"
                    value={card.name}
                    onChangeText={(v) => setCard({ ...card, name: v })}
                    placeholder="JOHN DOE"
                    autoCapitalize="characters"
                    colors={colors}
                  />
                </View>
              )}

              {paymentMethod === "bank" && (
                <View style={[styles.infoBox, { backgroundColor: "#EFF6FF" }]}>
                  <Text style={[styles.infoTitle, { color: "#1E40AF" }]}>
                    Bank Transfer Instructions
                  </Text>
                  <Text style={[styles.infoText, { color: "#1E40AF" }]}>
                    After placing your order, you will receive bank transfer
                    details via email and SMS. Payment must be completed within
                    24 hours.
                  </Text>
                  <Text style={[styles.infoSm, { color: "#3B82F6" }]}>
                    Supported: GTBank, Access, First Bank, UBA, Zenith
                  </Text>
                </View>
              )}

              {paymentMethod === "wallet" && (
                <View
                  style={[
                    styles.infoBox,
                    { backgroundColor: colors.successLight },
                  ]}
                >
                  <Text style={[styles.infoTitle, { color: colors.success }]}>
                    HANDI Wallet
                  </Text>
                  <Text style={[styles.infoText, { color: colors.success }]}>
                    Your wallet balance:{" "}
                    <Text
                      style={{
                        fontFamily: THEME.typography.fontFamily.heading,
                      }}
                    >
                      ₦25,000
                    </Text>
                  </Text>
                  {total > 25000 && (
                    <Text style={[styles.infoSm, { color: colors.error }]}>
                      ⚠️ Insufficient balance. Please top up or choose another
                      method.
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: canPayment
                      ? colors.primary
                      : colors.border,
                  },
                ]}
                disabled={!canPayment}
                onPress={() => setStep("review")}
              >
                <Text style={styles.primaryBtnText}>Review Order</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── REVIEW ────────────────────────────── */}
          {step === "review" && (
            <View style={{ gap: 12 }}>
              {/* Delivery summary */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      Delivery
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setStep("delivery")}>
                    <Text style={[styles.editLink, { color: colors.primary }]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.reviewText, { color: colors.text }]}>
                  {delivery.fullName}
                </Text>
                <Text style={[styles.reviewTextSm, { color: colors.muted }]}>
                  {delivery.address}, {delivery.city}, {delivery.state}
                </Text>
                <Text style={[styles.reviewTextSm, { color: colors.muted }]}>
                  {delivery.phone}
                </Text>
                {delivery.note ? (
                  <Text
                    style={[styles.reviewNote, { color: colors.placeholder }]}
                  >
                    Note: {delivery.note}
                  </Text>
                ) : null}
              </View>

              {/* Payment summary */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name="card-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      Payment
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setStep("payment")}>
                    <Text style={[styles.editLink, { color: colors.primary }]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.reviewText, { color: colors.text }]}>
                  {paymentMethod === "card"
                    ? `Debit Card ending ****${card.number.slice(-4)}`
                    : paymentMethod === "bank"
                      ? "Bank Transfer"
                      : "HANDI Wallet"}
                </Text>
              </View>

              {/* Items */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text, marginBottom: 12 },
                  ]}
                >
                  Items ({CART_ITEMS.length})
                </Text>
                {CART_ITEMS.map((item) => (
                  <View key={item.id} style={styles.reviewItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.reviewItemName, { color: colors.text }]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[styles.reviewItemSub, { color: colors.muted }]}
                      >
                        {item.provider} × {item.qty}
                      </Text>
                    </View>
                    <Text
                      style={[styles.reviewItemPrice, { color: colors.text }]}
                    >
                      ₦{(item.price * item.qty).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Totals */}
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <SummaryRow
                  label="Subtotal"
                  value={`₦${subtotal.toLocaleString()}`}
                  colors={colors}
                />
                <SummaryRow
                  label="Service Fee (5%)"
                  value={`₦${serviceFee.toLocaleString()}`}
                  colors={colors}
                />
                <SummaryRow
                  label="Delivery Fee"
                  value={`₦${deliveryFee.toLocaleString()}`}
                  colors={colors}
                />
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.summaryRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Total
                  </Text>
                  <Text style={[styles.totalValue, { color: colors.primary }]}>
                    ₦{total.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Place Order */}
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: processing
                      ? colors.border
                      : colors.primary,
                  },
                ]}
                disabled={processing}
                onPress={placeOrder}
              >
                {processing ? (
                  <View style={styles.processingRow}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.primaryBtnText}>
                      {" "}
                      Processing Payment...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.processingRow}>
                    <Ionicons name="lock-closed" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>
                      {" "}
                      Place Order • ₦{total.toLocaleString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.secureRow}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={colors.muted}
                />
                <Text style={[styles.secureText, { color: colors.muted }]}>
                  Your payment is secure and encrypted
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Reusable Field ───────────────────────────────────────────────
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
  autoCapitalize,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "characters";
  colors: any;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
          multiline && { height: 70, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}

// ── Summary Row ──────────────────────────────────────────────────
function SummaryRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.muted }]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Step indicator
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  stepDotWrap: { alignItems: "center" },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  stepLabel: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
  },
  stepLine: { flex: 1, height: 2, marginHorizontal: 8, borderRadius: 1 },

  // Cards
  scrollContent: { padding: THEME.spacing.lg, paddingBottom: 32 },
  card: {
    borderRadius: 16,
    padding: 20,
    ...THEME.shadow.card,
    marginBottom: 12,
  },
  subCard: { borderRadius: 12, padding: 14, marginBottom: 12 },

  // Section
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  sectionSub: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 16,
  },

  // Input
  fieldLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Payment methods
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  methodCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  methodLabel: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    textAlign: "center",
  },

  // Info boxes
  infoBox: { borderRadius: 12, padding: 14, marginBottom: 16 },
  infoTitle: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    lineHeight: 20,
  },
  infoSm: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 10,
    marginTop: 6,
  },

  // Buttons
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    marginTop: 8,
    ...THEME.shadow.card,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  outlineBtn: {
    paddingVertical: 14,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    borderWidth: 1,
    marginTop: 10,
  },
  outlineBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  processingRow: { flexDirection: "row", alignItems: "center" },
  row: { flexDirection: "row" },

  // Review
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  editLink: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  reviewText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  reviewTextSm: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  reviewNote: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
  },
  reviewItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reviewItemName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  reviewItemSub: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  reviewItemPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  summaryValue: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  divider: { height: 1, marginVertical: 8 },
  totalLabel: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  totalValue: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Secure
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  secureText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Success
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: 8,
  },
  successSub: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 24,
  },
  orderIdBold: { fontFamily: THEME.typography.fontFamily.heading },
  nextStepsCard: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    ...THEME.shadow.card,
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  stepText: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 20,
  },
});
