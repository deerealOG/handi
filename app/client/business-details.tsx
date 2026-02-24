// app/client/business-details.tsx
import { Button } from "@/components/Button";
import { VerificationBadge, VerificationLevel } from "@/components/VerificationBadge";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { THEME } from "../../constants/theme";


// Mock Data for Tabs
const TABS = ["About", "Services", "Our Team", "Reviews"];

export default function BusinessDetails() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeTab, setActiveTab] = useState("About");

  // Get data from params or fallbacks
  const business = {
    id: params.id || "biz_001",
    name: params.name || "Apex Services Ltd",
    skill: params.skill || "Home Renovations",
    rating: params.rating ? Number(params.rating) : 4.8,
    reviewCount: params.reviews ? Number(params.reviews) : 200,
    price: params.price || "From NGN 10,000",
    distance: params.distance || "1.5 km",
    verificationLevel: (params.verified === 'true' ? "certified" : "none") as VerificationLevel,
    isEmergencyAvailable: true,
    description: "Apex Services Ltd is a premier home renovation company specializing in electrical, plumbing, and general contracting. With a team of certified professionals, we deliver quality results for both residential and commercial projects.",
    address: "123 Victoria Island, Lagos",
    phone: "+234 800 123 4567",
    email: "contact@apexservices.com",
    website: "www.apexservices.com",
  };

  const services = [
    { id: "1", name: "Electrical Wiring", price: "NGN 15,000", description: "Complete house wiring and rewiring." },
    { id: "2", name: "Plumbing Installation", price: "NGN 12,000", description: "Installation of sinks, toilets, and showers." },
    { id: "3", name: "AC Maintenance", price: "NGN 8,000", description: "Cleaning and gas refill." },
    { id: "4", name: "General Repairs", price: "Quote", description: "Assessment and repair of various household items." },
  ];

  const team = [
    { id: "1", name: "Chidi Okonkwo", role: "Lead Electrician", exp: "8 years", verified: true },
    { id: "2", name: "Amaka Eze", role: "Senior Plumber", exp: "6 years", verified: true },
    { id: "3", name: "John Doe", role: "Technician", exp: "3 years", verified: false },
  ];

  const reviews = [
    { id: 1, name: "Amina O.", comment: "Apex Services did a fantastic job on my kitchen renovation. Professional team!", rating: 5 },
    { id: 2, name: "Chuka M.", comment: "Good service, but arrived a bit late. The work quality was excellent though.", rating: 4 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Services":
        return (
          <View style={styles.tabContent}>
             {services.map((service) => (
                <TouchableOpacity 
                  key={service.id} 
                  style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push({
                    pathname: "/client/book-artisan", // Reuse booking flow
                    params: { 
                      artisan: business.name, 
                      skill: service.name,
                      isBusiness: "true"
                    }
                  })}
                >
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                    <Text style={[styles.serviceDesc, { color: colors.muted }]}>{service.description}</Text>
                    <Text style={[styles.servicePrice, { color: colors.primary }]}>{service.price}</Text>
                  </View>
                  <View style={[styles.bookAction, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.bookActionText, { color: colors.primary }]}>Book</Text>
                  </View>
                </TouchableOpacity>
             ))}
          </View>
        );
      case "Our Team":
        return (
           <View style={styles.tabContent}>
             {team.map((member) => (
                <View key={member.id} style={[styles.teamCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Image source={require("../../assets/images/profileavatar.png")} style={styles.teamAvatar} />
                  <View style={styles.teamInfo}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                         <Text style={[styles.teamName, { color: colors.text }]}>{member.name}</Text>
                         {member.verified && <MaterialCommunityIcons name="check-decagram" size={14} color={colors.primary} />}
                    </View>
                    <Text style={[styles.teamRole, { color: colors.muted }]}>{member.role} • {member.exp}</Text>
                  </View>
                </View>
             ))}
           </View>
        );
      case "Reviews":
        return (
           <View style={styles.tabContent}>
             {reviews.map((review) => (
                <View key={review.id} style={[styles.reviewItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                   <View style={styles.reviewHeader}>
                      <Text style={[styles.reviewName, { color: colors.text }]}>{review.name}</Text>
                      <View style={{flexDirection: 'row'}}><Ionicons name="star" size={14} color="#FACC15" /><Text style={{color: colors.text, fontSize: 12, marginLeft: 2}}>{review.rating}</Text></View>
                   </View>
                   <Text style={[styles.reviewComment, { color: colors.muted }]}>{review.comment}</Text>
                </View>
             ))}
           </View>
        );
      case "About":
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.description, { color: colors.muted }]}>{business.description}</Text>
            
            <TouchableOpacity 
              style={[styles.infoRow, { marginTop: 16 }]}
              onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`)}
            >
               <Ionicons name="location-outline" size={20} color={colors.muted} />
               <Text style={[styles.infoText, { color: colors.primary, textDecorationLine: 'underline' }]}>{business.address}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${business.phone}`)}
            >
               <Ionicons name="call-outline" size={20} color={colors.muted} />
               <Text style={[styles.infoText, { color: colors.primary, textDecorationLine: 'underline' }]}>{business.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => Linking.openURL(`mailto:${business.email}`)}
            >
               <Ionicons name="mail-outline" size={20} color={colors.muted} />
               <Text style={[styles.infoText, { color: colors.primary, textDecorationLine: 'underline' }]}>{business.email}</Text>
            </TouchableOpacity>

             {/* Quick Stats */}
             <Text style={[styles.subsectionTitle, { color: colors.text }]}>Performance</Text>
             <View style={styles.quickStatsContainer}>
                <View style={[styles.quickStatCard, { backgroundColor: colors.surface }]}>
                  <MaterialCommunityIcons name="briefcase-check-outline" size={24} color={colors.primary} />
                  <Text style={[styles.quickStatValue, { color: colors.text }]}>500+</Text>
                  <Text style={[styles.quickStatLabel, { color: colors.muted }]}>Jobs Done</Text>
                </View>
                 <View style={[styles.quickStatCard, { backgroundColor: colors.surface }]}>
                  <MaterialCommunityIcons name="account-group-outline" size={24} color={colors.primary} />
                  <Text style={[styles.quickStatValue, { color: colors.text }]}>{team.length}</Text>
                  <Text style={[styles.quickStatLabel, { color: colors.muted }]}>Team Size</Text>
                </View>
             </View>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        {/* Header Image */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.coverImageContainer}>
          <Image source={require("../../assets/images/featured.png")} style={styles.coverImage} resizeMode="cover" />
          <View style={styles.overlay} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Business Info Header */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.headerContent}>
          <View style={[styles.logoWrapper, { borderColor: colors.surface }]}>
            <Image source={require("../../assets/images/profileavatar.png")} style={styles.logo} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.businessName, { color: colors.text }]}>{business.name}</Text>
            <Text style={[styles.category, { color: colors.muted }]}>{business.skill}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FACC15" />
                  <Text style={[styles.ratingValue, { color: colors.text }]}>{business.rating}</Text>
                  <Text style={[styles.reviewCount, { color: colors.muted }]}>({business.reviewCount} reviews)</Text>
                </View>
                <VerificationBadge level={business.verificationLevel} size="small" />
            </View>
          </View>
        </Animated.View>

        {/* Tabs */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={{ paddingHorizontal: THEME.spacing.lg }}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabItem,
                  activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab ? colors.primary : colors.muted, fontFamily: activeTab === tab ? THEME.typography.fontFamily.subheading : THEME.typography.fontFamily.body }
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Content */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.contentContainer}>
          {renderContent()}
        </Animated.View>

        {/* Extra padding for bottom area visibility */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 🟢 Bottom Action Bar */}
      <View style={[styles.bottomAction, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.muted }]}>Starting from</Text>
          <Text style={[styles.priceValue, { color: colors.primary }]}>{business.price}</Text>
        </View>
        <Button 
          label="Book Service"
          onPress={() => setActiveTab("Services")}
          style={styles.mainBookButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    paddingHorizontal: THEME.spacing.xl,
    flexDirection: 'row',
    marginTop: -40,
    alignItems: 'flex-end',
    marginBottom: THEME.spacing.md,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadow.base,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
    paddingBottom: 4,
  },
  businessName: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  category: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: THEME.typography.fontFamily.body,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  
  // Tabs
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabText: {
    fontSize: 16,
  },
  
  // Content
  contentContainer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 18,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginTop: 16,
    marginBottom: 12,
  },
  
  // Services
  serviceCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...THEME.shadow.base,
  },
  serviceInfo: {
    flex: 1,
    paddingRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 12,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  bookAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookActionText: {
    fontSize: 12,
    fontFamily: THEME.typography.fontFamily.subheading,
  },

  // Team
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  teamRole: {
    fontSize: 12,
  },

  // Reviews
  reviewItem: {
    padding: 16,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    ...THEME.shadow.base,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewName: {
    fontFamily: THEME.typography.fontFamily.subheading,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 20,
  },

  // Stats
  quickStatsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  quickStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...THEME.shadow.base,
  },
  quickStatValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 12,
  },

  // Bottom Action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    ...THEME.shadow.lg,
  },
  priceLabel: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 20,
    fontFamily: THEME.typography.fontFamily.heading,
  },
  mainBookButton: {
    flex: 1,
    marginLeft: 20,
  },
});

