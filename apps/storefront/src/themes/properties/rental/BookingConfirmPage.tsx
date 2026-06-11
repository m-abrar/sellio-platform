'use client';

import PropertyBookingConfirmPage from '@/themes/properties/shared/PropertyBookingConfirmPage';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';

export default function BookingConfirmPage() {
  const themeLink = useRentalThemeLink();

  return <PropertyBookingConfirmPage classPrefix="pr" themeLink={themeLink} />;
}
