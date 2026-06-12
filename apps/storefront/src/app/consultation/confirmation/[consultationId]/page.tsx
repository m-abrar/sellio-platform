import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    consultationId: string;
  }>;
}

export default async function ConsultationConfirmationRoute({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { consultationId } = await params;
  const ConsultationConfirmationPage = await loadThemeSubpage(layout, 'ConsultationConfirmationPage');

  if (!ConsultationConfirmationPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Consultation Confirmation" />;
  }

  const parsedId = Number(consultationId);
  const id = Number.isNaN(parsedId) ? consultationId : parsedId;

  return <ConsultationConfirmationPage consultationId={id} />;
}
