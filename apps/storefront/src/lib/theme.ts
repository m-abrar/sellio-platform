export type ThemeKey = 'fashion' | 'electronics' | 'grocery';

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
}

// In a real application, this would come from an environment variable, 
// a database setting via API, or a subdomain check.
export const activeTheme: ThemeKey = (process.env.NEXT_PUBLIC_THEME as ThemeKey) || 'fashion';

export const themes: Record<ThemeKey, ThemeConfig> = {
  fashion: {
    key: 'fashion',
    name: 'LeBrince Fashion',
  },
  electronics: {
    key: 'electronics',
    name: 'Sellio Tech',
  },
  grocery: {
    key: 'grocery',
    name: 'FreshMarket',
  },
};
