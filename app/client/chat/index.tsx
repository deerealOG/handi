import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

// ========================================
// MOCK DATA
// ========================================
const CHATS = [
  {
    id: "1",
    artisan: "Golden Amadi",
    skill: "Electrician",
    lastMessage: "I'll be there in 10 mins.",
    time: "10:23 AM",
    unread: 2,
    image: require("../../../assets/images/profileavatar.png"),
    online: true,
  },
  {
    id: "2",
    artisan: "Sarah Jones",
    skill: "Plumber",
    lastMessage: "Thanks for the payment!",
    time: "Yesterday",
    unread: 0,
    image: require("../../../assets/images/profileavatar.png"),
    online: false,
  },
  {
    id: "3",
    artisan: "Mike Obi",
    skill: "Carpenter",
    lastMessage: "Can you send a picture of the door?",
    time: "Oct 25",
    unread: 0,
    image: require("../../../assets/images/profileavatar.png"),
    online: false,
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FAFAFA' ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chatItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() =>
              router.push({
                pathname: "/client/chat/[id]",
                params: { id: item.id, name: item.artisan },
              } as any)
            }
          >
            {/* Avatar & Status */}
            <View style={styles.avatarContainer}>
              <Image source={item.image} style={styles.avatar} />
              {item.online && <View style={[styles.onlineBadge, { backgroundColor: colors.success, borderColor: colors.surface }]} />}
            </View>

            {/* Message Info */}
            <View style={styles.chatInfo}>
              <View style={styles.topRow}>
                <Text style={[styles.name, { color: colors.text }]}>{item.artisan}</Text>
                <Text style={[styles.time, { color: colors.muted }]}>{item.time}</Text>
              </View>
              <View style={styles.bottomRow}>
                <Text
                  style={[
                    styles.message,
                    { color: colors.muted },
                    item.unread > 0 && { color: colors.text, fontFamily: THEME.typography.fontFamily.bodyMedium },
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
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
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  chatInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: THEME.typography.sizes.base,
  },
  time: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    flex: 1,
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 13,
    marginRight: 8,
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
