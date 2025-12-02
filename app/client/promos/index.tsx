import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Clipboard,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

// ========================================
// MOCK PROMOS DATA
// ========================================
const ACTIVE_PROMOS = [
  {
    id: "1",
    code: "FIXIT20",
    title: "20% Off First Booking",
    description: "Get 20% off your first booking with any artisan. Valid for all services.",
    discount: "20%",
    expiryDate: "Dec 31, 2025",
    category: "First Time",
    image: require("../../../assets/images/featured.png"),
  },
  {
    id: "2",
    code: "PLUMBER15",
    title: "15% Off Plumbing",
    description: "Special discount on all plumbing services this month.",
    discount: "15%",
    expiryDate: "Nov 30, 2025",
    category: "Plumbing",
    image: require("../../../assets/images/featured.png"),
  },
  {
    id: "3",
    code: "ELECTRIC10",
    title: "10% Off Electrical Work",
    description: "Save on electrical repairs and installations.",
    discount: "10%",
    expiryDate: "Dec 15, 2025",
    category: "Electrical",
    image: require("../../../assets/images/featured.png"),
  },
];

export default function PromosScreen() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaimOffer = (promo: typeof ACTIVE_PROMOS[0]) => {
    Alert.alert(
      "Promo Code Copied!",
      `Use code "${promo.code}" at checkout to get ${promo.discount} off.`,
      [
        { text: "OK" },
        {
          text: "Book Now",
          onPress: () => router.push("/client/(tabs)/explore" as any),
        },
      ]
    );
    handleCopyCode(promo.code);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Special Offers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="gift-outline" size={24} color={THEME.colors.primary} />
          <Text style={styles.infoText}>
            Tap any offer to copy the promo code and save on your next booking!
          </Text>
        </View>

        {/* Promos List */}
        {ACTIVE_PROMOS.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={styles.promoCard}
            onPress={() => handleClaimOffer(promo)}
          >
            <Image source={promo.image} style={styles.promoImage} resizeMode="cover" />
            
            <View style={styles.promoContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{promo.discount} OFF</Text>
              </View>
              
              <Text style={styles.promoTitle}>{promo.title}</Text>
              <Text style={styles.promoDescription}>{promo.description}</Text>
              
              <View style={styles.codeContainer}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeLabel}>Code:</Text>
                  <Text style={styles.codeText}>{promo.code}</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => handleCopyCode(promo.code)}
                >
                  <Ionicons
                    name={copiedCode === promo.code ? "checkmark" : "copy-outline"}
                    size={18}
                    color={THEME.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <View style={styles.expiryRow}>
                  <Ionicons name="time-outline" size={14} color={THEME.colors.muted} />
                  <Text style={styles.expiryText}>Expires: {promo.expiryDate}</Text>
                </View>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{promo.category}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.primary,
    lineHeight: 18,
  },
  promoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  promoImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#E6F4EA",
  },
  promoContent: {
    padding: 16,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: THEME.colors.surface,
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  promoTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderStyle: "dashed",
  },
  codeLabel: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  copyButton: {
    padding: 8,
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  categoryTag: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
});
