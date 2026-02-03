// utils/location.ts
// Location utility functions for distance calculation and sorting

// ================================
// Types
// ================================
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  distance: number;
  distanceString: string;
}

// ================================
// Haversine Formula for Distance Calculation
// ================================
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const lat1 = toRadians(point1.latitude);
  const lat2 = toRadians(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// ================================
// Format Distance for Display
// ================================
export function formatDistance(distance: number): string {
  if (distance < 1) {
    // Show in meters for very close distances
    const meters = Math.round(distance * 1000);
    return `${meters} m`;
  }
  
  if (distance < 10) {
    // Show one decimal place for close distances
    return `${distance.toFixed(1)} km`;
  }
  
  // Round to whole number for larger distances
  return `${Math.round(distance)} km`;
}

// ================================
// Calculate Distance with Formatted String
// ================================
export function getDistanceResult(
  userLocation: Coordinates,
  targetLocation: Coordinates
): LocationResult {
  const distance = calculateDistance(userLocation, targetLocation);
  return {
    distance,
    distanceString: formatDistance(distance),
  };
}

// ================================
// Sort Items by Distance
// ================================
export function sortByDistance<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates
): T[] {
  return [...items].sort((a, b) => {
    if (!a.latitude || !a.longitude) return 1;
    if (!b.latitude || !b.longitude) return -1;

    const distA = calculateDistance(userLocation, {
      latitude: a.latitude,
      longitude: a.longitude,
    });
    const distB = calculateDistance(userLocation, {
      latitude: b.latitude,
      longitude: b.longitude,
    });

    return distA - distB;
  });
}

// ================================
// Filter Items Within Radius
// ================================
export function filterByRadius<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates,
  radiusKm: number
): T[] {
  return items.filter((item) => {
    if (!item.latitude || !item.longitude) return false;

    const distance = calculateDistance(userLocation, {
      latitude: item.latitude,
      longitude: item.longitude,
    });

    return distance <= radiusKm;
  });
}

// ================================
// Add Distance to Items
// ================================
export function addDistanceToItems<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates
): (T & { distance: number; distanceString: string })[] {
  return items.map((item) => {
    if (!item.latitude || !item.longitude) {
      return {
        ...item,
        distance: Infinity,
        distanceString: 'Unknown',
      };
    }

    const { distance, distanceString } = getDistanceResult(userLocation, {
      latitude: item.latitude,
      longitude: item.longitude,
    });

    return {
      ...item,
      distance,
      distanceString,
    };
  });
}

// ================================
// Nigerian City Coordinates (for fallback/testing)
// ================================
export const NIGERIAN_CITIES: Record<string, Coordinates> = {
  lagos: { latitude: 6.5244, longitude: 3.3792 },
  portHarcourt: { latitude: 4.8156, longitude: 7.0498 },
  abuja: { latitude: 9.0765, longitude: 7.3986 },
  ibadan: { latitude: 7.3775, longitude: 3.9470 },
  kano: { latitude: 12.0022, longitude: 8.5919 },
  enugu: { latitude: 6.4541, longitude: 7.5106 },
  benin: { latitude: 6.3350, longitude: 5.6037 },
  warri: { latitude: 5.5167, longitude: 5.7500 },
  calabar: { latitude: 4.9500, longitude: 8.3250 },
  owerri: { latitude: 5.4833, longitude: 7.0333 },
  onitsha: { latitude: 6.1667, longitude: 6.7833 },
  kaduna: { latitude: 10.5167, longitude: 7.4333 },
  jos: { latitude: 9.9167, longitude: 8.9000 },
  abeokuta: { latitude: 7.1560, longitude: 3.3467 },
  uyo: { latitude: 5.0333, longitude: 7.9167 },
};

// ================================
// Get Nearest City
// ================================
export function getNearestCity(
  userLocation: Coordinates
): { city: string; distance: number } | null {
  let nearestCity: string | null = null;
  let minDistance = Infinity;

  for (const [city, coords] of Object.entries(NIGERIAN_CITIES)) {
    const distance = calculateDistance(userLocation, coords);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  if (nearestCity) {
    return {
      city: nearestCity.charAt(0).toUpperCase() + nearestCity.slice(1),
      distance: minDistance,
    };
  }

  return null;
}
