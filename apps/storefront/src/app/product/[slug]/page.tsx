import type { Metadata } from 'next';
import { ThemeSubpageUnavailable } from '@/components/ThemeSubpageUnavailable';
import { loadThemeSubpage } from '@/lib/theme-pages';
import { getActiveTheme } from '@/lib/theme';
import { api } from '@sellio/api-client';
import { buildListingMetadata } from '@/lib/listing-metadata';
import React from 'react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await api.getProductBySlug(slug);
    return buildListingMetadata({
      title: product.title,
      description: product.description,
      image: product.media?.featured_image || product.image_url,
    });
  } catch {
    return {};
  }
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const { layout } = await getActiveTheme();

  const ProductPage = await loadThemeSubpage(layout, 'ProductPage');

  if (!ProductPage) {
    return <ThemeSubpageUnavailable layout={layout} pageName="Listing Details" />;
  }

  return <ProductPage slug={slug} vertical="products" />;
}
