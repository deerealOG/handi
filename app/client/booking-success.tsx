// app/client/booking-success.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function BookingSuccess() {
  const router = useRouter();

  // ⏱ Auto redirect to bookings after 4 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/client/bookings");
    }, 4000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* ✅ Success Icon */}
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={100}
          color={THEME.colors.primary}
        />
      </View>

      {/* 🏁 Success Message */}
      <Text style={styles.title}>Booking Confirmed!</Text>

      {/* 📝 Description */}
      <Text style={styles.subtitle}>
        Your booking request has been sent successfully.{"\n"}
        You’ll be notified once the artisan responds.
      </Text>

      {/* 🔘 Button to go to Bookings */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/client/bookings")}
      >
        <Text style={styles.buttonText}>Go to Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 THEME-BASED STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
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
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    textAlign: "center",
    lineHeight: THEME.typography.lineHeights.relaxed * 14, // converts relative to px
    marginBottom: THEME.spacing.xl,
  },

  button: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl * 1.5,
    ...THEME.shadow.base,
  },

  buttonText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.base,
    textAlign: "center",
  },
});
