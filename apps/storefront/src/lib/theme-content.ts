import { api } from '@sellio/api-client';
import type { ThemeContentResponse } from '@sellio/types';
import { getThemeContentDefaults } from '@/lib/theme-content-defaults';

export async function getThemeContent(page: string, themeKey?: string): Promise<ThemeContentResponse> {
  const defaults = getThemeContentDefaults(themeKey, page);

  if (!themeKey) {
    return defaults;
  }

  try {
    const remote = await api.getThemeContent(themeKey, page);

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
