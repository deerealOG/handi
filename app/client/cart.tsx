// app/client/cart.tsx
// Cart screen — mirrors web /cart with quantity controls, totals, and checkout CTA

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// ── Types & Mock Data ────────────────────────────────────────────
interface CartItem {
  id: string;
  name: string;
  provider: string;
  price: number;
  quantity: number;
  type: "product" | "service";
  maxStock?: number;
}

const INITIAL_CART: CartItem[] = [
  {
    id: "c1",
    name: "Deep House Cleaning",
    provider: "CleanPro Services",
    price: 15000,
    quantity: 1,
    type: "service",
  },
  {
    id: "c2",
    name: "AC Installation Kit",
    provider: "CoolTech Nigeria",
    price: 8500,
    quantity: 2,
    type: "product",
    maxStock: 10,
  },
  {
    id: "c3",
    name: "Plumbing Repair Tools",
    provider: "PipeMaster NG",
    price: 12000,
    quantity: 1,
    type: "product",
    maxStock: 5,
  },
];

// ── Component ────────────────────────────────────────────────────
export default function CartScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQty = (id: string, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = Math.max(1, item.quantity + delta);
        if (item.maxStock && next > item.maxStock) return item;
        return { ...item, quantity: next };
      }),
    );
  };

  const removeItem = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Remove Item", "Remove this item from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setItems((p) => p.filter((i) => i.id !== id)),
      },
    ]);
  };

  const clearCart = () => {
    Alert.alert("Clear Cart", "Remove all items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setItems([]) },
    ]);
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

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
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Cart ({items.length})
        </Text>
        {items.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={[styles.clearText, { color: colors.error }]}>
              Clear
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {items.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={64}
            color={colors.border}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.muted }]}>
            Browse services and products to add items.
          </Text>
          <TouchableOpacity
            style={[styles.browseCta, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/client/(tabs)/explore")}
          >
            <Text style={styles.browseCtaText}>Browse Services</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.itemIcon,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      item.type === "product"
                        ? "package-variant-closed"
                        : "wrench-outline"
                    }
                    size={24}
                    color={colors.primary}
                  />
                </View>

                {/* Info */}
                <View style={styles.itemInfo}>
                  <Text
                    style={[styles.itemName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.itemProvider, { color: colors.muted }]}>
                    {item.provider}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.itemPrice, { color: colors.primary }]}>
                      ₦{item.price.toLocaleString()}
                    </Text>
                    {item.maxStock !== undefined && (
                      <Text
                        style={[styles.stockLabel, { color: colors.muted }]}
                      >
                        ({item.maxStock} in stock)
                      </Text>
                    )}
                  </View>
                </View>

                {/* Quantity */}
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                    onPress={() => updateQty(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Ionicons
                      name="remove"
                      size={16}
                      color={item.quantity <= 1 ? colors.border : colors.text}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.qtyText, { color: colors.text }]}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={[styles.qtyBtn, { borderColor: colors.border }]}
                    onPress={() => updateQty(item.id, 1)}
                    disabled={
                      item.maxStock !== undefined &&
                      item.quantity >= item.maxStock
                    }
                  >
                    <Ionicons
                      name="add"
                      size={16}
                      color={
                        item.maxStock !== undefined &&
                        item.quantity >= item.maxStock
                          ? colors.border
                          : colors.text
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* Remove */}
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.removeBtn}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Order Summary Footer */}
          <View
            style={[
              styles.summary,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ₦{subtotal.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Service Fee (5%)
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ₦{serviceFee.toLocaleString()}
              </Text>
            </View>
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
            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/client/checkout" as any);
              }}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
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
  clearText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginTop: 8,
  },
  browseCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: THEME.radius.pill,
    marginTop: 24,
  },
  browseCtaText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // List
  listContent: { padding: THEME.spacing.lg, paddingBottom: 280 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    ...THEME.shadow.base,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: { flex: 1, marginRight: 8 },
  itemName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  itemProvider: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  stockLabel: { fontSize: 10, fontFamily: THEME.typography.fontFamily.body },

  // Quantity
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    width: 24,
    textAlign: "center",
  },

  // Remove
  removeBtn: { padding: 6 },

  // Summary
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    ...THEME.shadow.float,
  },
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
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: THEME.radius.pill,
    marginTop: 12,
    ...THEME.shadow.card,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
