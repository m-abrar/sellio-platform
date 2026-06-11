'use client';

import PropertyBookingConfirmationPage from '@/themes/properties/shared/PropertyBookingConfirmationPage';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';

interface BookingConfirmationPageProps {
  bookingId: number;
}

export default function BookingConfirmationPage({ bookingId }: BookingConfirmationPageProps) {
  const themeLink = useRentalThemeLink();

  return (
    <PropertyBookingConfirmationPage
      bookingId={bookingId}
      classPrefix="pr"
      themeLink={themeLink}
    />
  );
}
