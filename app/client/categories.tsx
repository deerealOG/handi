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
  { id: "1", name: "Electrician", icon: "flash-outline", color: "#ECFDF5", description: "Wiring, repairs, and installations" },
  { id: "2", name: "Plumber", icon: "pipe", color: "#ECFDF5", description: "Leaks, pipes, and bathroom fittings" },
  { id: "3", name: "Carpenter", icon: "hammer-screwdriver", color: "#ECFDF5", description: "Furniture, woodwork, and repairs" },
  { id: "4", name: "Barber", icon: "scissors-cutting", color: "#ECFDF5", description: "Haircuts and grooming" },
  { id: "5", name: "Painter", icon: "format-paint", color: "#ECFDF5", description: "Interior and exterior painting" },
  { id: "6", name: "Gardener", icon: "leaf", color: "#ECFDF5", description: "Landscaping and garden maintenance" },
  { id: "7", name: "Mechanic", icon: "car-wrench", color: "#ECFDF5", description: "Car repairs and servicing" },
  { id: "8", name: "Cleaner", icon: "broom", color: "#ECFDF5", description: "Home and office cleaning" },
  { id: "9", name: "AC Tech", icon: "air-conditioner", color: "#ECFDF5", description: "AC installation and repair" },
  { id: "10", name: "Makeup Artist", icon: "face-woman-shimmer", color: "#ECFDF5", description: "Professional makeup services" },
  { id: "11", name: "Tailor", icon: "tshirt-crew-outline", color: "#ECFDF5", description: "Custom clothing and alterations" },
  { id: "12", name: "Photographer", icon: "camera-outline", color: "#ECFDF5", description: "Events and portrait photography" },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.subtitle}>
          Find the right professional for your needs
        </Text>

        <View style={styles.grid}>
          {ALL_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/client/(tabs)/explore",
                  params: { category: category.name },
                })
              }
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={32}
                  color={THEME.colors.primary}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{category.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {category.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={THEME.colors.muted}
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
    backgroundColor: THEME.colors.background,
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
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
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
    color: THEME.colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  arrow: {
    marginLeft: 8,
  },
});
