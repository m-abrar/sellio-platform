import type { Metadata } from 'next';
import { MarketplaceDetailRoute } from '@/components/MarketplaceDetailRoute';
import { api } from '@sellio/api-client';
import { buildListingMetadata } from '@/lib/listing-metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const event = await api.getEventBySlug(slug);
    return buildListingMetadata({
      title: event.title,
      metaTitle: event.seo?.title,
      description: event.description,
      metaDescription: event.seo?.description,
      image: event.media?.poster || event.media?.preview,
    });
  } catch {
    return {};
  }
}

export default function EventsDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="events" />;
}
