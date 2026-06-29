'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

const TOKENS = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'muted-foreground',
  'border',
  'card',
  'foreground',
  'success',
  'danger',
  'warning',
  'primary',
] as const;

type TokenKey = (typeof TOKENS)[number];

/**
 * Resolves theme tokens into concrete `hsl(...)` strings for Recharts (which
 * needs literal SVG colors). Re-reads whenever the active theme changes.
 */
export function useChartColors(): Record<TokenKey, string> {
  const { theme } = useTheme();
  const [colors, setColors] = useState<Record<TokenKey, string>>(() =>
    Object.fromEntries(TOKENS.map((t) => [t, 'hsl(0 0% 50%)'])) as Record<TokenKey, string>
  );

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const next = Object.fromEntries(
      TOKENS.map((t) => {
        const raw = styles.getPropertyValue(`--${t}`).trim();
        return [t, raw ? `hsl(${raw})` : 'hsl(0 0% 50%)'];
      })
    ) as Record<TokenKey, string>;
    setColors(next);
  }, [theme]);

  return colors;
}
