'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type {
  Category,
  ClassifiedListing,
  EventListing,
  JobListing,
  Product,
  Property,
  ServiceListing,
  Vehicle,
} from '@sellio/types';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  isExploreSortOption,
  PRODUCT_CARD_PLACEHOLDER,
  type ExploreSortOption,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

type MarketplaceVertical = {
  key: string;
  label: string;
  cue: string;
  matcher: string[];
};

type ExploreListing = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  category: string;
  vertical: string;
  href: string;
  actionLabel: string;
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

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

const marketplaceVerticals: MarketplaceVertical[] = [
  { key: 'all', label: 'All', cue: 'Unified inventory', matcher: [] },
  { key: 'products', label: 'Products', cue: 'Goods and retail', matcher: ['product', 'products', 'shop', 'store', 'electronics', 'smart', 'gadget', 'furniture'] },
  { key: 'properties', label: 'Properties', cue: 'Homes and rentals', matcher: ['property', 'properties', 'real estate', 'rental', 'home', 'apartment'] },
  { key: 'autos', label: 'Autos', cue: 'Verified vehicles', matcher: ['auto', 'autos', 'vehicle', 'vehicles', 'car', 'cars'] },
  { key: 'services', label: 'Services', cue: 'Bookable providers', matcher: ['service', 'services', 'provider', 'studio'] },
  { key: 'jobs', label: 'Jobs', cue: 'Roles and talent', matcher: ['job', 'jobs', 'career', 'hiring'] },
  { key: 'events', label: 'Events', cue: 'Tickets and venues', matcher: ['event', 'events', 'ticket', 'venue', 'festival'] },
  { key: 'classifieds', label: 'Classifieds', cue: 'Local finds', matcher: ['classified', 'classifieds', 'deal', 'used'] },
];

const EXPLORE_REMOTE_PAGE_SIZE = 2;

function normalize(value: unknown): string {
  return plainText(value, '').toLowerCase();
}

function resolveProductVertical(product: Product, categories: Category[]): string {
  const label = normalize(getProductCategoryLabel(product, categories, ''));
  const category = categories.find((item) => item.id === product.category_id);
  const haystack = [label, category?.slug, product.title, product.description].map(normalize).join(' ');

  if (/\b(job|career|hiring|event|ticket|vehicle|auto|car|service|provider|classified)\b/.test(haystack)) {
    return marketplaceVerticals.find((vertical) =>
      !['all', 'products', 'properties'].includes(vertical.key) &&
      vertical.matcher.some((token) => haystack.includes(token)),
    )?.key ?? 'products';
  }

  return 'products';
}

function categoryMatchesVertical(category: Category, vertical: MarketplaceVertical): boolean {
  if (vertical.key === 'all') {
    return true;
  }

  if (vertical.key === 'products') {
    return true;
  }

  const haystack = `${normalize(category.title)} ${normalize(category.slug)}`;
  return vertical.matcher.some((token) => haystack.includes(token));
}

function productToExploreListing(product: Product, categories: Category[]): ExploreListing {
  return {
    id: `product-${product.id}`,
    title: product.title,
    slug: product.slug,
    description: product.description || 'Verified marketplace listing synchronized from Sellio.',
    price: formatProductPrice(product),
    image: getProductImage(product, PRODUCT_CARD_PLACEHOLDER),
    category: getProductCategoryLabel(product, categories),
    vertical: resolveProductVertical(product, categories),
    href: `/products/${product.slug}`,
    actionLabel: 'View details',
  };
}

function formatCurrency(value: number | string | null | undefined, fallback = 'Contact seller'): string {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? `$${amount.toLocaleString()}` : fallback;
}

function categoryName(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'title' in value) {
    const title = (value as { title?: unknown }).title;
    return typeof title === 'string' && title.trim() ? title : fallback;
  }

  return fallback;
}

