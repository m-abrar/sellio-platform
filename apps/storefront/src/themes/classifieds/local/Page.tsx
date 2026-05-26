'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing, Category } from '@sellio/types';
import { LocalHeader, LocalCard, LocalFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface LocalItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  distance: string;
  numericDistance: number;
  neighborhood: string;
  image: string;
  sellerInitials: string;
  sellerName: string;
  category: string;
  categoryIcon: string;
  conditionLabel: string;
  mapTop: number;   // Simulated absolute coordinates on the map (%)
  mapLeft: number;  // Simulated absolute coordinates on the map (%)
  slug: string;
}

// Fallback high-fidelity Classifieds Local database opportunities matching ClassifiedListing schema perfectly
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Like-New Trek Mountain Bike",
    slug: "like-new-trek-mountain-bike",
    description: "Trek mountain bike in pristine state. Multi-gear shifts, standard suspension, ready for mountain routes.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "bikes", brand: "John Smith" },
    media: { main_photo: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cl-badge-excellent", quantity: 1, dimensions: "32,38" },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 2,
    title: "Wooden Dining Table + 4 Chairs",
    slug: "wooden-dining-table-4-chairs",
    description: "Solid oak dining table set with 4 matching comfortable chairs. Minor wear on tabletop.",
    pricing: {
      base_price: 150,
      sale_price: 150,
      is_on_sale: false,
      discount: null,
      formatted: "$150",
      formatted_short: "$150",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "First Hill", state: "WA" },
    taxonomy: { category: "home", brand: "Marie Laurent" },
    media: { main_photo: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Good", badge_class: "cl-badge-good", quantity: 1, dimensions: "55,64" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 3,
    title: "Box of Baby Clothes (0-6 months)",
    slug: "box-of-baby-clothes-0-6-months",
    description: "Clean assortment of unisex baby clothes. Gown, onesies, socks, and hats included.",
    pricing: {
      base_price: 0,
      sale_price: 0,
      is_on_sale: false,
      discount: null,
      formatted: "Free",
      formatted_short: "Free",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "kids", brand: "Alice Baker" },
    media: { main_photo: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Like New", badge_class: "cl-badge-likenew", quantity: 1, dimensions: "45,22" },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 4,
    title: "Monstera Deliciosa Plant (Large)",
    slug: "monstera-deliciosa-plant-large",
    description: "Healthy indoor potted plant. 4 feet tall with wide split leaves, extremely easy to maintain.",
    pricing: {
      base_price: 40,
      sale_price: 40,
      is_on_sale: false,
      discount: null,
      formatted: "$40",
      formatted_short: "$40",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Queen Anne", state: "WA" },
    taxonomy: { category: "home", brand: "Ryan Taylor" },
    media: { main_photo: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Healthy", badge_class: "cl-badge-healthy", quantity: 1, dimensions: "18,58" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 5,
    title: "IKEA Kallax Shelf Unit (White)",
    slug: "ikea-kallax-shelf-unit-white",
    description: "Standard Kallax organizer with 4 cube compartments. Clean condition, slight cosmetic scuffs.",
    pricing: {
      base_price: 45,
      sale_price: 45,
      is_on_sale: false,
      discount: null,
      formatted: "$45",
      formatted_short: "$45",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Belltown", state: "WA" },
    taxonomy: { category: "home", brand: "Karen Davis" },
    media: { main_photo: "https://images.unsplash.com/photo-1595514535115-d52fdfbc3075?q=80&w=400" },
    item_specs: { condition_rating: 3, condition_label: "Fair", badge_class: "cl-badge-fair", quantity: 1, dimensions: "72,46" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 6,
    title: "Neighborhood Moving Sale - Sunday",
    slug: "neighborhood-moving-sale-sunday",
    description: "Huge selection of household tools, garage elements, vintage records, and winter jackets.",
    pricing: {
      base_price: 10,
      sale_price: 10,
      is_on_sale: false,
      discount: null,
      formatted: "Varies",
      formatted_short: "Varies",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "garage", brand: "Eric Wright" },
    media: { main_photo: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Multi-item", badge_class: "cl-badge-multi", quantity: 1, dimensions: "28,74" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 7,
    title: "Dog Crate - Medium Size Wire",
    slug: "dog-crate-medium-size-wire",
    description: "Folds flat for storage. Security locks and bottom plastic tray are completely intact.",
    pricing: {
      base_price: 25,
      sale_price: 25,
      is_on_sale: false,
      discount: null,
      formatted: "$25",
      formatted_short: "$25",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Fremont", state: "WA" },
    taxonomy: { category: "pets", brand: "Peter Parker" },
    media: { main_photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Good", badge_class: "cl-badge-good", quantity: 1, dimensions: "12,15" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 8,
    title: "Baby Jogger Stroller (Red)",
    slug: "baby-jogger-stroller-red",
    description: "Highly robust running stroller. Features three durable shock-absorbent all-terrain tires.",
    pricing: {
      base_price: 95,
      sale_price: 95,
      is_on_sale: false,
      discount: null,
      formatted: "$95",
      formatted_short: "$95",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Ballard", state: "WA" },
    taxonomy: { category: "kids", brand: "Mary Jane" },
    media: { main_photo: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cl-badge-excellent", quantity: 1, dimensions: "82,84" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  }
];

// Helper translator to adapt API models to LocalItem parameters statefully
const parseMapCoords = (dimensions: unknown): string[] => {
  if (typeof dimensions === 'string') {
    return dimensions.split(',').map((part) => part.trim()).filter(Boolean);
  }
  return [];
};

const translateListing = (item: ClassifiedListing): LocalItem => {
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Dynamically assign coordinates deterministically based on listing ID if not present in dimensions
  const coords = parseMapCoords(item.item_specs?.dimensions);
  const mapTop = coords.length === 2 ? parseInt(coords[0]) : (20 + (item.id * 7) % 70);
  const mapLeft = coords.length === 2 ? parseInt(coords[1]) : (15 + (item.id * 9) % 75);
  
  // Calculate dynamic radius distance based on ID sequence for filtering
  const numericDistance = item.id * 0.45;
  
  const category = item.taxonomy?.category || "home";
  let categoryIcon = "📍";
  if (category === 'bikes') categoryIcon = '🚲';
  else if (category === 'home') categoryIcon = '🏡';
  else if (category === 'kids') categoryIcon = '🧸';
  else if (category === 'pets') categoryIcon = '🐾';
  else if (category === 'garage') categoryIcon = '🏷️';
  
  const seller = item.taxonomy?.brand || "Neighbor";
  const initials = seller.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() || "N";
  
  const isFree = item.pricing?.sale_price === 0 || item.pricing?.base_price === 0;
  const priceLabel = isFree ? "Free" : (item.pricing?.formatted || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`);
  
  return {
    id: item.id,
    title: item.title,
    price: priceLabel,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    distance: numericDistance.toFixed(1),
    numericDistance: numericDistance,
    neighborhood: item.location?.city || "Capitol Hill",
    image: item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400",
    sellerInitials: initials,
    sellerName: seller,
    category: category,
    categoryIcon: categoryIcon,
    conditionLabel: item.item_specs?.condition_label || "Good",
    mapTop: mapTop,
    mapLeft: mapLeft,
    slug: generatedSlug
  };
};

export default function Page() {
  const router = useRouter();
  const panelTitle = useThemeContent('panel.title', 'Nearby Classifieds');
  const diagnosticsTitle = useThemeContent('diagnostics.title', '🛰️ VETTED NETWORK DIAGNOSTICS & RESILIENCE PANEL');
  const diagnosticsDescription = useThemeContent('diagnostics.description', 'Status: Local Database Node Offline. Activating Vetted neighborhood backup feed.');
  const alertsTitle = useThemeContent('alerts.title', 'Neighborhood Alerts');
  const alertItem1 = useThemeContent('alerts.item_1', 'Featured Offer: Like-New Trek Mountain Bike in Bikes & Outdoor is trending near Capitol Hill!');
  const alertItem2 = useThemeContent('alerts.item_2', "Lost Dog: Golden Retriever spotted near Cal Anderson Park. Collar says 'Max'. Contact Agent Sarah.");
  const emptyTitle = useThemeContent('empty.title', 'No Neighbors Listing Here');
  const emptyDescription = useThemeContent('empty.description', 'Expand your search radius in the header location tag to discover more items!');
  const expandRadiusLabel = useThemeContent('radius.expand_label', 'Expand Search Radius');

  // Stateful dynamic catalog mappings
  const [localItems, setLocalItems] = useState<LocalItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([
    { id: "all", name: "All Nearby", icon: "📍" }
  ]);

  // Loading & network resilience state tracking
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

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

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_local${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    const fetchLocalClassifieds = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifieds();
        if (response && response.data && response.data.length > 0) {
          const mapped = response.data.map(translateListing);
          setLocalItems(mapped);
          setUseFallback(false);

          // Extract category ribbon from API categories metadata if populated
          if (response.sidebar?.categories) {
            const mappedCats = response.sidebar.categories.map((cat: Category) => ({
              id: cat.slug || String(cat.id),
              name: cat.title,
              icon: cat.slug === 'bikes' ? '🚲' : (cat.slug === 'home' ? '🏡' : (cat.slug === 'kids' ? '🧸' : (cat.slug === 'pets' ? '🐾' : '🏷️')))
            }));
            const deduplicated = [{ id: "all", name: "All Nearby", icon: "📍" }];
            mappedCats.forEach((c) => {
              if (!deduplicated.some(d => d.id === c.id)) {
                deduplicated.push(c);
              }
            });
            setCategories(deduplicated);
          } else {
            // Deduplicate from loaded listing records taxonomy
            const dynamicCategories = [{ id: "all", name: "All Nearby", icon: "📍" }];
            response.data.forEach((item) => {
              const catSlug = item.taxonomy?.category;
              if (catSlug && !dynamicCategories.some(d => d.id === catSlug)) {
                let label = catSlug;
                if (catSlug === 'bikes') label = 'Bikes & Outdoor';
                else if (catSlug === 'home') label = 'Home & Garden';
                else if (catSlug === 'kids') label = 'Kids & Baby';
                else if (catSlug === 'pets') label = 'Pet Supplies';
                else if (catSlug === 'garage') label = 'Garage Sales';
                else label = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);

                let categoryIcon = "🏷️";
                if (catSlug === 'bikes') categoryIcon = '🚲';
                else if (catSlug === 'home') categoryIcon = '🏡';
                else if (catSlug === 'kids') categoryIcon = '🧸';
                else if (catSlug === 'pets') categoryIcon = '🐾';
                else if (catSlug === 'garage') categoryIcon = '🏷️';

                dynamicCategories.push({
                  id: catSlug,
                  name: label,
                  icon: categoryIcon
                });
              }
            });
            setCategories(dynamicCategories);
          }
        } else {
          console.warn("Classifieds Local database returned empty. Running backups.");
          setErrorTrace("Classifieds Local database returned empty.");
          loadLocalFallback();
        }
      } catch (err: any) {
        console.error("AxiosError: Connection failure while fetching local classifieds:", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadLocalFallback = () => {
      setLocalItems(FALLBACK_CLASSIFIEDS.map(translateListing));
      setCategories([
        { id: "all", name: "All Nearby", icon: "📍" },
        { id: "free", name: "🆓 Free Stuff", icon: "🆓" },
        { id: "home", name: "🏡 Home & Garden", icon: "🏡" },
        { id: "kids", name: "🧸 Kids & Baby", icon: "🧸" },
        { id: "bikes", name: "🚲 Bikes & Outdoor", icon: "🚲" },
        { id: "pets", name: "🐾 Pet Supplies", icon: "🐾" },
        { id: "garage", name: "🏷️ Garage Sales", icon: "🏷️" }
      ]);
      setUseFallback(true);
    };

    fetchLocalClassifieds();
  }, []);

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
        onPostClick={() => alert("📸 Launching Local camera capture: Post classified snapshot to neighborhood feed.")}
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

          {/* Resilient Diagnostics Connection Overlay on Server Outage */}
          {useFallback && (
            <div className="cl-resilience-panel">
              <div className="cl-resilience-header">
                {diagnosticsTitle}
              </div>
              <div style={{ fontWeight: 600 }}>
                {diagnosticsDescription}
              </div>
              <div className="cl-resilience-trace">
                {errorTrace || 'api.getClassifieds returned empty listings feed.'}
              </div>
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
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--cl-text-muted)' }}>
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
                  onMessageClick={() => alert(`✉️ Messenger: Direct secure chat established with neighbor ${item.sellerName}!`)}
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
                  onClick={() => alert(`✉️ Chat initiated: Secure channel created with ${activeFocusedItem.sellerName}!`)}
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
