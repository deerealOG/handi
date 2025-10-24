// components/Header.tsx
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

  return (
        <View style={styles.header}>
        {showBack && (
            <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={THEME.colors.primary}
            />
            </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        </View>
  );
};

const styles = StyleSheet.create({
    //This is the Header styling
    header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    ...THEME.shadow.base,
    marginTop: Platform.OS === "ios" ? 50 : 30,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.fontFamily.heading as any,
    color: THEME.colors.text,
    marginLeft: 16,

  },
});
export default Header;