import { MarketplaceDetailRoute } from '@/components/MarketplaceDetailRoute';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PropertiesDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="properties" />;
}
