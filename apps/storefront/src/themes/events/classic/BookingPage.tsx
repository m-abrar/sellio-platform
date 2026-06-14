'use client';

import EventBookingPaymentPage from '@/themes/events/shared/EventBookingPaymentPage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

interface BookingPageProps {
  bookingId: number;
}

export default function BookingPage({ bookingId }: BookingPageProps) {
  const themeLink = useEventsThemeLink();
  return <EventBookingPaymentPage bookingId={bookingId} classPrefix="ecc" themeLink={themeLink} />;
}
