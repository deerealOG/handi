// app/artisan/_layout.tsx
// Root layout for artisan section

import { useAppTheme } from "@/hooks/use-app-theme";
import { Stack } from "expo-router";
import React from "react";

export default function ArtisanLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
