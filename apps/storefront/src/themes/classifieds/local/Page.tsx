'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassifiedListing } from '@sellio/types';
import { LocalHeader, LocalCard, LocalFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome } from '@/themes/classifieds/shared/catalog';
import {
  buildLocalCategoriesFromListings,
  buildLocalCategoriesFromSidebar,
  deriveAreaLabelFromListings,
  mapClassifiedToLocalCard,
  type CategoryPill,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

export default function Page() {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const panelTitle = useThemeContent('panel.title', 'Nearby Classifieds');
  const alertsTitle = useThemeContent('alerts.title', 'Neighborhood Highlights');
  const emptyTitle = useThemeContent('empty.title', 'No Neighbors Listing Here');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Expand your search radius or browse all listings in explore.',
  );
  const expandRadiusLabel = useThemeContent('radius.expand_label', 'Expand Search Radius');

  const [localItems, setLocalItems] = useState<LocalCardItem[]>([]);
  const [categories, setCategories] = useState<CategoryPill[]>([
    { id: 'all', name: 'All Nearby', icon: '📍' },
  ]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [areaLabel, setAreaLabel] = useState('Your area');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [radiusIndex, setRadiusIndex] = useState(1);
  const radiuses = ['2 mi', '5 mi', '10 mi'];
  const radiusMiles = [2, 5, 10];

  const getThemeLink = themeLink;

  useEffect(() => {
    let isMounted = true;

    async function loadClassifieds() {
      setLoading(true);
      const result = await fetchClassifiedsHome({ per_page: 24 });

      if (!isMounted) return;

      if (result.ok && result.response.data && result.response.data.length > 0) {
        const listings = result.response.data as ClassifiedListing[];
        setLocalItems(listings.map(mapClassifiedToLocalCard));
        setInventoryTotal(result.response.meta?.total ?? listings.length);
        setAreaLabel(deriveAreaLabelFromListings(listings));
        setApiError(null);

        if (result.response.sidebar?.categories) {
          setCategories(buildLocalCategoriesFromSidebar(result.response.sidebar.categories));
        } else {
          setCategories(buildLocalCategoriesFromListings(listings));
        }
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        setLocalItems([]);
        setInventoryTotal(null);
        setAreaLabel('Your area');
      }

      setLoading(false);
    }

    loadClassifieds();

    return () => {
      isMounted = false;
    };
  }, []);

  const neighborhoodAlerts = useMemo(() => {
    return localItems.slice(0, 2).map((item) => ({
      id: item.id,
      text: `${item.categoryIcon} ${item.title} — ${item.price} in ${item.neighborhood}`,
    }));
  }, [localItems]);

  const handleLocationClick = () => {
    setRadiusIndex((prev) => (prev + 1) % radiuses.length);
    setFocusedItemId(null);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.7));
  const handleRecenter = () => {
    setZoomLevel(1);
    setFocusedItemId(null);
  };

  const currentLimit = radiusMiles[radiusIndex];
  const filteredItems = localItems
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'free' && item.numericPrice === 0) ||
        item.category === selectedCategory;
      const matchesRadius = item.numericDistance <= currentLimit;
      return matchesCategory && matchesRadius;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') {
        return a.numericDistance - b.numericDistance;
      }
      if (sortBy === 'new') {
        return b.id - a.id;
      }
      if (sortBy === 'price-asc') {
        return a.numericPrice - b.numericPrice;
      }
      return 0;
    });

  const activeFocusedItem = localItems.find((item) => item.id === focusedItemId);

  return (
    <div className="classifieds-local-wrapper">
      <LocalHeader
        locationName={`${areaLabel} (within ${radiuses[radiusIndex]})`}
        onLocationClick={handleLocationClick}
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        homeHref={themeLink('')}
      />

      <div className="cl-main-layout">
        <div className="cl-listing-panel">
          <div className="cl-panel-header">
            <div>
              <h4 className="cl-panel-title">{panelTitle}</h4>
              {!loading && inventoryTotal != null && (
                <p className="cl-panel-meta">
                  {filteredItems.length} shown
                  {inventoryTotal > filteredItems.length ? ` · ${inventoryTotal} total nearby` : ''}
                </p>
              )}
            </div>
            <select
              className="cl-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="distance">📍 Distance: Closest</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="new">🕒 Newly Listed</option>
            </select>
          </div>

          <div className="cl-pills-container">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cl-cat-btn ${selectedCategory === cat.id ? 'cl-active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setFocusedItemId(null);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {apiError && (
            <div className="cl-alert-slot">
              <CatalogSyncAlert classPrefix="cl" variant="production" error={apiError} />
            </div>
          )}

          {neighborhoodAlerts.length > 0 && (
            <div className="cl-alerts-container">
              <h5 className="cl-alerts-heading">{alertsTitle}</h5>
              {neighborhoodAlerts.map((alertItem) => (
                <div key={alertItem.id} className="cl-alert-card">
                  <span className="cl-alert-icon">📣</span>
                  <p className="cl-alert-body">{alertItem.text}</p>
                </div>
              ))}
            </div>
          )}

          <hr className="cl-panel-divider" />

          <div className="cl-listing-list">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="cl-shimmer-card">
                  <div className="cl-shimmer-img" />
                  <div className="cl-shimmer-body">
                    <div className="cl-shimmer-title" />
                    <div className="cl-shimmer-price" />
                    <div className="cl-shimmer-geo" />
                  </div>
                </div>
              ))
            ) : filteredItems.length === 0 ? (
              <div className="cl-empty-state">
                <span className="cl-empty-icon">📍</span>
                <h6>{emptyTitle}</h6>
                <p>{emptyDescription}</p>
                <a href={themeLink('/explore')} className="cl-btn-post cl-empty-cta">
                  Browse all listings
                </a>
              </div>
            ) : (
              filteredItems.map((item) => (
                <LocalCard
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  distance={item.distance}
                  neighborhood={item.neighborhood}
                  image={item.image}
                  sellerInitials={item.sellerInitials}
                  conditionLabel={item.conditionLabel}
                  isFocused={focusedItemId === item.id}
                  onClick={() => setFocusedItemId(item.id)}
                  onMessageClick={() => router.push(getThemeLink(`/product/${item.slug}`))}
                />
              ))
            )}
          </div>

          {!loading && radiusIndex < radiuses.length - 1 && (
            <button
              type="button"
              className="cl-btn-post cl-expand-radius-btn"
              onClick={handleLocationClick}
            >
              {expandRadiusLabel} (+{radiusMiles[radiusIndex + 1] - radiusMiles[radiusIndex]} mi)
            </button>
          )}

          <LocalFooter />
        </div>

        <div className="cl-map-view">
          <div
            className="cl-map-grid-mesh"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin:
                focusedItemId && activeFocusedItem
                  ? `${activeFocusedItem.mapLeft}% ${activeFocusedItem.mapTop}%`
                  : 'center center',
            }}
          />

          <div className="cl-map-controls">
            <button type="button" className="cl-ctrl-btn" onClick={handleZoomIn} title="Zoom In">
              +
            </button>
            <button type="button" className="cl-ctrl-btn" onClick={handleZoomOut} title="Zoom Out">
              -
            </button>
            <button type="button" className="cl-ctrl-btn" onClick={handleRecenter} title="Recenter">
              ⌖
            </button>
          </div>

          {!loading &&
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`cl-map-pin ${focusedItemId === item.id ? 'cl-focused' : ''}`}
                style={{
                  top: `${item.mapTop}%`,
                  left: `${item.mapLeft}%`,
                }}
                onClick={() => setFocusedItemId(item.id)}
              >
                <div className="cl-pin-body">
                  <span className="cl-pin-icon">{item.categoryIcon}</span>
                </div>
              </div>
            ))}

          {!loading && focusedItemId && activeFocusedItem && (
            <div
              className="cl-map-popup"
              style={{
                top: `${activeFocusedItem.mapTop}%`,
                left: `${activeFocusedItem.mapLeft}%`,
              }}
            >
              <button type="button" className="cl-popup-close" onClick={() => setFocusedItemId(null)}>
                ×
              </button>

              <h6 className="cl-popup-title">{activeFocusedItem.title}</h6>

              <div className="cl-popup-img-wrap">
                <img src={activeFocusedItem.image} className="cl-popup-img" alt={activeFocusedItem.title} />
              </div>

              <div className="cl-popup-price">{activeFocusedItem.price}</div>

              <div className="cl-popup-poster">
                <div className="cl-popup-poster-avatar">{activeFocusedItem.sellerInitials}</div>
                <span>Posted by {activeFocusedItem.sellerName}</span>
              </div>

              <div className="cl-popup-actions">
                <button
                  type="button"
                  className="cl-popup-btn cl-popup-btn-message"
                  onClick={() => router.push(getThemeLink(`/product/${activeFocusedItem.slug}`))}
                >
                  Message
                </button>
                <button
                  type="button"
                  className="cl-popup-btn cl-popup-btn-details"
                  onClick={() => router.push(getThemeLink(`/product/${activeFocusedItem.slug}`))}
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
