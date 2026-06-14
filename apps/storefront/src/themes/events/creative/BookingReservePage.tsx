'use client';

import EventBookingReservePage from '@/themes/events/shared/EventBookingReservePage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export default function BookingReservePage() {
  const themeLink = useEventsThemeLink();
  return <EventBookingReservePage classPrefix="ecc" themeLink={themeLink} />;
}
