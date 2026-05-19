'use client';
import React, { useState } from 'react';
import { LocalHeader, LocalCard, LocalFooter } from './components';

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
}

export default function Page() {
  // Local listings with coordinate properties for the simulated map
  const initialLocalItems: LocalItem[] = [
    { 
      id: 1, 
      title: "Like-New Trek Mountain Bike", 
      price: "$350", 
      numericPrice: 350,
      distance: "0.8", 
      numericDistance: 0.8,
      neighborhood: "Capitol Hill", 
      image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400", 
      sellerInitials: "JS",
      sellerName: "John Smith",
      category: "bikes",
      categoryIcon: "🚲",
      conditionLabel: "Excellent",
      mapTop: 32,
      mapLeft: 38
    },
    { 
      id: 2, 
      title: "Wooden Dining Table + 4 Chairs", 
      price: "$150", 
      numericPrice: 150,
      distance: "1.2", 
      numericDistance: 1.2,
      neighborhood: "First Hill", 
      image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=400", 
      sellerInitials: "ML",
      sellerName: "Marie Laurent",
      category: "home",
      categoryIcon: "🏡",
      conditionLabel: "Good",
      mapTop: 55,
      mapLeft: 64
    },
    { 
      id: 3, 
      title: "Box of Baby Clothes (0-6 months)", 
      price: "Free", 
      numericPrice: 0,
      distance: "0.3", 
      numericDistance: 0.3,
      neighborhood: "Capitol Hill", 
      image: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=400", 
      sellerInitials: "AB",
      sellerName: "Alice Baker",
      category: "kids",
      categoryIcon: "🧸",
      conditionLabel: "Like New",
      mapTop: 45,
      mapLeft: 22
    },
    { 
      id: 4, 
      title: "Monstera Deliciosa Plant (Large)", 
      price: "$40", 
      numericPrice: 40,
      distance: "2.1", 
      numericDistance: 2.1,
      neighborhood: "Queen Anne", 
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400", 
      sellerInitials: "RT",
      sellerName: "Ryan Taylor",
      category: "home",
      categoryIcon: "🏡",
      conditionLabel: "Healthy",
      mapTop: 18,
      mapLeft: 58
    },
    { 
      id: 5, 
      title: "IKEA Kallax Shelf Unit (White)", 
      price: "$45", 
      numericPrice: 45,
      distance: "1.5", 
      numericDistance: 1.5,
      neighborhood: "Belltown", 
      image: "https://images.unsplash.com/photo-1595514535115-d52fdfbc3075?q=80&w=400", 
      sellerInitials: "KD",
      sellerName: "Karen Davis",
      category: "home",
      categoryIcon: "🏡",
      conditionLabel: "Fair",
      mapTop: 72,
      mapLeft: 46
    },
    { 
      id: 6, 
      title: "Neighborhood Moving Sale - Sunday", 
      price: "Varies", 
      numericPrice: 10,
      distance: "0.5", 
      numericDistance: 0.5,
      neighborhood: "Capitol Hill", 
      image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400", 
      sellerInitials: "EW",
      sellerName: "Eric Wright",
      category: "garage",
      categoryIcon: "🏷️",
      conditionLabel: "Multi-item",
      mapTop: 28,
      mapLeft: 74
    },
    // Additional items appearing on radius expansion
    { 
      id: 7, 
      title: "Dog Crate - Medium Size Wire", 
      price: "$25", 
      numericPrice: 25,
      distance: "6.2", 
      numericDistance: 6.2,
      neighborhood: "Fremont", 
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400", 
      sellerInitials: "PW",
      sellerName: "Peter Parker",
      category: "pets",
      categoryIcon: "🐾",
      conditionLabel: "Good",
      mapTop: 12,
      mapLeft: 15
    },
    { 
      id: 8, 
      title: "Baby Jogger Stroller (Red)", 
      price: "$95", 
      numericPrice: 95,
      distance: "8.5", 
      numericDistance: 8.5,
      neighborhood: "Ballard", 
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=400", 
      sellerInitials: "MK",
      sellerName: "Mary Jane",
      category: "kids",
      categoryIcon: "🧸",
      conditionLabel: "Excellent",
      mapTop: 82,
      mapLeft: 84
    }
  ];

  const categories = [
    { id: "all", name: "All Nearby", icon: "📍" },
    { id: "free", name: "🆓 Free Stuff", icon: "🆓" },
    { id: "home", name: "🏡 Home & Garden", icon: "🏡" },
    { id: "kids", name: "🧸 Kids & Baby", icon: "🧸" },
    { id: "bikes", name: "🚲 Bikes & Outdoor", icon: "🚲" },
    { id: "pets", name: "🐾 Pet Supplies", icon: "🐾" },
    { id: "garage", name: "🏷️ Garage Sales", icon: "🏷️" },
  ];

  // Neighborhood alerts matching legacy Megaphone details
  const neighborhoodAlerts = [
    { id: 1, text: "Featured Offer: Like-New Trek Mountain Bike in Bikes & Outdoor is trending near Capitol Hill!" },
    { id: 2, text: "Lost Dog: Golden Retriever spotted near Cal Anderson Park. Collar says 'Max'. Contact Agent Sarah." }
  ];

  // Stateful interactive variables
  const [localItems, setLocalItems] = useState<LocalItem[]>(initialLocalItems);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = standard, 1.2 = Zoomed In, 0.8 = Zoomed Out
  
  // Dynamic header radius picker
  const [radiusIndex, setRadiusIndex] = useState(1); // 0 = 2 mi, 1 = 5 mi, 2 = 10 mi
  const radiuses = ["2 mi", "5 mi", "10 mi"];
  const radiusMiles = [2, 5, 10];

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
            <h4 className="cl-panel-title">Nearby Classifieds</h4>
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

          {/* Neighborhood Alerts Container */}
          <div className="cl-alerts-container">
            <h5 style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--cl-primary-blue)', margin: '0.5rem 0 0', textTransform: 'uppercase' }}>Neighborhood Alerts</h5>
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
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--cl-text-muted)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📍</span>
                <h6 style={{ fontWeight: 800 }}>No Neighbors Listing Here</h6>
                <p style={{ fontSize: '0.8rem' }}>Expand your search radius in the header location tag to discover more items!</p>
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
          {radiusIndex < radiuses.length - 1 && (
            <button 
              className="cl-btn-post" 
              style={{ backgroundColor: 'transparent', color: 'var(--cl-primary-blue)', border: '1.5px solid var(--cl-primary-blue)', boxShadow: 'none', justifyContent: 'center', marginTop: '1rem' }}
              onClick={handleLocationClick}
            >
              Expand Search Radius (+{radiusMiles[radiusIndex + 1] - radiusMiles[radiusIndex]} mi)
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
          {filteredItems.map((item) => (
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
          {focusedItemId && activeFocusedItem && (
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
                  onClick={() => alert(`🔍 Navigating to listing detail page for: ${activeFocusedItem.title}`)}
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
