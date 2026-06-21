export type ListingVertical =
  | 'products'
  | 'properties'
  | 'autos'
  | 'events'
  | 'jobs'
  | 'services'
  | 'classifieds';

export type ListingCategory = ListingVertical | 'all';

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ListingApiRecord {
  id: number | string;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  short_description?: string | null;
  featured_image?: string | null;
  thumbnail_image?: string | null;
  pricing?: Record<string, unknown>;
  ticketing?: Record<string, unknown>;
  compensation?: Record<string, unknown>;
  inventory?: Record<string, unknown>;
  specs?: Record<string, unknown>;
  item_specs?: Record<string, unknown>;
  media?: Record<string, unknown>;
  taxonomy?: Record<string, unknown>;
  location?: Record<string, unknown>;
  company?: Record<string, unknown>;
  employment?: Record<string, unknown>;
  professional?: Record<string, unknown>;
  schedule?: Record<string, unknown>;
}

export interface ListingCardItem {
  id: string;
  vertical: ListingVertical;
  title: string;
  slug: string;
  price: string;
  location: string;
  details: string;
  imageUrl: string | null;
}

export interface ListingDetailItem extends ListingCardItem {
  description: string;
}

export interface ListingCategoryDefinition {
  id: ListingVertical;
  title: string;
  icon: string;
  endpoint: string;
}
