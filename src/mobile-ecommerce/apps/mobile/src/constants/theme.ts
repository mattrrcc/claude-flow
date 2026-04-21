import { Platform } from 'react-native';

export const Colors = {
  background: '#0A0A0A',
  card: '#111111',
  border: '#1A1A1A',
  accent: '#C8A96E',
  accentLight: '#D4BA85',
  accentDark: '#A88B50',
  white: '#FFFFFF',
  muted: '#888888',
  mutedDark: '#555555',
  mutedLight: '#AAAAAA',
  error: '#FF4444',
  success: '#44BB44',
  warning: '#FFAA00',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  cardHover: '#161616',
  inputBackground: '#141414',
  skeleton: '#1A1A1A',
  skeletonHighlight: '#222222',
  tabBar: '#0D0D0D',
  statusBar: '#0A0A0A',
  saleRed: '#CC3333',
  starFilled: '#C8A96E',
  starEmpty: '#2A2A2A',
  badgePending: '#555555',
  badgeProcessing: '#C8A96E',
  badgeShipped: '#4477CC',
  badgeDelivered: '#44AA44',
  badgeCancelled: '#CC3333',
} as const;

export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  fontFamilyBold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
    hero: 40,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
    caps: 3,
  },
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  base: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  accent: {
    shadowColor: '#C8A96E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const NavigationTheme = {
  dark: true,
  colors: {
    primary: Colors.accent,
    background: Colors.background,
    card: Colors.card,
    text: Colors.white,
    border: Colors.border,
    notification: Colors.accent,
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  NavigationTheme,
};
