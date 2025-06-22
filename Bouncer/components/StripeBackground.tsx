import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { DesignTokens } from '@/constants/Colors';

export type StripeBackgroundProps = ViewProps & {
  children?: React.ReactNode;
  variant?: 'hero' | 'stripes-only';
};

export function StripeBackground({
  children,
  variant = 'hero',
  style,
  ...rest
}: StripeBackgroundProps) {
  if (variant === 'stripes-only') {
    return (
      <View style={[styles.stripesOnly, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      {/* Hero gradient background */}
      <View style={styles.heroGradient} />
      
      {/* Stripe pattern overlay */}
      <View style={styles.stripePattern} />
      
      {/* Optional sun glow effect */}
      <View style={styles.sunGlow} />
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: DesignTokens.colors['black-900'],
  },
  stripePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    // Note: React Native doesn't support repeating-linear-gradient
    // This would need to be implemented with SVG or a custom pattern
    // For now, we'll use a subtle overlay
    opacity: 0.12,
  },
  stripesOnly: {
    backgroundColor: 'transparent',
    // Simplified stripe effect using opacity
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors['brand-stripe'],
  },
  sunGlow: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 300, // Mobile equivalent of 1200px
    height: 300,
    marginLeft: -150,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
}); 