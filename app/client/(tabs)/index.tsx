// app/client/index.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { THEME } from "../../../constants/theme";

// this creates the top navigation icons displayed on the client
const TOPNAVIGATION = [
  { id: "7", name: "Profile", icon: "account-outline" },
  { id: "8", name: "Notifications", icon: "bell-outline" },
];

// this creates the list of categories displayed on the client 
const CATEGORIES = [
  { id: "1", name: "Electrician", icon: "flash-outline" },
  { id: "2", name: "Plumber", icon: "pipe" },
  { id: "3", name: "Carpenter", icon: "hammer-screwdriver" },
  { id: "4", name: "Barber", icon: "scissors-cutting" },
  { id: "5", name: "Painter", icon: "format-paint" },
  { id: "6", name: "Gardener", icon: "leaf" },
];

// the main function that renders the client home screen
export default function ClientHome() {
  return (
    // This is the main content area
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation*/}
      <View style={styles.topNav}>
        {TOPNAVIGATION.map((item) => (
          <TouchableOpacity key={item.id} style={styles.navItem}>
            <MaterialCommunityIcons name={item.icon as any} size={28} color={THEME.colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Golden</Text>        
        <Text style={styles.subText}>What do you need fixed today?</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={THEME.colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for services or artisans..."
          placeholderTextColor={THEME.colors.muted}
          returnKeyType="search"
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.categoryCard}>
            <MaterialCommunityIcons name={item.icon as any} size={28} color={THEME.colors.primary} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Featured Card*/}
      <Text style={styles.sectionTitle}>Featured</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3, 4].map((id) => (
          <View key={id} style={styles.featuredCardContainer}>
            <View style={styles.featuredCardFirstChild}> 
              <Image
                source={require('C:\\FIXIT\\assets\\images\\featured2.png')}
                style={{ width: 73, height: 73 , marginBottom: 10 }}
              />
              <Text>20% Off First Booking</Text>
              <TouchableOpacity key={id} style={styles.hireButton}>
                <Text style={styles.hireButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Image
                source={require('C:\\FIXIT\\assets\\images\\featured.png')}
                style={{ width: 117.45, height: 156 }}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Top Rated Artisans */}
      <Text style={styles.sectionTitle}>Top Rated Artisans</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        style={{ marginBottom: 16 }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
          <View key={id} style={styles.artisanCard}>
            <Image
              source={require('C:\\FIXIT\\assets\\images\\profileavatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.artisanName}>Golden Amadi</Text>
            <Text style={styles.artisanSkill}>Electrician</Text>
            <Text style={styles.artisanPrice}>Price hint: From ₦5,000</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color="#facc15" />
              <Text style={styles.ratingText}>4.{id}</Text>
            </View>
            <TouchableOpacity key={id} style={styles.hireButton}>
              <Text style={styles.hireButtonText}>Book now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Nearby Artisans */}
      <Text style={styles.sectionTitle}>Nearby Artisans</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {[9, 10, 11, 12, 13, 14, 15].map((id) => (
          <View key={id} style={styles.artisanCard}>
            <Image
              source={require('C:\\FIXIT\\assets\\images\\profileavatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.artisanName}>Golden Amadi</Text>
            <Text style={styles.artisanSkill}>Plumber</Text>
            <Text style={styles.artisanPrice}>Price hint: From ₦5,000</Text>
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={16} color="#facc15" />
              <Text style={styles.ratingText}>4.{id}</Text>
            </View>
            <TouchableOpacity key={id} style={styles.hireButton}>
              <Text style={styles.hireButtonText}>Book now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 40,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  header: {
    marginBottom: 7,
    alignItems: 'center', // center children horizontally
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28,140,75,0.05)', // 5% opacity for #1C8C4B
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
    height: 48,
    width: '100%',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
    textAlign: 'center', // ensure the text itself is centered
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 0,
    color: '#666666',
    fontSize: THEME.typography.sizes.sm,
  },
  subText: {
    color: THEME.colors.muted,
    marginTop: 4, marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
    marginVertical: 12,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryCard: {
    height: 100,
    width: "30%",
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    ...THEME.shadow.base,
  },
  categoryText: {
    fontSize: THEME.typography.sizes.sm,
    marginTop: 6,
    color: THEME.colors.text,
  },
  featuredCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: 'rgba(28, 140, 75, 0.10)',
    borderRadius: THEME.radius.lg,
    marginRight: 12, marginBottom: 20,
    alignItems: "center",
    width: 300.81, height: 'auto',
    paddingHorizontal: 10,
  },
  featuredCardFirstChild: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    fontSize:10, fontWeight:'regular',
  },
  hireButton: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#1C8C4B",
    paddingHorizontal: 5.36,
    paddingVertical: 7.8,
    borderRadius: 3.9,
    width: '70%',
    height: 30,
    marginTop:10,
  },
  hireButtonText: {
    color:THEME.colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  artisansGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},
  artisanCard: {
  backgroundColor: THEME.colors.white,
  borderRadius: THEME.radius.lg,
  padding: 12,
  marginRight: 12,
  marginBottom: 16,
  alignItems: "center",
  ...THEME.shadow.base,
},
avatar: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginBottom: 8,
},
  artisanName: {
    fontSize: THEME.typography.sizes.base,
    fontWeight: THEME.typography.weights.bold as any,
    color: THEME.colors.text,
  },
  artisanSkill: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.muted,
  },
  artisanPrice: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.text,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: THEME.colors.text,
  },
});
