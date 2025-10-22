// app/artisan/help.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function HelpScreen() {
  const router = useRouter();

  const openEmail = () =>
    Linking.openURL("mailto:support@artisanconnect.com?subject=Help Request");
  const openWhatsApp = () =>
    Linking.openURL("https://wa.me/2348071857190?text=Hello! I need help with the app.");
  const openFAQ = () => router.push("../faq"); // Optional future route

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <Text style={styles.intro}>
        Need assistance? We’re here to help! Choose one of the support options below.
      </Text>

      <TouchableOpacity style={styles.optionCard} onPress={openFAQ}>
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={28}
          color={THEME.colors.primary}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>FAQs</Text>
          <Text style={styles.optionText}>View frequently asked questions</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionCard} onPress={openEmail}>
        <MaterialCommunityIcons
          name="email-outline"
          size={28}
          color={THEME.colors.primary}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>Email Support</Text>
          <Text style={styles.optionText}>support@artisanconnect.com</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionCard} onPress={openWhatsApp}>
        <MaterialCommunityIcons
          name="whatsapp"
          size={28}
          color={THEME.colors.primary}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>Chat on WhatsApp</Text>
          <Text style={styles.optionText}>+234 801 234 5678</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ArtisanConnect © 2025</Text>
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
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.white,
    padding: 14,
    borderRadius: THEME.radius.md,
    marginBottom: 12,
    ...THEME.shadow.base,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  optionText: {
    fontSize: 13,
    color: THEME.colors.muted,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: THEME.colors.muted,
  },
});
