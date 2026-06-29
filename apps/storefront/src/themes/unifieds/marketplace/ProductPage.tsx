'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type {
  ClassifiedListing,
  EventListing,
  JobListing,
  Product,
  Property,
  ServiceListing,
  Vehicle,
} from '@/types';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import {
  formatProductPrice,
  getProductImage,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

type MarketplaceVertical =
  | 'products'
  | 'properties'
  | 'autos'
  | 'services'
  | 'jobs'
  | 'events'
  | 'classifieds';

type DetailMeta = {
  label: string;
  value: string;
};

type MarketplaceDetail = {
  id: number;
  title: string;
  slug: string;
  vertical: MarketplaceVertical;
  label: string;
  kicker: string;
  price: string;
  image: string;
  category: string;
  description: string;
  ownerLabel: string;
  actionLabel: string;
  actionHref: string;
  meta: DetailMeta[];
  chips: string[];
  product?: Product;
};

interface ProductPageProps {
  slug: string;
  vertical?: MarketplaceVertical;
}

const verticalLabels: Record<MarketplaceVertical, string> = {
  products: 'Product',
  properties: 'Property',
  autos: 'Auto',
  services: 'Service',
  jobs: 'Job',
  events: 'Event',
  classifieds: 'Classified',
};

function plainText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (typeof value === 'object' && value !== null && 'title' in value) {
    return plainText((value as { title?: unknown }).title, fallback);
  }

  return fallback;
}

function formatCurrency(value: number | string | null | undefined, fallback = 'Contact seller'): string {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? `$${amount.toLocaleString()}` : fallback;
}

function formatDate(value: string | null | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function compact(values: unknown[]): string[] {
  return values
    .map((value) => plainText(value, ''))
    .filter((value) => value.trim().length > 0);
}

function detailChips(values: unknown[]): string[] {
  const seen = new Set<string>();

  return compact(values).filter((value) => {
    if (/^\d+$/.test(value)) {
      return false;
    }

    const key = value.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function productToDetail(product: Product): MarketplaceDetail {
  const ext = product as Product & {
    sku?: string;
    taxonomy?: {
      category?: { id?: number; title?: string };
      brand?: { id?: number; title?: string };
      tags?: string[];
    };
  };

  const categoryTitle = ext.taxonomy?.category?.title || 'Products';
  const brandTitle = ext.taxonomy?.brand?.title || null;
  const sku = ext.sku || null;
  const tags = ext.taxonomy?.tags || [];

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    vertical: 'products',
    label: 'Product',
    kicker: 'Retail listing',
    price: formatProductPrice(product),
    image: getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER),
    category: categoryTitle,
    description: product.description || 'Verified marketplace product.',
    ownerLabel: brandTitle || 'Marketplace seller',
    actionLabel: 'Add to cart',
    actionHref: '/cart',
    meta: [
      { label: 'Category', value: categoryTitle },
      { label: 'Brand', value: brandTitle || 'Marketplace brand' },
      { label: 'SKU', value: sku || 'In catalog' },
    ],
    chips: detailChips(['Checkout ready', product.pricing?.formatted ? 'Live pricing' : 'Catalog price', ...tags]),
    product,
  };
}

function propertyToDetail(property: Property): MarketplaceDetail {
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
    description: property.short_description || property.description || 'Verified property listing.',
    ownerLabel: property.owner?.name || property.user?.name || 'Property host',
    actionLabel: 'View full listing',
    actionHref: property.slug ? `/properties/${property.slug}` : '/explore?vertical=properties',
    meta: [
      { label: 'Location', value: location },
      { label: 'Beds', value: String(specs?.bedrooms ?? property.number_of_bedrooms ?? 'Ask') },
      { label: 'Baths', value: String(specs?.bathrooms ?? property.number_of_bathrooms ?? 'Ask') },
      { label: 'Floor area', value: specs?.area_formatted || `${property.area_sq_ft?.toLocaleString?.() ?? property.area_sq_ft} sq ft` },
    ],
    chips: detailChips([
      property.is_rental ? 'Available to rent' : null,
      property.is_sale ? 'Available to buy' : null,
      specs?.property_type,
      property.is_featured ? 'Featured' : null,
    ]),
  };
}

function vehicleToDetail(vehicle: Vehicle): MarketplaceDetail {
  const location = compact([vehicle.location?.city, vehicle.location?.state, vehicle.location?.country]).join(', ') || 'Dealer location pending';

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
    description: vehicle.short_description || vehicle.description || 'Verified vehicle listing.',
    ownerLabel: vehicle.owner?.name || 'Auto seller',
    actionLabel: 'View full listing',
    actionHref: vehicle.slug ? `/autos/${vehicle.slug}` : '/explore?vertical=autos',
    meta: [
      { label: 'Make', value: vehicle.specs?.make || 'Ask seller' },
      { label: 'Model', value: vehicle.specs?.model || 'Ask seller' },
      { label: 'Mileage', value: vehicle.specs?.mileage || 'Ask seller' },
      { label: 'Location', value: location },
    ],
    chips: detailChips([
      vehicle.specs?.condition,
      vehicle.specs?.transmission,
      vehicle.pricing?.is_lease ? 'Lease available' : null,
      vehicle.status?.is_new_arrival ? 'New arrival' : null,
    ]),
  };
}

