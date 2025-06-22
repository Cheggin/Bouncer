import React from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { DesignTokens } from '@/constants/Colors';

export type ThemedButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
};

export function ThemedButton({
  title,
  variant = 'primary',
  size = 'default',
  style,
  ...rest
}: ThemedButtonProps) {
  const buttonStyle = variant === 'primary' ? styles.primary : styles.secondary;
  const textStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;
  const sizeStyle = size === 'small' ? styles.small : styles.default;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        buttonStyle,
        sizeStyle,
        pressed && styles.pressed,
        variant === 'primary' && styles.primaryGlow,
        style,
      ]}
      {...rest}
    >
      <ThemedText style={textStyle} type="small">
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DesignTokens.buttons.primary.radius,
    paddingVertical: DesignTokens.buttons.primary.padding.vertical,
    paddingHorizontal: DesignTokens.buttons.primary.padding.horizontal,
  },
  default: {
    minHeight: 44,
  },
  small: {
    minHeight: 36,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: DesignTokens.buttons.primary.bg,
  },
  primaryGlow: {
    shadowColor: DesignTokens.colors['accent-gray'],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  secondary: {
    backgroundColor: DesignTokens.buttons.secondary.bg,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
  },
  primaryText: {
    color: DesignTokens.buttons.primary.text,
    fontFamily: DesignTokens.typography.fontFamily.medium,
    fontSize: DesignTokens.buttons.primary.fontSize,
  },
  secondaryText: {
    color: DesignTokens.buttons.secondary.text,
    fontFamily: DesignTokens.typography.fontFamily.medium,
    fontSize: DesignTokens.buttons.primary.fontSize,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
}); 