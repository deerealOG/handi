import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../constants/theme";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // --- Load Saved Data ---
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("artisanProfile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setName(parsed.name || "");
          setProfession(parsed.profession || "");
          setBio(parsed.bio || "");
          setPhone(parsed.phone || "");
          setEmail(parsed.email || "");
          setProfileImage(parsed.profileImage || null);
        }
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  // --- Image Picker ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // --- Save Data ---
  const handleSave = async () => {
    try {
      const profileData = {
        name,
        profession,
        bio,
        phone,
        email,
        profileImage,
      };
      await AsyncStorage.setItem("artisanProfile", JSON.stringify(profileData));
      Alert.alert("✅ Profile Updated", "Your changes have been saved.");
      router.back();
    } catch (error) {
      console.log("Save error:", error);
      Alert.alert("❌ Error", "Failed to save your profile.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/profileavatar.png")
            }
            style={styles.avatar}
          />
          <View style={styles.editIcon}>
            <MaterialCommunityIcons
              name="pencil"
              size={16}
              color={THEME.colors.surface}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      {[
        { label: "Full Name", value: name, setter: setName, placeholder: "Enter your name" },
        { label: "Profession", value: profession, setter: setProfession, placeholder: "e.g. Electrician" },
        { label: "Phone Number", value: phone, setter: setPhone, placeholder: "Enter phone number" },
        { label: "Email", value: email, setter: setEmail, placeholder: "Enter email address" },
      ].map((field, index) => (
        <View key={index} style={styles.field}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.placeholder}
            placeholderTextColor={THEME.colors.muted}
          />
        </View>
      ))}

      <View style={styles.field}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell clients more about your experience..."
          placeholderTextColor={THEME.colors.muted}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.primary,
    borderRadius: 15,
    padding: 4,
  },
  field: {
    marginBottom: 18,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
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
