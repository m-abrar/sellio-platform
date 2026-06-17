'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import type { ClassifiedListing } from '@sellio/types';
import { LocalHeader, LocalCard, PinIcon } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome } from '@/themes/classifieds/shared/catalog';
import {
  buildLocalCategoriesFromListings,
  buildLocalCategoriesFromSidebar,
  deriveAreaLabelFromListings,
  mapClassifiedToLocalCard,
  recomputeLocalCardPositions,
  type CategoryPill,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

/** Haversine distance in miles between two lat/lng pairs. */
function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildMarkerIcon(L: any, item: LocalCardItem, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="cl-leaflet-pin${active ? ' cl-leaflet-pin--active' : ''}">${item.price}</div>`,
    iconSize: null,
    iconAnchor: [30, 14],
  });
}

type MarkerEntry = { marker: any; item: LocalCardItem };

async function placeMarkersOnMap(
  L: any,
  map: any,
  items: LocalCardItem[],
  idToMarkerRef: React.MutableRefObject<Map<number, MarkerEntry>>,
  clusterGroupRef: React.MutableRefObject<any>,
  onPinClickRef: React.MutableRefObject<(id: number) => void>,
  fitBounds = true,
) {
  // Remove existing cluster group; individual markers live inside it so no need to remove separately
  if (clusterGroupRef.current) {
    clusterGroupRef.current.remove();
    clusterGroupRef.current = null;
  }
  idToMarkerRef.current = new Map();

  await import('leaflet.markercluster');

  const cluster = (L as any).markerClusterGroup({
    maxClusterRadius: 60,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: (c: any) => {
      const count = c.getChildCount();
      return L.divIcon({
        className: '',
        html: `<div class="cl-cluster-pin">${count}</div>`,
        iconSize: null,
        iconAnchor: [20, 20],
      });
    },
  });

  const withCoords = items.filter((i) => i.lat != null && i.lng != null);

  withCoords.forEach((item) => {
    const marker = L.marker([item.lat!, item.lng!], { icon: buildMarkerIcon(L, item, false) })
      .on('click', () => onPinClickRef.current(item.id));
    marker.bindTooltip(item.title, {
      direction: 'top',
      offset: [0, -22],
      className: 'cl-map-tooltip',
    });
    cluster.addLayer(marker);
    idToMarkerRef.current.set(item.id, { marker, item });
  });

  cluster.addTo(map);
  clusterGroupRef.current = cluster;

  if (fitBounds && withCoords.length > 0) {
    if (withCoords.length === 1) {
      map.setView([withCoords[0].lat!, withCoords[0].lng!], 13);
    } else {
      map.fitBounds(cluster.getBounds(), { padding: [50, 50] });
    }
  }
}

export default function Page() {
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
  const [panelSearch, setPanelSearch] = useState('');
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null);

  const [radiusIndex, setRadiusIndex] = useState(1);
  const radiuses = ['2 mi', '5 mi', '10 mi'];
  const radiusMiles = [2, 5, 10];

  // Map mode toggle
  const [mapMode, setMapMode] = useState<'fit' | 'location'>('fit');
  const [locating, setLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const mapModeRef = useRef<'fit' | 'location'>('fit');
  useEffect(() => { mapModeRef.current = mapMode; }, [mapMode]);
  // Lets handleFitResults cancel an in-flight geo request
  const geoActiveRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; geoActiveRef.current = false; }, []);

  // Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterGroupRef = useRef<any>(null);
  const idToMarkerRef = useRef<Map<number, MarkerEntry>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const filteredItemsRef = useRef<LocalCardItem[]>([]);
  const onPinClickRef = useRef<(id: number) => void>(() => {});
  useEffect(() => { onPinClickRef.current = (id: number) => setFocusedItemId(id); });

  const getThemeLink = themeLink;

  useEffect(() => {
    let isMounted = true;
    async function loadClassifieds() {
      setLoading(true);
      const result = await fetchClassifiedsHome({ per_page: 24 });
      if (!isMounted) return;

      if (result.ok && result.response.data && result.response.data.length > 0) {
        const listings = result.response.data as ClassifiedListing[];
        setLocalItems(recomputeLocalCardPositions(listings.map(mapClassifiedToLocalCard)));
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
    return () => { isMounted = false; };
  }, []);

  const neighborhoodAlerts = useMemo(
    () => localItems.slice(0, 2).map((item) => ({
      id: item.id,
      text: `${item.categoryIcon} ${item.title} — ${item.price} in ${item.neighborhood}`,
    })),
    [localItems],
  );

  const handleLocationClick = () => {
    setRadiusIndex((prev) => (prev + 1) % radiuses.length);
    setFocusedItemId(null);
  };

  const currentLimit = radiusMiles[radiusIndex];

  const filteredItems = useMemo(
    () =>
      localItems
        .filter((item) => {
          const matchesCategory =
            selectedCategory === 'all' ||
            (selectedCategory === 'free' && item.numericPrice === 0) ||
            item.category === selectedCategory;
          const matchesRadius = item.numericDistance <= currentLimit;
          const needle = panelSearch.toLowerCase().trim();
          const matchesSearch =
            !needle ||
            item.title.toLowerCase().includes(needle) ||
            item.neighborhood.toLowerCase().includes(needle) ||
            item.category.toLowerCase().includes(needle);
          return matchesCategory && matchesRadius && matchesSearch;
        })
        .sort((a, b) => {
          // In location mode, sort by real Haversine distance from user's GPS
          if (mapMode === 'location' && userCoords) {
            const da = a.lat != null && a.lng != null
              ? haversineMiles(userCoords.lat, userCoords.lng, a.lat, a.lng) : Infinity;
            const db = b.lat != null && b.lng != null
              ? haversineMiles(userCoords.lat, userCoords.lng, b.lat, b.lng) : Infinity;
            return da - db;
          }
          if (sortBy === 'distance') return a.numericDistance - b.numericDistance;
          if (sortBy === 'new') return b.id - a.id;
          if (sortBy === 'price-asc') return a.numericPrice - b.numericPrice;
          return 0;
        }),
    [localItems, selectedCategory, currentLimit, panelSearch, sortBy, mapMode, userCoords],
  );

  useEffect(() => { filteredItemsRef.current = filteredItems; }, [filteredItems]);

  const activeFocusedItem = localItems.find((item) => item.id === focusedItemId);

  // Map mode handlers
  const handleFitResults = () => {
    geoActiveRef.current = false; // cancel any in-flight geo request
    setLocating(false);
    setMapMode('fit');
    const map = mapRef.current;
    const cluster = clusterGroupRef.current;
    if (!map || !cluster) return;
    map.fitBounds(cluster.getBounds(), { padding: [50, 50] });
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    geoActiveRef.current = true;
    setLocating(true);
    // mapMode stays 'fit' until GPS actually confirms — avoids premature active state

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!geoActiveRef.current || !mountedRef.current) return; // cancelled or unmounted
        geoActiveRef.current = false;
        const { latitude, longitude } = pos.coords;
        setLocating(false);
        setMapMode('location'); // only set active AFTER GPS confirms
        setUserCoords({ lat: latitude, lng: longitude }); // triggers real-distance sort in sidebar
        if (!mapRef.current) return;
        import('leaflet').then(({ default: L }) => {
          const map = mapRef.current;
          if (!map) return;
          if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
          const icon = L.divIcon({
            className: '',
            html: '<div class="cl-user-location-dot"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          userMarkerRef.current = L.marker([latitude, longitude], { icon, zIndexOffset: 1000 })
            .addTo(map)
            .bindTooltip('You are here', { direction: 'top', className: 'cl-map-tooltip' });

          // Fit bounds to show user location AND all listing pins together.
          // This works correctly even when the user is far from the demo data
          // (e.g., visitor in Germany, listings in USA) — they see both on the map.
          const bounds = L.latLngBounds([[latitude, longitude]]);
          idToMarkerRef.current.forEach(({ item }) => {
            if (item.lat != null && item.lng != null) bounds.extend([item.lat, item.lng]);
          });
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [60, 60], animate: true });
          } else {
            map.setView([latitude, longitude], 14, { animate: true });
          }
        });
      },
      () => {
        if (!mountedRef.current) return;
        geoActiveRef.current = false;
        setLocating(false);
        // mode stays unchanged — no re-fit, no flicker
      },
      { timeout: 8000, maximumAge: 60000 },
    );
  };

  // Initialise Leaflet — zoom control moved to topright to free up top-left for the toggle
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const el = mapContainerRef.current;
    let cancelled = false;

    import('leaflet').then(async ({ default: L }) => {
      if (cancelled || mapRef.current) return;
      const map = L.map(el, { zoomControl: false, center: [20, 0], zoom: 2 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: 'topright' }).addTo(map);
      mapRef.current = map;
      await placeMarkersOnMap(L, map, filteredItemsRef.current, idToMarkerRef, clusterGroupRef, onPinClickRef, true);
    });

    return () => {
      cancelled = true;
      if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
      if (clusterGroupRef.current) { clusterGroupRef.current.remove(); clusterGroupRef.current = null; }
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-place markers when filtered set changes; only re-fit if in 'fit' mode
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(async ({ default: L }) => {
      if (mapRef.current) {
        await placeMarkersOnMap(L, mapRef.current, filteredItems, idToMarkerRef, clusterGroupRef, onPinClickRef, mapModeRef.current === 'fit');
      }
    });
  }, [filteredItems]);

  // Highlight active marker and pan to it
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(({ default: L }) => {
      idToMarkerRef.current.forEach(({ marker, item }, id) => {
        marker.setIcon(buildMarkerIcon(L, item, id === focusedItemId));
      });
      if (focusedItemId != null) {
        const entry = idToMarkerRef.current.get(focusedItemId);
        if (entry?.item.lat != null && entry?.item.lng != null) {
          mapRef.current?.panTo([entry.item.lat, entry.item.lng], { animate: true, duration: 0.4 });
        }
      }
    });
  }, [focusedItemId]);

  return (
    <div className="classifieds-local-wrapper">
      <LocalHeader
        locationName={`${areaLabel} (within ${radiuses[radiusIndex]})`}
        onLocationClick={handleLocationClick}
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        homeHref={themeLink('/')}
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
              <option value="distance">Distance: Closest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="new">Newly Listed</option>
            </select>
          </div>

          <div className="cl-panel-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="search"
              className="cl-panel-search-input"
              placeholder="Search listings, neighborhoods..."
              value={panelSearch}
              onChange={(e) => { setPanelSearch(e.target.value); setFocusedItemId(null); }}
              aria-label="Search nearby listings"
            />
            {panelSearch && (
              <button
                type="button"
                className="cl-panel-search-clear"
                onClick={() => setPanelSearch('')}
                aria-label="Clear search"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          <div className="cl-pills-container">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cl-cat-btn ${selectedCategory === cat.id ? 'cl-active' : ''}`}
                onClick={() => { setSelectedCategory(cat.id); setFocusedItemId(null); }}
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
                  <span className="cl-alert-icon" style={{ display: 'flex', alignItems: 'center', color: 'var(--cl-primary-green)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </span>
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
                <span className="cl-empty-icon" style={{ color: 'var(--cl-primary-blue)', display: 'flex', justifyContent: 'center' }}>
                  <PinIcon size={40} />
                </span>
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
                  sellerAvatar={item.sellerAvatar}
                  conditionLabel={item.conditionLabel}
                  isFocused={focusedItemId === item.id}
                  onClick={() => setFocusedItemId(item.id)}
                  onMessageClick={() => { location.href = getThemeLink(`/product/${item.slug}`); }}
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

          <div style={{ height: '1.5rem', flexShrink: 0 }} aria-hidden="true" />
        </div>

        <div className="cl-map-view">
          <div ref={mapContainerRef} className="cl-leaflet-container" aria-label="Classifieds map" />

          {/* Map view mode toggle — top-left, above OSM tiles */}
          {!loading && (
            <div className="cl-map-mode-toggle" role="group" aria-label="Map view mode">
              <button
                type="button"
                className={`cl-mode-btn${mapMode === 'fit' ? ' cl-mode-btn--active' : ''}`}
                onClick={handleFitResults}
                title="Zoom to fit all visible results"
              >
                {/* Expand/fit icon */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
                Fit Results
              </button>
              <button
                type="button"
                className={`cl-mode-btn${mapMode === 'location' ? ' cl-mode-btn--active' : ''}`}
                onClick={handleMyLocation}
                title="Center map on your current location"
                disabled={locating}
              >
                {locating ? (
                  <span className="cl-mode-spinner" aria-hidden="true" />
                ) : (
                  /* Navigation/location dot icon */
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
                  </svg>
                )}
                {locating ? 'Locating…' : 'My Location'}
              </button>
            </div>
          )}

          {loading && (
            <div className="cl-map-loading" aria-live="polite" aria-label="Loading map">
              <div className="cl-map-spinner" aria-hidden="true" />
            </div>
          )}

          {!loading && (
            <div className="cl-map-info-chip">
              <PinIcon size={12} />
              {filteredItems.length} listing{filteredItems.length !== 1 ? 's' : ''} · {areaLabel}
            </div>
          )}

          {!loading && focusedItemId != null && activeFocusedItem && (
            <div className="cl-map-popup">
              <button type="button" className="cl-popup-close" onClick={() => setFocusedItemId(null)}>
                ×
              </button>
              <h6 className="cl-popup-title">{activeFocusedItem.title}</h6>
              <div className="cl-popup-img-wrap">
                <img src={activeFocusedItem.image} className="cl-popup-img" alt={activeFocusedItem.title} />
              </div>
              <div className="cl-popup-price">{activeFocusedItem.price}</div>
              <div className="cl-popup-poster">
                {activeFocusedItem.sellerAvatar ? (
                  <img src={activeFocusedItem.sellerAvatar} alt={activeFocusedItem.sellerInitials} className="cl-popup-poster-avatar" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="cl-popup-poster-avatar">{activeFocusedItem.sellerInitials}</div>
                )}
                <span>Posted by {activeFocusedItem.sellerName}</span>
              </div>
              <div className="cl-popup-actions">
                <a className="cl-popup-btn cl-popup-btn-message" href={getThemeLink(`/product/${activeFocusedItem.slug}`)} style={{ textDecoration: 'none' }}>
                  Message
                </a>
                <a className="cl-popup-btn cl-popup-btn-details" href={getThemeLink(`/product/${activeFocusedItem.slug}`)} style={{ textDecoration: 'none' }}>
                  View Details
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
