
import React from 'react';

export const UtilityHeader = () => (
  <header className="utility-header">
    <div className="gen-logo">
      <div style={{ width: '32px', height: '32px', background: 'var(--gen-yellow)', borderRadius: '6px' }}></div>
      <span>Sellio_General</span>
    </div>
    <nav className="gen-nav">
      <a href="#" className="gen-nav-link">Marketplace</a>
      <a href="#" className="gen-nav-link">Electronics</a>
      <a href="#" className="gen-nav-link">Home</a>
      <a href="#" className="gen-nav-link">Leisure</a>
    </nav>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button style={{ background: 'none', border: 'none', fontWeight: 700, color: '#9ca3af', fontSize: '0.85rem', cursor: 'pointer' }}>LOG_IN</button>
      <button style={{ background: 'var(--gen-charcoal)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>SELL_SOMETHING</button>
    </div>
  </header>
);

export const CommunityFooter = () => (
  <footer className="community-footer">
    <div className="community-footer-grid">
      <div>
        <div className="gen-logo" style={{ marginBottom: '2rem' }}>
          <div style={{ width: '24px', height: '24px', background: 'var(--gen-yellow)', borderRadius: '4px' }}></div>
          <span>Sellio_General</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '300px' }}>
          The world's most high-utility distribution node for general commerce. Built for speed, scale, and reliability.
        </p>
      </div>
      <div>
        <h4>PLATFORM</h4>
        <a href="#" className="community-footer-link">How it works</a>
        <a href="#" className="community-footer-link">Trust & Safety</a>
        <a href="#" className="community-footer-link">Node Verification</a>
      </div>
      <div>
        <h4>CATEGORIES</h4>
        <a href="#" className="community-footer-link">Electronics</a>
        <a href="#" className="community-footer-link">Home & Garden</a>
        <a href="#" className="community-footer-link">Vehicles</a>
      </div>
      <div>
        <h4>SUPPORT</h4>
        <a href="#" className="community-footer-link">Help Center</a>
        <a href="#" className="community-footer-link">Contact Node</a>
        <a href="#" className="community-footer-link">API Docs</a>
      </div>
    </div>
    <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid var(--gen-border)', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700 }}>
      © 2026 SELLIO_GENERAL_NODE. v8.2.4_STABLE
    </div>
  </footer>
);

export const ListingGridCard = ({ title, price, location, time, image }: any) => (
  <div className="listing-card">
    <img src={image} alt={title} className="listing-img" />
    <div className="listing-info">
      <div className="listing-price">{price}</div>
      <h3 className="listing-title">{title}</h3>
      <div className="listing-meta">
        <span>📍 {location}</span>
        <span>🕒 {time}</span>
      </div>
    </div>
  </div>
);

export const CategorySidebar = () => (
  <aside className="gen-sidebar">
    <div className="sidebar-title">ALL_CATEGORIES</div>
    <div className="sidebar-nav-item active">
      <span>📦 All Listings</span>
      <span>1,240</span>
    </div>
    {['Electronics', 'Home & Garden', 'Vehicles', 'Leisure', 'Fashion', 'Collectibles', 'Books', 'Other'].map(cat => (
      <div key={cat} className="sidebar-nav-item">
        <span>{cat}</span>
        <span style={{ opacity: 0.5 }}>{Math.floor(Math.random() * 500)}</span>
      </div>
    ))}
    
    <div className="sidebar-title" style={{ marginTop: '3rem' }}>FILTERS</div>
    <div style={{ padding: '0 1rem' }}>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#9ca3af', marginBottom: '1rem' }}>PRICE_RANGE</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input type="text" placeholder="Min" style={{ width: '50%', padding: '0.5rem', border: '1px solid var(--gen-border)', borderRadius: '4px' }} />
        <input type="text" placeholder="Max" style={{ width: '50%', padding: '0.5rem', border: '1px solid var(--gen-border)', borderRadius: '4px' }} />
      </div>
      <button style={{ width: '100%', padding: '0.75rem', background: 'var(--gen-charcoal)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem' }}>APPLY_FILTER</button>
    </div>
  </aside>
);

export const TrendingPanel = () => (
  <aside className="utility-panel">
    <div className="utility-card">
      <div className="sidebar-title">TRENDING_NOW</div>
      {[1,2,3].map(i => (
        <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '50px', background: '#f3f4f6', borderRadius: '8px' }}></div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Node Activity Peak</div>
            <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 700 }}>+42% velocity</div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="utility-card" style={{ background: 'var(--gen-yellow)', border: 'none' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem' }}>Sell faster with <br/>Elite Status.</h3>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Verified sellers get 5x more visibility across the global distribution network.
      </p>
      <button style={{ width: '100%', padding: '0.75rem', background: 'var(--gen-charcoal)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem' }}>UPGRADE_NODE</button>
    </div>
  </aside>
);
