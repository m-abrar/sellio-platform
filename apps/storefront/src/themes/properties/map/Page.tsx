'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { MapListCard, MapCanvas, type MapMarker } from './components';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

// NYC demo coordinates spread across Manhattan for when a property has no real location data
const NYC_FALLBACK_COORDS: [number, number][] = [
  [40.758, -73.9855],
  [40.7282, -73.9942],
  [40.7614, -73.9776],
  [40.7489, -73.968],
  [40.7193, -74.0001],
  [40.7831, -73.9712],
  [40.745, -73.999],
  [40.767, -73.957],
];

const PRICE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: '<$1M', value: 'under1m' },
  { label: '$1M–$3M', value: '1to3m' },
  { label: '$3M+', value: 'over3m' },
] as const;

const TYPE_FILTERS = [
  { label: 'All Types', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
] as const;

type PriceFilter = typeof PRICE_FILTERS[number]['value'];
type TypeFilter = typeof TYPE_FILTERS[number]['value'];

const fallbackImages = [
  '/themes/properties/map/1.webp',
  '/themes/properties/map/2.webp',
  '/themes/properties/map/3.webp',
  '/themes/properties/map/4.webp',
  '/themes/properties/map/5.webp',
  '/themes/properties/map/6.webp',
];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function mapPropertyToListing(property: Property, index: number) {
  const sqft = property.specs?.area_formatted?.replace(/[^\d,]/g, '')
    || String(property.area_sq_ft || property.specs?.area_sq_ft || '');

  const rawLat = Number(property.location?.latitude);
  const rawLng = Number(property.location?.longitude);
  const [fbLat, fbLng] = NYC_FALLBACK_COORDS[index % NYC_FALLBACK_COORDS.length];

  return {
    price: getPropertyPrice(property),
    address: property.location?.title
      || property.address
      || [property.city, property.state, property.country].filter(Boolean).join(', ')
      || 'Location not specified',
    beds: property.specs?.bedrooms ?? property.number_of_bedrooms ?? 1,
    baths: property.specs?.bathrooms ?? property.number_of_bathrooms ?? 1,
    sqft: sqft || 'N/A',
    image: property.featured_image || property.thumbnail_image || fallbackImages[index % fallbackImages.length],
    slug: property.slug,
    lat: Number.isFinite(rawLat) && rawLat !== 0 ? rawLat : fbLat,
    lng: Number.isFinite(rawLng) && rawLng !== 0 ? rawLng : fbLng,
    listingType: (property as any).listing_type || '',
    numericPrice: Number(property.base_price) || 0,
  };
}

export default function Page() {
  const themeLink = usePropertyThemeLink();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const listRef = useRef<HTMLDivElement>(null);

  // Hoist all content reads
  const sidebarTitle = useThemeContent('sidebar.title', 'Map Search');
  const unitsSuffix = useThemeContent('sidebar.units_suffix', 'listings');
  const offlineKicker = useThemeContent('offline.kicker', 'Connection error');
  const offlineTitle = useThemeContent('offline.title', 'Properties could not be loaded.');
  const emptyKicker = useThemeContent('empty.kicker', 'No listings yet');
  const emptyTitle = useThemeContent('empty.title', 'No properties are published yet.');
  const emptyDesc = useThemeContent('empty.description', 'Add property listings in the admin panel and they will appear here automatically.');
  const endLabel = useThemeContent('sidebar.end_label', 'End of results');

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      try {
        const response = await api.getProperties({ per_page: 20 });
        if (!isMounted) return;
        setProperties(Array.isArray(response.data) ? response.data : []);
        setPropertyError(null);
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load properties map listings:', error);
        setPropertyError(error instanceof Error ? error.message : 'Properties are temporarily unavailable.');
      } finally {
        if (isMounted) setLoadingProperties(false);
      }
    }

    loadProperties();
    return () => { isMounted = false; };
  }, []);

  const allListings = useMemo(
    () => properties.map((p, i) => mapPropertyToListing(p, i)),
    [properties],
  );

  const filteredListings = useMemo(() => allListings.filter((item) => {
    if (priceFilter === 'under1m' && item.numericPrice >= 1_000_000) return false;
    if (priceFilter === '1to3m' && (item.numericPrice < 1_000_000 || item.numericPrice > 3_000_000)) return false;
    if (priceFilter === 'over3m' && item.numericPrice <= 3_000_000) return false;
    if (typeFilter === 'buy' && !['buy', 'sale', 'for_sale'].includes(item.listingType)) return false;
    if (typeFilter === 'rent' && !['rent', 'for_rent', 'rental'].includes(item.listingType)) return false;
    return true;
  }), [allListings, priceFilter, typeFilter]);

  const mapMarkers: MapMarker[] = useMemo(
    () => filteredListings.map((l) => ({
      lat: l.lat,
      lng: l.lng,
      price: l.price,
      address: l.address,
      slug: l.slug,
    })),
    [filteredListings],
  );

  function handleMarkerClick(slug: string) {
    setSelectedSlug(slug);
    const card = listRef.current?.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const hasActiveFilter = priceFilter !== 'all' || typeFilter !== 'all';

  return (
    <>
      <aside className="pm-sidebar">
        <div className="pm-sidebar-header">
          <div className="pm-sidebar-title-row">
            <h2 className="pm-sidebar-title">{sidebarTitle}</h2>
            {!loadingProperties && (
              <span className="pm-count-badge">
                {filteredListings.length} {unitsSuffix}
              </span>
            )}
          </div>

          <div className="pm-filter-section">
            <div className="pm-filter-row">
              {PRICE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`pm-filter-chip${priceFilter === f.value ? ' pm-filter-chip-active' : ''}`}
                  onClick={() => setPriceFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="pm-filter-row">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`pm-filter-chip${typeFilter === f.value ? ' pm-filter-chip-active' : ''}`}
                  onClick={() => setTypeFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
              {hasActiveFilter && (
                <button
                  type="button"
                  className="pm-filter-chip pm-filter-clear"
                  onClick={() => { setPriceFilter('all'); setTypeFilter('all'); }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pm-results-list" ref={listRef}>
          {loadingProperties ? (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div className="pm-list-card prop-listing-skeleton" key={item}>
                <div className="prop-skeleton-line prop-skeleton-line-title" />
                <div className="prop-skeleton-line" />
                <div className="prop-skeleton-line prop-skeleton-line-short" />
              </div>
            ))
          ) : propertyError ? (
            <div className="prop-listing-state pm-listing-state">
              <div className="prop-listing-kicker">{offlineKicker}</div>
              <h3>{offlineTitle}</h3>
              <p>Check your API connection and make sure properties are published.</p>
            </div>
          ) : filteredListings.length === 0 && allListings.length > 0 ? (
            <div className="pm-empty-state">
              <div className="pm-empty-icon">◎</div>
              <div className="pm-empty-kicker">No matches</div>
              <p className="pm-empty-message">No properties match your current filters.</p>
              <button
                type="button"
                className="pm-empty-action"
                onClick={() => { setPriceFilter('all'); setTypeFilter('all'); }}
              >
                Clear filters
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="pm-empty-state">
              <div className="pm-empty-icon">◎</div>
              <div className="pm-empty-kicker">{emptyKicker}</div>
              <p className="pm-empty-message">{emptyTitle}</p>
              <p className="pm-empty-desc">{emptyDesc}</p>
            </div>
          ) : (
            filteredListings.map((item) => (
              <a
                key={item.slug}
                className="pm-list-link"
                href={themeLink(`/product/${item.slug}`)}
                data-slug={item.slug}
              >
                <MapListCard
                  price={item.price}
                  address={item.address}
                  beds={item.beds}
                  baths={item.baths}
                  sqft={item.sqft}
                  image={item.image}
                  isActive={selectedSlug === item.slug}
                />
              </a>
            ))
          )}
          {!loadingProperties && !propertyError && filteredListings.length > 0 && (
            <div className="pm-end-label">
              <div className="pm-hud-label">{endLabel}</div>
            </div>
          )}
        </div>
      </aside>

      <main className="pm-map-canvas">
        <MapCanvas
          markers={mapMarkers}
          selectedSlug={selectedSlug}
          onMarkerClick={handleMarkerClick}
        />
      </main>
    </>
  );
}
