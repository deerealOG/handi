import { useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export function ThemedStatusBar() {
  const { theme } = useTheme();
  return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />;
}
