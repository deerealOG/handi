import { PROVIDER_SERVICES } from "@/constants/role-dashboard-data";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function ArtisanServicesScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>My Services</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{PROVIDER_SERVICES.length} services listed</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
          onPress={() => router.push("/artisan/promote" as any)}
        >
          <Ionicons name="add" size={16} color={colors.onPrimary} />
          <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Add Service</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={PROVIDER_SERVICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.serviceName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.serviceCategory, { color: colors.muted }]}>{item.category}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "active" ? colors.successLight : colors.warningLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === "active" ? colors.success : colors.warning,
                    },
                  ]}
                >
                  {item.status === "active" ? "Active" : "Paused"}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: colors.muted }]}>{item.bookings} bookings</Text>
              <Text style={[styles.metaText, { color: colors.muted }]}>Rating {item.rating}</Text>
              <Text style={[styles.priceText, { color: colors.primary }]}>{item.price}</Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.secondaryAction, { borderColor: colors.border }]}
                onPress={() =>
                  router.push({
                    pathname: "/artisan/service-details",
                    params: { id: item.id, mode: "edit" },
                  } as any)
                }
              >
                <Text style={[styles.secondaryActionText, { color: colors.text }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryAction, { borderColor: colors.border }]}
                onPress={() =>
                  Alert.alert(
                    item.status === "active" ? "Pause service" : "Resume service",
                    `Service "${item.name}" status updated.`,
                  )
                }
              >
                <Text style={[styles.secondaryActionText, { color: colors.text }]}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryAction, { backgroundColor: colors.primaryLight }]}
                onPress={() =>
                  router.push({
                    pathname: "/artisan/service-details",
                    params: { id: item.id },
                  } as any)
                }
              >
                <Text style={[styles.primaryActionText, { color: colors.primary }]}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 48,
    paddingBottom: THEME.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.pill,
  },
  addButtonText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    ...THEME.shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 2,
  },
  serviceCategory: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.pill,
  },
  statusText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyBold,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metaText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priceText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    paddingVertical: 7,
  },
  secondaryActionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  primaryAction: {
    flex: 1.2,
    borderRadius: THEME.radius.pill,
    alignItems: "center",
    paddingVertical: 7,
  },
  primaryActionText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
