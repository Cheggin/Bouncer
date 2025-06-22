# Bouncer Design System

This document outlines the design system implementation for the Bouncer app, based on the provided design tokens.

## Overview

The design system provides a consistent visual language with:
- **Colors**: A refined palette with charcoal, white, and gray tones
- **Typography**: Inter font family with responsive scaling
- **Layout**: Grid-based system with consistent spacing
- **Components**: Reusable UI components following design patterns

## Colors

### Primary Colors
- `black-900`: `#0E0E08` - Charcoal hero/nav background
- `white-000`: `#FFFFFF` - Primary text & CTA background
- `gray-050`: `#F5F5F3` - Page background after hero
- `gray-100`: `#E6E6E4` - Section separators / form strokes
- `gray-400`: `#8B8B87` - Muted body copy
- `gray-700`: `#44443F` - Footer text
- `brand-stripe`: `rgba(0,0,0,0.12)` - Stripe pattern overlay

### Usage
```typescript
import { DesignTokens } from '@/constants/Colors';

// Use in styles
backgroundColor: DesignTokens.colors['black-900']
```

## Typography

### Font Family
- **Inter**: Primary font family with multiple weights
  - Light (300): Body text
  - Regular (400): Headings
  - Medium (500): Buttons, emphasized text
  - SemiBold (600): Subheadings

### Font Sizes
- `h1`: 44px - Large headlines
- `h2`: 32px - Section headings
- `h3`: 24px - Subsection headings
- `body`: 18px - Body text
- `small`: 14px - Captions, labels

### Usage
```typescript
// Use ThemedText component
<ThemedText type="h1">Main Headline</ThemedText>
<ThemedText type="body">Body text content</ThemedText>
<ThemedText type="small">Caption text</ThemedText>
```

## Layout

### Spacing
- Container padding: 24px
- Section padding: 64px (tight), 96px (normal), 160px (loose)
- Grid gutter: 24px

### Usage
```typescript
import { CommonStyles } from '@/constants/Styles';

// Use predefined styles
<View style={CommonStyles.section}>
  <View style={CommonStyles.card}>
    // Content
  </View>
</View>
```

## Components

### ThemedText
Typography component with design system integration.

```typescript
<ThemedText 
  type="h1" | "h2" | "h3" | "body" | "small" | "title" | "subtitle" | "link"
  style={customStyles}
>
  Text content
</ThemedText>
```

### ThemedButton
Button component with primary and secondary variants.

```typescript
<ThemedButton
  title="Button Text"
  variant="primary" | "secondary"
  size="default" | "small"
  onPress={handlePress}
/>
```

### StripeBackground
Hero section background with gradient and stripe pattern.

```typescript
<StripeBackground variant="hero" | "stripes-only">
  <View>Content</View>
</StripeBackground>
```

### ThemedView
View component with theme-aware background colors.

```typescript
<ThemedView style={styles.container}>
  // Content
</ThemedView>
```

## Common Patterns

### Hero Section
```typescript
<StripeBackground variant="hero">
  <ThemedView style={styles.heroContainer}>
    <ThemedText type="h1" style={styles.heroTitle}>
      Hero Headline
    </ThemedText>
    <ThemedText type="body" style={styles.heroSubtitle}>
      Supporting text
    </ThemedText>
    <ThemedButton title="Call to Action" variant="primary" />
  </ThemedView>
</StripeBackground>
```

### Content Section
```typescript
<View style={CommonStyles.section}>
  <ThemedText type="h2" style={CommonStyles.marginBottom16}>
    Section Title
  </ThemedText>
  <View style={CommonStyles.card}>
    <ThemedText type="body">
      Card content
    </ThemedText>
  </View>
</View>
```

### Form Elements
```typescript
<TextInput
  style={[
    CommonStyles.input,
    { borderColor: DesignTokens.colors['gray-100'] }
  ]}
  placeholder="Enter text"
  placeholderTextColor={DesignTokens.colors['gray-400']}
/>
```

## Best Practices

1. **Use design tokens**: Always reference colors, fonts, and spacing from the design system
2. **Consistent spacing**: Use the predefined spacing values for margins and padding
3. **Typography hierarchy**: Follow the established type scale for content hierarchy
4. **Component reuse**: Prefer design system components over custom implementations
5. **Theme support**: Components automatically adapt to light/dark themes

## Files Structure

```
constants/
├── Colors.ts          # Color palette and design tokens
└── Styles.ts          # Common styles and utilities

components/
├── ThemedText.tsx     # Typography component
├── ThemedButton.tsx   # Button component
├── ThemedView.tsx     # View component
└── StripeBackground.tsx # Hero background component
```

## Migration Notes

- Legacy theme colors are mapped to new design system colors
- Font weights are replaced with specific font family variants
- Existing components maintain backward compatibility
- New components follow design system patterns

This design system ensures visual consistency across the Bouncer app while providing flexibility for future enhancements. 