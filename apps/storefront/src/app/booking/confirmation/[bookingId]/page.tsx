import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function BookingConfirmationPage({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { bookingId } = await params;
  const ThemeBookingConfirmationPage = await loadThemeSubpage(layout, 'BookingConfirmationPage');

  if (!ThemeBookingConfirmationPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Booking Confirmation" />;
  }

  return <ThemeBookingConfirmationPage bookingId={Number(bookingId)} />;
}
