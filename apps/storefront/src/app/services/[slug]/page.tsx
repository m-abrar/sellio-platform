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
    const service = await api.getServiceBySlug(slug);
    return buildListingMetadata({
      title: service.title,
      metaTitle: service.seo?.meta_title,
      description: service.short_description || service.description,
      metaDescription: service.seo?.meta_description,
      image: service.media?.main_photo,
    });
  } catch {
    return {};
  }
}

export default function ServicesDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="services" />;
}
