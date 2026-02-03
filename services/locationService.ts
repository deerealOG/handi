// services/locationService.ts
// Location service with Nigerian cities for HANDI app

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "./api";

// ================================
// Types
// ================================
export interface City {
  id: string;
  name: string;
  state: string;
  coordinates: { lat: number; lng: number };
  isActive: boolean;
  artisanCount?: number;
}

export interface UserLocation {
  city: City;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

// ================================
// Nigerian Cities Data
// ================================
export const NIGERIAN_CITIES: City[] = [
  // Major Cities
  {
    id: "lagos",
    name: "Lagos",
    state: "Lagos",
    coordinates: { lat: 6.5244, lng: 3.3792 },
    isActive: true,
    artisanCount: 2500,
  },
  {
    id: "abuja",
    name: "Abuja",
    state: "FCT",
    coordinates: { lat: 9.0579, lng: 7.4951 },
    isActive: true,
    artisanCount: 1800,
  },
  {
    id: "port-harcourt",
    name: "Port Harcourt",
    state: "Rivers",
    coordinates: { lat: 4.8156, lng: 7.0498 },
    isActive: true,
    artisanCount: 1200,
  },
  {
    id: "ibadan",
    name: "Ibadan",
    state: "Oyo",
    coordinates: { lat: 7.3775, lng: 3.947 },
    isActive: true,
    artisanCount: 950,
  },
  {
    id: "kano",
    name: "Kano",
    state: "Kano",
    coordinates: { lat: 12.0022, lng: 8.592 },
    isActive: true,
    artisanCount: 800,
  },

  // Other Major Cities
  {
    id: "benin-city",
    name: "Benin City",
    state: "Edo",
    coordinates: { lat: 6.335, lng: 5.6037 },
    isActive: true,
    artisanCount: 650,
  },
  {
    id: "kaduna",
    name: "Kaduna",
    state: "Kaduna",
    coordinates: { lat: 10.5105, lng: 7.4165 },
    isActive: true,
    artisanCount: 580,
  },
  {
    id: "enugu",
    name: "Enugu",
    state: "Enugu",
    coordinates: { lat: 6.4584, lng: 7.5464 },
    isActive: true,
    artisanCount: 520,
  },
  {
    id: "warri",
    name: "Warri",
    state: "Delta",
    coordinates: { lat: 5.5167, lng: 5.75 },
    isActive: true,
    artisanCount: 380,
  },
  {
    id: "calabar",
    name: "Calabar",
    state: "Cross River",
    coordinates: { lat: 4.9757, lng: 8.3417 },
    isActive: true,
    artisanCount: 320,
  },

  // Expanding Cities
  {
    id: "owerri",
    name: "Owerri",
    state: "Imo",
    coordinates: { lat: 5.4836, lng: 7.0333 },
    isActive: true,
    artisanCount: 280,
  },
  {
    id: "uyo",
    name: "Uyo",
    state: "Akwa Ibom",
    coordinates: { lat: 5.038, lng: 7.9128 },
    isActive: true,
    artisanCount: 250,
  },
  {
    id: "jos",
    name: "Jos",
    state: "Plateau",
    coordinates: { lat: 9.8965, lng: 8.8583 },
    isActive: true,
    artisanCount: 220,
  },
  {
    id: "abeokuta",
    name: "Abeokuta",
    state: "Ogun",
    coordinates: { lat: 7.1475, lng: 3.3619 },
    isActive: true,
    artisanCount: 180,
  },
  {
    id: "ilorin",
    name: "Ilorin",
    state: "Kwara",
    coordinates: { lat: 8.4799, lng: 4.5418 },
    isActive: true,
    artisanCount: 170,
  },

  // Coming Soon
  {
    id: "maiduguri",
    name: "Maiduguri",
    state: "Borno",
    coordinates: { lat: 11.8333, lng: 13.15 },
    isActive: false,
  },
  {
    id: "zaria",
    name: "Zaria",
    state: "Kaduna",
    coordinates: { lat: 11.0667, lng: 7.7 },
    isActive: false,
  },
  {
    id: "aba",
    name: "Aba",
    state: "Abia",
    coordinates: { lat: 5.1167, lng: 7.3667 },
    isActive: false,
  },
  {
    id: "onitsha",
    name: "Onitsha",
    state: "Anambra",
    coordinates: { lat: 6.1667, lng: 6.7833 },
    isActive: false,
  },
  {
    id: "sokoto",
    name: "Sokoto",
    state: "Sokoto",
    coordinates: { lat: 13.0622, lng: 5.2339 },
    isActive: false,
  },
];

// Storage key
const LOCATION_KEY = "user_location";

// ================================
// Location Service
// ================================
export const locationService = {
  /**
   * Get all available cities
   */
  getCities(activeOnly: boolean = true): City[] {
    if (activeOnly) {
      return NIGERIAN_CITIES.filter((city) => city.isActive);
    }
    return NIGERIAN_CITIES;
  },

  /**
   * Get city by ID
   */
  getCityById(cityId: string): City | undefined {
    return NIGERIAN_CITIES.find((city) => city.id === cityId);
  },

  /**
   * Search cities by name
   */
  searchCities(query: string): City[] {
    const normalizedQuery = query.toLowerCase().trim();
    return NIGERIAN_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(normalizedQuery) ||
        city.state.toLowerCase().includes(normalizedQuery),
    );
  },

