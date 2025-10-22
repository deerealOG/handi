// app/artisan/change-password.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "New passwords do not match.");
    }

    // TODO: Connect to backend authentication
    Alert.alert("✅ Success", "Your password has been changed.");
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
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
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.saveText}>Update Password</Text>
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
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
    marginRight: 22,
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
    color: THEME.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
