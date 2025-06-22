/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Design System Colors
 * Updated to match the new brand design system with dark mode focus and gray accents
 */

export const Colors = {
  // Dark Mode Brand Colors
  'black-900': '#0A0A0A',           // Deep black for backgrounds
  'black-800': '#1A1A1A',           // Card backgrounds
  'black-700': '#2A2A2A',           // Elevated surfaces
  'gray-900': '#121212',            // Primary background
  'gray-800': '#1E1E1E',            // Secondary background
  'gray-700': '#2D2D2D',            // Surface backgrounds
  'gray-600': '#404040',            // Borders and dividers
  'gray-500': '#6B6B6B',            // Disabled text
  'gray-400': '#9CA3AF',            // Secondary text
  'gray-300': '#D1D5DB',            // Primary text on dark
  'gray-200': '#E5E7EB',            // High contrast text
  'gray-100': '#F3F4F6',            // Accent text
  'white-000': '#FFFFFF',           // Pure white for highlights
  'accent-gray': '#6B7280',         // Primary accent (gray)
  'accent-light': '#9CA3AF',        // Secondary accent (light gray)
  'success': '#10B981',             // Success states
  'warning': '#F59E0B',             // Warning states
  'error': '#EF4444',               // Error states

  // Legacy theme support (mapped to dark colors)
  light: {
    text: '#F3F4F6',
    background: '#121212',
    tint: '#6B7280',
    icon: '#9CA3AF',
    tabIconDefault: '#6B6B6B',
    tabIconSelected: '#6B7280',
  },
  dark: {
    text: '#F3F4F6',
    background: '#121212',
    tint: '#6B7280',
    icon: '#9CA3AF',
    tabIconDefault: '#6B6B6B',
    tabIconSelected: '#6B7280',
  },
};

// Design System Tokens
export const DesignTokens = {
  colors: {
    'black-900': '#0A0A0A',
    'black-800': '#1A1A1A',
    'black-700': '#2A2A2A',
    'gray-900': '#121212',
    'gray-800': '#1E1E1E',
    'gray-700': '#2D2D2D',
    'gray-600': '#404040',
    'gray-500': '#6B6B6B',
    'gray-400': '#9CA3AF',
    'gray-300': '#D1D5DB',
    'gray-200': '#E5E7EB',
    'gray-100': '#F3F4F6',
    'white-000': '#FFFFFF',
    'accent-gray': '#6B7280',
    'accent-light': '#9CA3AF',
    'success': '#10B981',
    'warning': '#F59E0B',
    'error': '#EF4444',
  },
  
  gradients: {
    primary: ['#121212', '#1E1E1E', '#2A2A2A'],
    hero: ['#0A0A0A', '#1A1A1A'],
    card: ['#1E1E1E', '#2A2A2A'],
    accent: ['#6B7280', '#9CA3AF'],
    surface: ['#1A1A1A', '#2D2D2D'],
  },
  
  typography: {
    fontFamily: {
      sans: 'Inter_400Regular',
      light: 'Inter_300Light',
      medium: 'Inter_500Medium',
      semiBold: 'Inter_600SemiBold',
    },
    fontWeight: {
      display: '400',
      body: '300',
      bold: '600',
    },
    fontSize: {
      h1: 44, // clamp equivalent for mobile
      h2: 32,
      h3: 24,
      body: 18, // 1.125rem * 16
      small: 14, // 0.875rem * 16
    },
    lineHeight: {
      tight: 1.05,
      normal: 1.25,
      loose: 1.5,
    },
    letterSpacing: {
      tight: -0.16, // -0.01em * 16
      capsNav: 0.64, // 0.04em * 16
    },
  },
  
  layout: {
    gridColumns: 12,
    gridGutter: 24,
    maxWidth: 1440,
    containerPadding: 24, // responsive equivalent
    sectionPadding: {
      tight: 64,
      normal: 96,
      loose: 160,
    },
  },
  
  navigation: {
    height: 72,
    logoMaxHeight: 28,
    linkGap: 32,
  },
  
  buttons: {
    primary: {
      bg: '#6B7280',
      text: '#FFFFFF',
      padding: { vertical: 14, horizontal: 32 },
      radius: 100,
      fontSize: 14,
      fontWeight: '500',
      hoverBg: '#4B5563',
    },
    secondary: {
      bg: 'transparent',
      text: '#F3F4F6',
      border: '1px solid rgba(243,244,246,0.3)',
      padding: { vertical: 14, horizontal: 32 },
      radius: 100,
      hoverBg: 'rgba(243,244,246,0.1)',
    },
  },
  
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    glow: {
      shadowColor: '#6B7280',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 0,
    },
  },
};
