import type { Metadata } from 'next';

export interface ListingMetaInput {
  title: string;
  metaTitle?: string | null;
  description?: string | null;
  metaDescription?: string | null;
  image?: string | null;
}

export function buildListingMetadata(item: ListingMetaInput): Metadata {
  const title = item.metaTitle || item.title;
  const description = (item.metaDescription || item.description || '').slice(0, 160) || undefined;
  const images = item.image ? [{ url: item.image }] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}