function serviceToDetail(service: ServiceListing): MarketplaceDetail {
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
    description: service.short_description || service.description || 'Verified service listing.',
    ownerLabel: service.provider?.name || 'Service provider',
    actionLabel: 'Book this service',
    actionHref: service.slug ? `/services/${service.slug}` : '/explore?vertical=services',
    meta: [
      { label: 'Provider', value: service.provider?.name || 'Verified provider' },
      { label: 'Availability', value: service.operations?.is_open ? 'Open now' : 'Schedule required' },
      { label: 'Service area', value: location },
      { label: 'Contract', value: service.pricing?.min_contract || 'Flexible' },
    ],
    chips: detailChips([
      service.operations?.hours_label,
      service.operations?.days_label,
      service.provider?.rating ? `${service.provider.rating}/5 rating` : null,
      service.status?.is_featured ? 'Featured' : null,
    ]),
  };
}

function jobToDetail(job: JobListing): MarketplaceDetail {
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
    description: job.description || 'Verified job listing.',
    ownerLabel: job.company?.name || job.employer?.name || 'Hiring team',
    actionLabel: 'Apply for role',
    actionHref: job.slug ? `/jobs/${job.slug}` : '/explore?vertical=jobs',
    meta: [
      { label: 'Company', value: job.company?.name || 'Company' },
      { label: 'Location', value: job.location?.display || 'Location flexible' },
      { label: 'Workplace', value: job.employment?.workplace || 'Not specified' },
      { label: 'Deadline', value: formatDate(job.status?.deadline, 'Open until filled') },
    ],
    chips: detailChips([
      job.employment?.type,
      job.employment?.experience_level,
      job.employment?.is_full_time ? 'Full time' : null,
      job.employment?.is_contract ? 'Contract' : null,
    ]),
  };
}

function eventToDetail(event: EventListing): MarketplaceDetail {
  const location = event.schedule?.is_virtual
    ? 'Virtual event'
    : compact([event.location?.city, event.location?.state, event.location?.country]).join(', ') || 'Venue pending';

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    vertical: 'events',
    label: 'Event',
    kicker: formatDate(event.schedule?.start_at, 'Upcoming event'),
    price: event.ticketing?.price_formatted || event.ticketing?.price_formatted_k || formatCurrency(event.ticketing?.base_price, 'Free'),
    image: event.media?.poster || event.media?.preview || PRODUCT_DETAIL_PLACEHOLDER,
    category: plainText(event.specs?.category || event.specs?.event_genre, 'Events'),
    description: event.description || 'Verified event listing.',
    ownerLabel: event.organizer?.name || 'Event organizer',
    actionLabel: 'Get tickets',
    actionHref: event.slug ? `/events/${event.slug}` : '/explore?vertical=events',
    meta: [
      { label: 'Date', value: formatDate(event.schedule?.start_at, 'Date pending') },
      { label: 'Location', value: location },
      { label: 'Tickets', value: event.ticketing?.tickets_left ? `${event.ticketing.tickets_left} left` : 'Check availability' },
      { label: 'Venue', value: plainText(event.specs?.venue_size, 'General admission') },
    ],
    chips: detailChips([
      event.specs?.event_genre,
      event.schedule?.is_virtual ? 'Virtual' : 'In person',
      event.ticketing?.is_free ? 'Free' : null,
      event.status?.is_featured ? 'Featured' : null,
    ]),
  };
}

