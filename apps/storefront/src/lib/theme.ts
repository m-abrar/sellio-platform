import type { Theme } from "@sellio/types";
import { api } from "@sellio/api-client";
import { headers } from "next/headers";

export type IndustryLayout = string;

export interface ResolvedTheme {
  theme: Theme;
  layout: IndustryLayout;
  databaseOffline?: boolean;
  errorDetails?: {
    success: boolean;
    message: string;
    code: string;
    status: number;
  };
}

/**
 * Resolves a database theme key and vertical to a specific Industry Layout path.
 */
export function resolveIndustryLayout(theme: Theme): IndustryLayout {
  // We now have dedicated folders for each theme key in src/themes/vertical/key/
  // Convert theme_key (e.g. properties_luxury) to path (properties/luxury)
  return theme.theme_key.toLowerCase().replace('_', '/');
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
      layout: resolveIndustryLayout(theme),
      databaseOffline: false
    };
  } catch (error: unknown) {
    const apiError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          code?: string;
        };
      };
      message?: string;
    };

    console.error(`[Offline Resilience] Failed to fetch active theme from API (${apiError.response?.status || 503}: ${apiError.message || error})`);
    
    return {
      theme: {
        id: 0,
        theme_key: 'unifieds_default',
        title: 'Unified Default',
        is_active: true,
        variables: {},
        app_settings: { site_name: 'Sellio', site_logo: '', hide_site_name: '0' }
      },
      layout: 'unifieds/default',
      databaseOffline: true,
      errorDetails: {
        success: false,
        message: apiError.response?.data?.message || "Database service is currently unavailable. Please try again later.",
        code: apiError.response?.data?.code || "DB_CONNECTION_REFUSED",
        status: apiError.response?.status || 503
      }
    };
  }
}
