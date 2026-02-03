import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
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

const RECENT_ARTISANS = [
  { id: "1", name: "Emeka Johnson", skill: "Plumber" },
  { id: "2", name: "Sarah Jones", skill: "Electrician" },
  { id: "3", name: "Mike Obi", skill: "Carpenter" },
];

export default function TransferScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"user" | "tip" | "business">("user");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);

  const handleTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (activeTab === "user" && !recipient) {
      Alert.alert("Error", "Please enter recipient email or phone");
      return;
    }
    if ((activeTab === "tip" || activeTab === "business") && !selectedArtisan) {
      Alert.alert("Error", "Please select a recipient");
      return;
    }
    
    // const recipientName = activeTab === "user" ? recipient : RECENT_ARTISANS.find(a => a.id === selectedArtisan)?.name;
    Alert.alert("Success", `Transfer initiated for ₦${amount}`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer Funds</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "user" && styles.activeTab]}
            onPress={() => setActiveTab("user")}
          >
            <Text style={[styles.tabText, activeTab === "user" && styles.activeTabText]}>To User</Text>
          </TouchableOpacity>
           <TouchableOpacity 
            style={[styles.tab, activeTab === "business" && styles.activeTab]}
            onPress={() => setActiveTab("business")}
          >
            <Text style={[styles.tabText, activeTab === "business" && styles.activeTabText]}>Pay Business</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "tip" && styles.activeTab]}
            onPress={() => setActiveTab("tip")}
          >
            <Text style={[styles.tabText, activeTab === "tip" && styles.activeTabText]}>Tip Artisan</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            
            {activeTab === "user" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient (Email or Phone)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="user@example.com or +234..."
                  placeholderTextColor={THEME.colors.muted}
                  value={recipient}
                  onChangeText={setRecipient}
                  autoCapitalize="none"
                />
              </View>
            ) : activeTab === "tip" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Artisan</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artisanScroll}>
                  {RECENT_ARTISANS.map((artisan) => (
                    <TouchableOpacity
                      key={artisan.id}
                      style={[
                        styles.artisanCard,
                        selectedArtisan === artisan.id && styles.artisanCardSelected
                      ]}
                      onPress={() => setSelectedArtisan(artisan.id)}
                    >
                      <Image 
                        source={require("../../../assets/images/profileavatar.png")} 
                        style={styles.artisanAvatar} 
                      />
                      <Text style={styles.artisanName}>{artisan.name}</Text>
                      <Text style={styles.artisanSkill}>{artisan.skill}</Text>
                      {selectedArtisan === artisan.id && (
                        <View style={styles.checkBadge}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
               // Business Tab
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Business</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artisanScroll}>
                  {[
                      { id: "b1", name: "Apex Services", skill: "Construction" },
                      { id: "b2", name: "CleanPro", skill: "Cleaning" }
                  ].map((biz) => (
                    <TouchableOpacity
                      key={biz.id}
                      style={[
                        styles.artisanCard,
                        selectedArtisan === biz.id && styles.artisanCardSelected
                      ]}
                      onPress={() => setSelectedArtisan(biz.id)}
                    >
                      <Image 
                        source={require("../../../assets/images/featured.png")} 
                        style={styles.artisanAvatar} 
                      />
                      <Text style={styles.artisanName}>{biz.name}</Text>
                      <Text style={styles.artisanSkill}>{biz.skill}</Text>
                      {selectedArtisan === biz.id && (
                        <View style={styles.checkBadge}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencyPrefix}>₦</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={THEME.colors.muted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>
             
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={activeTab === "tip" ? "Great job! Thanks." : "What's this for?"}
                placeholderTextColor={THEME.colors.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (!amount || (activeTab === "user" && !recipient) || (activeTab === "tip" && !selectedArtisan)) && styles.submitButtonDisabled
            ]} 
            onPress={handleTransfer}
            disabled={!amount || (activeTab === "user" && !recipient) || (activeTab === "tip" && !selectedArtisan)}
          >
            <Text style={styles.submitButtonText}>
              {activeTab === "tip" ? "Send Tip" : "Send Money"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 20,
  },
  
  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: THEME.colors.surface,
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.muted,
  },
  activeTabText: {
    color: THEME.colors.surface,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  form: {
    gap: 24,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
    color: THEME.colors.text,
  },
  input: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.body,
    color: THEME.colors.text,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  
  // Artisan Selection
  artisanScroll: {
    flexDirection: "row",
  },
  artisanCard: {
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
    marginRight: 12,
    width: 100,
    position: "relative",
  },
  artisanCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: "#F0FDF4",
  },
  artisanAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  artisanName: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
    color: THEME.colors.text,
    textAlign: "center",
    marginBottom: 2,
  },
  artisanSkill: {
    fontSize: 10,
    color: THEME.colors.muted,
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  submitButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    ...THEME.shadow.card,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: THEME.colors.surface,
    fontSize: THEME.typography.sizes.md,
    fontFamily: THEME.typography.fontFamily.heading,
  },
});
