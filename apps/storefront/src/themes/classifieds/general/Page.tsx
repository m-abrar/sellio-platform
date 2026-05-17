'use client';
import React from 'react';
import { GeneralHeader, ListingCard, GeneralFooter } from './components';

export default function Page() {
  const categories = [
    { name: "Electronics", icon: "📱", active: false },
    { name: "Vehicles", icon: "🚗", active: false },
    { name: "Real Estate", icon: "🏠", active: true },
    { name: "Home Goods", icon: "🛋️", active: false },
    { name: "Fashion", icon: "👕", active: false },
    { name: "Services", icon: "🔧", active: false },
    { name: "Community", icon: "👥", active: false },
  ];

  const listings = [
    { title: "iPhone 13 Pro - 256GB Unlocked", price: "$799", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400", seller: "User113", isSaved: false },
    { title: "Classic Road Bike - Excellent Condition", price: "$450", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400", seller: "CyclistJoe", isSaved: true },
    { title: "Mid-Century Modern Sofa (Teal)", price: "$600", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400", seller: "UsesM83", isSaved: false },
    { title: "Modern Brass Desk Lamp", price: "$85", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f7821?q=80&w=400", seller: "ShopLux", isSaved: false },
    { title: "2018 Honda Civic EX", price: "$16,500", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400", seller: "AutoSeller99", isSaved: false },
    { title: "Sony A7III Mirrorless Camera Body", price: "$1,200", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400", seller: "PhotoPro", isSaved: true },
  ];

  return (
    <div className="classifieds-general-wrapper">
      <GeneralHeader />

      <div className="cg-layout">
          {/* Sidebar */}
          <aside>
              <div className="cg-sidebar">
                  <div className="cg-sidebar-title">Categories</div>
                  <div className="cg-category-list">
                      {categories.map(cat => (
                          <a key={cat.name} href="#" className={`cg-category-link ${cat.active ? 'active' : ''}`}>
                              <span>{cat.icon}</span>
                              {cat.name}
                          </a>
                      ))}
                  </div>
                  
                  <div className="cg-sidebar-title" style={{ marginTop: '2rem' }}>Filters</div>
                  <div style={{ padding: '0 0.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--cg-text-main)' }}>
                          <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Local pickup only
                      </label>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--cg-text-main)' }}>
                          <input type="checkbox" style={{ marginRight: '0.5rem' }} /> Includes delivery
                      </label>
                  </div>
              </div>
          </aside>

          {/* Main Content */}
          <main>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recommended for you</h1>
                  <select style={{ padding: '0.5rem', border: '1px solid var(--cg-border)', borderRadius: '4px', outline: 'none' }}>
                      <option>Newly Listed</option>
                      <option>Lowest Price</option>
                      <option>Highest Price</option>
                      <option>Distance: Nearest First</option>
                  </select>
              </div>

              <div className="cg-grid">
                  {listings.map((item, i) => (
                      <ListingCard key={i} {...item} />
                  ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button className="cg-btn cg-btn-outline">Load More Listings</button>
              </div>
          </main>
      </div>

      <GeneralFooter />
    </div>
  );
}
