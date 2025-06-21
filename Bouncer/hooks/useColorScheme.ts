import { useColorScheme as useNativeColorScheme } from 'react-native';

// The useColorScheme value is always 'dark', but the built-in name is used for type-safety.
export function useColorScheme(): 'light' | 'dark' {
  // Always return 'dark' to force dark mode.
  return 'dark';
}
