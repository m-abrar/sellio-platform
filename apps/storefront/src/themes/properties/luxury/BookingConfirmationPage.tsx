'use client';

import PropertyBookingConfirmationPage from '@/themes/properties/shared/PropertyBookingConfirmationPage';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

interface BookingConfirmationPageProps {
  bookingId: number;
}

export default function BookingConfirmationPage({ bookingId }: BookingConfirmationPageProps) {
  const themeLink = usePropertyThemeLink();
  return <PropertyBookingConfirmationPage bookingId={bookingId} classPrefix="pr" themeLink={themeLink} />;
}
