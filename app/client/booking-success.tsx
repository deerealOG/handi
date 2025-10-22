// app/client/booking-success.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function BookingSuccess() {
  const router = useRouter();

  // Optional: auto-redirect after a few seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/client/(tabs)/bookings");
    }, 4000);
    return () => clearTimeout(timeout);
  },);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={100}
          color={THEME.colors.primary}
        />
      </View>

      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>
        Your booking request has been sent successfully.{"\n"}
        You’ll be notified once the artisan responds.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/client/(tabs)/bookings")}
      >
        <Text style={styles.buttonText}>Go to Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconWrapper: {
    marginBottom: 30,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: THEME.colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: THEME.colors.white,
    fontWeight: "600",
    fontSize: THEME.typography.sizes.base,
  },
});
