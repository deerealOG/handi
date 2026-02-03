// components/Header.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../constants/theme";

type HeaderProps = {
  title: string;
  showBack?: boolean;
};

export const Header = ({ title, showBack = true }: HeaderProps) => {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    ...THEME.shadow.base,
    marginTop: Platform.OS === "ios" ? 50 : 30,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.fontFamily.heading as any,
    marginLeft: 16,
  },
});

export default Header;