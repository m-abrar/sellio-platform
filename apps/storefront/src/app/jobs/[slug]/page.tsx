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
    const job = await api.getJobBySlug(slug);
    return buildListingMetadata({
      title: job.title,
      description: job.description,
    });
  } catch {
    return {};
  }
}

export default function JobsDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="jobs" />;
}
