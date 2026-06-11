import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React, { Suspense } from 'react';

function ReserveFallback() {
  return <div className="p-20 text-center">Preparing reservation...</div>;
}

export default async function BookingReserveRoutePage() {
  const { layout } = await getActiveTheme();
  const ThemeBookingReservePage = await loadThemeSubpage(layout, 'BookingReservePage');

  if (!ThemeBookingReservePage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Booking Reservation" />;
  }

  return (
    <Suspense fallback={<ReserveFallback />}>
      <ThemeBookingReservePage />
    </Suspense>
  );
}
