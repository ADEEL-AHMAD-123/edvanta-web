/**
 * Central theme registry. To add a 6th theme: add an entry here AND a
 * matching `[data-theme='id']` block in app/globals.css. Nothing else
 * in the app needs to change — every component reads semantic tokens.
 */
export type ThemeId = 'blue' | 'green' | 'purple' | 'orange' | 'dark';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  /** Swatch color (a literal value, used ONLY to render the picker dot). */
  swatch: string;
  isDark?: boolean;
}

export const THEMES: ThemeMeta[] = [
  { id: 'blue', name: 'Edvanta Navy', swatch: 'hsl(222 47% 28%)' },
  { id: 'green', name: 'Emerald Green', swatch: 'hsl(158 64% 38%)' },
  { id: 'purple', name: 'Royal Purple', swatch: 'hsl(263 70% 50%)' },
  { id: 'orange', name: 'Sunset Orange', swatch: 'hsl(21 90% 48%)' },
  { id: 'dark', name: 'Slate Dark', swatch: 'hsl(217 91% 60%)', isDark: true },
];

export const DEFAULT_THEME: ThemeId = 'blue';
export const THEME_STORAGE_KEY = 'edvanta-theme';

export function isValidTheme(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}
