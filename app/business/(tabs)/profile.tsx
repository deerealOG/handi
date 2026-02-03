// app/business/(tabs)/profile.tsx
// Business Profile & Availability Management

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { BusinessProfile, businessService } from "@/services";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../../constants/theme";

export default function BusinessProfileScreen() {
  const { colors } = useAppTheme();
  const { user, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState<Partial<BusinessProfile>>({});

  const loadProfile = useCallback(async () => {
    try {
      const businessId = user?.id || 'business_001';
      const data = await businessService.getProfile(businessId);
      setProfile(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      await businessService.updateProfile(profile.id, editForm);
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = (index: number) => {
    if (!editForm.availability) return;
    
    const newAvailability = [...editForm.availability];
    newAvailability[index].isOpen = !newAvailability[index].isOpen;
    setEditForm({ ...editForm, availability: newAvailability });
  };

  const handleTimeChange = (index: number, type: 'start' | 'end', time: string) => {
    if (!editForm.availability) return;
    
    const newAvailability = [...editForm.availability];
    if (type === 'start') newAvailability[index].start = time;
    else newAvailability[index].end = time;
    setEditForm({ ...editForm, availability: newAvailability });
  };

  const handlePickImage = async (type: 'avatar' | 'cover') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'avatar') {
        setEditForm({ ...editForm, avatar: result.assets[0].uri });
      } else {
        setEditForm({ ...editForm, coverImage: result.assets[0].uri });
      }
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  if (loading && !profile) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Profile</Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.actionText, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Cover & Avatar */}
        <View style={styles.coverContainer}>
          <TouchableOpacity 
            disabled={!isEditing} 
            onPress={() => handlePickImage('cover')}
            style={[styles.coverImage, { backgroundColor: colors.surface }]}
          >
            {editForm.coverImage || profile?.coverImage ? (
              <Image 
                source={{ uri: isEditing ? editForm.coverImage : profile?.coverImage }} 
                style={styles.coverImageFull} 
              />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={32} color={colors.muted} />
                {isEditing && <Text style={{ color: colors.muted, fontSize: 12 }}>Add Cover</Text>}
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            disabled={!isEditing}
            onPress={() => handlePickImage('avatar')}
            style={[styles.avatarContainer, { borderColor: colors.background }]}
          >
            {editForm.avatar || profile?.avatar ? (
              <Image 
                source={{ uri: isEditing ? editForm.avatar : profile?.avatar }} 
                style={styles.avatarImage} 
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {(editForm.businessName || profile?.businessName || 'B').charAt(0)}
                </Text>
              </View>
            )}
            {isEditing && (
              <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Business Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Business Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Business Name</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={editForm.businessName}
                onChangeText={(text) => setEditForm({ ...editForm, businessName: text })}
              />
            ) : (
              <Text style={[styles.value, { color: colors.text }]}>{profile?.businessName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Description</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={editForm.description}
                onChangeText={(text) => setEditForm({ ...editForm, description: text })}
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={[styles.value, { color: colors.text }]}>{profile?.description}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Address</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                value={editForm.address}
                onChangeText={(text) => setEditForm({ ...editForm, address: text })}
              />
            ) : (
              <Text style={[styles.value, { color: colors.text }]}>{profile?.address}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.muted }]}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={[styles.value, { color: colors.text }]}>{profile?.phone}</Text>
              )}
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
              <Text style={[styles.value, { color: colors.text }]}>{profile?.email}</Text>
            </View>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Operating Hours</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            Set when your business is available for bookings
          </Text>

          {isEditing ? (
            editForm.availability?.map((day, index) => (
              <View key={day.day} style={[styles.availabilityRow, { borderBottomColor: colors.border }]}>
                <View style={styles.daySwitch}>
                  <Switch
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="white"
                    value={day.isOpen}
                    onValueChange={() => handleAvailabilityToggle(index)}
                  />
                  <Text style={[styles.dayName, { color: colors.text }]}>{day.day.substring(0, 3)}</Text>
                </View>

                {day.isOpen ? (
                  <View style={styles.timeInputs}>
                    <TextInput
                      style={[styles.timeInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                      value={day.start}
                      onChangeText={(text) => handleTimeChange(index, 'start', text)}
                      placeholder="09:00"
                    />
                    <Text style={{ color: colors.muted }}>-</Text>
                    <TextInput
                      style={[styles.timeInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                      value={day.end}
                      onChangeText={(text) => handleTimeChange(index, 'end', text)}
                      placeholder="17:00"
                    />
                  </View>
                ) : (
                  <Text style={[styles.closedText, { color: colors.muted }]}>Closed</Text>
                )}
              </View>
            ))
          ) : (
            profile?.availability?.map((day) => (
              <View key={day.day} style={[styles.availabilityDisplay, { borderBottomColor: colors.border }]}>
                <Text style={[styles.dayDisplay, { color: colors.text }]}>{day.day}</Text>
                <Text style={[
                  styles.timeDisplay, 
                  { color: day.isOpen ? colors.success : colors.error }
                ]}>
                  {day.isOpen ? `${day.start} - ${day.end}` : 'Closed'}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Account Actions */}
        {!isEditing && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: colors.errorLight }]}
              onPress={handleLogout}
            >
              <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  actionText: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  coverContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  coverImageFull: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    borderWidth: 4,
    borderRadius: 50,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    color: 'white',
    fontFamily: THEME.typography.fontFamily.heading,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  section: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.body,
    lineHeight: 22,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  daySwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 100,
  },
  dayName: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    width: 70,
    textAlign: 'center',
  },
  closedText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  availabilityDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dayDisplay: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.body,
  },
  timeDisplay: {
    fontSize: 15,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
