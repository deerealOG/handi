import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the booking object if passed as a string, or use individual params
  // For simplicity, we'll assume individual params are passed or we just display what we have.
  // In a real app, you might fetch details by ID.
  const { id, artisan, skill, date, time, price, status } = params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.card}>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order ID</Text>
                <Text style={styles.detailValue}>#{id}234</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Artisan</Text>
                <Text style={styles.detailValue}>{artisan}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service</Text>
                <Text style={styles.detailValue}>{skill}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{date}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{time}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={[styles.detailValue, { color: THEME.colors.primary }]}>
                ₦{price}
                </Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[
                styles.detailValue,
                status === "Active" && { color: THEME.colors.success },
                status === "Pending" && { color: "#CA8A04" },
                status === "Cancelled" && { color: THEME.colors.error },
                ]}>{status}</Text>
            </View>
        </View>

        <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => router.push({
              pathname: "/client/chat/1",
              params: { name: artisan }
            } as any)}
        >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={THEME.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.messageButtonText}>Message Artisan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push({
                pathname: "/client/book-artisan",
                params: { artisan: artisan, skill: skill }
            } as any)}
        >
            <Text style={styles.primaryButtonText}>Book Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    padding: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 20,
    ...THEME.shadow.card,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  detailLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.base,
  },
  detailValue: {
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    fontSize: THEME.typography.sizes.base,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  primaryButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  messageButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
