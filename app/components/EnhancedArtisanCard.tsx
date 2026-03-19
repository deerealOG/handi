import { useLikedItems } from "@/app/context/LikedItemsContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  VerificationBadge,
  VerificationLevel,
} from "./components/VerificationBadge";
import { THEME } from "../constants/theme";
import { EmergencyBadge } from "./EmergencyBadge";

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
  type?: "individual" | "business";
}

interface EnhancedArtisanCardProps {
  artisan: ArtisanData;
  onPress?: () => void;
  onBookPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

const formatServicePrice = (value: string | number) => {
  const text = String(value ?? "").trim();
  if (!text) return "NGN 0";
  if (/^ngn\s/i.test(text)) return text;
  if (!/\d/.test(text)) return text;
  const numeric = text.replace(/[^\d.,]/g, "");
  const prefixed = `NGN ${numeric}`;
  return /^from\s/i.test(text) ? `From ${prefixed}` : prefixed;
};

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
      return;
    }
    toggleLike(artisan);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (artisan.type === "business") {
      router.push({
        pathname: "/client/business-details",
        params: {
          id: artisan.id,
          name: artisan.name,
          businessName: artisan.name,
          skill: artisan.skill,
          rating: artisan.rating,
          reviews: artisan.reviews,
          distance: artisan.distance,
          verified: artisan.verificationLevel !== "none" ? "true" : "false",
        },
      });
      return;
    }

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
        verified: artisan.verificationLevel !== "none" ? "true" : "false",
      },
    });
  };

  const handleBook = () => {
    if (onBookPress) {
      onBookPress();
      return;
    }
    router.push({
      pathname: "/client/book-artisan",
      params: { artisan: artisan.name, skill: artisan.skill },
    });
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image
          source={
            artisan.avatar || require("../../assets/images/profileavatar.png")
          }
          style={styles.compactAvatar}
        />
        <View style={styles.compactContent}>
          <View style={styles.compactNameRow}>
            <Text
              style={[styles.compactName, { color: colors.text }]}
              numberOfLines={1}
            >
              {artisan.name}
            </Text>
            {artisan.verificationLevel !== "none" && (
              <VerificationBadge
                level={artisan.verificationLevel}
                size="small"
                showLabel={false}
              />
            )}
            {artisan.isEmergencyAvailable && (
              <EmergencyBadge size="small" showLabel={false} />
            )}
          </View>
          <Text style={[styles.compactSkill, { color: colors.muted }]}>
            {artisan.skill}
          </Text>
          <View style={styles.compactMetrics}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FACC15" />
              <Text style={[styles.compactRating, { color: colors.text }]}>
                {artisan.rating}
              </Text>
            </View>
            <Text style={[styles.compactDistance, { color: colors.muted }]}>
              {artisan.distance}
            </Text>
          </View>
        </View>
        <Text style={[styles.compactPrice, { color: colors.primary }]}>
          {formatServicePrice(artisan.price)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', width: '100%' }}>
        {/* Left: Avatar/Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              artisan.avatar || require("../../assets/images/profileavatar.png")
            }
            style={styles.providerImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.absoluteFavorite}
            onPress={handleFavorite}
          >
            <Ionicons
              name={isItemLiked || isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isItemLiked || isFavorite ? colors.error : colors.background}
            />
          </TouchableOpacity>
        </View>

        {/* Right: Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                  {artisan.name}
                </Text>
                {artisan.verificationLevel !== "none" && (
                   <MaterialCommunityIcons
                     name="check-decagram"
                     size={16}
                     color={
                       artisan.verificationLevel === "certified"
                         ? "#8B5CF6"
                         : "#10B981"
                     }
                   />
                )}
              </View>
              <Text style={[styles.skill, { color: colors.primary }]} numberOfLines={1}>
                {artisan.skill}
              </Text>
            </View>
          </View>

          <View style={styles.midRow}>
            <View style={styles.ratingMain}>
              <Ionicons name="star" size={14} color="#FACC15" />
              <Text style={[styles.ratingValue, { color: colors.text }]}>
                {artisan.rating}
              </Text>
              <Text style={[styles.ratingCount, { color: colors.muted }]}>
                ({artisan.reviews})
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="location-outline" size={12} color={colors.muted} />
              <Text style={[styles.metricText, { color: colors.muted }]}>
                {artisan.distance}
              </Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <View>
              <Text style={[styles.priceLabel, { color: colors.muted }]}>Starting from</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                {formatServicePrice(artisan.price)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.bookBtn, { backgroundColor: colors.primary }]}
              onPress={handleBook}
            >
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    width: 280, 
    ...THEME.shadow.base,
  },
  imageContainer: {
    width: 100,
    height: "100%",
    position: "relative",
  },
  providerImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  absoluteFavorite: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  skill: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  midRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  ratingMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingValue: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  ratingCount: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  metricText: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceValue: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
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
