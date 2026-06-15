import { MarketplaceDetailRoute } from '@/components/MarketplaceDetailRoute';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductsDetailPage({ params }: PageProps) {
  return <MarketplaceDetailRoute params={params} vertical="products" />;
}
