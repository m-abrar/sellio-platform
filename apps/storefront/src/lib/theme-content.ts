import type { ApiResponse, ThemeContentResponse } from '@sellio/types';
import { getThemeContentDefaults } from '@/lib/theme-content-defaults';

async function fetchThemeContent(themeKey: string, page: string): Promise<ThemeContentResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';
  const url = new URL('/api/v1/theme-content', baseUrl.replace(/\/api\/?$/, ''));
  url.searchParams.set('theme_key', themeKey);
  url.searchParams.set('page', page);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Theme-Key': themeKey,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Theme content request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<ThemeContentResponse>;
  return payload.data;
}

export async function getThemeContent(page: string, themeKey?: string): Promise<ThemeContentResponse> {
  const defaults = getThemeContentDefaults(themeKey, page);

  if (!themeKey) {
    return defaults;
  }

  try {
    const remote = await fetchThemeContent(themeKey, page);

    return {
      theme_key: remote.theme_key,
      page: remote.page,
      content: {
        ...defaults.content,
        ...remote.content,
      },
      media: {
        ...defaults.media,
        ...remote.media,
      },
      config: {
        ...defaults.config,
        ...remote.config,
      },
    };
  } catch (error) {
    console.error(`Failed to load theme content for ${themeKey}/${page}`, error);
    return defaults;
  }
}
