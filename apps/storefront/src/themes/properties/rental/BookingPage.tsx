'use client';

import PropertyBookingPaymentPage from '@/themes/properties/shared/PropertyBookingPaymentPage';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';

interface BookingPageProps {
  bookingId: number;
}

export default function BookingPage({ bookingId }: BookingPageProps) {
  const themeLink = useRentalThemeLink();

  return (
    <PropertyBookingPaymentPage
      bookingId={bookingId}
      classPrefix="pr"
      themeLink={themeLink}
    />
  );
}
