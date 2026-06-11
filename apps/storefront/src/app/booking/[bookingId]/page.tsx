import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function BookingPaymentPage({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { bookingId } = await params;
  const ThemeBookingPage = await loadThemeSubpage(layout, 'BookingPage');

  if (!ThemeBookingPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Booking Payment" />;
  }

  return <ThemeBookingPage bookingId={Number(bookingId)} />;
}
