import EcommerceExplorePage from '@/themes/ecommerce/shared/EcommerceExplorePage';

export default function ExplorePage({
  initialCategorySlug,
  initialSearch,
}: {
  initialCategorySlug?: string;
  initialSearch?: string;
}) {
  return (
    <EcommerceExplorePage
      classPrefix="ef"
      initialCategorySlug={initialCategorySlug}
      initialSearch={initialSearch}
    />
  );
}
