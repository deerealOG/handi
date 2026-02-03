// app/artisan/change-password.tsx
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function ChangePassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert("Error", "New password must be different from current password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(currentPassword, newPassword);
      if (result.success) {
        Alert.alert("✅ Success", "Your password has been changed.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to update password");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      {[
        {
          label: "Current Password",
          value: currentPassword,
          setter: setCurrentPassword,
          placeholder: "Enter current password",
        },
        {
          label: "New Password",
          value: newPassword,
          setter: setNewPassword,
          placeholder: "Enter new password",
        },
        {
          label: "Confirm New Password",
          value: confirmPassword,
          setter: setConfirmPassword,
          placeholder: "Re-enter new password",
        },
      ].map((field, index) => (
        <View key={index} style={styles.field}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder={field.placeholder}
            placeholderTextColor={THEME.colors.muted}
            value={field.value}
            onChangeText={field.setter}
            editable={!isLoading}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveButton, { opacity: isLoading ? 0.7 : 1 }]}
        onPress={handleChangePassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={THEME.colors.surface} size="small" />
        ) : (
          <Text style={styles.saveText}>Update Password</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    color: THEME.colors.text,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: THEME.colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(28,140,75,0.05)",
    borderRadius: THEME.radius.md,
    padding: 12,
    color: THEME.colors.text,
  },
  saveButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: THEME.colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
