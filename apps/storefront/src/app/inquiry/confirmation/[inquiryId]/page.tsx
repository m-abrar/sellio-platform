import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    inquiryId: string;
  }>;
}

export default async function InquiryConfirmationRoute({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { inquiryId } = await params;
  const InquiryConfirmationPage = await loadThemeSubpage(layout, 'InquiryConfirmationPage');

  if (!InquiryConfirmationPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Inquiry Confirmation" />;
  }

  const parsedId = Number(inquiryId);
  const id = Number.isNaN(parsedId) ? inquiryId : parsedId;

  return <InquiryConfirmationPage inquiryId={id} />;
}
