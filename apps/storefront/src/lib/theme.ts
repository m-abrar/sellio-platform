import { Theme } from "@sellio/types";

export type IndustryLayout = 'fashion' | 'electronics' | 'grocery';

export interface ResolvedTheme {
  theme: Theme;
  layout: IndustryLayout;
}

/**
 * Resolves a database theme key to one of our 3 core industry layouts.
 * This is the "Mapping Logic" that connects the backend seeders to the frontend designs.
 */
export function resolveIndustryLayout(themeKey: string): IndustryLayout {
  const key = themeKey.toLowerCase();
  
  // Pattern matching for industry resolution
  if (key.includes('fashion') || key.includes('luxury') || key.includes('properties_classic')) {
    return 'fashion';
  }
  
  if (key.includes('tech') || key.includes('electronics') || key.includes('autos') || key.includes('modern')) {
    return 'electronics';
  }
  
  if (key.includes('grocery') || key.includes('fresh') || key.includes('bakery')) {
    return 'grocery';
  }

  // Fallback to fashion for high-contrast default or you could add a 'unified' layout
  return 'fashion'; 
}

/**
 * Mocking a dynamic fetch for now, but this would use the @sellio/api-client
 */
export async function getActiveTheme(keyFromUrl?: string): Promise<ResolvedTheme> {
  // In a real app, we fetch from API: await api.getTheme(keyFromUrl || 'unifieds_default')
  
  // For demonstration, we simulate the DB record that matches the Seeder
  const mockDbTheme: Theme = {
    id: 1,
    theme_key: keyFromUrl || 'ecommerce_fashion',
    title: 'Dynamic Theme from DB',
    is_active: true,
    variables: {
      "--fashion-accent": "#ff0000", // Dynamic override example
    }
  };

  return {
    theme: mockDbTheme,
    layout: resolveIndustryLayout(mockDbTheme.theme_key)
  };
}
