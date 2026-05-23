'use client';
import React, { useState } from 'react';

export const RentalHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="pr-header">
      <div className="pr-logo">
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔑</span>
        RENT<span style={{ color: 'var(--pr-mint)' }}>NODE</span>
      </div>
      
      <button 
          className={`pr-hamburger ${isOpen ? 'pr-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="pr-hamburger-toggle"
      >
          <span className="pr-hamburger-bar"></span>
          <span className="pr-hamburger-bar"></span>
          <span className="pr-hamburger-bar"></span>
      </button>

      <nav className={`pr-nav ${isOpen ? 'pr-nav-open' : ''}`}>
          {['Discover', 'Verified_Nodes', 'Tenants', 'Leasing_FAQ'].map(link => (
              <a key={link} href="#" className="pr-nav-link" onClick={() => setIsOpen(false)}>{link.replace('_', ' ')}</a>
          ))}
          <button className="pr-btn-primary pr-mobile-auth-btn" style={{ padding: '1rem 3rem', fontSize: '0.9rem', marginTop: '2rem' }}>
            GET_STARTED
          </button>
      </nav>

      <button className="pr-btn-primary pr-desktop-auth-btn" style={{ padding: '0.7rem 1.8rem', fontSize: '0.8rem' }}>
        GET_STARTED
      </button>
    </header>
  );
};

export const LeaseUnitCard = ({ title, price, type, location, beds, baths, sqft, rating, reviews, image, onClick }: any) => {
  // Generate high-fidelity SVG star ratings
  const renderStars = (ratingVal: number) => {
    const stars = [];
    const floor = Math.floor(ratingVal);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < floor ? "var(--pr-coral)" : "var(--pr-border)"} style={{ marginRight: '2px' }}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="pr-rent-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="pr-card-img-wrapper">
        <img src={image} alt={title} className="pr-card-img" />
        <div style={{ 
          position: 'absolute', 
          top: '1.5rem', 
          left: '1.5rem', 
          background: 'var(--pr-white)', 
          padding: '0.5rem 1.25rem', 
          borderRadius: '100px', 
          fontWeight: 900, 
          fontSize: '0.7rem', 
          color: 'var(--pr-slate)', 
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          letterSpacing: '1px'
        }}>
          {type.toUpperCase()}
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: '1.5rem', 
          right: '1.5rem', 
          background: 'var(--pr-slate)', 
          color: 'var(--pr-white)', 
          padding: '0.5rem 1.25rem', 
          borderRadius: '100px', 
          fontWeight: 800, 
          fontSize: '0.7rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          ★ {rating.toFixed(1)}
        </div>
      </div>
      <div style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--pr-slate)' }}>
                {price}
                <span style={{ fontSize: '1rem', color: 'var(--pr-text-muted)', fontWeight: 600 }}>/mo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {renderStars(rating)}
                <span style={{ fontSize: '0.75rem', color: 'var(--pr-text-muted)', marginLeft: '0.5rem', fontWeight: 600 }}>({reviews})</span>
              </div>
          </div>
          
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--pr-slate)' }}>{title}</h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--pr-text-muted)', marginBottom: '2.5rem' }}>{location}</div>
          
          <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--pr-border)', paddingTop: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span>🛏️</span> {beds} BD
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span>🚿</span> {baths} BA
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span>📐</span> {sqft} SQFT
                  </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--pr-mint)' }}>
                  <span>✓</span> SECURE_NODE
              </div>
          </div>
      </div>
    </div>
  );
};

export const TrustMetrics = ({ value, label }: { value: string, label: string }) => (
    <div style={{ padding: '2.5rem', background: 'var(--pr-white)', borderRadius: '24px', border: '1px solid var(--pr-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--pr-mint)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>{value}</div>
        <div className="pr-mono" style={{ fontSize: '0.7rem', color: 'var(--pr-slate)' }}>{label}</div>
    </div>
);

export const TenantFooter = () => (
    <footer className="pr-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }} className="pr-footer-grid">
            <div>
                <div className="pr-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '2.5rem' }}>
                  🔑 RENT<span style={{ color: 'var(--pr-mint)' }}>NODE</span>
                </div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A high-fidelity rental and leasing protocol designed for modern residential nodes. Secure transactions, instant verification, and automated maintenance routing.
                </p>
            </div>
            {['RESOURCES', 'TENANTS', 'LEGAL'].map(col => (
                <div key={col}>
                    <div className="pr-mono" style={{ color: 'white', marginBottom: '2.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Verification', 'Support Portal', 'Auth Registry'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }} className="pr-footer-link">{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="pr-footer-bottom">
            <div className="pr-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 SELLIO_RENTAL_OS // NODE_STABLE</div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                {['X_PROTOCOL', 'INSTAGRAM', 'LINKEDIN_NODE'].map(social => (
                    <span key={social} className="pr-mono" style={{ opacity: 0.3, fontSize: '0.65rem', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
