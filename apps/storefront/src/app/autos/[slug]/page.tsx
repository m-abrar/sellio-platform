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
    const vehicle = await api.getVehicleBySlug(slug);
    return buildListingMetadata({
      title: vehicle.title,
      metaTitle: vehicle.seo?.meta_title,
      description: vehicle.short_description || vehicle.description,
      metaDescription: vehicle.seo?.meta_description,
      image: vehicle.featured_image || vehicle.media?.main_photo,
    });
  } catch {
    return {};
  }
}

export default function AutosDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="autos" />;
}
