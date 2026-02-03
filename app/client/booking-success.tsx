// app/client/booking-success.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function BookingSuccess() {
  const router = useRouter();
  const { colors } = useAppTheme();

  // ⏱ Auto redirect to bookings after 4 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/client/bookings");
    }, 4000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ Success Icon */}
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={100}
          color={colors.primary}
        />
      </View>

      {/* 🏁 Success Message */}
      <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed!</Text>

      {/* 📝 Description */}
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Your booking request has been sent successfully.{"\n"}
        You’ll be notified once the artisan responds.
      </Text>

      {/* 🔘 Button to go to Bookings */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.replace("/client/bookings")}
      >
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Go to Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 THEME-BASED STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: THEME.spacing.lg,
  },

  iconWrapper: {
    marginBottom: THEME.spacing.xl,
  },

  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.xl,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    lineHeight: THEME.typography.lineHeights.relaxed * 14, // converts relative to px
    marginBottom: THEME.spacing.xl,
  },

  button: {
    borderRadius: THEME.radius.lg,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl * 1.5,
    ...THEME.shadow.base,
  },

  buttonText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
    textAlign: "center",
  },
});
