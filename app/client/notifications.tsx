import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "../../components/Toast";
import { THEME } from "../../constants/theme";

// ========================================
// MOCK DATA
// ========================================
const NOTIFICATIONS = [
  {
    id: "1",
    type: "order",
    title: "Booking Confirmed",
    message: "Your booking with Golden Amadi has been confirmed for tomorrow at 2 PM.",
    time: "2 mins ago",
    read: false,
    icon: "calendar-check",
    color: THEME.colors.success,
  },
  {
    id: "2",
    type: "promo",
    title: "20% Off Promo",
    message: "Use code FIXIT20 to get 20% off your next plumbing service.",
    time: "2 hours ago",
    read: false,
    icon: "ticket-percent",
    color: THEME.colors.secondary,
  },
  {
    id: "3",
    type: "system",
    title: "Security Alert",
    message: "A new device logged into your account from Lagos, NG.",
    time: "Yesterday",
    read: true,
    icon: "shield-alert",
    color: THEME.colors.error,
  },
  {
    id: "4",
    type: "order",
    title: "Job Completed",
    message: "Please rate your experience with Sarah Jones.",
    time: "2 days ago",
    read: true,
    icon: "star-circle",
    color: THEME.colors.primary,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSimulateNotification = () => {
    setToastMessage("New Message: Artisan is on the way!");
    setToastVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <Toast 
        visible={toastVisible} 
        message={toastMessage} 
        type="info"
        onDismiss={() => setToastVisible(false)} 
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleSimulateNotification}>
          <Ionicons name="notifications-circle-outline" size={28} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.notificationItem, !item.read && styles.unreadItem]}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + "20" }]}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
            </View>
            
            <View style={styles.contentBox}>
              <View style={styles.topRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </View>

            {!item.read && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
      />
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
    marginBottom: THEME.spacing.md,
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
  markAllText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.primary,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  unreadItem: {
    backgroundColor: "#F0FDF4", // Very light green
    borderColor: THEME.colors.primary + "40",
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
    color: THEME.colors.text,
  },
  time: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 12,
    color: THEME.colors.muted,
  },
  message: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 13,
    color: THEME.colors.text,
    lineHeight: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
    marginLeft: 8,
    marginTop: 6,
  },
});
