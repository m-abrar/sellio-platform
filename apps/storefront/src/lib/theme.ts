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
  const headerTheme = headerList.get("x-theme-key");
  const cookieTheme = headerList.get("cookie")?.match(/(?:^|; )theme=([^;]*)/)?.[1];
  const themeOverride = headerTheme || cookieTheme;

  // #region agent log
  fetch('http://127.0.0.1:7444/ingest/7299bd34-d23f-4a85-8035-1e1996ea1a56',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'706e24'},body:JSON.stringify({sessionId:'706e24',location:'theme.ts:getActiveTheme',message:'theme resolution inputs',data:{headerTheme,cookieTheme,themeOverride},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  try {
    const theme = await api.getActiveTheme(themeOverride);
    
    return {
      theme,
      layout: resolveIndustryLayout(theme),
      databaseOffline: false
    };
  } catch (error: any) {
    console.error(`[Offline Resilience] Failed to fetch active theme from API (${error.response?.status || 503}: ${error.message || error})`);
    
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
        message: error.response?.data?.message || "Database service is currently unavailable. Please try again later.",
        code: error.response?.data?.code || "DB_CONNECTION_REFUSED",
        status: error.response?.status || 503
      }
    };
  }
}
