import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { DesignTokens } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'h1' ? styles.h1 : undefined,
        type === 'h2' ? styles.h2 : undefined,
        type === 'h3' ? styles.h3 : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: DesignTokens.typography.fontSize.body,
    lineHeight: DesignTokens.typography.fontSize.body * DesignTokens.typography.lineHeight.normal,
    fontFamily: DesignTokens.typography.fontFamily.light,
    color: DesignTokens.colors['gray-100'],
  },
  h1: {
    fontSize: DesignTokens.typography.fontSize.h1,
    lineHeight: DesignTokens.typography.fontSize.h1 * DesignTokens.typography.lineHeight.tight,
    fontFamily: DesignTokens.typography.fontFamily.sans,
    letterSpacing: DesignTokens.typography.letterSpacing.tight,
    color: DesignTokens.colors['white-000'],
  },
  h2: {
    fontSize: DesignTokens.typography.fontSize.h2,
    lineHeight: DesignTokens.typography.fontSize.h2 * DesignTokens.typography.lineHeight.tight,
    fontFamily: DesignTokens.typography.fontFamily.sans,
    letterSpacing: DesignTokens.typography.letterSpacing.tight,
    color: DesignTokens.colors['gray-200'],
  },
  h3: {
    fontSize: DesignTokens.typography.fontSize.h3,
    lineHeight: DesignTokens.typography.fontSize.h3 * DesignTokens.typography.lineHeight.normal,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    color: DesignTokens.colors['gray-200'],
  },
  body: {
    fontSize: DesignTokens.typography.fontSize.body,
    lineHeight: DesignTokens.typography.fontSize.body * DesignTokens.typography.lineHeight.normal,
    fontFamily: DesignTokens.typography.fontFamily.light,
    color: DesignTokens.colors['gray-300'],
  },
  small: {
    fontSize: DesignTokens.typography.fontSize.small,
    lineHeight: DesignTokens.typography.fontSize.small * DesignTokens.typography.lineHeight.normal,
    fontFamily: DesignTokens.typography.fontFamily.light,
    color: DesignTokens.colors['gray-400'],
  },
  // Legacy support
  title: {
    fontSize: DesignTokens.typography.fontSize.h1,
    lineHeight: DesignTokens.typography.fontSize.h1 * DesignTokens.typography.lineHeight.tight,
    fontFamily: DesignTokens.typography.fontFamily.sans,
    color: DesignTokens.colors['white-000'],
  },
  defaultSemiBold: {
    fontSize: DesignTokens.typography.fontSize.body,
    lineHeight: DesignTokens.typography.fontSize.body * DesignTokens.typography.lineHeight.normal,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    color: DesignTokens.colors['gray-200'],
  },
  subtitle: {
    fontSize: DesignTokens.typography.fontSize.h3,
    lineHeight: DesignTokens.typography.fontSize.h3 * DesignTokens.typography.lineHeight.normal,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    color: DesignTokens.colors['gray-200'],
  },
  link: {
    fontSize: DesignTokens.typography.fontSize.body,
    lineHeight: DesignTokens.typography.fontSize.body * DesignTokens.typography.lineHeight.loose,
    color: DesignTokens.colors['accent-blue'],
    textDecorationLine: 'none',
  },
});
