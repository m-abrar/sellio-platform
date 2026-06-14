'use client';

import PropertyBookingConfirmPage from '@/themes/properties/shared/PropertyBookingConfirmPage';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export default function BookingConfirmPage() {
  const themeLink = usePropertyThemeLink();
  return <PropertyBookingConfirmPage classPrefix="pr" themeLink={themeLink} />;
}
