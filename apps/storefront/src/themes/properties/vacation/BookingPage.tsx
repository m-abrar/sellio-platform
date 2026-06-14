'use client';

import PropertyBookingPaymentPage from '@/themes/properties/shared/PropertyBookingPaymentPage';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

interface BookingPageProps {
  bookingId: number;
}

export default function BookingPage({ bookingId }: BookingPageProps) {
  const themeLink = usePropertyThemeLink();
  return <PropertyBookingPaymentPage bookingId={bookingId} classPrefix="pr" themeLink={themeLink} />;
}
