'use client';

import EventBookingConfirmPage from '@/themes/events/shared/EventBookingConfirmPage';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export default function BookingConfirmPage() {
  const themeLink = useEventsThemeLink();
  return <EventBookingConfirmPage classPrefix="ecc" themeLink={themeLink} />;
}
