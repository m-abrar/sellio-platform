import React from 'react';

export const HubHeader = () => (
  <header className="hub-header">
    <div className="hub-logo">SELLIO_HUB</div>
    <div className="hub-search-bar">
      <input type="text" placeholder="Search for items, cars, homes, or jobs..." />
    </div>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <button style={{ 
        background: 'var(--color-blue)', 
        color: 'white', 
        padding: '0.6rem 1.5rem', 
        borderRadius: '100px', 
        border: 'none', 
        fontWeight: 700,
        fontSize: '0.85rem',
        cursor: 'pointer'
      }}>
        + List Item
      </button>
      <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%' }}></div>
    </div>
  </header>
);

export const CategoryTile = ({ label, icon, count }: { label: string, icon: string, count: string }) => (
  <div className="category-tile">
    <div className="tile-icon">{icon}</div>
    <div className="tile-label">{label}</div>
    <div style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '0.2rem' }}>{count} items</div>
  </div>
);

export const HubListingCard = ({ title, price, location, image, isVerified }: { title: string, price: string, location: string, image: string, isVerified?: boolean }) => (
  <div className="hub-listing-card">
    <div style={{ height: '220px', background: '#f1f5f9' }}>
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ padding: '1.5rem' }}>
      {isVerified && <div className="verified-badge">VERIFIED_LISTING</div>}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>{title}</h3>
      <div style={{ opacity: 0.5, fontSize: '0.85rem', marginBottom: '1rem' }}>{location}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-blue)' }}>{price}</div>
        <button style={{ background: '#f1f5f9', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }}>VIEW_DETAILS</button>
      </div>
    </div>
  </div>
);

export const HubFooter = () => (
  <footer className="hub-footer">
    <div>
      <div className="hub-logo" style={{ marginBottom: '1rem' }}>SELLIO_HUB</div>
      <p style={{ opacity: 0.4, fontSize: '0.85rem', maxWidth: '300px' }}>The trusted community marketplace for local and global connections.</p>
    </div>
    <div style={{ display: 'flex', gap: '4rem' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem' }}>COMMUNITY</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
          <span>Forum</span>
          <span>Safety Tips</span>
          <span>Guidelines</span>
        </div>
      </div>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem' }}>COMPANY</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
          <span>About</span>
          <span>Press</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  </footer>
);
