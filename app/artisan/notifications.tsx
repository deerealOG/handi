import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "New Job Request",
    message: "Golden Amadi requested a plumbing service.",
    time: "10 mins ago",
    type: "job",
    read: false,
  },
  {
    id: "2",
    title: "Payment Received",
    message: "You received ₦5,000 for 'Fix Kitchen Sink'.",
    time: "2 hours ago",
    type: "payment",
    read: true,
  },
  {
    id: "3",
    title: "Job Cancelled",
    message: "The job 'Paint Living Room' was cancelled by the client.",
    time: "Yesterday",
    type: "alert",
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case "job":
        return "briefcase-outline";
      case "payment":
        return "wallet-outline";
      case "alert":
        return "alert-circle-outline";
      default:
        return "bell-outline";
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "job":
        return THEME.colors.primary;
      case "payment":
        return "#F57C00"; // Orange
      case "alert":
        return "#D32F2F"; // Red
      default:
        return THEME.colors.muted;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadItem]}>
      <View style={[styles.iconContainer, { backgroundColor: getColor(item.type) + "20" }]}>
        <MaterialCommunityIcons
          name={getIcon(item.type) as any}
          size={24}
          color={getColor(item.type)}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    backgroundColor: THEME.colors.surface,
    marginBottom: 12,
    ...THEME.shadow.base,
  },
  unreadItem: {
    backgroundColor: "#F0F9F4", // Light green background for unread
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: THEME.colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: THEME.colors.muted,
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
