'use client';
import React from 'react';
import { ModernHeader, ModernCard, ModernFooter } from './components';

export default function Page() {
  const categories = [
    { name: "Everything", active: true },
    { name: "Electronics", active: false },
    { name: "Fashion", active: false },
    { name: "Furniture", active: false },
    { name: "Vehicles", active: false },
    { name: "Art & Collectibles", active: false },
    { name: "Sporting Goods", active: false },
  ];

  const items = [
    { title: "Apple iPad Pro 12.9 (M2 Chip)", price: "$850", location: "San Jose, CA", time: "2h ago", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400" },
    { title: "Vintage Leather Chesterfield Sofa", price: "$1,200", location: "Austin, TX", time: "5h ago", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400" },
    { title: "DJI Mavic Air 2 Fly More Combo", price: "$650", location: "Miami, FL", time: "Just now", image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400" },
    { title: "Adidas Yeezy Boost 350 V2", price: "$220", location: "Brooklyn, NY", time: "1d ago", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400" },
    { title: "Sony PlayStation 5 Disc Edition", price: "$400", location: "Chicago, IL", time: "3d ago", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400" },
    { title: "Canon EOS R5 Mirrorless Camera", price: "$2,800", location: "Seattle, WA", time: "4d ago", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400" },
    { title: "Secretlab TITAN Evo Gaming Chair", price: "$350", location: "Denver, CO", time: "1w ago", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400" },
    { title: "Oculus Quest 2 128GB VR Headset", price: "$200", location: "Atlanta, GA", time: "1w ago", image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400" },
  ];

  return (
    <div className="classifieds-modern-wrapper">
      <ModernHeader />

      {/* Hero */}
      <section className="cm-hero">
          <div className="cm-hero-content">
              <h1 className="cm-hero-title">Discover the best things to <span className="cm-text-orange">buy</span>, <span className="cm-text-cyan">sell</span>, and trade.</h1>
              
              <div className="cm-search-container">
                  <input type="text" className="cm-search-input" placeholder="What are you looking for?" />
                  <button className="cm-btn cm-btn-primary" style={{ margin: '0.5rem', padding: '0.8rem 2.5rem' }}>Search</button>
              </div>
          </div>
      </section>

      {/* Categories */}
      <div className="cm-categories">
          {categories.map(cat => (
              <a href="#" key={cat.name} className={`cm-cat-pill ${cat.active ? 'active' : ''}`}>{cat.name}</a>
          ))}
      </div>

      {/* Grid */}
      <section className="cm-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Fresh Recommendations</h2>
              <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--cm-border)', outline: 'none', fontWeight: 600, fontFamily: 'var(--cm-font)', color: 'var(--cm-text-main)' }}>
                  <option>Sort by: Newest</option>
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Popular</option>
              </select>
          </div>

          <div className="cm-grid">
              {items.map((item, i) => (
                  <ModernCard key={i} {...item} />
              ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button className="cm-btn" style={{ backgroundColor: 'white', border: '2px solid var(--cm-border)', color: 'var(--cm-text-main)' }}>Load More Items</button>
          </div>
      </section>

      <ModernFooter />
    </div>
  );
}
