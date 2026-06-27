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
  base_price?: number | string | null;
  sale_price?: number | string | null;
  price_formatted?: string | null;
  salary_min?: number | string | null;
  salary_max?: number | string | null;
  salary_range_formatted?: string | null;
  city?: string | null;
  state?: string | null;
  primary_image_url?: string | null;
  thumbnail_url?: string | null;
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
  operations?: Record<string, unknown>;
  status?: Record<string, unknown>;
  vendor?: Record<string, unknown>;
  provider?: Record<string, unknown>;
  seller?: Record<string, unknown>;
  owner?: Record<string, unknown>;
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
  facts: ListingDetailFact[];
  primaryActionLabel: string;
  primaryActionDescription: string;
}

export interface ListingDetailFact {
  label: string;
  value: string;
}

export interface ListingCategoryDefinition {
  id: ListingVertical;
  title: string;
  icon: string;
  endpoint: string;
}

export type ListingModuleMap = Partial<Record<ListingVertical, boolean>>;

export interface BrandSettingsResponse {
  site_name?: string | null;
  site_favicon?: string | null;
  site_logo?: string | null;
  modules?: ListingModuleMap | null;
}

export interface LocationApiRecord {
  id: number;
  title?: string | null;
  slug?: string | null;
  state?: string | null;
  country?: string | null;
  flags?: Partial<Record<
    | 'is_property'
    | 'is_event'
    | 'is_job'
    | 'is_auto'
    | 'is_service'
    | 'is_classified'
    | 'is_product',
    boolean
  >> | null;
}

export interface LocationFilterItem {
  id: string;
  title: string;
  label: string;
  slug: string | null;
  flags: NonNullable<LocationApiRecord['flags']>;
}
