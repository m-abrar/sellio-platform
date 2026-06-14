'use client';

import ClassifiedInquiryConfirmationPage from '@/themes/classifieds/shared/ClassifiedInquiryConfirmationPage';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

interface InquiryConfirmationPageProps {
  inquiryId: number | string;
}

export default function InquiryConfirmationPage({ inquiryId }: InquiryConfirmationPageProps) {
  const themeLink = useClassifiedsThemeLink();

  return (
    <ClassifiedInquiryConfirmationPage inquiryId={inquiryId} themeLink={themeLink} />
  );
}
