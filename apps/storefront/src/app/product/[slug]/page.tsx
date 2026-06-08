import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import React from 'react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const { layout } = await getActiveTheme();

  const ProductPage = await loadThemeSubpage(layout, 'ProductPage');

  if (!ProductPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Listing Details" />;
  }

  return <ProductPage slug={slug} />;
}
