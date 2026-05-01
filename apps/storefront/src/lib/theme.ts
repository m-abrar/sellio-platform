import { Theme } from "@sellio/types";
import { api } from "@sellio/api-client";
import { headers } from "next/headers";

export type IndustryLayout = 
  | 'ecommerce/fashion' 
  | 'ecommerce/electronics' 
  | 'ecommerce/grocery' 
  | 'properties'
  | 'events'
  | 'autos'
  | 'services'
  | 'jobs'
  | 'classifieds'
  | 'unified/default'
  | 'unified/modern'
  | 'unified/minimal';

export interface ResolvedTheme {
  theme: Theme;
  layout: IndustryLayout;
}

/**
 * Resolves a database theme key and vertical to a specific Industry Layout path.
 */
export function resolveIndustryLayout(theme: Theme): IndustryLayout {
  const vertical = theme.vertical?.toLowerCase();
  const key = theme.theme_key.toLowerCase();
  
  // 1. Handle Ecommerce Vertical
  if (vertical === 'ecommerce') {
    if (key.includes('fashion') || key.includes('luxury')) return 'ecommerce/fashion';
    if (key.includes('tech') || key.includes('electronics')) return 'ecommerce/electronics';
    if (key.includes('grocery') || key.includes('fresh')) return 'ecommerce/grocery';
    return 'unified/default';
  }

  // 2. Handle Unified Series
  if (key.includes('unifieds_')) {
    if (key.includes('modern')) return 'unified/modern';
    if (key.includes('minimal')) return 'unified/minimal';
    return 'unified/default';
  }

  // 3. Vertical Fallbacks
  if (vertical === 'properties') return 'properties' as any; // Map to base vertical
  if (vertical === 'events') return 'events' as any;
  if (vertical === 'autos') return 'autos' as any;
  
  return 'unified/default';
}

/**
 * Fetches the active theme from the Laravel API.
 */
export async function getActiveTheme(): Promise<ResolvedTheme> {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie") || "";
  const themeOverride = cookieHeader.match(/theme=([^;]+)/)?.[1];

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
