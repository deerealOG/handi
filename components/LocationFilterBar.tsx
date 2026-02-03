// components/LocationFilterBar.tsx
// Location-based filtering component for artisan search

import { useLocation } from "@/context/LocationContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

// ================================
// Types
// ================================
interface LocationFilterBarProps {
  onDistanceChange?: (distance: number) => void;
  selectedDistance?: number;
  compact?: boolean;
}

// ================================
// Component
// ================================
export function LocationFilterBar({
  onDistanceChange,
  selectedDistance = 10,
  compact = false,
}: LocationFilterBarProps) {
  const { colors } = useAppTheme();
  const { userLocation, requestPermission, isLoading } = useLocation();
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [tempRadius, setTempRadius] = useState(selectedDistance);

  const handleLocationPress = async () => {
    if (!userLocation) {
      await requestPermission();
    }
  };

  const handleApplyRadius = () => {
    onDistanceChange?.(tempRadius);
    setShowRadiusModal(false);
  };

  const displayLocation = userLocation?.address || userLocation?.city.name || 'Set Location';

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleLocationPress}
        >
          <Ionicons 
            name={userLocation ? "location" : "location-outline"} 
            size={18} 
            color={userLocation ? colors.primary : colors.muted} 
          />
          <Text 
            style={[styles.locationText, { color: userLocation ? colors.text : colors.muted }]}
            numberOfLines={1}
          >
            {isLoading ? 'Detecting...' : displayLocation}
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          style={styles.radiusButton}
          onPress={() => setShowRadiusModal(true)}
        >
          <Ionicons name="navigate-circle-outline" size={18} color={colors.primary} />
          <Text style={[styles.radiusText, { color: colors.text }]}>{selectedDistance} km</Text>
        </TouchableOpacity>

        {/* Radius Modal */}
        <RadiusModal
          visible={showRadiusModal}
          onClose={() => setShowRadiusModal(false)}
          onApply={handleApplyRadius}
          radius={tempRadius}
          onRadiusChange={setTempRadius}
          colors={colors}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Current Location */}
      <TouchableOpacity
        style={[styles.locationSection, { backgroundColor: colors.primaryLight }]}
        onPress={handleLocationPress}
      >
        <View style={[styles.locationIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name="location" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.locationContent}>
          <Text style={[styles.locationLabel, { color: colors.muted }]}>Your Location</Text>
          <Text style={[styles.locationValue, { color: colors.text }]} numberOfLines={1}>
            {isLoading ? 'Detecting location...' : displayLocation}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </TouchableOpacity>

      {/* Search Radius */}
      <View style={styles.radiusSection}>
        <View style={styles.radiusHeader}>
          <Text style={[styles.radiusLabel, { color: colors.text }]}>Search Radius</Text>
          <Text style={[styles.radiusValue, { color: colors.primary }]}>{selectedDistance} km</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={selectedDistance}
          onValueChange={(value) => onDistanceChange?.(value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <View style={styles.radiusLabels}>
          <Text style={[styles.radiusMinMax, { color: colors.muted }]}>1 km</Text>
          <Text style={[styles.radiusMinMax, { color: colors.muted }]}>50 km</Text>
        </View>
      </View>
    </View>
  );
}

// ================================
// Radius Modal
// ================================
function RadiusModal({
  visible,
  onClose,
  onApply,
  radius,
  onRadiusChange,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  radius: number;
  onRadiusChange: (value: number) => void;
  colors: any;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Search Radius</Text>
          
          <View style={styles.modalRadiusDisplay}>
            <Text style={[styles.modalRadiusValue, { color: colors.primary }]}>{radius}</Text>
            <Text style={[styles.modalRadiusUnit, { color: colors.muted }]}>kilometers</Text>
          </View>

          <Slider
            style={styles.modalSlider}
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={radius}
            onValueChange={onRadiusChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />

          <View style={styles.modalLabels}>
            <Text style={[styles.modalLabel, { color: colors.muted }]}>1 km</Text>
            <Text style={[styles.modalLabel, { color: colors.muted }]}>25 km</Text>
            <Text style={[styles.modalLabel, { color: colors.muted }]}>50 km</Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: colors.muted }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalApplyButton, { backgroundColor: colors.primary }]}
              onPress={onApply}
            >
              <Text style={[styles.modalButtonText, { color: colors.onPrimary }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ================================
// Nearby Indicator Component
// ================================
export function NearbyIndicator({ distance, colors }: { distance: string; colors: any }) {
  const distanceNum = parseFloat(distance);
  const isVeryClose = distanceNum < 2;
  const isClose = distanceNum < 5;

  return (
    <View style={[
      styles.nearbyBadge,
      { 
        backgroundColor: isVeryClose ? colors.successLight : isClose ? colors.primaryLight : colors.background,
        borderColor: isVeryClose ? colors.success : isClose ? colors.primary : colors.border,
      }
    ]}>
      <Ionicons 
        name="location" 
        size={12} 
        color={isVeryClose ? colors.success : isClose ? colors.primary : colors.muted} 
      />
      <Text style={[
        styles.nearbyText,
        { color: isVeryClose ? colors.success : isClose ? colors.primary : colors.muted }
      ]}>
        {distance}
      </Text>
    </View>
  );
}

// ================================
// Styles
// ================================
const styles = StyleSheet.create({
  container: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    marginBottom: THEME.spacing.md,
  },

  // Location Section
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.md,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Radius Section
  radiusSection: {
    paddingTop: THEME.spacing.sm,
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  radiusLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  radiusValue: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusMinMax: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Compact Version
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  locationText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: THEME.spacing.sm,
  },
  radiusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radiusText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  modalRadiusDisplay: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  modalRadiusValue: {
    fontSize: 48,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  modalRadiusUnit: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  modalSlider: {
    width: '100%',
    height: 40,
  },
  modalLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.lg,
  },
  modalLabel: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalApplyButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Nearby Badge
  nearbyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
  },
  nearbyText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
});

export default LocationFilterBar;
