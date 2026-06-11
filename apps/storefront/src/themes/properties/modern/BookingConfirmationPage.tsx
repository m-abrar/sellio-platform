'use client';

import PropertyBookingConfirmationPage from '@/themes/properties/shared/PropertyBookingConfirmationPage';
import { useModernThemeLink } from './hooks/useModernThemeLink';

interface BookingConfirmationPageProps {
  bookingId: number;
}

export default function BookingConfirmationPage({ bookingId }: BookingConfirmationPageProps) {
  const themeLink = useModernThemeLink();

  return (
    <PropertyBookingConfirmationPage
      bookingId={bookingId}
      classPrefix="pm"
      themeLink={themeLink}
    />
  );
}
