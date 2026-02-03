// app/business/services.tsx
// Business Service Offerings Management

import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { businessService, ServiceOffering } from "@/services";
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

const SERVICE_CATEGORIES = [
  { id: 'electrical', name: 'Electrical Services', icon: 'flash' },
  { id: 'plumbing', name: 'Plumbing Services', icon: 'water' },
  { id: 'carpentry', name: 'Carpentry', icon: 'hammer' },
  { id: 'ac_repair', name: 'AC Repair', icon: 'snow' },
  { id: 'painting', name: 'Painting', icon: 'color-palette' },
  { id: 'cleaning', name: 'Cleaning', icon: 'sparkles' },
  { id: 'landscaping', name: 'Landscaping', icon: 'leaf' },
  { id: 'appliance', name: 'Appliance Repair', icon: 'tv' },
];

const PRICE_TYPES: { key: ServiceOffering['priceType']; label: string }[] = [
  { key: 'fixed', label: 'Fixed Price' },
  { key: 'hourly', label: 'Per Hour' },
  { key: 'quote', label: 'Get Quote' },
];

export default function ServicesManagement() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [services, setServices] = useState<ServiceOffering[]>([]);
  
  // Add service modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newService, setNewService] = useState({
    categoryId: '',
    categoryName: '',
    description: '',
    basePrice: '',
    priceType: 'quote' as ServiceOffering['priceType'],
  });

  const loadServices = useCallback(async () => {
    try {
      const businessId = user?.id || 'business_001';
      const servicesData = await businessService.getServiceOfferings(businessId);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadServices();
  }, [loadServices]);

  const handleAddService = async () => {
    if (!newService.categoryId || !newService.description.trim()) {
      Alert.alert('Error', 'Please select a category and add a description');
      return;
    }

    const businessId = user?.id || 'business_001';
    const result = await businessService.addServiceOffering(businessId, {
      categoryId: newService.categoryId,
      categoryName: newService.categoryName,
      description: newService.description,
      basePrice: parseInt(newService.basePrice) || 0,
      priceType: newService.priceType,
    });

    if (result.success) {
      Alert.alert('Success', 'Service added successfully');
      setModalVisible(false);
      setNewService({ categoryId: '', categoryName: '', description: '', basePrice: '', priceType: 'quote' });
      loadServices();
    }
  };

  const handleToggleService = async (serviceId: string) => {
    await businessService.toggleServiceStatus(serviceId);
    loadServices();
  };

  const formatPrice = (price: number, type: ServiceOffering['priceType']): string => {
    if (type === 'quote') return 'Get Quote';
    if (price === 0) return 'Starting from ₦0';
    const formatted = `₦${price.toLocaleString()}`;
    return type === 'hourly' ? `${formatted}/hr` : formatted;
  };

  const getCategoryIcon = (categoryId: string): string => {
    return SERVICE_CATEGORIES.find(c => c.id === categoryId)?.icon || 'construct';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const activeServices = services.filter(s => s.isActive);
  const inactiveServices = services.filter(s => !s.isActive);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Services</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{activeServices.length}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Active Services</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{inactiveServices.length}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Paused</Text>
        </View>
      </View>

      {/* Services List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {services.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="toolbox-outline" size={48} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Services Listed</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Add the services your business offers
            </Text>
            <TouchableOpacity 
              style={[styles.addFirstBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addFirstText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          services.map(service => (
            <View 
              key={service.id} 
              style={[
                styles.serviceCard, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                !service.isActive && styles.inactiveCard
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons 
                  name={getCategoryIcon(service.categoryId) as any} 
                  size={24} 
                  color={colors.primary} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.serviceHeader}>
                  <Text style={[styles.serviceName, { color: service.isActive ? colors.text : colors.muted }]}>
                    {service.categoryName}
                  </Text>
                  {!service.isActive && (
                    <View style={[styles.pausedBadge, { backgroundColor: colors.errorLight }]}>
                      <Text style={[styles.pausedText, { color: colors.error }]}>Paused</Text>
                    </View>
                  )}
                </View>
                <Text 
                  style={[styles.serviceDescription, { color: colors.muted }]} 
                  numberOfLines={2}
                >
                  {service.description}
                </Text>
                <Text style={[styles.servicePrice, { color: colors.primary }]}>
                  {formatPrice(service.basePrice, service.priceType)}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.toggleBtn}
                onPress={() => handleToggleService(service.id)}
              >
                <Ionicons 
                  name={service.isActive ? "pause-circle-outline" : "play-circle-outline"} 
                  size={28} 
                  color={service.isActive ? colors.error : colors.success} 
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Service Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Service</Text>
            
            <Text style={[styles.inputLabel, { color: colors.muted }]}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {SERVICE_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    { borderColor: colors.border },
                    newService.categoryId === cat.id && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setNewService({...newService, categoryId: cat.id, categoryName: cat.name})}
                >
                  <Ionicons 
                    name={cat.icon as any} 
                    size={16} 
                    color={newService.categoryId === cat.id ? 'white' : colors.muted} 
                  />
                  <Text style={[
                    styles.categoryChipText,
                    { color: colors.muted },
                    newService.categoryId === cat.id && { color: 'white' }
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Service description..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              value={newService.description}
              onChangeText={(text) => setNewService({...newService, description: text})}
            />
            
            <Text style={[styles.inputLabel, { color: colors.muted }]}>Pricing</Text>
            <View style={styles.pricingRow}>
              {PRICE_TYPES.map(pt => (
                <TouchableOpacity
                  key={pt.key}
                  style={[
                    styles.priceTypeBtn,
                    { borderColor: colors.border },
                    newService.priceType === pt.key && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setNewService({...newService, priceType: pt.key})}
                >
                  <Text style={[
                    styles.priceTypeBtnText,
                    { color: colors.muted },
                    newService.priceType === pt.key && { color: 'white' }
                  ]}>
                    {pt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {newService.priceType !== 'quote' && (
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder={newService.priceType === 'hourly' ? 'Hourly rate (₦)' : 'Fixed price (₦)'}
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={newService.basePrice}
                onChangeText={(text) => setNewService({...newService, basePrice: text})}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.cancelBtn, { backgroundColor: colors.background }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleAddService}
              >
                <Text style={styles.submitBtnText}>Add Service</Text>
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
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: THEME.spacing.lg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  pausedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pausedText: {
    fontSize: 10,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  serviceDescription: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginTop: 4,
    lineHeight: 16,
  },
  servicePrice: {
    fontSize: 13,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: 6,
  },
  toggleBtn: {
    padding: 4,
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
    textAlign: 'center',
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.heading,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.body,
    marginBottom: 8,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.bodyMedium,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  priceTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  priceTypeBtnText: {
    fontSize: 12,
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
