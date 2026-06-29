import { api } from '@/lib/storefront-api';
import type {
  Category,
  ClassifiedListing,
  EventListing,
  JobListing,
  Product,
  Property,
  ServiceListing,
  Vehicle,
} from '@/types';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  PRODUCT_CARD_PLACEHOLDER,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';

export type Vertical =
  | 'products'
  | 'properties'
  | 'autos'
  | 'services'
  | 'jobs'
  | 'events'
  | 'classifieds';

export type VerticalDescriptor = {
  key: Vertical;
  label: string;
  description: string;
};

export const VERTICALS: VerticalDescriptor[] = [
  { key: 'products', label: 'Products', description: 'Retail goods and everyday items' },
  { key: 'properties', label: 'Properties', description: 'Homes, rentals, and commercial space' },
  { key: 'autos', label: 'Autos', description: 'Verified vehicles for sale' },
  { key: 'services', label: 'Services', description: 'Bookable providers' },
  { key: 'jobs', label: 'Jobs', description: 'Open roles and hiring' },
  { key: 'events', label: 'Events', description: 'Tickets and venues' },
  { key: 'classifieds', label: 'Classifieds', description: 'Local listings and deals' },
];

export type ExploreListingSpecs = {
  beds?: string;
  baths?: string;
  area?: string;
  mileage?: string;
  transmission?: string;
  workplace?: string;
  company?: string;
  companyLogo?: string;
  salary?: string;
  condition?: string;
  location?: string;
  ticketsLeft?: string;
};

export type ExploreListing = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  category: string;
  vertical: Vertical;
  href: string;
  actionLabel: string;
  specs?: ExploreListingSpecs;
  date?: string;
  listingType?: string;
};

type CatalogResponse<T> = {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  sidebar?: {
    categories?: Category[];
  };
};

function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    return `http://${host}:8000/api`;
  }

  return 'http://127.0.0.1:8000/api';
}

