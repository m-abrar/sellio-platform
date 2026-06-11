'use client';

import PropertyBookingReservePage from '@/themes/properties/shared/PropertyBookingReservePage';
import { useModernThemeLink } from './hooks/useModernThemeLink';

export default function BookingReservePage() {
  const themeLink = useModernThemeLink();
  return <PropertyBookingReservePage classPrefix="pm" themeLink={themeLink} />;
}
