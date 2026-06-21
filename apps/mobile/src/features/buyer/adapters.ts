import { FavoriteListingCard, FavoriteRecord } from './types';
import { ListingApiRecord, ListingVertical } from '../listings/types';

const MORPH_TYPE_TO_VERTICAL: Record<string, ListingVertical> = {
  product: 'products',
  property: 'properties',
  auto: 'autos',
  event: 'events',
  joblisting: 'jobs',
  service: 'services',
  classified: 'classifieds',
};

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function verticalFromMorphType(type: string) {
  const modelName = type.split('\\').pop()?.toLowerCase() || '';
  return MORPH_TYPE_TO_VERTICAL[modelName] || null;
}

function money(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount)
    ? `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : null;
}

function favoritePrice(record: ListingApiRecord, vertical: ListingVertical) {
  if (vertical === 'jobs') {
    const formatted = text(record.salary_range_formatted);
    if (formatted) return formatted;

    const minimum = money(record.salary_min);
    const maximum = money(record.salary_max);
    return minimum && maximum ? `${minimum} - ${maximum}` : minimum || maximum || 'Salary undisclosed';
  }

  return text(record.price_formatted)
    || money(record.sale_price)
    || money(record.base_price)
    || 'Price unavailable';
}

export function toFavoriteListingCard(favorite: FavoriteRecord): FavoriteListingCard | null {
  const record = favorite.favoritable;
  const vertical = verticalFromMorphType(favorite.favoritable_type);

  if (!record || !vertical) return null;

  return {
    favoriteId: favorite.id,
    listingId: String(record.id || favorite.favoritable_id),
    vertical,
    title: text(record.title) || text(record.name) || 'Untitled listing',
    slug: text(record.slug) || String(record.id || favorite.favoritable_id),
    price: favoritePrice(record, vertical),
    location: [text(record.city), text(record.state)].filter(Boolean).join(', ')
      || 'Location unavailable',
    imageUrl: text(record.thumbnail_url) || text(record.primary_image_url),
  };
}
