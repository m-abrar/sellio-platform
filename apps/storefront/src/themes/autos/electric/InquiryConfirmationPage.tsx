'use client';

import AutosInquiryConfirmationPage from '@/themes/autos/shared/AutosInquiryConfirmationPage';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';

interface InquiryConfirmationPageProps { inquiryId: number | string; }

export default function InquiryConfirmationPage({ inquiryId }: InquiryConfirmationPageProps) {
  const themeLink = useAutosThemeLink();
  return <AutosInquiryConfirmationPage inquiryId={inquiryId} classPrefix="ev" themeLink={themeLink} />;
}
