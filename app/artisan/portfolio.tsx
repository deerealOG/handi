import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

const PORTFOLIO_ITEMS = [
  {
    id: "1",
    title: "Modern Kitchen Wiring",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Circuit Breaker Installation",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Living Room Lighting",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=2835&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Office Network Setup",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
  },
];

export default function PortfolioScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.portfolioItem}>
      <Image source={{ uri: item.image }} style={styles.portfolioImage} />
      <View style={styles.portfolioOverlay}>
        <Text style={styles.portfolioTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Portfolio</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={PORTFOLIO_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(28,140,75,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  portfolioItem: {
    width: "48%",
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: THEME.colors.surface,
    ...THEME.shadow.base,
  },
  portfolioImage: {
    width: "100%",
    height: "100%",
  },
  portfolioOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
  },
  portfolioTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
