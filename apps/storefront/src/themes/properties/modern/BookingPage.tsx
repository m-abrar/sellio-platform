'use client';

import PropertyBookingPaymentPage from '@/themes/properties/shared/PropertyBookingPaymentPage';
import { useModernThemeLink } from './hooks/useModernThemeLink';

interface BookingPageProps {
  bookingId: number;
}

export default function BookingPage({ bookingId }: BookingPageProps) {
  const themeLink = useModernThemeLink();

  return (
    <PropertyBookingPaymentPage
      bookingId={bookingId}
      classPrefix="pm"
      themeLink={themeLink}
    />
  );
}
