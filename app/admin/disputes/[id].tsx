// app/admin/disputes/[id].tsx
// Admin Dispute Detail with resolution actions

import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const MOCK_DISPUTE = {
  id: "1",
  status: "OPEN",
  reason: "Incomplete work",
  description:
    "The artisan left before completing the job. Half of the wiring was not done and he refused to come back. I paid full amount upfront.",
  filedAt: "2026-01-27 10:30 AM",
  evidence: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  ],
  booking: {
    id: "booking-001",
    service: "Electrical Wiring",
    date: "2026-01-25",
    amount: 15000,
    client: {
      name: "John Adebayo",
      email: "john@example.com",
      phone: "+234 801 234 5678",
      avatar: null,
    },
    artisan: {
      name: "Golden Amadi",
      email: "golden@example.com",
      phone: "+234 803 456 7890",
      avatar: null,
      rating: 4.8,
      totalJobs: 45,
    },
  },
  chatHistory: [
    {
      id: "1",
      sender: "client",
      message: "Hello, I need electrical work done",
      time: "9:00 AM",
    },
    {
      id: "2",
      sender: "artisan",
      message: "Sure, I can help. What exactly do you need?",
      time: "9:05 AM",
    },
    {
      id: "3",
      sender: "client",
      message: "Full room wiring for a new extension",
      time: "9:10 AM",
    },
    {
      id: "4",
      sender: "artisan",
      message: "That will cost ₦15,000. I can come tomorrow",
      time: "9:15 AM",
    },
    {
      id: "5",
      sender: "client",
      message: "OK deal. See you tomorrow",
      time: "9:20 AM",
    },
  ],
};

const resolutionOptions = [
  {
    id: "REFUND_CLIENT",
    label: "Full Refund to Client",
    icon: "arrow-undo",
    color: "#EF4444",
  },
  {
    id: "PAY_ARTISAN",
    label: "Pay Artisan in Full",
    icon: "cash",
    color: "#10B981",
  },
  {
    id: "SPLIT_50_50",
    label: "Split 50/50",
    icon: "git-compare",
    color: "#F59E0B",
  },
  {
    id: "PARTIAL_REFUND",
    label: "Partial Refund",
    icon: "remove-circle",
    color: "#8B5CF6",
  },
  {
    id: "NO_ACTION",
    label: "Dismiss - No Action",
    icon: "close-circle",
    color: "#6B7280",
  },
];

