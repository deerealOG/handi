// components/DecorativeBlobs.tsx
// Decorative balloon-like shape for auth screens

import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { THEME } from "../constants/theme";

interface DecorativeBlobsProps {
  color?: string;
}

export const DecorativeBlobs = ({ color }: DecorativeBlobsProps) => {
  // Default to surface color (same as status bar)
  const blobColor = color || THEME.colors.surface;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Large decorative blob - top right */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.blob, { backgroundColor: blobColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: "hidden",
    zIndex: 0,
  },
  blob: {
    position: "absolute",
    borderRadius: 9999,
    width: 200,
    height: 200,
    top: -80,
    right: -60,
    opacity: 0.3,
  },
});

export default DecorativeBlobs;
