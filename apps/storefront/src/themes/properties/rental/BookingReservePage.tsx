'use client';

import PropertyBookingReservePage from '@/themes/properties/shared/PropertyBookingReservePage';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';

export default function BookingReservePage() {
  const themeLink = useRentalThemeLink();
  return <PropertyBookingReservePage classPrefix="pr" themeLink={themeLink} />;
}
