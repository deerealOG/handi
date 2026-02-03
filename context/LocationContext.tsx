// context/LocationContext.tsx
// Global location context for HANDI app

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    City,
    locationService,
    NIGERIAN_CITIES,
    UserLocation,
} from "../services";

// ================================
// Types
// ================================
interface LocationState {
  currentCity: City;
  userLocation: UserLocation | null;
  isLoading: boolean;
  availableCities: City[];
}

interface LocationContextType extends LocationState {
  setCity: (city: City) => Promise<void>;
  setAddress: (address: string) => void;
  searchCities: (query: string) => City[];
  getPopularAreas: () => string[];
  calculateDistance: (lat: number, lng: number) => number;
  formatDistance: (distanceKm: number) => string;
  requestPermission: () => Promise<void>;
}

// ================================
// Default City (Lagos)
// ================================
const DEFAULT_CITY = NIGERIAN_CITIES[0]; // Lagos

// ================================
// Context
// ================================
const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

// ================================
// Provider
// ================================
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LocationState>({
    currentCity: DEFAULT_CITY,
    userLocation: null,
    isLoading: true,
    availableCities: locationService.getCities(true),
  });

  // Load saved location on mount
  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const savedLocation = await locationService.getUserLocation();
      if (savedLocation) {
        setState((prev) => ({
          ...prev,
          currentCity: savedLocation.city,
          userLocation: savedLocation,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading saved location:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const setCity = async (city: City): Promise<void> => {
    const newLocation: UserLocation = {
      city,
      address: state.userLocation?.address,
    };

    await locationService.saveUserLocation(newLocation);

    setState((prev) => ({
      ...prev,
      currentCity: city,
      userLocation: newLocation,
    }));
  };

  const setAddress = (address: string): void => {
    setState((prev) => ({
      ...prev,
      userLocation: prev.userLocation
        ? { ...prev.userLocation, address }
        : { city: prev.currentCity, address },
    }));
  };

  const searchCities = (query: string): City[] => {
    return locationService.searchCities(query);
  };

  const getPopularAreas = (): string[] => {
    return locationService.getPopularAreas(state.currentCity.id);
  };

  const calculateDistance = (lat: number, lng: number): number => {
    return locationService.calculateDistance(state.currentCity.coordinates, {
      lat,
      lng,
    });
  };

  const formatDistance = (distanceKm: number): string => {
    return locationService.formatDistance(distanceKm);
  };

  const requestPermission = async (): Promise<void> => {
    // Mock permission request for now ensuring UI flow works
    setState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Could integrate expo-location here later
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  return (
    <LocationContext.Provider
      value={{
        ...state,
        setCity,
        setAddress,
        searchCities,
        getPopularAreas,
        calculateDistance,
        formatDistance,
        requestPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

export default LocationContext;
