import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Animated,
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
import { THEME } from "../../constants/theme";

// Enable layout animations for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const router = useRouter();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I accept a job request?",
      answer:
        "Once a client books your service, you'll get a notification in your Jobs tab. Open the job details and tap 'Accept' to confirm.",
    },
    {
      question: "How do I get paid after completing a job?",
      answer:
        "Payments are released to your wallet once the client marks the job as completed. You can withdraw funds directly to your bank account.",
    },
    {
      question: "Can I change my service category?",
      answer:
        "Yes, you can update your service type from your Profile > Edit Profile section. Make sure to keep your details accurate for better matching.",
    },
    {
      question: "What should I do if a client cancels?",
      answer:
        "You’ll be notified immediately. Depending on the cancellation time, a partial fee may still be credited to your account.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team via the Help screen. We’re available through email and WhatsApp 24/7.",
    },
  ];

  // --- Filter FAQs based on search query ---
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
      </View>

      <Text style={styles.intro}>
        Have a question? Find answers to common issues below.
      </Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={THEME.colors.muted}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          placeholderTextColor={THEME.colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={THEME.colors.muted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* FAQ List */}
      {filteredFaqs.length === 0 ? (
        <Text style={styles.noResultsText}>No results found.</Text>
      ) : (
        filteredFaqs.map((faq, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              style={styles.questionRow}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.8}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <MaterialCommunityIcons
                name={
                  expandedIndex === index ? "chevron-up" : "chevron-down"
                }
                size={22}
                color={THEME.colors.primary}
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <Animated.View style={styles.answerBox}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </Animated.View>
            )}
          </View>
        ))
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Still need help? Reach out to our support team anytime.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
    marginRight: 22,
  },
  intro: {
    fontSize: 14,
    color: THEME.colors.muted,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: THEME.colors.text,
  },
  noResultsText: {
    textAlign: "center",
    color: THEME.colors.muted,
    marginTop: 30,
    fontSize: 14,
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...THEME.shadow.base,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  answerBox: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 8,
  },
  answerText: {
    fontSize: 14,
    color: THEME.colors.muted,
    lineHeight: 20,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: THEME.colors.muted,
    textAlign: "center",
  },
});
