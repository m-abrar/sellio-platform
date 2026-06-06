import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    categorySlug?: string[];
  }>;
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
