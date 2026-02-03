// app/client/chatbot.tsx
// AI-powered chatbot assistant for HANDI

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../constants/theme";

// ================================
// Types
// ================================
interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: QuickReply[];
}

interface QuickReply {
  id: string;
  text: string;
  action?: string;
}

// ================================
// Quick Replies
// ================================
const INITIAL_QUICK_REPLIES: QuickReply[] = [
  { id: "1", text: "🔍 Find a professional", action: "find_pro" },
  { id: "2", text: "📅 Check my bookings", action: "bookings" },
  { id: "3", text: "💳 Payment issues", action: "payment" },
  { id: "4", text: "🤔 How does HANDI work?", action: "how_it_works" },
  { id: "5", text: "📞 Contact support", action: "support" },
];

// ================================
// Bot Responses
// ================================
const BOT_RESPONSES: Record<string, { text: string; options?: QuickReply[] }> =
  {
    greeting: {
      text: "Hi there! 👋 I'm HANDI Assistant. I can help you find professionals, manage bookings, and answer questions. How can I help you today?",
      options: INITIAL_QUICK_REPLIES,
    },
    find_pro: {
      text: "Looking for a professional? I can help you find one! What type of service do you need?",
      options: [
        { id: "cat1", text: "⚡ Electrician" },
        { id: "cat2", text: "🔧 Plumber" },
        { id: "cat3", text: "❄️ AC Repair" },
        { id: "cat4", text: "🧹 Cleaning" },
        { id: "cat5", text: "📋 Browse all categories" },
      ],
    },
    bookings: {
      text: "You can view and manage all your bookings in the Bookings tab. Would you like me to take you there?",
      options: [
        { id: "go_bookings", text: "📋 Go to Bookings" },
        { id: "main_menu", text: "🏠 Main menu" },
      ],
    },
    payment: {
      text: "I can help with payment-related queries. What's the issue?",
      options: [
        { id: "pay1", text: "💳 Payment failed" },
        { id: "pay2", text: "🔄 Request refund" },
        { id: "pay3", text: "🧾 View receipts" },
        { id: "main_menu", text: "🏠 Main menu" },
      ],
    },
    how_it_works: {
      text: "HANDI connects you with verified professionals for home services. Here's how it works:\n\n1️⃣ **Search** - Find professionals near you\n2️⃣ **Book** - Select a date, time, and service\n3️⃣ **Pay** - Secure payment through the app\n4️⃣ **Rate** - Leave a review after service\n\nAll our professionals are verified with background checks!",
      options: [
        { id: "find_pro", text: "🔍 Find a professional" },
        { id: "main_menu", text: "🏠 Main menu" },
      ],
    },
    support: {
      text: "Need to talk to a human? Our support team is here to help!\n\n📞 Call: +234 800 HANDI 000\n📧 Email: support@handi.ng\n⏰ Hours: Mon-Sat, 8AM-8PM",
      options: [
        { id: "whatsapp", text: "💬 Chat on WhatsApp" },
        { id: "main_menu", text: "🏠 Main menu" },
      ],
    },
    main_menu: {
      text: "What else can I help you with?",
      options: INITIAL_QUICK_REPLIES,
    },
    default: {
      text: "I'm not sure I understand. Could you try rephrasing, or choose one of these options?",
      options: INITIAL_QUICK_REPLIES,
    },
    category_selected: {
      text: "Great choice! I've found several professionals in that category near you. Would you like me to show you the top-rated ones?",
      options: [
        { id: "show_top", text: "⭐ Show top rated" },
        { id: "show_nearest", text: "📍 Show nearest" },
        { id: "main_menu", text: "🏠 Main menu" },
      ],
    },
  };

// ================================
// Component
// ================================
export default function ChatbotScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: BOT_RESPONSES.greeting.text,
      isBot: true,
      timestamp: new Date(),
      options: BOT_RESPONSES.greeting.options,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string, action?: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);

      let response = BOT_RESPONSES.default;

      // Determine response based on action or text
      if (action) {
        if (action === "go_bookings") {
          router.push("/client/bookings");
          return;
        }
        if (action === "whatsapp") {
          // Open WhatsApp
          return;
        }
        if (["cat1", "cat2", "cat3", "cat4"].includes(action)) {
          response = BOT_RESPONSES.category_selected;
        } else if (
          action === "cat5" ||
          action === "show_top" ||
          action === "show_nearest"
        ) {
          router.push("/client/explore");
          return;
        } else {
          response = BOT_RESPONSES[action] || BOT_RESPONSES.default;
        }
      } else {
        // Simple keyword matching
        const lowerText = text.toLowerCase();
        if (
          lowerText.includes("hello") ||
          lowerText.includes("hi") ||
          lowerText.includes("hey")
        ) {
          response = BOT_RESPONSES.greeting;
        } else if (
          lowerText.includes("find") ||
          lowerText.includes("search") ||
          lowerText.includes("need")
        ) {
          response = BOT_RESPONSES.find_pro;
        } else if (
          lowerText.includes("book") ||
          lowerText.includes("appointment")
        ) {
          response = BOT_RESPONSES.bookings;
        } else if (
          lowerText.includes("pay") ||
          lowerText.includes("refund") ||
          lowerText.includes("money")
        ) {
          response = BOT_RESPONSES.payment;
        } else if (
          lowerText.includes("how") ||
          lowerText.includes("work") ||
          lowerText.includes("what is")
        ) {
          response = BOT_RESPONSES.how_it_works;
        } else if (
          lowerText.includes("help") ||
          lowerText.includes("support") ||
          lowerText.includes("contact")
        ) {
          response = BOT_RESPONSES.support;
        }
      }

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        options: response.options,
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.text, reply.action);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          item.isBot
            ? [
                styles.botBubble,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]
            : [styles.userBubble, { backgroundColor: colors.primary }],
        ]}
      >
        {item.isBot && (
          <View
            style={[
              styles.botAvatar,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="chatbubbles" size={16} color={colors.primary} />
          </View>
        )}
        <Text
          style={[
            styles.messageText,
            { color: item.isBot ? colors.text : "#FFFFFF" },
          ]}
        >
          {item.text}
        </Text>
      </View>

      {/* Quick Replies */}
      {item.isBot && item.options && (
        <View style={styles.quickReplies}>
          {item.options.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={[
                styles.quickReplyButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={[styles.quickReplyText, { color: colors.text }]}>
                {reply.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.text === "#FAFAFA" ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View
            style={[
              styles.headerAvatar,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="chatbubbles" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              HANDI Assistant
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.success }]}>
              ● Online
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View
          style={[styles.typingContainer, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.typingDot, { backgroundColor: colors.muted }]} />
          <View
            style={[
              styles.typingDot,
              styles.typingDot2,
              { backgroundColor: colors.muted },
            ]}
          />
          <View
            style={[
              styles.typingDot,
              styles.typingDot3,
              { backgroundColor: colors.muted },
            ]}
          />
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View
          style={[styles.inputContainer, { borderTopColor: colors.border }]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={colors.muted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: THEME.spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  headerSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.body,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  messageList: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
  },
  messageContainer: {
    marginBottom: THEME.spacing.md,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
  },
  botBubble: {
    alignSelf: "flex-start",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: THEME.spacing.sm,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
    flex: 1,
  },
  quickReplies: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.sm,
    marginLeft: 40,
  },
  quickReplyButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: THEME.typography.sizes.xs,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    alignSelf: "flex-start",
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: THEME.spacing.md,
    borderTopWidth: 1,
    gap: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: THEME.radius.pill,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.body,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
