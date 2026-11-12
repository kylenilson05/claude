// Design tokens from the Vertex Detailing design system, as used by the STACKED design.
import type { TextStyle } from 'react-native';

export const C = {
  accent: '#FF6000',
  accentHover: '#FF7F33',
  accentPress: '#E04E00',
  accentTint: '#FFB07A',
  accentDeep: '#B83E00',
  accentFg: '#0B0B0D',
  accentWash: 'rgba(255,96,0,0.12)',
  accentLine: 'rgba(255,96,0,0.40)',

  pageDeep: '#060607',
  page: '#0B0B0D',
  surface: '#121215',
  card: '#17171B',
  input: '#1E1E23',
  elevated: '#26262C',
  border: '#303038',
  borderStrong: '#3E3E48',
  hairline: 'rgba(255,255,255,0.08)',
  focusRing: 'rgba(255,96,0,0.55)',

  text: '#FFFFFF',
  textSoft: '#CBCBD3',
  textSecondary: '#A6A6B2',
  textMuted: '#7C7C89',
  textDisabled: '#565662',

  success: '#2FBF67',
  successInk: '#08160E',
  danger: '#E5352B',
  dangerText: '#FF7A73',
  white: '#FFFFFF',
  scrim: 'rgba(0,0,0,0.72)',
} as const;

// Solved-group band colors, easiest to hardest: [background, text].
export const TIER: [string, string][] = [
  ['#FFFFFF', '#0B0B0D'],
  ['#FFB07A', '#0B0B0D'],
  ['#FF6000', '#0B0B0D'],
  ['#B83E00', '#FFFFFF'],
];

// Font family names as registered with expo-font in app/_layout.tsx.
export const F = {
  display700i: 'Saira_700Bold_Italic',
  display800i: 'Saira_800ExtraBold_Italic',
  display900i: 'Saira_900Black_Italic',
  body400: 'Barlow_400Regular',
  body500: 'Barlow_500Medium',
  ui500: 'BarlowSemiCondensed_500Medium',
  ui600: 'BarlowSemiCondensed_600SemiBold',
  ui700: 'BarlowSemiCondensed_700Bold',
} as const;

export type FontKey = keyof typeof F;

/** Text style shorthand: font, size, optional color, line-height multiplier and letter-spacing in em. */
export function t(font: FontKey, size: number, color: string = C.text, lh?: number, em?: number): TextStyle {
  return {
    fontFamily: F[font],
    fontSize: size,
    color,
    ...(lh ? { lineHeight: Math.round(size * lh) } : null),
    ...(em ? { letterSpacing: size * em } : null),
  };
}

/** Caps eyebrow: Barlow Semi Condensed 700, 0.14em tracking. */
export const eyebrow = (size = 11, color: string = C.accent): TextStyle => ({
  ...t('ui700', size, color, undefined, 0.14),
  textTransform: 'uppercase',
});

export const R = { xs: 3, sm: 6, md: 10, lg: 16, xl: 22, pill: 999 } as const;
export const CUT = 14;

export const shadowCard = '0 2px 4px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.45)';
export const glowOrange = '0 0 0 1px rgba(255,96,0,0.5), 0 8px 28px rgba(255,96,0,0.28)';
export const glowOrangeSm = '0 6px 18px rgba(255,96,0,0.30)';
export const shadowMd = '0 8px 24px rgba(0,0,0,0.55)';

export const GRADIENT = ['#FF7F33', '#FF6000', '#E04E00'] as const;
