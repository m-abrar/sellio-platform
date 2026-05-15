import React from 'react';
import { api } from "@sellio/api-client";
import { ThemeSwitcherClient } from './ThemeSwitcherClient';

export const ThemeSwitcher = async () => {
  try {
    const themes = await api.getThemes();
    return <ThemeSwitcherClient themes={themes} />;
  } catch (error) {
    console.error("ThemeSwitcher failed to fetch themes", error);
    return null;
  }
};
