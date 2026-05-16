
import React from 'react';

export const HubHeader = () => (
  <header className="cm-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '32px', height: '32px', background: 'var(--cm-primary)', borderRadius: '8px' }}></div>
      <span style={{ fontFamily: 'var(--cm-font-display)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-1px' }}>Sellio_Hub</span>
    </div>
    <nav style={{ display: 'flex', gap: '2.5rem' }}>
      <a href="#" className="cm-nav-link">Marketplace</a>
      <a href="#" className="cm-nav-link">Local_Nodes</a>
      <a href="#" className="cm-nav-link">Live_Deals</a>
    </nav>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button style={{ background: 'none', border: 'none', fontWeight: 700, color: 'var(--cm-text-dim)', cursor: 'pointer', fontSize: '0.85rem' }}>SIGN_IN</button>
      <button className="cm-btn-primary">POST_LISTING</button>
    </div>
  </header>
);

export const HubFooter = () => (
  <footer style={{ padding: '8rem 5% 4rem', background: 'white', borderTop: '1px solid var(--cm-border)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '24px', height: '24px', background: 'var(--cm-primary)', borderRadius: '6px' }}></div>
          <span style={{ fontFamily: 'var(--cm-font-display)', fontWeight: 800 }}>Sellio_Hub</span>
        </div>
        <p style={{ color: 'var(--cm-text-dim)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '300px' }}>
          The community-powered distribution engine for local commerce. verified. trusted. local.
        </p>
      </div>
      <div>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '1px' }}>EXPLORE</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>All Categories</a></li>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Verified Sellers</a></li>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Safety Protocol</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '1px' }}>PROTOCOL</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Escrow Services</a></li>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Listing Rules</a></li>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Node Rewards</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '1px' }}>SUPPORT</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Help Center</a></li>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Dispute Resolution</a></li>
          <li><a href="#" className="cm-nav-link" style={{ fontSize: '0.75rem' }}>Contact Node</a></li>
        </ul>
      </div>
    </div>
    <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid var(--cm-border)', textAlign: 'center', color: 'var(--cm-text-dim)', fontSize: '0.75rem', fontWeight: 600 }}>
      © 2026 SELLIO_HUB. PROTOCOL_VERSION_4.2.1
    </div>
  </footer>
);

export const CategoryTile = ({ label, icon, count }: any) => (
  <div className="cm-cat-card">
    <span className="cm-cat-icon">{icon}</span>
    <div className="cm-cat-label">{label}</div>
    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--cm-text-dim)', marginTop: '0.5rem' }}>{count} ITEMS</div>
  </div>
);

export const HubListingCard = ({ title, price, location, image, isVerified }: any) => (
  <div className="cm-listing-card">
    {isVerified && <div className="cm-badge">VERIFIED_NODE</div>}
    <img src={image} alt={title} className="cm-listing-img" />
    <div className="cm-listing-content">
      <div className="cm-price">{price}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0 1.5rem' }}>{title}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cm-text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>
          <span>📍</span> {location}
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--cm-primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>CONTACT_SELLER</button>
      </div>
    </div>
  </div>
);
