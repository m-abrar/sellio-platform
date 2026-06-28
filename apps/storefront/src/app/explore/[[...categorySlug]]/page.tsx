import type { Metadata } from 'next';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    categorySlug?: string[];
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { layout, theme } = await getActiveTheme();
  const vertical = layout.split('/')[0] ?? 'listings';
  const verticalLabel = vertical.charAt(0).toUpperCase() + vertical.slice(1);
  const siteName = theme.app_settings?.site_name || 'Sellio';
  return {
    title: `Browse ${verticalLabel}`,
    description: `Search and filter ${verticalLabel.toLowerCase()} listings on ${siteName}.`,
  };
}

export default async function ExplorePage({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { categorySlug } = await params;
  const initialCategorySlug = categorySlug && categorySlug.length > 0 ? categorySlug[0] : undefined;

  const ThemeExplorePage = await loadThemeSubpage(layout, 'ExplorePage');

  if (!ThemeExplorePage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Explore Catalogue" />;
  }

  return <ThemeExplorePage initialCategorySlug={initialCategorySlug} />;
}
