
import React from 'react';

export const HubHeader = () => (
  <header className="cm-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ width: '36px', height: '36px', background: 'var(--cm-orange)', borderRadius: '10px', boxShadow: '0 8px 16px rgba(255, 103, 0, 0.2)' }}></div>
      <span style={{ fontFamily: 'var(--cm-font-display)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-1px' }}>THE <span style={{ color: 'var(--cm-orange)' }}>EXCHANGE</span></span>
    </div>
    <nav style={{ display: 'flex', gap: '3rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) { nav { display: none !important; } }
      ` }} />
      {['Marketplace', 'Categories', 'Premium', 'Support'].map(link => (
        <a key={link} href="#" className="cm-nav-link" style={{ fontSize: '0.8rem', fontWeight: 800 }}>{link}</a>
      ))}
    </nav>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <button style={{ background: 'none', border: 'none', fontWeight: 800, color: 'var(--cm-text-dim)', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Sign In</button>
      <button className="cm-btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.75rem' }}>Post Your Ad</button>
    </div>
  </header>
);

export const HubFooter = () => (
  <footer style={{ padding: '10rem 5% 5rem', background: 'white', borderTop: '1px solid var(--cm-border)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--cm-orange)', borderRadius: '8px' }}></div>
          <span style={{ fontFamily: 'var(--cm-font-display)', fontWeight: 800, fontSize: '1.25rem' }}>THE EXCHANGE</span>
        </div>
        <p style={{ color: 'var(--cm-text-dim)', fontSize: '0.95rem', lineHeight: 2, maxWidth: '350px' }}>
          The world's most trusted community distribution engine for high-fidelity local commerce. Verified. Direct. Elite.
        </p>
      </div>
      {['RESOURCES', 'PROTOCOL', 'SUPPORT'].map(col => (
        <div key={col}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '2px', color: 'var(--cm-text)' }}>{col}</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {['All Categories', 'Verified Sellers', 'Safety Protocol', 'Market Rules'].map(link => (
                    <li key={link}><a href="#" className="cm-nav-link" style={{ fontSize: '0.8rem', textTransform: 'none', fontWeight: 500 }}>{link}</a></li>
                ))}
            </ul>
        </div>
      ))}
    </div>
    <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--cm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
      <div className="cm-nav-link" style={{ opacity: 0.4, fontSize: '0.7rem' }}>© 2026 THE EXCHANGE // GLOBAL_EXCHANGE_STABLE</div>
      <div style={{ display: 'flex', gap: '4rem' }}>
          {['Instagram', 'LinkedIn', 'X_Exchange'].map(social => (
              <span key={social} className="cm-nav-link" style={{ opacity: 0.4, fontSize: '0.7rem' }}>{social}</span>
          ))}
      </div>
    </div>
  </footer>
);

export const CategoryTile = ({ label, icon, count }: any) => (
  <div className="cm-cat-card">
    <span className="cm-cat-icon" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{icon}</span>
    <div className="cm-cat-label" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>{label}</div>
    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--cm-orange)', marginTop: '0.75rem', opacity: 0.8 }}>{count} ACTIVE</div>
  </div>
);

export const HubListingCard = ({ title, price, location, image, isVerified, onQuickView }: any) => (
  <div className="cm-listing-card" style={{ border: 'none', boxShadow: 'var(--cm-shadow)' }}>
    {isVerified && <div className="cm-badge cm-badge-cyan">Verified Unit</div>}
    <div style={{ position: 'relative', overflow: 'hidden' }} className="cm-img-container">
        <img src={image} alt={title} className="cm-listing-img" style={{ transition: 'transform 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="cm-overlay">
            <button className="cm-btn-primary" onClick={onQuickView} style={{ fontSize: '0.7rem', padding: '0.8rem 1.5rem' }}>Quick View</button>
        </div>
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
        .cm-listing-card:hover .cm-overlay { opacity: 1 !important; }
        .cm-listing-card:hover .cm-listing-img { transform: scale(1.1); }
    ` }} />
    <div className="cm-listing-content" style={{ padding: '2.5rem' }}>
      <div className="cm-price" style={{ fontSize: '1.8rem' }}>{price}</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '1rem 0 2rem', lineHeight: 1.3, color: 'var(--cm-text)' }}>{title}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--cm-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--cm-text-dim)', fontSize: '0.8rem', fontWeight: 700 }}>
          <span style={{ fontSize: '1rem' }}>📍</span> {location}
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--cm-orange)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Inquire →</button>
      </div>
    </div>
  </div>
);
