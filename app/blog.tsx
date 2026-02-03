// app/blog.tsx
// Blog Page for HANDI

import WebFooter from "@/components/web/WebFooter";
import WebNavbar from "@/components/web/WebNavbar";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

const BLOG_POSTS = [
  {
    title: "Top 10 Home Maintenance Tips for Nigerian Homeowners",
    excerpt:
      "Keep your home in perfect condition with these essential maintenance tips from our expert service providers.",
    category: "Home Tips",
    date: "Jan 28, 2026",
    readTime: "5 min read",
  },
  {
    title: "How to Choose the Right Electrician for Your Project",
    excerpt:
      "Everything you need to know about hiring a qualified electrician in Nigeria, from verification to pricing.",
    category: "Guides",
    date: "Jan 25, 2026",
    readTime: "7 min read",
  },
  {
    title: "The Rise of Home Services Apps in Nigeria",
    excerpt:
      "How technology is transforming the way Nigerians access skilled professionals and quality services.",
    category: "Industry",
    date: "Jan 20, 2026",
    readTime: "4 min read",
  },
  {
    title: "Success Story: From Artisan to Entrepreneur with HANDI",
    excerpt:
      "Meet Chinedu, an electrician who grew his business 300% using the HANDI platform.",
    category: "Success Stories",
    date: "Jan 15, 2026",
    readTime: "6 min read",
  },
  {
    title: "Safety First: Protecting Your Home During Service Visits",
    excerpt:
      "Tips and best practices for ensuring safety when having service providers in your home.",
    category: "Safety",
    date: "Jan 10, 2026",
    readTime: "5 min read",
  },
  {
    title: "HANDI Launches in 5 New States Across Nigeria",
    excerpt:
      "We're excited to announce our expansion to Kaduna, Enugu, Delta, Ogun, and Kwara states.",
    category: "Company News",
    date: "Jan 5, 2026",
    readTime: "3 min read",
  },
];

const CATEGORIES = [
  "All",
  "Home Tips",
  "Guides",
  "Industry",
  "Success Stories",
  "Safety",
  "Company News",
];

export default function BlogPage() {
  const { colors } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <WebNavbar />

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
        <Text style={styles.heroTitle}>HANDI Blog</Text>
        <Text style={styles.heroSubtitle}>
          Tips, guides, and stories from the world of home services
        </Text>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color:
                    selectedCategory === category ? "#FFFFFF" : colors.text,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Blog Posts */}
      <View style={styles.postsSection}>
        <View style={styles.postsGrid}>
          {filteredPosts.map((post, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.postCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.postImage,
                  { backgroundColor: `${THEME.colors.primary}20` },
                ]}
              >
                <Text style={styles.postCategory}>{post.category}</Text>
              </View>
              <View style={styles.postContent}>
                <Text style={[styles.postTitle, { color: colors.text }]}>
                  {post.title}
                </Text>
                <Text style={[styles.postExcerpt, { color: colors.muted }]}>
                  {post.excerpt}
                </Text>
                <View style={styles.postMeta}>
                  <Text style={[styles.postDate, { color: colors.muted }]}>
                    {post.date}
                  </Text>
                  <Text style={[styles.postReadTime, { color: colors.muted }]}>
                    • {post.readTime}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Newsletter CTA */}
      <View style={[styles.newsletterSection, { backgroundColor: "#F9FAFB" }]}>
        <Text style={[styles.newsletterTitle, { color: colors.text }]}>
          Subscribe to Our Newsletter
        </Text>
        <Text style={[styles.newsletterSubtitle, { color: colors.muted }]}>
          Get the latest tips, guides, and updates delivered to your inbox.
        </Text>
      </View>

      <WebFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  heroSection: {
    paddingVertical: THEME.spacing["3xl"],
    paddingHorizontal: THEME.spacing.xl,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 48 : 32,
    fontFamily: THEME.typography.fontFamily.heading,
    color: "#FFFFFF",
    marginBottom: THEME.spacing.md,
  },
  heroSubtitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.body,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },
  categoriesContainer: {
    marginTop: THEME.spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    backgroundColor: "#E5E7EB",
    marginRight: THEME.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.primary,
  },
  categoryChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  postsSection: {
    paddingVertical: THEME.spacing["2xl"],
    paddingHorizontal: THEME.spacing.xl,
  },
  postsGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: THEME.spacing.lg,
  },
  postCard: {
    width: Platform.OS === "web" ? 350 : "100%",
    borderRadius: THEME.radius.lg,
    overflow: "hidden",
    ...THEME.shadow.card,
  },
  postImage: {
    height: 150,
    justifyContent: "flex-end",
    padding: THEME.spacing.md,
  },
  postCategory: {
    alignSelf: "flex-start",
    backgroundColor: THEME.colors.primary,
    color: "#FFFFFF",
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.radius.sm,
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  postContent: {
    padding: THEME.spacing.lg,
  },
  postTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: THEME.spacing.sm,
  },
  postExcerpt: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
    marginBottom: THEME.spacing.md,
  },
  postMeta: {
    flexDirection: "row",
    gap: THEME.spacing.xs,
  },
  postDate: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  postReadTime: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  newsletterSection: {
    padding: THEME.spacing["2xl"],
    alignItems: "center",
  },
  newsletterTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },
  newsletterSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    maxWidth: 400,
  },
});
