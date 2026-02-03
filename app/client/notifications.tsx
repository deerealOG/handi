import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "../../components/Toast";
import { THEME } from "../../constants/theme";

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ========================================
  // MOCK DATA - Using dynamic colors
  // ========================================
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "order",
      title: "Booking Confirmed",
      message:
        "Your booking with Golden Amadi has been confirmed for tomorrow at 2 PM.",
      time: "2 mins ago",
      read: false,
      icon: "calendar-check",
      color: colors.success,
    },
    {
      id: "2",
      type: "promo",
      title: "20% Off Promo",
      message: "Use code HANDI20 to get 20% off your next plumbing service.",
      time: "2 hours ago",
      read: false,
      icon: "ticket-percent",
      color: colors.secondary,
    },
    {
      id: "3",
      type: "system",
      title: "Security Alert",
      message: "A new device logged into your account from Lagos, NG.",
      time: "Yesterday",
      read: true,
      icon: "shield-alert",
      color: colors.error,
    },
    {
      id: "4",
      type: "order",
      title: "Job Completed",
      message: "Please rate your experience with Sarah Jones.",
      time: "2 days ago",
      read: true,
      icon: "star-circle",
      color: colors.primary,
    },
  ]);

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => setNotifications([]),
        },
      ],
    );
  };

  const handleSimulateNotification = () => {
    setToastMessage("New Message: Artisan is on the way!");
    setToastVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="info"
        onDismiss={() => setToastVisible(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons
                name="broom"
                size={24}
                color={colors.error}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSimulateNotification}>
            <Ionicons
              name="notifications-circle-outline"
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notificationItem,
              { backgroundColor: colors.surface, borderColor: colors.border },
              !item.read && {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary,
              },
            ]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: item.color + "20" }]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color={item.color}
              />
            </View>

            <View style={styles.contentBox}>
              <View style={styles.topRow}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.time, { color: colors.muted }]}>
                  {item.time}
                </Text>
              </View>
              <Text
                style={[styles.message, { color: colors.muted }]}
                numberOfLines={2}
              >
                {item.message}
              </Text>
            </View>

            {!item.read && (
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
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
    marginBottom: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentBox: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },
  time: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 12,
  },
  message: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 13,
    lineHeight: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 6,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearButton: {
    padding: 4,
  },
});
