import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: [number, number];
  rating: number;
  verifiedOnly: boolean;
  distance: number;
}

const PRICE_RANGES = [
  { label: "Any Price", value: [0, 100000] as [number, number] },
  { label: "Under ₦3,000", value: [0, 3000] as [number, number] },
  { label: "₦3,000 - ₦5,000", value: [3000, 5000] as [number, number] },
  { label: "₦5,000 - ₦10,000", value: [5000, 10000] as [number, number] },
  { label: "Above ₦10,000", value: [10000, 100000] as [number, number] },
];

const RATINGS = [
  { label: "Any Rating", value: 0 },
  { label: "4.0+ Stars", value: 4.0 },
  { label: "4.5+ Stars", value: 4.5 },
];

const DISTANCES = [
  { label: "Any Distance", value: 100 },
  { label: "Within 1 km", value: 1 },
  { label: "Within 3 km", value: 3 },
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
];

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const { colors } = useAppTheme();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [rating, setRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [distance, setDistance] = useState(100);

  const handleApply = () => {
    onApply({ priceRange, rating, verifiedOnly, distance });
    onClose();
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setRating(0);
    setVerifiedOnly(false);
    setDistance(100);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Filter Artisans</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Range</Text>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.label}
                  style={[
                    styles.option,
                    { backgroundColor: colors.background },
                    priceRange[0] === range.value[0] &&
                    priceRange[1] === range.value[1] &&
                    { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary },
                  ]}
                  onPress={() => setPriceRange(range.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      priceRange[0] === range.value[0] &&
                      priceRange[1] === range.value[1] &&
                      { color: colors.primary, fontFamily: THEME.typography.fontFamily.subheading },
                    ]}
                  >
                    {range.label}
                  </Text>
                  {priceRange[0] === range.value[0] &&
                    priceRange[1] === range.value[1] && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Minimum Rating</Text>
              {RATINGS.map((r) => (
                <TouchableOpacity
                  key={r.label}
                  style={[
                    styles.option,
                    { backgroundColor: colors.background },
                    rating === r.value && { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary },
                  ]}
                  onPress={() => setRating(r.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      rating === r.value && { color: colors.primary, fontFamily: THEME.typography.fontFamily.subheading },
                    ]}
                  >
                    {r.label}
                  </Text>
                  {rating === r.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Distance */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Distance</Text>
              {DISTANCES.map((d) => (
                <TouchableOpacity
                  key={d.label}
                  style={[
                    styles.option,
                    { backgroundColor: colors.background },
                    distance === d.value && { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary },
                  ]}
                  onPress={() => setDistance(d.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      distance === d.value && { color: colors.primary, fontFamily: THEME.typography.fontFamily.subheading },
                    ]}
                  >
                    {d.label}
                  </Text>
                  {distance === d.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Verified Only */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.option,
                  { backgroundColor: colors.background },
                  verifiedOnly && { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary },
                ]}
                onPress={() => setVerifiedOnly(!verifiedOnly)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.text },
                    verifiedOnly && { color: colors.primary, fontFamily: THEME.typography.fontFamily.subheading },
                  ]}
                >
                  Verified Artisans Only
                </Text>
                {verifiedOnly && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={handleReset}>
              <Text style={[styles.resetText, { color: colors.text }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]} onPress={handleApply}>
              <Text style={[styles.applyText, { color: colors.onPrimary }]}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: THEME.colors.background,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  optionText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  selectedOptionText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.primary,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  resetText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
  },
  applyText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.surface,
  },
});
