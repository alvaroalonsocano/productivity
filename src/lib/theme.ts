import { useColorScheme } from 'react-native';

export const lightColors = {
  bg: '#f8fafc',
  card: '#ffffff',
  cardAlt: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#1e293b',
  textMuted: '#64748b',
  textPlaceholder: '#94a3b8',
  border: '#f1f5f9',
  borderStrong: '#e2e8f0',
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryBg: '#eff6ff',
  primaryBorder: '#bfdbfe',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
  success: '#22c55e',
  successBg: '#f0fdf4',
  warning: '#f59e0b',
  warningBg: '#fef3c7',
  tabBar: '#ffffff',
  tabBorder: '#e2e8f0',
};

export const darkColors: typeof lightColors = {
  bg: '#0f172a',
  card: '#1e293b',
  cardAlt: '#334155',
  text: '#f1f5f9',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  textPlaceholder: '#64748b',
  border: '#1e293b',
  borderStrong: '#334155',
  primary: '#60a5fa',
  primaryDark: '#3b82f6',
  primaryBg: '#1e3a5f',
  primaryBorder: '#1d4ed8',
  danger: '#f87171',
  dangerBg: '#450a0a',
  success: '#4ade80',
  successBg: '#052e16',
  warning: '#fbbf24',
  warningBg: '#451a03',
  tabBar: '#1e293b',
  tabBorder: '#334155',
};

export type AppColors = typeof lightColors;

export function getColors(scheme: 'light' | 'dark' | null | undefined): AppColors {
  return scheme === 'dark' ? darkColors : lightColors;
}

export function useTheme(): AppColors {
  const scheme = useColorScheme();
  return getColors(scheme);
}
