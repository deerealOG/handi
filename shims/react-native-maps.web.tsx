// shims/react-native-maps.web.tsx
// Web mock for react-native-maps (native-only module)
// This provides stub components that work on web

import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Mock MapView component
export const MapView = React.forwardRef<View, any>(
  ({ children, style, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.mapContainer, style]} {...props}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Map View</Text>
          <Text style={styles.mapSubtext}>Maps not available on web</Text>
        </View>
        {children}
      </View>
    );
  },
);

MapView.displayName = "MapView";

// Mock Marker component
export const Marker = ({ children, ...props }: any) => {
  return <View {...props}>{children}</View>;
};

// Mock Polyline component
export const Polyline = (props: any) => null;

// Mock Circle component
export const Circle = (props: any) => null;

// Mock Polygon component
export const Polygon = (props: any) => null;

// Mock Callout component
export const Callout = ({ children, ...props }: any) => {
  return <View {...props}>{children}</View>;
};

// Mock constants
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;

// Mock animated components
export const AnimatedRegion = class {
  latitude: number;
  longitude: number;

  constructor(coords: { latitude: number; longitude: number }) {
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
  }

  timing() {
    return { start: () => {} };
  }
};

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: "#e8e8e8",
    borderRadius: 12,
    overflow: "hidden",
  },
  mapPlaceholder: {
    flex: 1,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  mapText: {
    fontSize: 24,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#666",
  },
});

export default MapView;
