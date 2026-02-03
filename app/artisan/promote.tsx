import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
    TextInput,
} from "react-native";
import { THEME } from "../../constants/theme";

interface Promotion {
  id: string;
  name: string;
  description: string;
  discount: number;
  isActive: boolean;
  expiresAt: string;
}

export default function PromoteScreen() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'Summer Special - 20% Off',
      description: 'Promote your plumbing services',
      discount: 20,
      isActive: true,
      expiresAt: '2025-12-31',
    },
    {
      id: '2',
      name: 'First Time Customer Deal',
      description: 'Attract new clients with this offer',
      discount: 15,
      isActive: false,
      expiresAt: '2025-12-25',
    },
  ]);
  const [showNewPromo, setShowNewPromo] = useState(false);
  const [promoName, setPromoName] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');

  const handleTogglePromotion = (id: string) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleCreatePromotion = () => {
    if (!promoName.trim() || !promoDiscount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newPromo: Promotion = {
      id: Date.now().toString(),
      name: promoName,
      description: 'Custom promotion',
      discount: parseInt(promoDiscount),
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setPromotions([...promotions, newPromo]);
    setPromoName('');
    setPromoDiscount('');
    setShowNewPromo(false);
    Alert.alert('Success', 'Promotion created successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotions</Text>
        <TouchableOpacity onPress={() => setShowNewPromo(!showNewPromo)}>
          <Ionicons name="add-circle" size={28} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {showNewPromo && (
          <View style={styles.createPromoCard}>
            <Text style={styles.cardTitle}>Create New Promotion</Text>
            <TextInput
              style={styles.input}
              placeholder="Promotion Name"
              placeholderTextColor={THEME.colors.muted}
              value={promoName}
              onChangeText={setPromoName}
            />
            <TextInput
              style={styles.input}
              placeholder="Discount %"
              placeholderTextColor={THEME.colors.muted}
              value={promoDiscount}
              onChangeText={setPromoDiscount}
              keyboardType="number-pad"
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: THEME.colors.primary }]}
              onPress={handleCreatePromotion}
            >
              <Text style={styles.buttonText}>Create Promotion</Text>
            </TouchableOpacity>
          </View>
        )}

        {promotions.map((promo) => (
          <View key={promo.id} style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <View style={styles.promoInfo}>
                <Text style={styles.promoName}>{promo.name}</Text>
                <Text style={styles.promoDescription}>{promo.description}</Text>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{promo.discount}%</Text>
                <Text style={styles.offText}>OFF</Text>
              </View>
            </View>

            <View style={styles.promoFooter}>
              <Text style={styles.expiryText}>Expires: {promo.expiresAt}</Text>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>{promo.isActive ? 'Active' : 'Inactive'}</Text>
                <Switch
                  value={promo.isActive}
                  onValueChange={() => handleTogglePromotion(promo.id)}
                  trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
                  thumbColor={THEME.colors.surface}
                />
              </View>
            </View>
          </View>
        ))}

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Promotion Stats</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Active</Text>
              <Text style={styles.statValue}>{promotions.filter(p => p.isActive).length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{promotions.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Best Offer</Text>
              <Text style={styles.statValue}>{Math.max(...promotions.map(p => p.discount))}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Promotion Tips</Text>
          <Text style={styles.tipText}>• Offer limited-time discounts to attract new clients</Text>
          <Text style={styles.tipText}>• Highlight your best services with targeted promotions</Text>
          <Text style={styles.tipText}>• Track which promotions drive the most bookings</Text>
          <Text style={styles.tipText}>• Rotate promotions to keep your services fresh</Text>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    flex: 1,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  createPromoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
  },
  promoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  promoInfo: {
    flex: 1,
    marginRight: 12,
  },
  promoName: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 13,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  discountBadge: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.surface,
  },
  offText: {
    fontSize: 11,
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.body,
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  expiryText: {
    fontSize: 12,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    color: THEME.colors.text,
    fontFamily: THEME.typography.fontFamily.body,
  },
  statsContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.primary,
  },
  tipsContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: THEME.colors.muted,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 8,
    lineHeight: 20,
  },
});
