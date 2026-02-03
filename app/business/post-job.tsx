// app/business/post-job.tsx
// Business job posting screen

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { businessService, CreateProjectData, ProjectPriority } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../constants/theme";

const SERVICE_TYPES = [
  "Renovation",
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "AC Repair",
  "Cleaning",
  "Gardening",
  "General Maintenance",
];

const SKILL_OPTIONS = [
  "Plumber",
  "Electrician",
  "Painter",
  "Carpenter",
  "AC Technician",
  "Cleaner",
  "Gardener",
  "Mason",
  "Welder",
];

const PRIORITY_OPTIONS: { value: ProjectPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
  { value: 'urgent', label: 'Urgent', color: '#7C3AED' },
];

export default function PostJobScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lagos');
  const [state, setState] = useState('Lagos');
  const [priority, setPriority] = useState<ProjectPriority>('medium');
  const [artisansNeeded, setArtisansNeeded] = useState('1');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return 'Please enter a job title';
    if (!description.trim()) return 'Please enter a job description';
    if (!serviceType) return 'Please select a service type';
    if (selectedSkills.length === 0) return 'Please select at least one required skill';
    if (!budgetMin || !budgetMax) return 'Please enter budget range';
    if (parseInt(budgetMin) >= parseInt(budgetMax)) return 'Maximum budget must be greater than minimum';
    if (!address.trim()) return 'Please enter the job location';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setLoading(true);
    try {
      const projectData: CreateProjectData = {
        title: title.trim(),
        description: description.trim(),
        serviceType,
        requiredSkills: selectedSkills,
        budgetMin: parseInt(budgetMin),
        budgetMax: parseInt(budgetMax),
        address: address.trim(),
        city,
        state,
        priority,
        artisansNeeded: parseInt(artisansNeeded) || 1,
      };

      const result = await businessService.createProject(
        user?.id || 'business_001',
        projectData
      );

      if (result.success) {
        Alert.alert(
          'Success',
          'Your job has been posted successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to post job');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post a Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Job Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. Office Renovation - Floor 3"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Describe the work that needs to be done..."
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Service Type */}
          <View style={[styles.fieldContainer, { zIndex: 100 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Service Type *</Text>
            <TouchableOpacity
              style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setShowServiceDropdown(!showServiceDropdown)}
            >
              <Text style={[styles.dropdownText, { color: serviceType ? colors.text : colors.muted }]}>
                {serviceType || 'Select service type'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.muted} />
            </TouchableOpacity>
            
            {showServiceDropdown && (
              <View style={[styles.dropdownList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {SERVICE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setServiceType(type);
                      setShowServiceDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, { color: colors.text }]}>{type}</Text>
                    {serviceType === type && (
                      <Ionicons name="checkmark" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Required Skills */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Required Skills *</Text>
            <View style={styles.skillsGrid}>
              {SKILL_OPTIONS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillChip,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    selectedSkills.includes(skill) && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={[
                    styles.skillChipText,
                    { color: selectedSkills.includes(skill) ? 'white' : colors.text },
                  ]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Budget Range (₦) *</Text>
            <View style={styles.budgetRow}>
              <TextInput
                style={[styles.budgetInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Min"
                placeholderTextColor={colors.muted}
                value={budgetMin}
                onChangeText={setBudgetMin}
                keyboardType="numeric"
              />
              <Text style={[styles.budgetDash, { color: colors.muted }]}>—</Text>
              <TextInput
                style={[styles.budgetInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Max"
                placeholderTextColor={colors.muted}
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Location *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter full address"
              placeholderTextColor={colors.muted}
              value={address}
              onChangeText={setAddress}
            />
            <View style={styles.cityStateRow}>
              <TextInput
                style={[styles.halfInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="City"
                placeholderTextColor={colors.muted}
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.halfInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="State"
                placeholderTextColor={colors.muted}
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>

          {/* Priority */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityChip,
                    { borderColor: option.color },
                    priority === option.value && { backgroundColor: option.color },
                  ]}
                  onPress={() => setPriority(option.value)}
                >
                  <Text style={[
                    styles.priorityText,
                    { color: priority === option.value ? 'white' : option.color },
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Artisans Needed */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Artisans Needed</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setArtisansNeeded(Math.max(1, parseInt(artisansNeeded) - 1).toString())}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.counterValue, { color: colors.text }]}>{artisansNeeded}</Text>
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setArtisansNeeded((parseInt(artisansNeeded) + 1).toString())}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="briefcase-plus" size={20} color="white" />
                <Text style={styles.submitText}>Post Job</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 50,
    paddingBottom: THEME.spacing.md,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  content: {
    padding: THEME.spacing.lg,
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  dropdownText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    ...THEME.shadow.card,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  skillChipText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  budgetDash: {
    fontSize: 20,
  },
  cityStateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    minWidth: 30,
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
