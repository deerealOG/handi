import { useAppTheme } from "@/hooks/use-app-theme";
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
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  
  // Parse the booking object if passed as a string, or use individual params
  // For simplicity, we'll assume individual params are passed or we just display what we have.
  // In a real app, you might fetch details by ID.
  const { id, artisan, skill, date, time, price, status } = params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FAFAFA' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Order ID</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>#{id}234</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Artisan</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{artisan}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Service</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{skill}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Date</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{date}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Time</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{time}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Price</Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>
                ₦{price}
                </Text>
            </View>
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailLabel, { color: colors.muted }]}>Status</Text>
                <Text style={[
                styles.detailValue,
                { color: colors.text },
                status === "Active" && { color: colors.success },
                status === "Pending" && { color: colors.warning },
                status === "Cancelled" && { color: colors.error },
                ]}>{status}</Text>
            </View>
        </View>

        <TouchableOpacity 
            style={[styles.messageButton, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
            onPress={() => router.push({
              pathname: "/client/chat/1",
              params: { name: artisan }
            } as any)}
        >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.messageButtonText, { color: colors.primary }]}>Message Artisan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
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
    paddingTop: 50,
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
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  content: {
    padding: THEME.spacing.lg,
  },
  card: {
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
  },
  detailLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.base,
  },
  detailValue: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
