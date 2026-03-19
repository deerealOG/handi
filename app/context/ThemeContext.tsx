import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("user-theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
      } else {
        // On web, default to light mode for landing/marketing pages
        // On native, follow system preference
        if (Platform.OS === "web") {
          setThemeState("light");
        } else {
          const systemScheme = Appearance.getColorScheme();
          if (systemScheme) {
            setThemeState(systemScheme);
          }
        }
      }
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem("user-theme", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem("user-theme", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
