/**
 * Design tokens — single source of truth for all styling.
 * Ported from the El Carot web app (app/globals.css): a dark, mystical,
 * handmade tarot aesthetic — warm cream text on charcoal, muted sage accents.
 *
 * Import in every component:
 *   import { theme } from '@/lib/theme';
 *   <View style={{ backgroundColor: theme.colors.bgBase }}>
 *
 * Do NOT use CSS custom properties (var(--token)) in React Native.
 * Do NOT hardcode color strings or pixel values in components.
 */

export const theme = {
  colors: {
    // Backgrounds
    bgBase: '#202020', // charcoal screen
    bgSurface: '#eedbc4', // cream card surface
    bgSurfaceRaised: '#f2e7d3', // softer cream
    bgInverse: '#353029', // dark brown ink

    // Text
    textPrimary: '#e9d9c7', // warm cream body text
    textSecondary: '#9aa693', // muted sage
    textMuted: '#5b6256', // sage divider / dim text
    textOnCream: '#353029', // ink, for text on cream surfaces

    // Brand sage greens
    sage: '#9aa693',
    sageLight: '#afbca7',
    sageDeep: '#7e8c77',

    border: '#5b6256',

    // Interactive
    accent: '#afbca7', // sage-light buttons
    accentDeep: '#7e8c77',
    accentLight: '#2b2b2b',

    // Artwork accents
    red: '#b2402e',
    ochre: '#d4a23a',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 40,
    '4xl': 56,
  },

  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },

  fontFamily: {
    // Maragsa Display (bundled OTF) for titles; system for body.
    display: 'MaragsaDisplay',
    sans: 'System',
    mono: 'monospace',
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 14,
    xl: 20,
    full: 9999,
  },

  // Card artwork aspect ratio (width / height), preserved from the deck.
  cardAspect: 0.535,
} as const;
