import type { Theme } from "@sellio/types";
import { api } from "@sellio/api-client";
import { headers } from "next/headers";

export type IndustryLayout = string;

export interface ResolvedTheme {
  theme: Theme;
  layout: IndustryLayout;
}

/**
 * Resolves a database theme key and vertical to a specific Industry Layout path.
 */
export function resolveIndustryLayout(theme: Theme): IndustryLayout {
  // We now have dedicated folders for each theme key in src/themes/
  // The layout path matches the theme_key (e.g. properties_luxury)
  return theme.theme_key.toLowerCase();
}

/**
 * Fetches the active theme from the Laravel API.
 */
export async function getActiveTheme(): Promise<ResolvedTheme> {
  const headerList = await headers();
  const themeOverride = headerList.get("x-theme-key") || 
                        headerList.get("cookie")?.match(/(?:^|; )theme=([^;]*)/)?.[1];

  try {
    const theme = await api.getActiveTheme(themeOverride);
    
    return {
      theme,
      layout: resolveIndustryLayout(theme)
    };
  } catch (error) {
    console.error("Failed to fetch theme from API", error);
    
    return {
      theme: {
        id: 0,
        theme_key: 'unifieds_default',
        title: 'Unified Default',
        is_active: true,
        variables: {},
        app_settings: { site_name: 'Sellio', site_logo: '', hide_site_name: '0' }
      },
      layout: 'unified/default'
    };
  }
}