  /**
   * Save user's selected location
   */
  async saveUserLocation(location: UserLocation): Promise<void> {
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  },

  /**
   * Get user's saved location
   */
  async getUserLocation(): Promise<UserLocation | null> {
    try {
      const stored = await AsyncStorage.getItem(LOCATION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error getting user location:", e);
    }
    // Default to Lagos
    return {
      city: NIGERIAN_CITIES[0], // Lagos
    };
  },

  /**
   * Calculate distance between two coordinates (in km)
   */
  calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number },
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLng = this.toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) *
        Math.cos(this.toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal
  },

  toRad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  /**
   * Get formatted distance string
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m away`;
    }
    return `${distanceKm}km away`;
  },

  /**
   * Get popular areas within a city
   */
  getPopularAreas(cityId: string): string[] {
    const areasMap: Record<string, string[]> = {
      lagos: [
        "Victoria Island",
        "Lekki",
        "Ikeja",
        "Surulere",
        "Yaba",
        "Ikoyi",
        "Ajah",
        "Ogba",
        "Maryland",
        "Festac",
        "Gbagada",
        "Magodo",
        "Ogudu",
        "Anthony",
        "Isolo",
      ],
      abuja: [
        "Wuse",
        "Garki",
        "Maitama",
        "Asokoro",
        "Gwarinpa",
        "Jabi",
        "Utako",
        "Kubwa",
        "Lugbe",
        "Kado",
      ],
      "port-harcourt": [
        "GRA",
        "D-Line",
        "Trans Amadi",
        "Rumuola",
        "Eleme Junction",
        "Rumuokoro",
        "Ada George",
        "Woji",
        "Abuloma",
        "Oyigbo",
      ],
      ibadan: [
        "Bodija",
        "Ring Road",
        "Challenge",
        "Dugbe",
        "Agodi",
        "UI",
        "Mokola",
        "Iyaganku",
        "Jericho",
        "Oluyole",
      ],
      kano: [
        "Nassarawa",
        "Sabon Gari",
        "Fagge",
        "Tarauni",
        "Kumbotso",
        "Bompai",
        "GRA",
        "Gwale",
        "Kano Municipal",
        "Ungogo",
      ],
    };
    return areasMap[cityId] || [];
  },

  /**
   * Get artisans near a location (mock implementation)
   */
  async getNearbyArtisans(
    cityId: string,
    categoryId?: string,
    maxDistance?: number,
  ): Promise<ApiResponse<{ artisanId: string; distance: number }[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock nearby artisans
    const mockArtisans = [
      { artisanId: "artisan_001", distance: 1.2 },
      { artisanId: "artisan_002", distance: 2.5 },
      { artisanId: "artisan_003", distance: 3.8 },
      { artisanId: "artisan_004", distance: 4.1 },
      { artisanId: "artisan_005", distance: 5.5 },
    ];

    let filtered = mockArtisans;
    if (maxDistance) {
      filtered = mockArtisans.filter((a) => a.distance <= maxDistance);
    }

    return {
      success: true,
      data: filtered,
    };
  },
};

export default locationService;
