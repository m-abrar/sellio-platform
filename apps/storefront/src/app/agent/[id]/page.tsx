import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentBioRoute({ params }: PageProps) {
  const { id } = await params;
  const { layout } = await getActiveTheme();

  const AgentBioPage = await loadThemeSubpage(layout, 'AgentBioPage');

  if (!AgentBioPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Agent Profile" />;
  }

  return <AgentBioPage agentId={id} />;
}
