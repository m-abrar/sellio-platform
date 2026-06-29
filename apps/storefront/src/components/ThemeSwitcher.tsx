import React from 'react';
import { api } from "@/lib/api-client";
import { ThemeSwitcherClient } from './ThemeSwitcherClient';

import { getActiveTheme } from '@/lib/theme';

export const ThemeSwitcher = async () => {
  try {
    const [themes, { theme: activeTheme }] = await Promise.all([
      api.getThemes(),
      getActiveTheme()
    ]);
    
    return <ThemeSwitcherClient themes={themes} activeThemeKey={activeTheme.theme_key} />;
  } catch (error) {
    console.error("ThemeSwitcher failed to fetch themes", error);
    return null;
  }
};