async function fetchCatalog<T>(
  endpoint: string,
  params: Record<string, unknown>,
): Promise<CatalogResponse<T>> {
  const url = new URL(`${resolveApiBaseUrl()}/v1/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`${endpoint} returned HTTP ${response.status}`);
  }

  const body = (await response.json()) as CatalogResponse<T>;

  return {
    data: Array.isArray(body.data) ? body.data : [],
    meta: body.meta,
    sidebar: body.sidebar,
  };
}

export function plainText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (typeof value === 'object' && value !== null && 'title' in value) {
    const title = (value as { title?: unknown }).title;
    return plainText(title, fallback);
  }

  return fallback;
}

function formatCurrency(value: number | string | null | undefined, fallback = 'Contact seller'): string {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? `$${amount.toLocaleString()}` : fallback;
}

function compact(values: unknown[]): string[] {
  return values.map((value) => plainText(value, '')).filter((value) => value.trim().length > 0);
}

function productToListing(product: Product, categories: Category[]): ExploreListing {
  return {
    id: `products-${product.id}`,
    title: product.title,
    slug: product.slug,
    description: product.description || 'Browse this listing for full details and pricing.',
    price: formatProductPrice(product),
    image: getProductImage(product, PRODUCT_CARD_PLACEHOLDER),
    category: getProductCategoryLabel(product, categories),
    vertical: 'products',
    href: `/products/${product.slug}`,
    actionLabel: 'View details',
  };
}

function propertyToListing(property: Property): ExploreListing {
  const specs = property.specs;
  const location = compact([property.city, property.state]).join(', ') || undefined;
  return {
    id: `properties-${property.id}`,
    title: property.title,
    slug: property.slug,
    description: property.short_description || property.description || 'Browse this property listing for full details.',
    price: property.pricing?.price_formatted || formatCurrency(property.pricing?.active_price ?? property.base_price),
    image: property.primary_image_url || property.featured_image || property.thumbnail_image || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(property.category?.title || specs?.category, 'Properties'),
    vertical: 'properties',
    href: `/properties/${property.slug}`,
    actionLabel: 'View property',
    listingType: property.is_rental ? 'For Rent' : 'For Sale',
    specs: {
      beds: specs?.bedrooms != null ? String(specs.bedrooms) : property.number_of_bedrooms != null ? String(property.number_of_bedrooms) : undefined,
      baths: specs?.bathrooms != null ? String(specs.bathrooms) : property.number_of_bathrooms != null ? String(property.number_of_bathrooms) : undefined,
      area: specs?.area_formatted || (property.area_sq_ft ? `${property.area_sq_ft.toLocaleString()} sq ft` : undefined),
      location,
    },
  };
}

function vehicleToListing(vehicle: Vehicle): ExploreListing {
  return {
    id: `autos-${vehicle.id}`,
    title: vehicle.title,
    slug: vehicle.slug,
    description: vehicle.short_description || vehicle.description || 'Browse this vehicle listing for full details.',
    price: vehicle.pricing?.formatted || vehicle.pricing?.formatted_short || formatCurrency(vehicle.pricing?.base_price),
    image: vehicle.media?.main_photo || vehicle.media?.preview || vehicle.featured_image || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(vehicle.taxonomy?.category, 'Autos'),
    vertical: 'autos',
    href: `/autos/${vehicle.slug}`,
    actionLabel: 'View vehicle',
    listingType: vehicle.specs?.condition || undefined,
    specs: {
      mileage: vehicle.specs?.mileage || undefined,
      transmission: vehicle.specs?.transmission || undefined,
      location: compact([vehicle.location?.city, vehicle.location?.state]).join(', ') || undefined,
    },
  };
}

function jobToListing(job: JobListing): ExploreListing {
  return {
    id: `jobs-${job.id}`,
    title: job.title,
    slug: job.slug,
    description: job.description || `${job.company?.name || 'A company'} is hiring for ${job.employment?.type || 'this role'}.`,
    price: job.compensation?.range_compact || job.compensation?.range_full || 'Apply now',
    image: job.company?.logo_card || job.company?.logo || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(job.taxonomy?.category, 'Jobs'),
    vertical: 'jobs',
    href: `/jobs/${job.slug}`,
    actionLabel: 'View role',
    listingType: job.employment?.workplace || undefined,
    specs: {
      company: job.company?.name || undefined,
      companyLogo: job.company?.logo_card || job.company?.logo || undefined,
      workplace: job.employment?.workplace || undefined,
      salary: job.compensation?.range_compact || job.compensation?.range_full || undefined,
      location: job.location?.display || undefined,
    },
  };
}

function serviceToListing(service: ServiceListing): ExploreListing {
  return {
    id: `services-${service.id}`,
    title: service.title,
    slug: service.slug,
    description: service.short_description || service.description || 'Browse this service listing for full details.',
    price: service.pricing?.formatted || service.pricing?.formatted_short || formatCurrency(service.pricing?.base_price, 'Request quote'),
    image: service.media?.main_photo || service.provider?.avatar || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(service.professional?.category, 'Services'),
    vertical: 'services',
    href: `/services/${service.slug}`,
    actionLabel: 'View service',
  };
}

function eventToListing(event: EventListing): ExploreListing {
  const startsAt = event.schedule?.start_at || undefined;
  const ticketsLeft = event.ticketing?.tickets_left != null ? String(event.ticketing.tickets_left) : undefined;
  const location = event.schedule?.is_virtual
    ? 'Virtual'
    : compact([event.location?.city, event.location?.state]).join(', ') || undefined;
  return {
    id: `events-${event.id}`,
    title: event.title,
    slug: event.slug,
    description: event.description || 'Browse this event listing for full details.',
    price: event.ticketing?.price_formatted || event.ticketing?.price_formatted_k || formatCurrency(event.ticketing?.base_price, 'Free'),
    image: event.media?.poster || event.media?.preview || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(event.specs?.category || event.specs?.event_genre, 'Events'),
    vertical: 'events',
    href: `/events/${event.slug}`,
    actionLabel: 'View event',
    date: startsAt,
    specs: {
      location,
      ticketsLeft,
    },
  };
}

function classifiedToListing(classified: ClassifiedListing): ExploreListing {
  return {
    id: `classifieds-${classified.id}`,
    title: classified.title,
    slug: classified.slug,
    description: classified.short_description || classified.description || 'Browse this classified listing for full details.',
    price: classified.pricing?.formatted || classified.pricing?.formatted_short || formatCurrency(classified.pricing?.base_price),
    image: classified.media?.main_photo || classified.media?.thumbnail || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(classified.taxonomy?.category, 'Classifieds'),
    vertical: 'classifieds',
    href: `/classifieds/${classified.slug}`,
    actionLabel: 'View listing',
  };
}

export type MultiVerticalResult = {
  listings: ExploreListing[];
  categories: Category[];
  totals: Partial<Record<Vertical, number>>;
  total: number;
  lastPage: number;
  failedVerticals: Vertical[];
};

/**
 * Fetches all 7 verticals in a single HTTP request via the unified catalog
 * endpoint. Used by the home page to avoid 7 parallel round trips to the
 * backend (which queues on php artisan serve).
 */
export async function fetchHomeListings(): Promise<MultiVerticalResult> {
  const url = `${resolveApiBaseUrl()}/v1/catalog/home`;

  let body: Record<string, unknown> = {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (response.ok) {
      body = (await response.json()) as Record<string, unknown>;
    }
  } catch {
    // Network error, timeout abort, or non-ok response — fall through with empty body
  } finally {
    clearTimeout(timer);
  }

  const categories: Category[] = [];
  const listings: ExploreListing[] = [];
  const totals: Partial<Record<Vertical, number>> = {};
  const failedVerticals: Vertical[] = [];
  let total = 0;
  let lastPage = 1;

  function process<T>(
    key: Vertical,
    toListingFn: (item: T, cats?: Category[]) => ExploreListing,
    productCats?: Category[],
  ) {
    const block = body[key] as { data?: T[]; meta?: { total?: number; last_page?: number }; sidebar?: { categories?: Category[] } } | undefined;
    if (!block || !Array.isArray(block.data)) {
      failedVerticals.push(key);
      return;
    }
    const blockCats = block.sidebar?.categories ?? [];
    categories.push(...blockCats);
    listings.push(...block.data.map((item) => toListingFn(item, productCats ?? blockCats)));
    const t = block.meta?.total ?? block.data.length;
    totals[key] = t;
    total += t;
    lastPage = Math.max(lastPage, block.meta?.last_page ?? 1);
  }

  const productCats = (body.products as { sidebar?: { categories?: Category[] } } | undefined)?.sidebar?.categories ?? [];

  process<Product>('products', (p) => productToListing(p as Product, productCats));
  process<Property>('properties', (p) => propertyToListing(p as Property));
  process<Vehicle>('autos', (v) => vehicleToListing(v as Vehicle));
  process<EventListing>('events', (e) => eventToListing(e as EventListing));
  process<JobListing>('jobs', (j) => jobToListing(j as JobListing));
  process<ServiceListing>('services', (s) => serviceToListing(s as ServiceListing));
  process<ClassifiedListing>('classifieds', (c) => classifiedToListing(c as ClassifiedListing));

  const seenCategorySlugs = new Map<string, Category>();
  categories.forEach((cat) => seenCategorySlugs.set(cat.slug, cat));

  return { listings, categories: Array.from(seenCategorySlugs.values()), totals, total, lastPage, failedVerticals };
}

export async function fetchAllVerticals(params: Record<string, unknown>): Promise<MultiVerticalResult> {
  const [
    productsResult,
    propertiesResult,
    vehiclesResult,
    jobsResult,
    servicesResult,
    eventsResult,
    classifiedsResult,
  ] = await Promise.allSettled([
    fetchCatalog<Product>('products', params),
    fetchCatalog<Property>('properties', params),
    fetchCatalog<Vehicle>('vehicles', params),
    fetchCatalog<JobListing>('jobs', params),
    fetchCatalog<ServiceListing>('services', params),
    fetchCatalog<EventListing>('events', params),
    fetchCatalog<ClassifiedListing>('classifieds', params),
  ]);

  const categories: Category[] = [];
  const listings: ExploreListing[] = [];
  const totals: Partial<Record<Vertical, number>> = {};
  const failedVerticals: Vertical[] = [];
  let total = 0;
  let lastPage = 1;

  if (productsResult.status === 'fulfilled') {
    const productCategories = productsResult.value.sidebar?.categories ?? [];
    categories.push(...productCategories);
    listings.push(...productsResult.value.data.map((product) => productToListing(product, productCategories)));
    totals.products = productsResult.value.meta?.total ?? productsResult.value.data.length;
    total += totals.products;
    lastPage = Math.max(lastPage, productsResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('products');
  }

  if (propertiesResult.status === 'fulfilled') {
    categories.push(...(propertiesResult.value.sidebar?.categories ?? []));
    listings.push(...propertiesResult.value.data.map(propertyToListing));
    totals.properties = propertiesResult.value.meta?.total ?? propertiesResult.value.data.length;
    total += totals.properties;
    lastPage = Math.max(lastPage, propertiesResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('properties');
  }

  if (vehiclesResult.status === 'fulfilled') {
    categories.push(...(vehiclesResult.value.sidebar?.categories ?? []));
    listings.push(...vehiclesResult.value.data.map(vehicleToListing));
    totals.autos = vehiclesResult.value.meta?.total ?? vehiclesResult.value.data.length;
    total += totals.autos;
    lastPage = Math.max(lastPage, vehiclesResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('autos');
  }

  if (jobsResult.status === 'fulfilled') {
    categories.push(...(jobsResult.value.sidebar?.categories ?? []));
    listings.push(...jobsResult.value.data.map(jobToListing));
    totals.jobs = jobsResult.value.meta?.total ?? jobsResult.value.data.length;
    total += totals.jobs;
    lastPage = Math.max(lastPage, jobsResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('jobs');
  }

  if (servicesResult.status === 'fulfilled') {
    categories.push(...(servicesResult.value.sidebar?.categories ?? []));
    listings.push(...servicesResult.value.data.map(serviceToListing));
    totals.services = servicesResult.value.meta?.total ?? servicesResult.value.data.length;
    total += totals.services;
    lastPage = Math.max(lastPage, servicesResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('services');
  }

  if (eventsResult.status === 'fulfilled') {
    categories.push(...(eventsResult.value.sidebar?.categories ?? []));
    listings.push(...eventsResult.value.data.map(eventToListing));
    totals.events = eventsResult.value.meta?.total ?? eventsResult.value.data.length;
    total += totals.events;
    lastPage = Math.max(lastPage, eventsResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('events');
  }

  if (classifiedsResult.status === 'fulfilled') {
    categories.push(...(classifiedsResult.value.sidebar?.categories ?? []));
    listings.push(...classifiedsResult.value.data.map(classifiedToListing));
    totals.classifieds = classifiedsResult.value.meta?.total ?? classifiedsResult.value.data.length;
    total += totals.classifieds;
    lastPage = Math.max(lastPage, classifiedsResult.value.meta?.last_page ?? 1);
  } else {
    failedVerticals.push('classifieds');
  }

  const seenCategorySlugs = new Map<string, Category>();
  categories.forEach((category) => seenCategorySlugs.set(category.slug, category));

  return {
    listings,
    categories: Array.from(seenCategorySlugs.values()),
    totals,
    total,
    lastPage,
    failedVerticals,
  };
}

// --- Detail (single listing) helpers, used by ProductPage for any vertical ---

export type DetailMeta = { label: string; value: string };

export type VerticalDetail = {
  id: number;
  title: string;
  slug: string;
  vertical: Vertical;
  label: string;
  kicker: string;
  price: string;
  image: string;
  category: string;
  description: string;
  meta: DetailMeta[];
  actionLabel: string;
  actionHref: string;
  product?: Product;
  property?: Property;
  vehicle?: Vehicle;
  job?: JobListing;
  service?: ServiceListing;
  classified?: ClassifiedListing;
  event?: EventListing;
};

export const VERTICAL_LABELS: Record<Vertical, string> = {
  products: 'Product',
  properties: 'Property',
  autos: 'Auto',
  services: 'Service',
  jobs: 'Job',
  events: 'Event',
  classifieds: 'Classified',
};

function productToDetail(product: Product): VerticalDetail {
  const ext = product as Product & {
    sku?: string;
    taxonomy?: { category?: { title?: string }; brand?: { title?: string } };
  };
  const categoryTitle = ext.taxonomy?.category?.title || 'Products';

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    vertical: 'products',
    label: 'Product',
    kicker: categoryTitle,
    price: formatProductPrice(product),
    image: getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER),
    category: categoryTitle,
    description: product.description || 'Browse this listing for full details and pricing.',
    meta: [
      { label: 'Category', value: categoryTitle },
      { label: 'Brand', value: ext.taxonomy?.brand?.title || 'Not specified' },
      { label: 'SKU', value: ext.sku || product.slug },
    ],
    actionLabel: 'Add to cart',
    actionHref: '/cart',
    product,
  };
}

function propertyToDetail(property: Property): VerticalDetail {
  const specs = property.specs;
  const location = compact([property.city, property.state, property.country]).join(', ') || 'Location available on request';

  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    vertical: 'properties',
    label: 'Property',
    kicker: property.is_rental ? 'Rental property' : 'Sale property',
    price: property.pricing?.price_formatted || formatCurrency(property.pricing?.active_price ?? property.base_price),
    image: property.primary_image_url || property.featured_image || property.thumbnail_image || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(property.category?.title || specs?.category, 'Properties'),
    description: property.short_description || property.description || 'Browse this property listing for full details.',
    meta: [
      { label: 'Location', value: location },
      { label: 'Beds', value: String(specs?.bedrooms ?? property.number_of_bedrooms ?? 'Ask') },
      { label: 'Baths', value: String(specs?.bathrooms ?? property.number_of_bathrooms ?? 'Ask') },
      { label: 'Floor area', value: specs?.area_formatted || `${property.area_sq_ft?.toLocaleString?.() ?? property.area_sq_ft ?? 'Ask'} sq ft` },
    ],
    actionLabel: 'Browse properties',
    actionHref: '/explore?vertical=properties',
    property,
  };
}

function vehicleToDetail(vehicle: Vehicle): VerticalDetail {
  const location = compact([vehicle.location?.city, vehicle.location?.state, vehicle.location?.country]).join(', ') || 'Location available on request';

  return {
    id: vehicle.id,
    title: vehicle.title,
    slug: vehicle.slug,
    vertical: 'autos',
    label: 'Auto',
    kicker: `${vehicle.specs?.year || 'Verified'} vehicle`,
    price: vehicle.pricing?.formatted || vehicle.pricing?.formatted_short || formatCurrency(vehicle.pricing?.base_price),
    image: vehicle.media?.main_photo || vehicle.media?.preview || vehicle.featured_image || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(vehicle.taxonomy?.category, 'Autos'),
    description: vehicle.short_description || vehicle.description || 'Browse this vehicle listing for full details.',
    meta: [
      { label: 'Make', value: vehicle.specs?.make || 'Ask seller' },
      { label: 'Model', value: vehicle.specs?.model || 'Ask seller' },
      { label: 'Mileage', value: vehicle.specs?.mileage || 'Ask seller' },
      { label: 'Location', value: location },
    ],
    actionLabel: 'Browse autos',
    actionHref: '/explore?vertical=autos',
    vehicle,
  };
}

function serviceToDetail(service: ServiceListing): VerticalDetail {
  const location = compact([service.location?.city, service.location?.state, service.location?.country]).join(', ') || 'Remote or local service';

  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    vertical: 'services',
    label: 'Service',
    kicker: 'Bookable provider',
    price: service.pricing?.formatted || service.pricing?.formatted_short || formatCurrency(service.pricing?.base_price, 'Request quote'),
    image: service.media?.main_photo || service.provider?.avatar || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(service.professional?.category, 'Services'),
    description: service.short_description || service.description || 'Browse this service listing for full details.',
    meta: [
      { label: 'Provider', value: service.provider?.name || 'Verified provider' },
      { label: 'Availability', value: service.operations?.is_open ? 'Open now' : 'Schedule required' },
      { label: 'Service area', value: location },
    ],
    actionLabel: 'Browse services',
    actionHref: '/explore?vertical=services',
    service,
  };
}

function jobToDetail(job: JobListing): VerticalDetail {
  return {
    id: job.id,
    title: job.title,
    slug: job.slug,
    vertical: 'jobs',
    label: 'Job',
    kicker: job.company?.name || 'Hiring now',
    price: job.compensation?.range_compact || job.compensation?.range_full || 'Apply now',
    image: job.company?.logo_card || job.company?.logo || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(job.taxonomy?.category, 'Jobs'),
    description: job.description || 'Browse this job listing for full details.',
    meta: [
      { label: 'Company', value: job.company?.name || 'Not specified' },
      { label: 'Location', value: job.location?.display || 'Location flexible' },
      { label: 'Workplace', value: job.employment?.workplace || 'Not specified' },
    ],
    actionLabel: 'Browse jobs',
    actionHref: '/explore?vertical=jobs',
    job,
  };
}

function eventToDetail(event: EventListing): VerticalDetail {
  const location = event.schedule?.is_virtual
    ? 'Virtual event'
    : compact([event.location?.city, event.location?.state, event.location?.country]).join(', ') || 'Venue to be announced';

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    vertical: 'events',
    label: 'Event',
    kicker: 'Upcoming event',
    price: event.ticketing?.price_formatted || event.ticketing?.price_formatted_k || formatCurrency(event.ticketing?.base_price, 'Free'),
    image: event.media?.poster || event.media?.preview || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(event.specs?.category || event.specs?.event_genre, 'Events'),
    description: event.description || 'Browse this event listing for full details.',
    meta: [
      { label: 'Location', value: location },
      { label: 'Tickets', value: event.ticketing?.tickets_left ? `${event.ticketing.tickets_left} left` : 'Check availability' },
    ],
    actionLabel: 'Browse events',
    actionHref: '/explore?vertical=events',
    event,
  };
}

function classifiedToDetail(classified: ClassifiedListing): VerticalDetail {
  const location = compact([classified.location?.city, classified.location?.state, classified.location?.country]).join(', ') || 'Local pickup details available on request';

  return {
    id: classified.id,
    title: classified.title,
    slug: classified.slug,
    vertical: 'classifieds',
    label: 'Classified',
    kicker: classified.item_specs?.condition_label || 'Local listing',
    price: classified.pricing?.formatted || classified.pricing?.formatted_short || formatCurrency(classified.pricing?.base_price),
    image: classified.media?.main_photo || classified.media?.thumbnail || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(classified.taxonomy?.category, 'Classifieds'),
    description: classified.short_description || classified.description || 'Browse this classified listing for full details.',
    meta: [
      { label: 'Condition', value: classified.item_specs?.condition_label || 'Ask seller' },
      { label: 'Location', value: location },
    ],
    actionLabel: 'Browse classifieds',
    actionHref: '/explore?vertical=classifieds',
    classified,
  };
}

export async function fetchVerticalDetail(vertical: Vertical, slug: string): Promise<VerticalDetail> {
  if (vertical === 'products') {
    return productToDetail(await api.getProductBySlug(slug));
  }

  if (vertical === 'properties') {
    const response = await api.getPropertyDetails(slug);
    if (response?.success && response.data) {
      return propertyToDetail(response.data);
    }
  }

  if (vertical === 'autos') {
    const response = await api.getVehicleDetails(slug);
    if (response?.success && response.data) {
      return vehicleToDetail(response.data);
    }
  }

  if (vertical === 'services') {
    return serviceToDetail(await api.getServiceBySlug(slug));
  }

  if (vertical === 'jobs') {
    const response = await api.getJobDetails(slug);
    if (response?.success && response.data) {
      return jobToDetail(response.data);
    }
  }

  if (vertical === 'events') {
    const response = await api.getEventDetails(slug);
    if (response?.success && response.data) {
      return eventToDetail(response.data);
    }
  }

  if (vertical === 'classifieds') {
    const response = await api.getClassifiedDetails(slug);
    if (response?.success && response.data) {
      return classifiedToDetail(response.data);
    }
  }

  throw new Error(`${VERTICAL_LABELS[vertical]} listing not found.`);
}
