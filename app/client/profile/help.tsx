import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Collapsible } from "../../../components/ui/collapsible";
import { THEME } from "../../../constants/theme";

const FAQS = [
  {
    question: "How do I book an artisan?",
    answer: "Browse the 'Explore' tab, select an artisan, and click 'Book Now'. You can choose a date and time that works for you.",
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, all payments are processed securely through Paystack or Flutterwave. We do not store your card details.",
  },
  {
    question: "Can I cancel a booking?",
    answer: "You can cancel a booking from the 'Bookings' tab as long as the artisan hasn't started the job yet. Cancellation fees may apply.",
  },
  {
    question: "How do I become an artisan?",
    answer: "Log out and sign up as an Artisan. You will need to provide verification documents and pass a background check.",
  },
];

export default function HelpScreen() {
  const router = useRouter();

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@handi.ng");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Contact Card */}
        <View style={styles.contactCard}>
          <View style={styles.iconBox}>
            <Ionicons name="headset" size={32} color={THEME.colors.primary} />
          </View>
          <Text style={styles.contactTitle}>Need help with something?</Text>
          <Text style={styles.contactSubtitle}>Our support team is available 24/7 to assist you.</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {FAQS.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Collapsible title={faq.question}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </Collapsible>
            </View>
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
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  contactCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  contactSubtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textAlign: "center",
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  contactButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 16,
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    lineHeight: 22,
  },
});
