import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

export default async function ApplicationConfirmationRoute({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { applicationId } = await params;
  const ApplicationConfirmationPage = await loadThemeSubpage(layout, 'ApplicationConfirmationPage');

  if (!ApplicationConfirmationPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Application Confirmation" />;
  }

  const parsedId = Number(applicationId);
  const id = Number.isNaN(parsedId) ? applicationId : parsedId;

  return <ApplicationConfirmationPage applicationId={id} />;
}
