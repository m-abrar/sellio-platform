'use client';

import PropertyBookingConfirmPage from '@/themes/properties/shared/PropertyBookingConfirmPage';
import { useModernThemeLink } from './hooks/useModernThemeLink';

export default function BookingConfirmPage() {
  const themeLink = useModernThemeLink();

  return <PropertyBookingConfirmPage classPrefix="pm" themeLink={themeLink} />;
}
