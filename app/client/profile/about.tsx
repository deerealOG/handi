import { Ionicons } from "@expo/vector-icons";
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
import { THEME } from "../../../constants/theme";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About App</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>H</Text>
          </View>
          <Text style={styles.appName}>HANDI</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.sectionText}>
            HANDI is your go-to platform for finding reliable artisans for all your home service needs. 
            From plumbing to electrical work, we connect you with verified professionals in your area.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            To provide a seamless, safe, and efficient way for homeowners to maintain their homes 
            while empowering skilled artisans with more job opportunities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionText}>
            Email: support@handi.com{"\n"}
            Phone: +234 800 123 4567
          </Text>
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
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.surface,
  },
  appName: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
  },
  section: {
    marginBottom: 24,
    backgroundColor: THEME.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.card,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    lineHeight: 22,
  },
});
