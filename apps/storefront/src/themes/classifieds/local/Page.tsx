'use client';
import React from 'react';
import { LocalHeader, LocalCard, LocalFooter } from './components';

export default function Page() {
  const categories = [
    { name: "All Nearby", active: true },
    { name: "🆓 Free Stuff", active: false },
    { name: "🏡 Home & Garden", active: false },
    { name: "🧸 Kids & Baby", active: false },
    { name: "🚲 Bikes & Outdoor", active: false },
    { name: "🐾 Pet Supplies", active: false },
    { name: "🏷️ Garage Sales", active: false },
  ];

  const localItems = [
    { title: "Like-New Trek Mountain Bike", price: "$350", distance: "0.8", neighborhood: "Capitol Hill", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400", sellerInitials: "JS" },
    { title: "Wooden Dining Table + 4 Chairs", price: "$150", distance: "1.2", neighborhood: "First Hill", image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=400", sellerInitials: "ML" },
    { title: "Box of Baby Clothes (0-6 months)", price: "Free", distance: "0.3", neighborhood: "Capitol Hill", image: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=400", sellerInitials: "AB" },
    { title: "Monstera Deliciosa Plant (Large)", price: "$40", distance: "2.1", neighborhood: "Queen Anne", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400", sellerInitials: "RT" },
    { title: "IKEA Kallax Shelf Unit", price: "$45", distance: "1.5", neighborhood: "Belltown", image: "https://images.unsplash.com/photo-1595514535115-d52fdfbc3075?q=80&w=400", sellerInitials: "KD" },
    { title: "Moving Sale - Sunday 9am", price: "Varies", distance: "0.5", neighborhood: "Capitol Hill", image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400", sellerInitials: "EW" },
  ];

  return (
    <div className="classifieds-local-wrapper">
      <LocalHeader />

      {/* Hero / Map */}
      <section className="cl-hero">
          <div className="cl-hero-content">
              <h1 className="cl-hero-title">Discover what's selling right down the street.</h1>
              <p className="cl-hero-subtitle">Connect with verified neighbors to buy, sell, and trade locally.</p>
              
              <div className="cl-search-box">
                  <input type="text" className="cl-search-input" placeholder="Search for bikes, furniture, free items..." />
                  <button className="cl-btn-primary" style={{ padding: '0.8rem 2rem' }}>Search</button>
              </div>
          </div>
          <div className="cl-hero-map d-none d-md-block">
              <div className="cl-map-overlay"></div>
              {/* Mock Map Markers */}
              <div className="cl-map-marker" style={{ top: '30%', left: '40%' }}>$350</div>
              <div className="cl-map-marker" style={{ top: '60%', left: '70%' }}>$150</div>
              <div className="cl-map-marker" style={{ top: '45%', left: '55%', backgroundColor: 'var(--cl-secondary)' }}>Free</div>
              <div className="cl-map-marker" style={{ top: '80%', left: '30%' }}>$40</div>
              <div className="cl-map-marker" style={{ top: '20%', left: '80%' }}>$45</div>
          </div>
      </section>

      {/* Categories */}
      <div className="cl-categories">
          {categories.map(cat => (
              <a href="#" key={cat.name} className={`cl-cat-pill ${cat.active ? 'active' : ''}`}>{cat.name}</a>
          ))}
      </div>

      {/* Local Feed */}
      <section className="cl-section">
          <div className="cl-section-header">
              <h2 className="cl-section-title">
                  <span style={{ fontSize: '2rem' }}>👋</span> Fresh in your neighborhood
              </h2>
              <select style={{ padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--cl-border)', fontFamily: 'var(--cl-font)', fontWeight: 700, outline: 'none' }}>
                  <option>Distance: Nearest First</option>
                  <option>Newly Listed</option>
                  <option>Price: Low to High</option>
              </select>
          </div>
          
          <div className="cl-grid">
              {localItems.map((item, i) => (
                  <LocalCard key={i} {...item} />
              ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button className="cl-btn-primary" style={{ backgroundColor: 'white', color: 'var(--cl-secondary)', border: '2px solid var(--cl-secondary)' }}>
                  Expand Search Radius (+5 mi)
              </button>
          </div>
      </section>

      <LocalFooter />
    </div>
  );
}
