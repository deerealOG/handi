import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StatusBar,
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
  const { colors } = useAppTheme();

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
        return colors.primary;
      case "payment":
        return colors.secondary;
      case "alert":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { backgroundColor: colors.surface },
        !item.read && { backgroundColor: colors.primaryLight, borderLeftWidth: 4, borderLeftColor: colors.primary }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColor(item.type) + "20" }]}>
        <MaterialCommunityIcons
          name={getIcon(item.type) as any}
          size={24}
          color={getColor(item.type)}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.message, { color: colors.muted }]}>{item.message}</Text>
        <Text style={[styles.time, { color: colors.muted }]}>{item.time}</Text>
      </View>
      {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FAFAFA' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...THEME.shadow.base,
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
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 6,
  },
});
