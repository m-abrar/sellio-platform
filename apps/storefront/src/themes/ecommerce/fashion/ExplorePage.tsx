'use client';

import EcommerceExplorePage from '@/themes/ecommerce/shared/EcommerceExplorePage';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

export default function ExplorePage(props: ExplorePageProps) {
  return <EcommerceExplorePage classPrefix="ef" {...props} />;
}
