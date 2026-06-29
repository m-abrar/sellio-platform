import type { Metadata } from 'next';
import { MarketplaceDetailRoute } from '@/components/MarketplaceDetailRoute';
import { api } from '@/lib/api-client';
import { buildListingMetadata } from '@/lib/listing-metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const property = await api.getPropertyBySlug(slug);
    return buildListingMetadata({
      title: property.title,
      description: property.short_description || property.description,
      image: property.featured_image || property.thumbnail_image,
    });
  } catch {
    return {};
  }
}

export default function PropertiesDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="properties" />;
}
