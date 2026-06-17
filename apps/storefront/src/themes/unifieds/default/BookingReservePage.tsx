'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyBookingReservePage from '@/themes/properties/shared/PropertyBookingReservePage';
import EventBookingReservePage from '@/themes/events/shared/EventBookingReservePage';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

function BookingReserveContent() {
  const themeLink = useUnifiedThemeLink();
  const searchParams = useSearchParams();

  // Detect booking type from query params and delegate to the right shared page
  if (searchParams.get('event_id')) {
    return <EventBookingReservePage classPrefix="ecc" themeLink={themeLink} />;
  }

  return <PropertyBookingReservePage classPrefix="pr" themeLink={themeLink} />;
}

export default function BookingReservePage() {
  return (
    <Suspense fallback={<main className="pr-booking-page"><p>Loading reservation...</p></main>}>
      <BookingReserveContent />
    </Suspense>
  );
}
