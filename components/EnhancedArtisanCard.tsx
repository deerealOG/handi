// components/EnhancedArtisanCard.tsx
// Enhanced artisan card with prominent ratings, verification, and emergency badges

import { useLikedItems } from "@/context/LikedItemsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";
import { EmergencyBadge } from "./EmergencyBadge";
import { VerificationBadge, VerificationLevel } from "./VerificationBadge";

// ================================
// Types
// ================================
export interface ArtisanData {
  id: number | string;
  name: string;
  skill: string;
  price: string;
  rating: number;
  reviews: number;
  distance: string;
  verificationLevel: VerificationLevel;
  isEmergencyAvailable?: boolean;
  responseTime?: string;
  jobsCompleted?: number;
  avatar?: any;
  latitude?: number;
  longitude?: number;
  type?: 'individual' | 'business';
}

interface EnhancedArtisanCardProps {
  artisan: ArtisanData;
  onPress?: () => void;
  onBookPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

// ================================
// Component
// ================================
export function EnhancedArtisanCard({
  artisan,
  onPress,
  onBookPress,
  onFavoritePress,
  isFavorite = false,
  compact = false,
}: EnhancedArtisanCardProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { isLiked, toggleLike } = useLikedItems();
  
  const isItemLiked = isLiked(artisan.id);

  const handleFavorite = () => {
    if (onFavoritePress) {
      onFavoritePress();
    } else {
      toggleLike(artisan);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (artisan.type === 'business') {
        router.push({
          pathname: "/client/business-details",
          params: { 
            id: artisan.id,
            name: artisan.name,
            businessName: artisan.name,
            skill: artisan.skill, // or primary service category
            rating: artisan.rating,
            reviews: artisan.reviews,
            distance: artisan.distance,
            verified: artisan.verificationLevel !== 'none' ? 'true' : 'false',
          },
        });
      } else {
        router.push({
          pathname: "/client/artisan-details",
          params: { 
            id: artisan.id, 
            name: artisan.name, 
            skill: artisan.skill, 
            price: artisan.price, 
            rating: artisan.rating, 
            reviews: artisan.reviews, 
            distance: artisan.distance, 
            verified: artisan.verificationLevel !== 'none' ? 'true' : 'false',
          },
        });
      }
    }
  };

  const handleBook = () => {
    if (onBookPress) {
      onBookPress();
    } else {
      router.push({
        pathname: "/client/book-artisan",
        params: { artisan: artisan.name, skill: artisan.skill },
      });
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image
          source={artisan.avatar || require("../assets/images/profileavatar.png")}
          style={styles.compactAvatar}
        />
        <View style={styles.compactContent}>
          <View style={styles.compactNameRow}>
            <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>
              {artisan.name}
            </Text>
            {artisan.verificationLevel !== 'none' && (
              <VerificationBadge level={artisan.verificationLevel} size="small" showLabel={false} />
            )}
            {artisan.isEmergencyAvailable && (
              <EmergencyBadge size="small" showLabel={false} />
            )}
          </View>
          <Text style={[styles.compactSkill, { color: colors.muted }]}>{artisan.skill}</Text>
          <View style={styles.compactMetrics}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FACC15" />
              <Text style={[styles.compactRating, { color: colors.text }]}>{artisan.rating}</Text>
            </View>
            <Text style={[styles.compactDistance, { color: colors.muted }]}>{artisan.distance}</Text>
          </View>
        </View>
        <Text style={[styles.compactPrice, { color: colors.primary }]}>₦{artisan.price}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Top Row: Avatar, Favorite, Badges */}
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={artisan.avatar || require("../assets/images/profileavatar.png")}
            style={styles.avatar}
          />
          {/* Verification indicator on avatar */}
          {artisan.verificationLevel !== 'none' && (
            <View style={[styles.verifiedIndicator, { backgroundColor: colors.surface }]}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={18}
                color={artisan.verificationLevel === 'certified' ? '#8B5CF6' : '#10B981'}
              />
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: colors.background }]} 
          onPress={handleFavorite}
        >
          <Ionicons 
            name={isItemLiked || isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={isItemLiked || isFavorite ? colors.error : colors.muted} 
          />
        </TouchableOpacity>
      </View>

      {/* Badges Row */}
      <View style={styles.badgesRow}>
        {artisan.verificationLevel !== 'none' && (
          <VerificationBadge level={artisan.verificationLevel} size="small" />
        )}
        {artisan.isEmergencyAvailable && (
          <EmergencyBadge size="small" />
        )}
      </View>

      {/* Name & Skill */}
      <View style={styles.nameRow}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {artisan.name}
        </Text>
      </View>
      <Text style={[styles.skill, { color: colors.muted }]}>{artisan.skill}</Text>

      {/* PROMINENT Rating Section */}
      <View style={[styles.ratingSection, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
        <View style={styles.ratingMain}>
          <Ionicons name="star" size={18} color="#FACC15" />
          <Text style={[styles.ratingValue, { color: colors.text }]}>{artisan.rating}</Text>
          <Text style={[styles.ratingCount, { color: colors.muted }]}>({artisan.reviews} reviews)</Text>
        </View>
        {artisan.jobsCompleted && (
          <View style={styles.jobsCompleted}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.jobsText, { color: colors.muted }]}>{artisan.jobsCompleted}+ jobs</Text>
          </View>
        )}
      </View>

      {/* Distance & Response Time */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Ionicons name="location-outline" size={14} color={colors.muted} />
          <Text style={[styles.metricText, { color: colors.muted }]}>{artisan.distance}</Text>
        </View>
        {artisan.responseTime && (
          <View style={styles.metricItem}>
            <Ionicons name="time-outline" size={14} color={colors.muted} />
            <Text style={[styles.metricText, { color: colors.muted }]}>{artisan.responseTime} reply</Text>
          </View>
        )}
      </View>

      {/* Price & Book Button */}
      <View style={[styles.bottomRow, { borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.muted }]}>From</Text>
          <Text style={[styles.priceValue, { color: colors.primary }]}>
            {artisan.price.toString().startsWith('₦') ? artisan.price : `₦${artisan.price}`}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={handleBook}
          activeOpacity={0.8}
        >
          <Text style={[styles.bookButtonText, { color: colors.onPrimary }]}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    ...THEME.shadow.card,
  },

  // Top Row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verifiedIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: 10,
    padding: 2,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
    flexWrap: 'wrap',
  },

  // Name
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    flex: 1,
  },
  skill: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.sm,
  },

  // Rating Section - PROMINENT
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
  },
  ratingMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  ratingCount: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  jobsCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobsText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Bottom
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
  },
  priceLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceValue: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  bookButton: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 12,
    borderRadius: THEME.radius.pill,
    ...THEME.shadow.base,
  },
  bookButtonText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Compact Version
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    marginBottom: THEME.spacing.sm,
  },
  compactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: THEME.spacing.sm,
  },
  compactContent: {
    flex: 1,
  },
  compactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactName: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  compactSkill: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  compactMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  compactRating: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  compactDistance: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  compactPrice: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});

export default EnhancedArtisanCard;