function classifiedToDetail(classified: ClassifiedListing): MarketplaceDetail {
  const location = compact([classified.location?.city, classified.location?.state, classified.location?.country]).join(', ') || 'Local pickup details pending';

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
    description: classified.short_description || classified.description || 'Verified classified listing.',
    ownerLabel: classified.seller?.name || 'Local seller',
    actionLabel: 'Contact seller',
    actionHref: classified.slug ? `/classifieds/${classified.slug}` : '/explore?vertical=classifieds',
    meta: [
      { label: 'Condition', value: classified.item_specs?.condition_label || 'Ask seller' },
      { label: 'Quantity', value: String(classified.item_specs?.quantity ?? 1) },
      { label: 'Location', value: location },
      { label: 'Record', value: classified.slug },
    ],
    chips: detailChips([
      classified.pricing?.transaction_type?.for_rent ? 'For rent' : 'For sale',
      classified.status?.is_shipping ? 'Shipping available' : 'Local exchange',
      classified.status?.is_new_listing ? 'New listing' : null,
    ]),
  };
}

async function fetchMarketplaceDetail(vertical: MarketplaceVertical, slug: string): Promise<MarketplaceDetail> {
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

  throw new Error(`${verticalLabels[vertical]} listing not found or API returned no data.`);
}

export default function ProductPage({ slug, vertical = 'products' }: ProductPageProps) {
  const [detail, setDetail] = useState<MarketplaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      setLoading(true);
      try {
        const loaded = await fetchMarketplaceDetail(vertical, slug);
        if (!isMounted) {
          return;
        }

        setDetail(loaded);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified marketplace listing details:', error);
        setDetail(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'The listing record could not be loaded.',
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [slug, vertical]);

  const handleAddToCart = () => {
    if (!detail?.product) {
      return;
    }

    setAddingToCart(true);
    setCartNotice(null);

    try {
      addProductToCart(detail.product);
      setCartNotice(`"${detail.title}" was added to your cart.`);
    } catch (error) {
      console.error('Failed to persist unified marketplace cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="um-detail-page" aria-busy="true">
        <div className="um-detail-back-skeleton" />
        <section className="um-detail-grid">
          <div className="um-detail-media um-detail-skeleton" />
          <div className="um-detail-panel">
            <div className="um-detail-line um-detail-line-small" />
            <div className="um-detail-line um-detail-line-title" />
            <div className="um-detail-line um-detail-line-price" />
            <div className="um-detail-line um-detail-line-copy" />
            <div className="um-detail-line um-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !detail) {
    return (
      <main className="um-detail-page">
        <section className="um-detail-state" role="status">
          <div className="um-mono um-detail-state-code">LISTING_UNAVAILABLE</div>
          <h1>{verticalLabels[vertical]} details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink(`/explore?vertical=${vertical}`)} className="um-btn-primary">Return to marketplace</a>
        </section>
      </main>
    );
  }

  return (
    <main className={`um-detail-page um-detail-page--${detail.vertical}`}>
      <a href={themeLink(`/explore?vertical=${detail.vertical}`)} className="um-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to {detail.label.toLowerCase()} listings
      </a>

      <section className="um-detail-grid um-detail-grid--marketplace" aria-labelledby="um-detail-page-title">
        <div className="um-detail-media">
          <img src={detail.image} alt={detail.title} />
          <div className="um-detail-media-badge">{detail.label}</div>
        </div>

        <article className="um-detail-panel">
          <div className="um-detail-kicker">
            <span className="um-mono">{detail.kicker}</span>
            <strong>LISTING_{detail.id}</strong>
          </div>
          <h1 id="um-detail-page-title">{detail.title}</h1>
          <div className="um-detail-price">{detail.price}</div>

          <div className="um-detail-rule" />

          <div className="um-detail-summary">
            <h2>Overview</h2>
            <p>{detail.description}</p>
          </div>

          {detail.chips.length > 0 ? (
            <div className="um-detail-chip-row" aria-label="Listing highlights">
              {detail.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          ) : null}

          <div className="um-detail-specs" aria-label="Listing metadata">
            {detail.meta.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <aside className="um-detail-owner-panel">
            <span>Managed by</span>
            <strong>{detail.ownerLabel}</strong>
            <p>Verified and published on MarketHub.</p>
          </aside>

          <div className="um-detail-actions">
            {detail.product ? (
              <button type="button" className="um-btn-primary um-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? 'ADDING...' : detail.actionLabel}
              </button>
            ) : (
              <a className="um-btn-primary um-detail-action" href={themeLink(detail.actionHref)}>
                {detail.actionLabel}
              </a>
            )}
            <a className="um-btn-secondary um-detail-secondary-action" href={themeLink('/explore')}>
              Explore all
            </a>
            {cartNotice ? (
              <p className="um-detail-cart-notice">
                {cartNotice}{' '}
                <a href={themeLink('/cart')}>View cart</a>
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
