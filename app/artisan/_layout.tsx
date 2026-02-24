// app/artisan/_layout.tsx
// Root layout for artisan section - adds web sidebar wrapper

import { useAppTheme } from "@/hooks/use-app-theme";
import { Stack } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Sidebar } from "@/components/web/Sidebar";

export default function ArtisanLayout() {
  const { colors } = useAppTheme();
  const isWeb = Platform.OS === "web";

  // On web, wrap content with sidebar
  if (isWeb) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Sidebar />
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        </View>
      </View>
    );
  }

  // On mobile, just use Stack navigation
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
  },
  content: {
    flex: 1,
  },
});
