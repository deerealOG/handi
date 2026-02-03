// components/RatingDisplay.tsx
// Enhanced rating display component with multiple variants

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "small" | "medium" | "large" | "hero";
  showCount?: boolean;
  showStars?: boolean;
  style?: any;
}

// ================================
// Main Rating Display Component
// ================================
export function RatingDisplay({
  rating,
  reviewCount = 0,
  size = "medium",
  showCount = true,
  showStars = true,
  style,
}: RatingDisplayProps) {
  const { colors } = useAppTheme();

  const sizes = {
    small: { star: 12, text: 11, gap: 2 },
    medium: { star: 14, text: 13, gap: 4 },
    large: { star: 18, text: 16, gap: 6 },
    hero: { star: 24, text: 22, gap: 8 },
  };

  const sizeConfig = sizes[size];

  return (
    <View style={[styles.container, { gap: sizeConfig.gap }, style]}>
      {showStars && (
        <View style={styles.starsContainer}>
          <Ionicons name="star" size={sizeConfig.star} color="#FACC15" />
        </View>
      )}
      <Text style={[styles.ratingText, { fontSize: sizeConfig.text, color: colors.text }]}>
        {rating.toFixed(1)}
      </Text>
      {showCount && reviewCount > 0 && (
        <Text style={[styles.countText, { fontSize: sizeConfig.text - 2, color: colors.muted }]}>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
}

// ================================
// Star Rating Row (5 stars)
// ================================
export function StarRating({
  rating,
  size = 16,
  gap = 2,
}: {
  rating: number;
  size?: number;
  gap?: number;
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={[styles.starRow, { gap }]}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return <Ionicons key={star} name="star" size={size} color="#FACC15" />;
        }
        if (star === fullStars + 1 && hasHalfStar) {
          return <Ionicons key={star} name="star-half" size={size} color="#FACC15" />;
        }
        return <Ionicons key={star} name="star-outline" size={size} color="#D1D5DB" />;
      })}
    </View>
  );
}

// ================================
// Prominent Rating Badge (for cards)
// ================================
export function RatingBadge({
  rating,
  reviewCount,
  size = "medium",
  style,
}: {
  rating: number;
  reviewCount?: number;
  size?: "small" | "medium" | "large";
  style?: any;
}) {
  const { colors } = useAppTheme();

  const sizes = {
    small: { padding: 4, star: 12, text: 11 },
    medium: { padding: 6, star: 14, text: 12 },
    large: { padding: 8, star: 16, text: 14 },
  };

  const sizeConfig = sizes[size];

  const getRatingColor = () => {
    if (rating >= 4.5) return colors.success;
    if (rating >= 4.0) return colors.primary;
    if (rating >= 3.5) return '#F59E0B';
    return colors.error;
  };

  const bgColor = getRatingColor() + '15';
  const borderColor = getRatingColor() + '30';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          paddingHorizontal: sizeConfig.padding + 4,
          paddingVertical: sizeConfig.padding,
        },
        style,
      ]}
    >
      <Ionicons name="star" size={sizeConfig.star} color="#FACC15" />
      <Text style={[styles.badgeRating, { fontSize: sizeConfig.text, color: colors.text }]}>
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text style={[styles.badgeCount, { fontSize: sizeConfig.text - 1, color: colors.muted }]}>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
}

// ================================
// Hero Rating Card (for artisan profile)
// ================================
export function HeroRatingCard({
  rating,
  reviewCount,
  style,
}: {
  rating: number;
  reviewCount: number;
  style?: any;
}) {
  const { colors } = useAppTheme();

  const getRatingLabel = () => {
    if (rating >= 4.8) return 'Exceptional';
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    return 'Fair';
  };

  return (
    <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      <View style={styles.heroMain}>
        <Text style={[styles.heroRating, { color: colors.text }]}>{rating.toFixed(1)}</Text>
        <StarRating rating={rating} size={20} gap={4} />
        <Text style={[styles.heroLabel, { color: colors.primary }]}>{getRatingLabel()}</Text>
      </View>
      <View style={[styles.heroDivider, { backgroundColor: colors.border }]} />
      <View style={styles.heroReviews}>
        <Text style={[styles.heroReviewCount, { color: colors.text }]}>{reviewCount.toLocaleString()}</Text>
        <Text style={[styles.heroReviewLabel, { color: colors.muted }]}>Reviews</Text>
      </View>
    </View>
  );
}

// ================================
// Rating Breakdown (for reviews page)
// ================================
export function RatingBreakdown({
  breakdown,
  totalReviews,
  style,
}: {
  breakdown: { stars: number; count: number }[];
  totalReviews: number;
  style?: any;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.breakdown, style]}>
      {breakdown.map((item) => {
        const percentage = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;
        
        return (
          <View key={item.stars} style={styles.breakdownRow}>
            <View style={styles.breakdownLabel}>
              <Text style={[styles.breakdownStars, { color: colors.text }]}>{item.stars}</Text>
              <Ionicons name="star" size={12} color="#FACC15" />
            </View>
            <View style={[styles.breakdownBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.breakdownFill,
                  { width: `${percentage}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <Text style={[styles.breakdownCount, { color: colors.muted }]}>
              {item.count}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  countText: {
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Star Row
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    gap: 4,
  },
  badgeRating: {
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  badgeCount: {
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Hero Card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    ...THEME.shadow.card,
  },
  heroMain: {
    alignItems: 'center',
    flex: 1,
  },
  heroRating: {
    fontSize: 48,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 4,
  },
  heroLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 60,
    marginHorizontal: THEME.spacing.lg,
  },
  heroReviews: {
    alignItems: 'center',
    flex: 1,
  },
  heroReviewCount: {
    fontSize: THEME.typography.sizes['2xl'],
    fontFamily: THEME.typography.fontFamily.heading,
  },
  heroReviewLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Breakdown
  breakdown: {
    gap: THEME.spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
    gap: 2,
  },
  breakdownStars: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  breakdownBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownCount: {
    width: 40,
    textAlign: 'right',
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
});

export default RatingDisplay;
