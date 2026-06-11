import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

export default async function CheckoutPage() {
  const { layout } = await getActiveTheme();
  const ThemeCheckoutPage = await loadThemeSubpage(layout, 'CheckoutPage');

  if (!ThemeCheckoutPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Checkout" />;
  }

  return <ThemeCheckoutPage />;
}
