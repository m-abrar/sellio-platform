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
    const classified = await api.getClassifiedBySlug(slug);
    return buildListingMetadata({
      title: classified.title,
      description: classified.short_description || classified.description,
      image: classified.media?.main_photo,
    });
  } catch {
    return {};
  }
}

export default function ClassifiedsDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="classifieds" />;
}
