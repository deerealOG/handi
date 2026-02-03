import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

const ALL_CATEGORIES = [
  { id: "1", name: "Electrician", icon: "flash-outline", description: "Wiring, repairs, and installations" },
  { id: "2", name: "Plumber", icon: "pipe", description: "Leaks, pipes, and bathroom fittings" },
  { id: "3", name: "Carpenter", icon: "hammer-screwdriver", description: "Furniture, woodwork, and repairs" },
  { id: "4", name: "Barber", icon: "scissors-cutting", description: "Haircuts and grooming" },
  { id: "5", name: "Painter", icon: "format-paint", description: "Interior and exterior painting" },
  { id: "6", name: "Gardener", icon: "leaf", description: "Landscaping and garden maintenance" },
  { id: "7", name: "Mechanic", icon: "car-wrench", description: "Car repairs and servicing" },
  { id: "8", name: "Cleaner", icon: "broom", description: "Home and office cleaning" },
  { id: "9", name: "AC Tech", icon: "air-conditioner", description: "AC installation and repair" },
  { id: "10", name: "Makeup Artist", icon: "face-woman-shimmer", description: "Professional makeup services" },
  { id: "11", name: "Tailor", icon: "tshirt-crew-outline", description: "Custom clothing and alterations" },
  { id: "12", name: "Photographer", icon: "camera-outline", description: "Events and portrait photography" },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FAFAFA' ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>All Categories</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Find the right professional for your needs
        </Text>

        <View style={styles.grid}>
          {ALL_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() =>
                router.push({
                  pathname: "/client/(tabs)/explore",
                  params: { category: category.name },
                })
              }
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={32}
                  color={colors.primary}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{category.name}</Text>
                <Text style={[styles.cardDescription, { color: colors.muted }]} numberOfLines={2}>
                  {category.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.muted}
                style={styles.arrow}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    ...THEME.shadow.card,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  arrow: {
    marginLeft: 8,
  },
});
