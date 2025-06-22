import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { 
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DesignTokens } from '@/constants/Colors';

// Create custom theme based on design system
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: DesignTokens.colors['black-900'],
    background: DesignTokens.colors['gray-050'],
    card: DesignTokens.colors['white-000'],
    text: DesignTokens.colors['black-900'],
    border: DesignTokens.colors['gray-100'],
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DesignTokens.colors['white-000'],
    background: DesignTokens.colors['black-900'],
    card: DesignTokens.colors['black-900'],
    text: DesignTokens.colors['white-000'],
    border: DesignTokens.colors['gray-400'],
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Inter font family for design system
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
