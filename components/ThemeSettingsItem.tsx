import { THEME } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export function ThemeSettingsItem() {
  const { theme, toggleTheme } = useTheme();
  const { colors } = useAppTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons 
            name={isDark ? "moon" : "sunny"} 
            size={22} 
            color={colors.text} 
          />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
      </View>
      
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#E5E7EB', true: THEME.colors.primary }}
        thumbColor={'#FFFFFF'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});
