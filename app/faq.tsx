// app/faq.tsx
// FAQ Page for HANDI - Works on both web and native

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { FAQ_CATEGORIES, FAQ_DATA, FAQItem } from "@/constants/faqData";
import { Colors, THEME } from "@/constants/theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// Enable layout animations for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");
const isDesktop = Platform.OS === "web" && width > 768;

export default function FAQPage() {
  const router = useRouter();
  const colors = Colors.light;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter FAQs based on search and category
  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  // Native header (for mobile)
  const NativeHeader = () => (
    <View style={styles.nativeHeader}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.nativeHeaderTitle, { color: colors.text }]}>
        FAQ
      </Text>
      <View style={{ width: 40 }} />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navigation */}
      {Platform.OS === "web" ? <WebNavbar /> : <NativeHeader />}

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
        <Text style={styles.heroSubtitle}>
          Find answers to common questions about HANDI
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search questions..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === null && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === null && styles.categoryTabTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {FAQ_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.id ? "#FFFFFF" : colors.primary
                }
              />
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category.id &&
                    styles.categoryTabTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAQ Content */}
      <View style={styles.faqContent}>
        {filteredFAQs.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="magnify" size={40} color={colors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No results found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              We couldn't find any FAQs matching your search.
            </Text>
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: "#F59E0B" }]}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.faqList}>
            {filteredFAQs.map((faq, index) => (
              <FAQItemCard
                key={index}
                faq={faq}
                isExpanded={expandedIndex === index}
                onToggle={() => toggleExpand(index)}
                colors={colors}
              />
            ))}
          </View>
        )}
      </View>

      {/* Contact Section */}
      <View
        style={[styles.contactSection, { backgroundColor: colors.surface }]}
      >
        <Icon name="headset" size={48} color={colors.primary} />
        <Text style={[styles.contactTitle, { color: colors.text }]}>
          Still have questions?
        </Text>
        <Text style={[styles.contactSubtitle, { color: colors.muted }]}>
          Our support team is available 24/7 to help you
        </Text>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/contact" as any)}
        >
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Footer (web only) */}
      {Platform.OS === "web" && <WebFooter />}
    </ScrollView>
  );
}

// FAQ Item Card Component
function FAQItemCard({
  faq,
  isExpanded,
  onToggle,
  colors,
}: {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
  colors: typeof Colors.light;
}) {
  return (
    <View style={[styles.faqCard, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.faqQuestionText, { color: colors.text }]}>
          {faq.question}
        </Text>
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={[styles.faqAnswerText, { color: colors.muted }]}>
            {faq.answer}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Native Header
  nativeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
  },
  nativeHeaderTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },

  // Hero Section
  heroSection: {
    paddingTop: Platform.OS === "web" ? THEME.spacing["2xl"] : THEME.spacing.lg,
    paddingBottom: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 36 : 28,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: "rgba(255,255,255,0.9)",
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radius.pill,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    width: "100%",
    maxWidth: 500,
  },
  searchInput: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },

  // Categories
  categoriesContainer: {
    paddingVertical: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  categoriesScroll: {
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  categoryTabActive: {
    backgroundColor: THEME.colors.primary,
  },
  categoryTabText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.primary,
  },
  categoryTabTextActive: {
    color: "#FFFFFF",
  },

  // FAQ Content
  faqContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing["2xl"],
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  faqList: {
    gap: THEME.spacing.md,
  },
  faqCard: {
    borderRadius: THEME.radius.md,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: THEME.spacing.lg,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginRight: THEME.spacing.md,
  },
  faqAnswer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: THEME.spacing.md,
  },
  faqAnswerText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 24,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing["3xl"],
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.lg,
  },
  emptyTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  clearButton: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.sm,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },

  // Contact Section
  contactSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing["2xl"],
    borderRadius: THEME.radius.lg,
  },
  contactTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  contactSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: THEME.spacing.xl,
    textAlign: "center",
  },
  contactButton: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
