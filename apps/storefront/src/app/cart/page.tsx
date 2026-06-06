import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

export default async function CartPage() {
  const { layout } = await getActiveTheme();

  const ThemeCartPage = await loadThemeSubpage(layout, 'CartPage');

  if (!ThemeCartPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Shopping Cart" />;
  }

  return <ThemeCartPage />;
}
