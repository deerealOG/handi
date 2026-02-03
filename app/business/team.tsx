// app/business/team.tsx
// Business Team Management Screen

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { businessService, TeamMember } from "@/services";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { THEME } from "../../constants/theme";

const ROLES: { key: TeamMember['role']; label: string }[] = [
  { key: 'manager', label: 'Manager' },
  { key: 'technician', label: 'Technician' },
  { key: 'support', label: 'Support' },
];

export default function TeamManagement() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  
  // Add member modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'technician' as TeamMember['role'],
    skills: '',
  });

  const loadTeam = useCallback(async () => {
    try {
      const businessId = user?.id || 'business_001';
      const teamData = await businessService.getTeamMembers(businessId);
      setTeam(teamData);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTeam();
  }, [loadTeam]);

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim() || !newMember.phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const businessId = user?.id || 'business_001';
    const result = await businessService.addTeamMember(businessId, {
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role,
      skills: newMember.skills.split(',').map(s => s.trim()).filter(Boolean),
    });

    if (result.success) {
      Alert.alert('Success', 'Team member added successfully');
      setModalVisible(false);
      setNewMember({ name: '', email: '', phone: '', role: 'technician', skills: '' });
      loadTeam();
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    await businessService.updateTeamMember(member.id, { isActive: !member.isActive });
    loadTeam();
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'manager': return { bg: '#EDE9FE', text: '#7C3AED' };
      case 'technician': return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'support': return { bg: '#FCE7F3', text: '#DB2777' };
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const activeTeam = team.filter(m => m.isActive);
  const inactiveTeam = team.filter(m => !m.isActive);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Team</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{activeTeam.length}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {team.filter(m => m.role === 'technician').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Technicians</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {team.filter(m => m.role === 'manager').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Managers</Text>
        </View>
      </View>

      {/* Team List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {team.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="account-group-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Team Members</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Add team members to assign jobs
            </Text>
            <TouchableOpacity 
              style={[styles.addFirstBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addFirstText}>Add Team Member</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Active Members */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Members ({activeTeam.length})
            </Text>
            {activeTeam.map(member => {
              const roleColor = getRoleColor(member.role);
              return (
                <View key={member.id} style={[styles.memberCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberEmail, { color: colors.muted }]}>{member.email}</Text>
                    <View style={styles.skillsRow}>
                      {member.skills.slice(0, 2).map((skill, i) => (
                        <View key={i} style={[styles.skillTag, { backgroundColor: colors.background }]}>
                          <Text style={[styles.skillText, { color: colors.muted }]}>{skill}</Text>
                        </View>
                      ))}
                      {member.skills.length > 2 && (
                        <Text style={[styles.moreSkills, { color: colors.muted }]}>
                          +{member.skills.length - 2}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={[styles.roleBadge, { backgroundColor: roleColor.bg }]}>
                      <Text style={[styles.roleText, { color: roleColor.text }]}>
                        {member.role}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.toggleBtn}
                      onPress={() => handleToggleActive(member)}
                    >
                      <Ionicons name="ellipsis-horizontal" size={18} color={colors.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Inactive Members */}
            {inactiveTeam.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.muted, marginTop: 20 }]}>
                  Inactive ({inactiveTeam.length})
                </Text>
                {inactiveTeam.map(member => (
                  <View key={member.id} style={[styles.memberCard, styles.inactiveCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.background }]}>
                      <Text style={[styles.avatarText, { color: colors.muted }]}>
                        {member.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.memberName, { color: colors.muted }]}>{member.name}</Text>
                      <Text style={[styles.memberEmail, { color: colors.muted }]}>{member.email}</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.activateBtn, { borderColor: colors.primary }]}
                      onPress={() => handleToggleActive(member)}
                    >
                      <Text style={[styles.activateText, { color: colors.primary }]}>Activate</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Member Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Team Member</Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Full Name *"
              placeholderTextColor={colors.muted}
              value={newMember.name}
              onChangeText={(text) => setNewMember({...newMember, name: text})}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Email *"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              value={newMember.email}
              onChangeText={(text) => setNewMember({...newMember, email: text})}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Phone *"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              value={newMember.phone}
              onChangeText={(text) => setNewMember({...newMember, phone: text})}
            />
            
            <Text style={[styles.inputLabel, { color: colors.muted }]}>Role</Text>
            <View style={styles.roleButtons}>
              {ROLES.map(role => (
                <TouchableOpacity
                  key={role.key}
                  style={[
                    styles.roleBtn,
                    { borderColor: colors.border },
                    newMember.role === role.key && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setNewMember({...newMember, role: role.key})}
                >
                  <Text style={[
                    styles.roleBtnText,
                    { color: colors.muted },
                    newMember.role === role.key && { color: 'white' }
                  ]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Skills (comma separated)"
              placeholderTextColor={colors.muted}
              value={newMember.skills}
              onChangeText={(text) => setNewMember({...newMember, skills: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.cancelBtn, { backgroundColor: colors.background }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleAddMember}
              >
                <Text style={styles.submitBtnText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    marginLeft: 12,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  memberName: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  memberEmail: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  skillTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.body,
  },
  moreSkills: {
    fontSize: 11,
    fontFamily: THEME.typography.fontFamily.body,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.heading,
    textTransform: 'capitalize',
  },
  toggleBtn: {
    padding: 4,
  },
  activateBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  activateText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
    marginBottom: 20,
  },
  addFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addFirstText: {
    color: 'white',
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 20,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  roleBtnText: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
