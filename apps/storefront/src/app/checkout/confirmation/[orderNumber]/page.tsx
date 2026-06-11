import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function CheckoutConfirmationPage({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { orderNumber } = await params;
  const ThemeCheckoutConfirmationPage = await loadThemeSubpage(layout, 'CheckoutConfirmationPage');

  if (!ThemeCheckoutConfirmationPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Order Confirmation" />;
  }

  return <ThemeCheckoutConfirmationPage orderNumber={orderNumber} />;
}
