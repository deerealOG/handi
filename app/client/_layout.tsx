// app/client/_layout.tsx
// Root layout for client section

import { useAppTheme } from "@/hooks/use-app-theme";
import { Stack } from "expo-router";
import React from "react";

export default function ClientLayout() {
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
