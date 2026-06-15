import React from 'react';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { getActiveTheme } from '@/lib/theme';
import { loadThemeSubpage } from '@/lib/theme-pages';

export type MarketplaceRouteVertical =
  | 'products'
  | 'properties'
  | 'autos'
  | 'services'
  | 'jobs'
  | 'events'
  | 'classifieds';

interface MarketplaceDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
  vertical: MarketplaceRouteVertical;
}

export async function MarketplaceDetailRoute({
  params,
  vertical,
}: MarketplaceDetailRouteProps) {
  const { slug } = await params;
  const { layout } = await getActiveTheme();
  const ProductPage = await loadThemeSubpage(layout, 'ProductPage');

  if (!ProductPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Listing Details" />;
  }

  return <ProductPage slug={slug} vertical={vertical} />;
}