export default function DisputeDetailScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(
    null,
  );
  const [adminNotes, setAdminNotes] = useState("");

  const handleResolve = () => {
    if (!selectedResolution) {
      Alert.alert("Error", "Please select a resolution");
      return;
    }
    Alert.alert(
      "Confirm Resolution",
      `Are you sure you want to resolve this dispute with: ${selectedResolution.replace("_", " ")}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => {
            // API call would go here
            Alert.alert("Success", "Dispute resolved successfully");
            router.back();
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>
            Dispute Details
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: "#EF444420" }]}>
            <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "600" }}>
              {MOCK_DISPUTE.status}
            </Text>
          </View>
        </View>

        {/* Reason & Description */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Dispute Reason
          </Text>
          <Text style={[styles.reason, { color: colors.text }]}>
            {MOCK_DISPUTE.reason}
          </Text>
          <Text style={[styles.description, { color: colors.muted }]}>
            {MOCK_DISPUTE.description}
          </Text>
          <Text style={[styles.filedAt, { color: colors.muted }]}>
            Filed on {MOCK_DISPUTE.filedAt}
          </Text>
        </View>

        {/* Parties */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Parties Involved
          </Text>

          <View style={styles.partyCard}>
            <View style={[styles.partyIcon, { backgroundColor: "#3B82F620" }]}>
              <Ionicons name="person" size={20} color="#3B82F6" />
            </View>
            <View style={styles.partyInfo}>
              <Text style={[styles.partyRole, { color: colors.muted }]}>
                Client
              </Text>
              <Text style={[styles.partyName, { color: colors.text }]}>
                {MOCK_DISPUTE.booking.client.name}
              </Text>
              <Text style={[styles.partyContact, { color: colors.muted }]}>
                {MOCK_DISPUTE.booking.client.email}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.partyCard}>
            <View style={[styles.partyIcon, { backgroundColor: "#10B98120" }]}>
              <Ionicons name="construct" size={20} color="#10B981" />
            </View>
            <View style={styles.partyInfo}>
              <Text style={[styles.partyRole, { color: colors.muted }]}>
                Artisan
              </Text>
              <Text style={[styles.partyName, { color: colors.text }]}>
                {MOCK_DISPUTE.booking.artisan.name}
              </Text>
              <View style={styles.artisanStats}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={[styles.rating, { color: colors.text }]}>
                  {MOCK_DISPUTE.booking.artisan.rating}
                </Text>
                <Text style={[styles.jobCount, { color: colors.muted }]}>
                  • {MOCK_DISPUTE.booking.artisan.totalJobs} jobs
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Evidence */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Evidence
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MOCK_DISPUTE.evidence.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.evidenceImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Chat History */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Chat History
          </Text>
          {MOCK_DISPUTE.chatHistory.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.chatBubble,
                msg.sender === "client"
                  ? styles.clientBubble
                  : styles.artisanBubble,
                {
                  backgroundColor:
                    msg.sender === "client"
                      ? colors.primary + "20"
                      : colors.border,
                },
              ]}
            >
              <Text style={[styles.chatSender, { color: colors.muted }]}>
                {msg.sender === "client" ? "Client" : "Artisan"} • {msg.time}
              </Text>
              <Text style={[styles.chatMessage, { color: colors.text }]}>
                {msg.message}
              </Text>
            </View>
          ))}
        </View>

        {/* Booking Details */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Booking Info
          </Text>
          <View style={styles.bookingRow}>
            <Text style={[styles.bookingLabel, { color: colors.muted }]}>
              Service
            </Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>
              {MOCK_DISPUTE.booking.service}
            </Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={[styles.bookingLabel, { color: colors.muted }]}>
              Date
            </Text>
            <Text style={[styles.bookingValue, { color: colors.text }]}>
              {MOCK_DISPUTE.booking.date}
            </Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={[styles.bookingLabel, { color: colors.muted }]}>
              Amount
            </Text>
            <Text
              style={[
                styles.bookingValue,
                { color: colors.primary, fontWeight: "700" },
              ]}
            >
              ₦{MOCK_DISPUTE.booking.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <Pressable
          style={[styles.resolveButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowResolutionModal(true)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.resolveButtonText}>Resolve Dispute</Text>
        </Pressable>
      </View>

      {/* Resolution Modal */}
      <Modal visible={showResolutionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Resolution
            </Text>

            {resolutionOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.resolutionOption,
                  selectedResolution === option.id && {
                    backgroundColor: option.color + "20",
                    borderColor: option.color,
                  },
                  { borderColor: colors.border },
                ]}
                onPress={() => setSelectedResolution(option.id)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={option.color}
                />
                <Text style={[styles.resolutionLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}

            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Admin notes (optional)"
              placeholderTextColor={colors.muted}
              value={adminNotes}
              onChangeText={setAdminNotes}
              multiline
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => setShowResolutionModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleResolve}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  backButton: { padding: 8 },
  title: { flex: 1, fontSize: 22, fontWeight: "700" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  card: { padding: 16, borderRadius: 12, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  reason: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  filedAt: { fontSize: 12 },
  partyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  partyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  partyInfo: { flex: 1 },
  partyRole: { fontSize: 11, marginBottom: 2 },
  partyName: { fontSize: 15, fontWeight: "600" },
  partyContact: { fontSize: 12 },
  artisanStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  rating: { fontSize: 13, fontWeight: "600" },
  jobCount: { fontSize: 12 },
  divider: { height: 1, marginVertical: 12 },
  evidenceImage: { width: 120, height: 120, borderRadius: 8, marginRight: 12 },
  chatBubble: { padding: 12, borderRadius: 12, marginBottom: 8 },
  clientBubble: { marginRight: 40 },
  artisanBubble: { marginLeft: 40 },
  chatSender: { fontSize: 10, marginBottom: 4 },
  chatMessage: { fontSize: 14 },
  bookingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  bookingLabel: { fontSize: 14 },
  bookingValue: { fontSize: 14 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  resolveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  resolveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "90%", maxWidth: 400, padding: 24, borderRadius: 16 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  resolutionOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  resolutionLabel: { fontSize: 14, fontWeight: "500" },
  notesInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 20 },
  modalButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: "center" },
  modalButtonText: { fontSize: 15, fontWeight: "600" },
});
