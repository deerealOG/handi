import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { THEME } from "../../constants/theme";

interface ProfileField {
  key: string;
  label: string;
  isCompleted: boolean;
}

interface ProfileCompletionWidgetProps {
  onCompletePress: () => void;
}

export function ProfileCompletionWidget({ onCompletePress }: ProfileCompletionWidgetProps) {
  const { colors } = useAppTheme();
  
  // Mock Data for demonstration
  // In a real app, this would come from a user profile hook/context
  const [fields, setFields] = useState<ProfileField[]>([
    { key: 'email', label: 'Business Email', isCompleted: true },
    { key: 'type', label: 'Business Type', isCompleted: true },
    { key: 'services', label: 'Services Offered', isCompleted: true },
    { key: 'rc', label: 'RC Number', isCompleted: false },
    { key: 'incorp', label: 'Date of Incorporation', isCompleted: false },
    { key: 'address', label: 'Business Address', isCompleted: true },
    { key: 'utility', label: 'Utility Bill', isCompleted: false },
  ]);

  const completedCount = fields.filter(f => f.isCompleted).length;
  const totalCount = fields.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, { duration: 1000 });
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  if (percentage === 100) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Complete Profile</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Get verified to access more jobs
          </Text>
        </View>
        <View style={styles.percentageBadge}>
            <Text style={[styles.percentageText, { color: colors.primary }]}>{percentage}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <Animated.View style={[styles.progressBar, { backgroundColor: colors.primary }, progressStyle]} />
      </View>

      {/* Missing Items Preview */}
      <View style={styles.missingList}>
        {fields.filter(f => !f.isCompleted).slice(0, 2).map((field, index) => (
             <View key={field.key} style={styles.missingItem}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
                <Text style={[styles.missingText, { color: colors.muted }]}>Add {field.label}</Text>
             </View>
        ))}
        {fields.filter(f => !f.isCompleted).length > 2 && (
             <Text style={[styles.moreText, { color: colors.muted }]}>+ {fields.filter(f => !f.isCompleted).length - 2} more items</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primaryLight }]}
        onPress={onCompletePress}
      >
        <Text style={[styles.buttonText, { color: colors.primary }]}>Continue Setup</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    ...THEME.shadow.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.md,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light green
  },
  percentageText: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.sm,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  missingList: {
    gap: 8,
    marginBottom: 16,
  },
  missingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  missingText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  moreText: {
      fontSize: 12,
      fontFamily: THEME.typography.fontFamily.body,
      marginLeft: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.sm,
  },
});
