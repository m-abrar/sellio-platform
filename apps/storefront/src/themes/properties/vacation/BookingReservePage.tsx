'use client';

import PropertyBookingReservePage from '@/themes/properties/shared/PropertyBookingReservePage';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export default function BookingReservePage() {
  const themeLink = usePropertyThemeLink();
  return <PropertyBookingReservePage classPrefix="pr" themeLink={themeLink} />;
}
