'use client';

import EventBookingConfirmationPage from '@/themes/events/shared/EventBookingConfirmationPage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

interface BookingConfirmationPageProps {
  bookingId: number;
}

export default function BookingConfirmationPage({ bookingId }: BookingConfirmationPageProps) {
  const themeLink = useEventsThemeLink();
  return <EventBookingConfirmationPage bookingId={bookingId} classPrefix="ecc" themeLink={themeLink} />;
}
