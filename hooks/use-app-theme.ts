import { Colors } from '@/app/constants/theme';
import { useTheme } from '@/app/context/ThemeContext';

export function useAppTheme() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  return { colors, theme };
}