function plainText(value: unknown, fallback: string): string {
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

function propertyToExploreListing(property: Property): ExploreListing {
  return {
    id: `property-${property.id}`,
    title: property.title,
    slug: property.slug,
    description: property.short_description || property.description || 'Published property listing.',
    price: property.pricing?.price_formatted || formatCurrency(property.pricing?.active_price ?? property.base_price),
    image: property.primary_image_url || property.featured_image || property.thumbnail_image || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(property.category?.title || property.specs?.category, 'Properties'),
    vertical: 'properties',
    href: `/properties/${property.slug}`,
    actionLabel: 'View property',
  };
}

function vehicleToExploreListing(vehicle: Vehicle): ExploreListing {
  return {
    id: `auto-${vehicle.id}`,
    title: vehicle.title,
    slug: vehicle.slug,
    description: vehicle.short_description || vehicle.description || 'Published vehicle listing.',
    price: vehicle.pricing?.formatted || vehicle.pricing?.formatted_short || formatCurrency(vehicle.pricing?.base_price),
    image: vehicle.media?.main_photo || vehicle.media?.preview || vehicle.featured_image || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(vehicle.taxonomy?.category, 'Autos'),
    vertical: 'autos',
    href: `/autos/${vehicle.slug}`,
    actionLabel: 'View vehicle',
  };
}

function jobToExploreListing(job: JobListing): ExploreListing {
  return {
    id: `job-${job.id}`,
    title: job.title,
    slug: job.slug,
    description: job.description || `${job.company?.name || 'Company'} hiring ${job.employment?.type || 'talent'}.`,
    price: job.compensation?.range_compact || job.compensation?.range_full || 'Apply now',
    image: job.company?.logo_card || job.company?.logo || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(job.taxonomy?.category, 'Jobs'),
    vertical: 'jobs',
    href: `/jobs/${job.slug}`,
    actionLabel: 'View role',
  };
}

function serviceToExploreListing(service: ServiceListing): ExploreListing {
  return {
    id: `service-${service.id}`,
    title: service.title,
    slug: service.slug,
    description: service.short_description || service.description || 'Published service listing.',
    price: service.pricing?.formatted || service.pricing?.formatted_short || formatCurrency(service.pricing?.base_price),
    image: service.media?.main_photo || service.provider?.avatar || PRODUCT_CARD_PLACEHOLDER,
    category: categoryName(service.professional?.category, 'Services'),
    vertical: 'services',
    href: `/services/${service.slug}`,
    actionLabel: 'View service',
  };
}

function eventToExploreListing(event: EventListing): ExploreListing {
  return {
    id: `event-${event.id}`,
    title: event.title,
    slug: event.slug,
    description: event.description || 'Published event listing.',
    price: event.ticketing?.price_formatted || event.ticketing?.price_formatted_k || formatCurrency(event.ticketing?.base_price, 'Free'),
    image: event.media?.poster || event.media?.preview || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(event.specs?.category || event.specs?.event_genre, 'Events'),
    vertical: 'events',
    href: `/events/${event.slug}`,
    actionLabel: 'View event',
  };
}

function classifiedToExploreListing(classified: ClassifiedListing): ExploreListing {
  return {
    id: `classified-${classified.id}`,
    title: classified.title,
    slug: classified.slug,
    description: classified.short_description || classified.description || 'Published classified listing.',
    price: classified.pricing?.formatted || classified.pricing?.formatted_short || formatCurrency(classified.pricing?.base_price),
    image: classified.media?.main_photo || classified.media?.thumbnail || PRODUCT_CARD_PLACEHOLDER,
    category: plainText(classified.taxonomy?.category, 'Classifieds'),
    vertical: 'classifieds',
    href: `/classifieds/${classified.slug}`,
    actionLabel: 'View classified',
  };
}

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

function updateUrlSearch(
  router: ReturnType<typeof useRouter>,
  themeLink: ReturnType<typeof useUnifiedThemeLink>,
  currentParams: URLSearchParams,
  updates: Record<string, string>,
) {
  const params = new URLSearchParams(currentParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  if (!updates.page) {
    params.delete('page');
  }

  const query = params.toString();
  router.push(themeLink(query ? `/explore?${query}` : '/explore'));
}

function ExplorePageContent({ initialCategorySlug, initialSearch = '' }: ExplorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useUnifiedThemeLink();

  const [listings, setListings] = useState<ExploreListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [verticalTotals, setVerticalTotals] = useState<Record<string, number>>({});
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listingError, setListingError] = useState<string | null>(null);

  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const searchQuery = searchParams.get('search') || searchParams.get('q') || initialSearch;
  const selectedCategorySlug = searchParams.get('category') || initialCategorySlug || '';
  const selectedVerticalKey = searchParams.get('vertical') || 'all';
  const sortBy = isExploreSortOption(searchParams.get('sort') || '')
    ? (searchParams.get('sort') as ExploreSortOption)
    : 'default';

  const selectedVertical =
    marketplaceVerticals.find((vertical) => vertical.key === selectedVerticalKey) ?? marketplaceVerticals[0];
  const selectedCategory = categories.find(
    (category) => category.slug.toLowerCase() === selectedCategorySlug.toLowerCase(),
  );
  const searchKey = searchParams.toString();
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const query: Record<string, unknown> = { page, per_page: EXPLORE_REMOTE_PAGE_SIZE };
      if (searchQuery) query.search = searchQuery;
      if (selectedCategorySlug) query.category = selectedCategorySlug;

      const [
        productsResult,
        propertiesResult,
        vehiclesResult,
        jobsResult,
        servicesResult,
        eventsResult,
        classifiedsResult,
      ] = await Promise.allSettled([
        fetchCatalog<Product>('products', query),
        fetchCatalog<Property>('properties', query),
        fetchCatalog<Vehicle>('vehicles', query),
        fetchCatalog<JobListing>('jobs', query),
        fetchCatalog<ServiceListing>('services', query),
        fetchCatalog<EventListing>('events', query),
        fetchCatalog<ClassifiedListing>('classifieds', query),
      ]);

      if (!isMounted) {
        return;
      }

      const loadedCategories: Category[] = [];
      const loadedListings: ExploreListing[] = [];
      const loadedTotals: Record<string, number> = {};
      const errors: string[] = [];
      let total = 0;
      let highestLastPage = 1;

      if (productsResult.status === 'fulfilled') {
        loadedCategories.push(...(productsResult.value.sidebar?.categories ?? []));
        loadedListings.push(...productsResult.value.data.map((product) => productToExploreListing(product, productsResult.value.sidebar?.categories ?? [])));
        loadedTotals.products = productsResult.value.meta?.total ?? productsResult.value.data.length;
        total += loadedTotals.products;
        highestLastPage = Math.max(highestLastPage, productsResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('products');
      }

      if (propertiesResult.status === 'fulfilled') {
        loadedCategories.push(...(propertiesResult.value.sidebar?.categories ?? []));
        loadedListings.push(...propertiesResult.value.data.map(propertyToExploreListing));
        loadedTotals.properties = propertiesResult.value.meta?.total ?? propertiesResult.value.data.length;
        total += loadedTotals.properties;
        highestLastPage = Math.max(highestLastPage, propertiesResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('properties');
      }

      if (vehiclesResult.status === 'fulfilled') {
        loadedCategories.push(...(vehiclesResult.value.sidebar?.categories ?? []));
        loadedListings.push(...vehiclesResult.value.data.map(vehicleToExploreListing));
        loadedTotals.autos = vehiclesResult.value.meta?.total ?? vehiclesResult.value.data.length;
        total += loadedTotals.autos;
        highestLastPage = Math.max(highestLastPage, vehiclesResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('autos');
      }

      if (jobsResult.status === 'fulfilled') {
        loadedCategories.push(...(jobsResult.value.sidebar?.categories ?? []));
        loadedListings.push(...jobsResult.value.data.map(jobToExploreListing));
        loadedTotals.jobs = jobsResult.value.meta?.total ?? jobsResult.value.data.length;
        total += loadedTotals.jobs;
        highestLastPage = Math.max(highestLastPage, jobsResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('jobs');
      }

      if (servicesResult.status === 'fulfilled') {
        loadedCategories.push(...(servicesResult.value.sidebar?.categories ?? []));
        loadedListings.push(...servicesResult.value.data.map(serviceToExploreListing));
        loadedTotals.services = servicesResult.value.meta?.total ?? servicesResult.value.data.length;
        total += loadedTotals.services;
        highestLastPage = Math.max(highestLastPage, servicesResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('services');
      }

      if (eventsResult.status === 'fulfilled') {
        loadedCategories.push(...(eventsResult.value.sidebar?.categories ?? []));
        loadedListings.push(...eventsResult.value.data.map(eventToExploreListing));
        loadedTotals.events = eventsResult.value.meta?.total ?? eventsResult.value.data.length;
        total += loadedTotals.events;
        highestLastPage = Math.max(highestLastPage, eventsResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('events');
      }

      if (classifiedsResult.status === 'fulfilled') {
        loadedCategories.push(...(classifiedsResult.value.sidebar?.categories ?? []));
        loadedListings.push(...classifiedsResult.value.data.map(classifiedToExploreListing));
        loadedTotals.classifieds = classifiedsResult.value.meta?.total ?? classifiedsResult.value.data.length;
        total += loadedTotals.classifieds;
        highestLastPage = Math.max(highestLastPage, classifiedsResult.value.meta?.last_page ?? 1);
      } else {
        errors.push('classifieds');
      }

      setListings((previous) => {
        const merged = isFirstPage ? loadedListings : [...previous, ...loadedListings];
        const seen = new Set<string>();

        return merged.filter((item) => {
          if (seen.has(item.id)) {
            return false;
          }
          seen.add(item.id);
          return true;
        });
      });

      setCategories((previous) => {
        const bySlug = new Map<string, Category>();
        [...previous, ...loadedCategories].forEach((category) => {
          bySlug.set(category.slug, category);
        });
        return Array.from(bySlug.values());
      });
      setInventoryTotal(total || loadedListings.length);
      setVerticalTotals((previous) => (isFirstPage ? loadedTotals : { ...previous, ...loadedTotals }));
      setLastPage(highestLastPage);
      setListingError(
        errors.length > 0 && loadedListings.length === 0
          ? `Could not load ${errors.join(', ')} listings.`
          : null,
      );

      if (isFirstPage && loadedListings.length === 0 && errors.length > 0) {
        setListings([]);
        setInventoryTotal(null);
        setVerticalTotals({});
        setLastPage(1);
      }

      setLoading(false);
      setLoadingMore(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [page, searchKey, searchQuery, selectedCategorySlug]);

  const verticalCounts = useMemo(() => {
    return marketplaceVerticals.reduce<Record<string, number>>((counts, vertical) => {
      counts[vertical.key] = vertical.key === 'all'
        ? inventoryTotal ?? listings.length
        : verticalTotals[vertical.key] ?? listings.filter((listing) => listing.vertical === vertical.key).length;
      return counts;
    }, {});
  }, [inventoryTotal, listings, verticalTotals]);

  const visibleCategories = useMemo(() => {
    return categories
      .filter((category) => categoryMatchesVertical(category, selectedVertical))
      .slice(0, 8);
  }, [categories, selectedVertical]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();

    return listings
      .filter((listing) => {
        const matchesVertical = selectedVertical.key === 'all' || listing.vertical === selectedVertical.key;
        const matchesCategory =
          !selectedCategory || listing.category.toLowerCase() === plainText(selectedCategory.title, '').toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          listing.title.toLowerCase().includes(normalizedSearch) ||
          listing.description.toLowerCase().includes(normalizedSearch) ||
          listing.category.toLowerCase().includes(normalizedSearch);

        return matchesVertical && matchesCategory && matchesSearch;
      })
      .sort((left, right) => {
        if (sortBy === 'price_asc') {
          return Number(left.price.replace(/[^0-9.]/g, '')) - Number(right.price.replace(/[^0-9.]/g, ''));
        }
        if (sortBy === 'price_desc') {
          return Number(right.price.replace(/[^0-9.]/g, '')) - Number(left.price.replace(/[^0-9.]/g, ''));
        }
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedVertical, sortBy]);

  const hasRemoteListings = page < lastPage;
  const canLoadMoreListings = hasRemoteListings;
  const resultTotal = selectedVertical.key === 'all'
    ? inventoryTotal ?? filteredProducts.length
    : verticalTotals[selectedVertical.key] ?? filteredProducts.length;

  const resultLabel = inventoryTotal === null
    ? 'Live marketplace'
    : `${inventoryTotal.toLocaleString()} live listings`;
  const selectedCategoryLabel = selectedCategory ? plainText(selectedCategory.title, 'All categories') : 'All categories';

  const handleFilterUpdate = (updates: Record<string, string>) => {
    updateUrlSearch(router, themeLink, searchParams, updates);
  };

  const handleLoadMore = () => {
    if (hasRemoteListings) {
      handleFilterUpdate({ page: String(page + 1) });
    }
  };

  return (
    <main className="um-explore-page">
      <section className="um-explore-hero" aria-labelledby="um-explore-title">
        <div className="um-explore-hero-copy">
          <span className="um-section-kicker">Marketplace directory</span>
          <h1 id="um-explore-title">Find what you need across Sellio.</h1>
          <p>
            Browse homes, vehicles, services, jobs, events, products, and local listings
            from one simple search page.
          </p>

          <div className="um-explore-hero-summary" aria-label="Explore summary">
            <div>
              <span>Available now</span>
              <strong>{resultLabel}</strong>
            </div>
            <div>
              <span>Browsing</span>
              <strong>{selectedVertical.label}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{selectedCategoryLabel}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="um-explore-command" aria-label="Explore filters">
        <label htmlFor="um-explore-search">
          <span>Search listings</span>
          <input
            id="um-explore-search"
            type="search"
            placeholder="Search homes, cars, services, jobs..."
            defaultValue={searchQuery}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleFilterUpdate({ search: (event.target as HTMLInputElement).value });
              }
            }}
          />
        </label>

        <label htmlFor="um-explore-category">
          <span>Category</span>
          <select
            id="um-explore-category"
            value={selectedCategorySlug}
            onChange={(event) => handleFilterUpdate({ category: event.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {plainText(category.title, 'Category')}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="um-explore-sort">
          <span>Sort</span>
          <select
            id="um-explore-sort"
            value={sortBy}
            onChange={(event) => {
              if (isExploreSortOption(event.target.value)) {
                handleFilterUpdate({ sort: event.target.value });
              }
            }}
          >
            <option value="default">Featured first</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </select>
        </label>
      </section>

      <section className="um-explore-verticals" aria-label="Marketplace verticals">
        {marketplaceVerticals.map((vertical) => (
          <button
            type="button"
            className={`um-explore-vertical ${selectedVertical.key === vertical.key ? 'is-active' : ''}`}
            key={vertical.key}
            onClick={() => handleFilterUpdate({ vertical: vertical.key === 'all' ? '' : vertical.key, category: '' })}
          >
            <span>{vertical.label}</span>
            <strong>{verticalCounts[vertical.key] ?? 0}</strong>
            <em>{vertical.cue}</em>
          </button>
        ))}
      </section>

      {visibleCategories.length > 0 ? (
        <section className="um-explore-category-strip" aria-label="Featured categories">
          {visibleCategories.map((category) => (
            <button
              type="button"
              className={`um-explore-category-chip ${selectedCategorySlug === category.slug ? 'is-active' : ''}`}
              key={category.id}
              onClick={() => handleFilterUpdate({ category: selectedCategorySlug === category.slug ? '' : category.slug })}
            >
              {plainText(category.title, 'Category')}
            </button>
          ))}
        </section>
      ) : null}

      {listingError ? (
        <div className="um-explore-alert" role="status">
          <strong>Some results are unavailable.</strong>
          <span>{listingError} Showing the listings that are available right now.</span>
        </div>
      ) : null}

      <section className="um-explore-results" aria-labelledby="um-explore-results-title">
        <div className="um-explore-results-head">
          <div>
            <span className="um-section-kicker">Results</span>
            <h2 id="um-explore-results-title">
              {loading
                ? 'Loading marketplace listings'
                : `${filteredProducts.length} of ${resultTotal.toLocaleString()} listings shown`}
            </h2>
          </div>
          <a href={themeLink('/cart')} className="um-btn-secondary">View cart</a>
        </div>

        {loading ? (
          <div className="um-explore-grid" aria-label="Loading marketplace listings">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <article className="um-explore-card um-explore-card-loading" key={item}>
                <div className="um-explore-card-media" />
                <div className="um-explore-card-body">
                  <span />
                  <strong />
                  <p />
                  <em />
                </div>
              </article>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="um-explore-grid">
              {filteredProducts.map((listing) => {
                const vertical = marketplaceVerticals.find((item) => item.key === listing.vertical);

                return (
                  <a
                    href={themeLink(listing.href)}
                    className="um-explore-card"
                    key={listing.id}
                  >
                    <div className="um-explore-card-media">
                      <img src={listing.image} alt={listing.title} loading="lazy" /> 
                      <span>{vertical?.label ?? 'Listing'}</span>
                    </div>
                    <div className="um-explore-card-body">
                      <div className="um-explore-card-meta">
                        <span>{listing.category}</span>
                        <strong>{listing.price}</strong>
                      </div>
                      <h3>{listing.title}</h3>
                      <p>{listing.description}</p>
                      <div className="um-explore-card-footer">
                        <span>Verified listing</span>
                        <strong>{listing.actionLabel}</strong>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {canLoadMoreListings ? (
              <div className="um-explore-load-more">
                <button
                  type="button"
                  className="um-btn-primary"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                >
                  {loadingMore ? 'Loading listings...' : 'Load more listings'}
                </button>
                <span>
                  Showing {filteredProducts.length} of {resultTotal.toLocaleString()} available listings
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <div className="um-explore-empty" role="status">
            <span className="um-section-kicker">No matches</span>
            <h2>No listings match these filters.</h2>
            <p>Try another vertical, clear the category, or search a broader marketplace term.</p>
            <button
              type="button"
              className="um-btn-primary"
              onClick={() => handleFilterUpdate({ search: '', category: '', vertical: '', sort: '' })}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ExplorePage(props: ExplorePageProps) {
  return (
    <Suspense fallback={<main className="um-explore-page"><p>Loading marketplace...</p></main>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
