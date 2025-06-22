import { StyleSheet } from 'react-native';
import { DesignTokens } from './Colors';

// Common layout styles based on the dark design system
export const CommonStyles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors['gray-900'],
  },
  
  heroContainer: {
    flex: 1,
    backgroundColor: DesignTokens.colors['black-900'],
  },
  
  section: {
    paddingHorizontal: DesignTokens.layout.containerPadding,
    paddingVertical: DesignTokens.layout.sectionPadding.normal,
  },
  
  sectionTight: {
    paddingHorizontal: DesignTokens.layout.containerPadding,
    paddingVertical: DesignTokens.layout.sectionPadding.tight,
  },
  
  sectionLoose: {
    paddingHorizontal: DesignTokens.layout.containerPadding,
    paddingVertical: DesignTokens.layout.sectionPadding.loose,
  },
  
  // Cards and surfaces with dark theme
  card: {
    backgroundColor: DesignTokens.colors['black-800'],
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    ...DesignTokens.shadows.card,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-700'],
  },
  
  cardSubtle: {
    backgroundColor: DesignTokens.colors['black-800'],
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    ...DesignTokens.shadows.subtle,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-700'],
  },
  
  cardGlass: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(243, 244, 246, 0.1)',
    backdropFilter: 'blur(20px)',
    ...DesignTokens.shadows.subtle,
  },
  
  cardBorder: {
    backgroundColor: DesignTokens.colors['gray-800'],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
    padding: 24,
  },
  
  cardProfessional: {
    backgroundColor: DesignTokens.colors['black-800'],
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
  },
  
  cardElevated: {
    backgroundColor: DesignTokens.colors['black-700'],
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
  },
  
  // Form elements
  input: {
    backgroundColor: DesignTokens.colors['gray-800'],
    borderRadius: 12,
    padding: 16,
    fontSize: DesignTokens.typography.fontSize.body,
    fontFamily: DesignTokens.typography.fontFamily.sans,
    color: DesignTokens.colors['gray-200'],
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
    minHeight: 52,
  },
  
  inputFocused: {
    borderColor: DesignTokens.colors['accent-gray'],
    shadowColor: DesignTokens.colors['accent-gray'],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Navigation styles
  navigation: {
    height: DesignTokens.navigation.height,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.layout.containerPadding,
  },
  
  navLink: {
    fontSize: DesignTokens.typography.fontSize.small,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: DesignTokens.typography.letterSpacing.capsNav,
    color: DesignTokens.colors['gray-100'],
  },
  
  // Utility classes
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  row: {
    flexDirection: 'row',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  flex1: {
    flex: 1,
  },
  
  // Text utilities
  textCenter: {
    textAlign: 'center',
  },
  
  textLeft: {
    textAlign: 'left',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  // Spacing utilities
  marginBottom8: {
    marginBottom: 8,
  },
  
  marginBottom16: {
    marginBottom: 16,
  },
  
  marginBottom24: {
    marginBottom: 24,
  },
  
  marginBottom32: {
    marginBottom: 32,
  },
  
  marginTop8: {
    marginTop: 8,
  },
  
  marginTop16: {
    marginTop: 16,
  },
  
  marginTop24: {
    marginTop: 24,
  },
  
  marginTop32: {
    marginTop: 32,
  },
  
  // Background colors
  bgPrimary: {
    backgroundColor: DesignTokens.colors['gray-900'],
  },
  
  bgSecondary: {
    backgroundColor: DesignTokens.colors['gray-800'],
  },
  
  bgSurface: {
    backgroundColor: DesignTokens.colors['gray-700'],
  },
  
  bgAccent: {
    backgroundColor: DesignTokens.colors['accent-blue'],
  },
  
  // Text colors
  textPrimary: {
    color: DesignTokens.colors['gray-100'],
  },
  
  textSecondary: {
    color: DesignTokens.colors['gray-400'],
  },
  
  textMuted: {
    color: DesignTokens.colors['gray-500'],
  },
  
  textAccent: {
    color: DesignTokens.colors['accent-blue'],
  },
  
  textWhite: {
    color: DesignTokens.colors['white-000'],
  },

  sectionProfessional: {
    marginBottom: 32,
    paddingHorizontal: DesignTokens.layout.containerPadding,
  },
  
  sectionTitle: {
    fontSize: DesignTokens.typography.fontSize.h3,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
    color: DesignTokens.colors['white-000'],
    marginBottom: 8,
  },

  sectionDescription: {
    fontSize: DesignTokens.typography.fontSize.small,
    fontFamily: DesignTokens.typography.fontFamily.sans,
    color: DesignTokens.colors['gray-400'],
    marginBottom: 16,
    lineHeight: 20,
  },
  
  // Button Styles
  buttonPrimary: {
    backgroundColor: DesignTokens.colors['accent-gray'],
    paddingVertical: DesignTokens.buttons.primary.padding.vertical,
    paddingHorizontal: DesignTokens.buttons.primary.padding.horizontal,
    borderRadius: DesignTokens.buttons.primary.radius,
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignTokens.shadows.glow,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: DesignTokens.buttons.secondary.padding.vertical,
    paddingHorizontal: DesignTokens.buttons.secondary.padding.horizontal,
    borderRadius: DesignTokens.buttons.secondary.radius,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Professional Layout Styles
  headerSection: {
    paddingVertical: 24,
    paddingHorizontal: DesignTokens.layout.containerPadding,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors['gray-700'],
    backgroundColor: DesignTokens.colors['black-900'],
  },

  contentSection: {
    paddingTop: 24,
    paddingHorizontal: DesignTokens.layout.containerPadding,
  },

  divider: {
    height: 1,
    backgroundColor: DesignTokens.colors['gray-700'],
    marginVertical: 20,
    marginHorizontal: -20, // Extend to card edges
  },

  // Status and Badge Styles
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  statusBadgeLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },

  statusBadgeMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },

  statusBadgeHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },

  // Professional Table Styles
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: DesignTokens.colors['gray-800'],
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors['gray-600'],
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors['gray-700'],
    backgroundColor: DesignTokens.colors['black-800'],
  },

  tableRowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },

  tableCell: {
    flex: 1,
    alignItems: 'flex-start',
  },

  tableCellCenter: {
    alignItems: 'center',
  },

  tableCellRight: {
    alignItems: 'flex-end',
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  emptyStateText: {
    color: DesignTokens.colors['gray-400'],
    fontSize: DesignTokens.typography.fontSize.body,
    textAlign: 'center',
    marginTop: 16,
  },
});

// Hero section specific styles with gradients
export const HeroStyles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: DesignTokens.colors['black-900'],
    position: 'relative',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.layout.containerPadding,
    paddingVertical: DesignTokens.layout.sectionPadding.loose,
    zIndex: 1,
  },
  
  headline: {
    fontSize: DesignTokens.typography.fontSize.h1,
    lineHeight: DesignTokens.typography.fontSize.h1 * DesignTokens.typography.lineHeight.tight,
    fontWeight: DesignTokens.typography.fontWeight.display,
    color: DesignTokens.colors['white-000'],
    textAlign: 'center',
    letterSpacing: DesignTokens.typography.letterSpacing.tight,
    maxWidth: '12ch', // Design system specification
  },
}); 