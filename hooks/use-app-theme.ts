import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export function useAppTheme() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  return { colors, theme };
}
