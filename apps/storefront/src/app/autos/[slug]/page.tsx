import { MarketplaceDetailRoute } from '@/components/MarketplaceDetailRoute';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function AutosDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="autos" />;
}
