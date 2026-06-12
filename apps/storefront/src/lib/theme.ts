import type { Theme } from "@sellio/types";
import { api } from "@sellio/api-client";
import { headers } from "next/headers";
import { cache } from "react";

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
export const getActiveTheme = cache(async function getActiveTheme(): Promise<ResolvedTheme> {
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

    const responseCode = apiError.response?.data?.code;
    const responseStatus = apiError.response?.status || 503;
    const normalizedStatus = responseCode === "DB_CONNECTION_REFUSED" ? 503 : responseStatus;
    const normalizedMessage = responseCode === "DB_CONNECTION_REFUSED"
      ? "Database service is currently unavailable. Please try again later."
      : apiError.response?.data?.message || "Database service is currently unavailable. Please try again later.";

    const fallbackThemeKey = themeOverride || 'unifieds_default';
    const fallbackTitle = fallbackThemeKey
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    
    return {
      theme: {
        id: 0,
        theme_key: fallbackThemeKey,
        vertical: fallbackThemeKey.split('_')[0] || 'unifieds',
        title: fallbackTitle,
        is_active: true,
        variables: {},
        app_settings: { site_name: 'Sellio', site_logo: '', hide_site_name: '0' }
      },
      layout: fallbackThemeKey.toLowerCase().replace('_', '/'),
      databaseOffline: true,
      errorDetails: {
        success: false,
        message: normalizedMessage,
        code: responseCode || "DB_CONNECTION_REFUSED",
        status: normalizedStatus
      }
    };
  }
});
