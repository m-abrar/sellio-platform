import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React, { Suspense } from 'react';

function ConfirmFallback() {
  return <div className="p-20 text-center">Confirming booking payment...</div>;
}

export default async function BookingConfirmPage() {
  const { layout } = await getActiveTheme();
  const ThemeBookingConfirmPage = await loadThemeSubpage(layout, 'BookingConfirmPage');

  if (!ThemeBookingConfirmPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Booking Payment Confirmation" />;
  }

  return (
    <Suspense fallback={<ConfirmFallback />}>
      <ThemeBookingConfirmPage />
    </Suspense>
  );
}
