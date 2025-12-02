import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { THEME } from "../../../constants/theme";

// ========================================
// MOCK MESSAGES
// ========================================
const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hello! I'm interested in your electrical services.",
    sender: "me",
    time: "10:00 AM",
  },
  {
    id: "2",
    text: "Hi! Thanks for reaching out. What seems to be the issue?",
    sender: "other",
    time: "10:05 AM",
  },
  {
    id: "3",
    text: "My circuit breaker keeps tripping whenever I turn on the AC.",
    sender: "me",
    time: "10:10 AM",
  },
  {
    id: "4",
    text: "I see. That sounds like an overload issue. I can come check it out today.",
    sender: "other",
    time: "10:15 AM",
  },
  {
    id: "5",
    text: "Great! Does 2 PM work for you?",
    sender: "me",
    time: "10:20 AM",
  },
  {
    id: "6",
    text: "Yes, 2 PM is perfect. I'll be there in 10 mins.",
    sender: "other",
    time: "10:23 AM",
  },
];

export default function ChatRoomScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{name || "Chat"}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call-outline" size={22} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={[...messages].reverse()} // Show newest at bottom (inverted list)
        inverted
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "me" ? styles.myMessageText : styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                item.sender === "me" ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add" size={24} color={THEME.colors.muted} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={THEME.colors.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color={THEME.colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 12,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  headerStatus: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.success,
  },
  callButton: {
    padding: 8,
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
  },
  messagesList: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: THEME.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: THEME.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  messageText: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
  },
  myMessageText: {
    color: THEME.colors.surface,
  },
  otherMessageText: {
    color: THEME.colors.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },
  otherMessageTime: {
    color: THEME.colors.muted,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  sendButton: {
    backgroundColor: THEME.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: THEME.colors.muted,
    opacity: 0.5,
  },
});
