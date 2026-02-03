import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../../../constants/theme";

const CARDS = [
  { id: "1", type: "Mastercard", last4: "4242", expiry: "12/25", color: "#1E293B" },
  { id: "2", type: "Visa", last4: "1234", expiry: "09/26", color: "#1D4ED8" },
];

export default function CardsScreen() {
  const router = useRouter();
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const handleAddCard = () => {
    // Mock save
    setShowAddCard(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardName("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddCard(true)}>
          <Ionicons name="add" size={24} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {CARDS.map((card) => (
          <View key={card.id} style={[styles.card, { backgroundColor: card.color }]}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name={card.type.toLowerCase() as any} size={40} color="white" />
              <TouchableOpacity style={styles.cardMenu}>
                <Ionicons name="ellipsis-horizontal" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>Expiry</Text>
                <Text style={styles.cardValue}>{card.expiry}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Holder</Text>
                <Text style={styles.cardValue}>Golden Amadi</Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addNewCard} onPress={() => setShowAddCard(true)}>
          <View style={styles.addIcon}>
            <Ionicons name="add" size={24} color={THEME.colors.primary} />
          </View>
          <Text style={styles.addText}>Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCard}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddCard(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setShowAddCard(false)}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  maxLength={19}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    value={expiry}
                    onChangeText={setExpiry}
                    maxLength={5}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name on card"
                  value={cardName}
                  onChangeText={setCardName}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleAddCard}>
                <Text style={styles.saveButtonText}>Save Card</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
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
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadow.base,
  },
  addButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    padding: THEME.spacing.lg,
    gap: 20,
  },
  card: {
    height: 200,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
    ...THEME.shadow.card,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMenu: {
    padding: 4,
  },
  cardNumber: {
    fontFamily: THEME.typography.fontFamily.heading,
    fontSize: 22,
    color: "white",
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: 14,
    color: "white",
  },
  addNewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    borderStyle: "dashed",
    gap: 12,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.text,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  inputGroup: {
    marginBottom: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  saveButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  saveButtonText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.md,
  },
});
