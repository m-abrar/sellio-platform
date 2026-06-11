import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React, { Suspense } from 'react';

function ConfirmFallback() {
  return <div className="p-20 text-center">Confirming payment...</div>;
}

export default async function CheckoutConfirmPage() {
  const { layout } = await getActiveTheme();
  const ThemeCheckoutConfirmPage = await loadThemeSubpage(layout, 'CheckoutConfirmPage');

  if (!ThemeCheckoutConfirmPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Payment Confirmation" />;
  }

  return (
    <Suspense fallback={<ConfirmFallback />}>
      <ThemeCheckoutConfirmPage />
    </Suspense>
  );
}
