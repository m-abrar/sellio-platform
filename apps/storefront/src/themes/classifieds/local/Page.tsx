'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassifiedListing } from '@sellio/types';
import { LocalHeader, LocalCard, LocalFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome, resolveClassifiedsFailure } from '@/themes/classifieds/shared/catalog';
import { LOCAL_DEMO_CATEGORIES } from '@/themes/classifieds/shared/fallback-data';
import {
  buildLocalCategoriesFromListings,
  buildLocalCategoriesFromSidebar,
  mapClassifiedToLocalCard,
  type CategoryPill,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

export default function Page() {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const panelTitle = useThemeContent('panel.title', 'Nearby Classifieds');
  const alertsTitle = useThemeContent('alerts.title', 'Neighborhood Alerts');
  const alertItem1 = useThemeContent('alerts.item_1', 'Featured Offer: Like-New Trek Mountain Bike in Bikes & Outdoor is trending near Capitol Hill!');
  const alertItem2 = useThemeContent('alerts.item_2', "Lost Dog: Golden Retriever spotted near Cal Anderson Park. Collar says 'Max'. Contact Agent Sarah.");
  const emptyTitle = useThemeContent('empty.title', 'No Neighbors Listing Here');
  const emptyDescription = useThemeContent('empty.description', 'Expand your search radius in the header location tag to discover more items!');
  const expandRadiusLabel = useThemeContent('radius.expand_label', 'Expand Search Radius');

  const [localItems, setLocalItems] = useState<LocalCardItem[]>([]);
  const [categories, setCategories] = useState<CategoryPill[]>([
    { id: 'all', name: 'All Nearby', icon: '📍' },
  ]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Neighborhood alerts matching legacy Megaphone details
  const neighborhoodAlerts = [
    { id: 1, text: alertItem1 },
    { id: 2, text: alertItem2 }
  ];

  // Stateful interactive filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = standard, 1.2 = Zoomed In, 0.8 = Zoomed Out
  
  // Dynamic header radius picker
  const [radiusIndex, setRadiusIndex] = useState(1); // 0 = 2 mi, 1 = 5 mi, 2 = 10 mi
  const radiuses = ["2 mi", "5 mi", "10 mi"];
  const radiusMiles = [2, 5, 10];

  const getThemeLink = themeLink;

  useEffect(() => {
    let isMounted = true;

    async function loadClassifieds() {
      setLoading(true);
      const result = await fetchClassifiedsHome();

      if (!isMounted) return;

      if (result.ok && result.response.data && result.response.data.length > 0) {
        const listings = result.response.data as ClassifiedListing[];
        setLocalItems(listings.map(mapClassifiedToLocalCard));
        setUseFallback(false);
        setApiError(null);

        if (result.response.sidebar?.categories) {
          setCategories(buildLocalCategoriesFromSidebar(result.response.sidebar.categories));
        } else {
          setCategories(buildLocalCategoriesFromListings(listings));
        }
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedsFailure(allowDemo, 'local');

        if (resolution.mode === 'demo') {
          setLocalItems(resolution.listings.map(mapClassifiedToLocalCard));
          setCategories(LOCAL_DEMO_CATEGORIES);
          setUseFallback(true);
        } else {
          setLocalItems([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadClassifieds();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

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

  // Filter listings based on category pill and dynamic search radius mile limits
  const currentLimit = radiusMiles[radiusIndex];
  const filteredItems = localItems
    .filter((item) => {
      const matchesCategory = selectedCategory === 'all' || 
                              (selectedCategory === 'free' && item.numericPrice === 0) || 
                              item.category === selectedCategory;
      const matchesRadius = item.numericDistance <= currentLimit;
      return matchesCategory && matchesRadius;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') {
        return a.numericDistance - b.numericDistance; // Nearest First
      } else if (sortBy === 'new') {
        return a.id - b.id; // Newest order
      } else if (sortBy === 'price-asc') {
        return a.numericPrice - b.numericPrice; // Low to High
      }
      return 0;
    });

  // Active focused item details for map popup
  const activeFocusedItem = localItems.find(item => item.id === focusedItemId);

  return (
    <div className="classifieds-local-wrapper">
      {/* High-Fidelity Local Header */}
      <LocalHeader 
        locationName={`Seattle, WA (within ${radiuses[radiusIndex]})`}
        onLocationClick={handleLocationClick}
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        homeHref={themeLink('')}
      />

      {/* Main Split Window */}
      <div className="cl-main-layout">
        
        {/* Left Side Scrollable Listings Panel */}
        <div className="cl-listing-panel">
          
          {/* List panel sorting and title */}
          <div className="cl-panel-header">
            <h4 className="cl-panel-title">{panelTitle}</h4>
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

          {/* Categories Pill Horizontal Ribbon */}
          <div className="cl-pills-container">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                className={`cl-cat-btn ${selectedCategory === cat.id ? 'cl-active' : ''}`}
                onClick={() => { setSelectedCategory(cat.id); setFocusedItemId(null); }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {(useFallback || apiError) && apiError && (
            <div className="cl-alert-slot">
              <CatalogSyncAlert
                classPrefix="cl"
                variant={useFallback ? 'demo' : 'production'}
                error={apiError}
              />
            </div>
          )}

          {/* Neighborhood Alerts Container */}
          <div className="cl-alerts-container">
            <h5 style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--cl-primary-blue)', margin: '0.5rem 0 0', textTransform: 'uppercase' }}>{alertsTitle}</h5>
            {neighborhoodAlerts.map((alertItem) => (
              <div key={alertItem.id} className="cl-alert-card">
                <span className="cl-alert-icon">📣</span>
                <p className="cl-alert-body">{alertItem.text}</p>
              </div>
            ))}
          </div>

          <hr style={{ border: '0', borderTop: '1.5px dashed var(--cl-border)', margin: '0.5rem 0' }} />

          {/* Scrollable Listings Grid Cards */}
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
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📍</span>
                <h6 style={{ fontWeight: 800 }}>{emptyTitle}</h6>
                <p style={{ fontSize: '0.8rem' }}>{emptyDescription}</p>
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

          {/* Expand Radius Quick CTA */}
          {!loading && radiusIndex < radiuses.length - 1 && (
            <button 
              className="cl-btn-post" 
              style={{ backgroundColor: 'transparent', color: 'var(--cl-primary-blue)', border: '1.5px solid var(--cl-primary-blue)', boxShadow: 'none', justifyContent: 'center', marginTop: '1rem' }}
              onClick={handleLocationClick}
            >
              {expandRadiusLabel} (+{radiusMiles[radiusIndex + 1] - radiusMiles[radiusIndex]} mi)
            </button>
          )}

          {/* Simple Footer under panel */}
          <LocalFooter />

        </div>

        {/* Right Side Map-Centric Simulation */}
        <div className="cl-map-view">
          
          {/* Map grid streets layer */}
          <div 
            className="cl-map-grid-mesh"
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: focusedItemId && activeFocusedItem 
                ? `${activeFocusedItem.mapLeft}% ${activeFocusedItem.mapTop}%` 
                : 'center center'
            }}
          />

          {/* Map overlay controls box */}
          <div className="cl-map-controls">
            <button className="cl-ctrl-btn" onClick={handleZoomIn} title="Zoom In">+</button>
            <button className="cl-ctrl-btn" onClick={handleZoomOut} title="Zoom Out">-</button>
            <button className="cl-ctrl-btn" onClick={handleRecenter} title="Recenter">⌖</button>
          </div>

          {/* Map coordinate pins */}
          {!loading && filteredItems.map((item) => (
            <div 
              key={item.id}
              className={`cl-map-pin ${focusedItemId === item.id ? 'cl-focused' : ''}`}
              style={{ 
                top: `${item.mapTop}%`, 
                left: `${item.mapLeft}%` 
              }}
              onClick={() => setFocusedItemId(item.id)}
            >
              <div className="cl-pin-body">
                <span className="cl-pin-icon">{item.categoryIcon}</span>
              </div>
            </div>
          ))}

          {/* Floating details popup card */}
          {!loading && focusedItemId && activeFocusedItem && (
            <div 
              className="cl-map-popup"
              style={{ 
                top: `${activeFocusedItem.mapTop}%`, 
                left: `${activeFocusedItem.mapLeft}%`
              }}
            >
              <button className="cl-popup-close" onClick={() => setFocusedItemId(null)}>×</button>
              
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
                  className="cl-popup-btn cl-popup-btn-message"
                  onClick={() => router.push(getThemeLink(`/product/${activeFocusedItem.slug}`))}
                >
                  Message
                </button>
                <button 
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
