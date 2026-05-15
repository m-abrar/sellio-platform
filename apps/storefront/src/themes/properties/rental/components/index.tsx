'use client';
import React from 'react';

export const RentalHeader = () => (
  <header className="pr-header">
    <div className="pr-logo">
      RENT<span style={{ color: 'var(--pr-mint)' }}>NODE</span>
    </div>
    
    <nav className="pr-nav">
        {['Discover', 'Vertically_Verified', 'Tenants', 'Support'].map(link => (
            <a key={link} href="#" className="pr-nav-link">{link}</a>
        ))}
    </nav>

    <button className="pr-btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
      GET_STARTED
    </button>
  </header>
);

export const LeaseUnitCard = ({ title, price, type, location, beds, baths, image }: any) => (
  <div className="pr-rent-card">
    <div className="pr-card-img-wrapper">
      <img src={image} alt={title} className="pr-card-img" />
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'white', padding: '0.5rem 1.25rem', borderRadius: '100px', fontWeight: 900, fontSize: '0.7rem', color: 'var(--pr-mint)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
        {type.toUpperCase()}
      </div>
    </div>
    <div style={{ padding: '2.5rem' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--pr-mint)', marginBottom: '0.5rem' }}>{price}<span style={{ fontSize: '1rem', color: 'var(--pr-text-muted)', fontWeight: 600 }}>/mo</span></div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--pr-text-muted)', marginBottom: '2.5rem' }}>{location}</div>
        
        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--pr-border)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <span>🛏️</span> {beds} BD
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <span>🚿</span> {baths} BA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--pr-mint)' }}>
                <span>✓</span> VERIFIED
            </div>
        </div>
    </div>
  </div>
);

export const TrustMetrics = ({ value, label }: { value: string, label: string }) => (
    <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--pr-mint)', marginBottom: '0.5rem' }}>{value}</div>
        <div className="pr-mono" style={{ color: 'var(--pr-text-muted)' }}>{label}</div>
    </div>
);

export const TenantFooter = () => (
    <footer className="pr-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="pr-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '2.5rem' }}>RENTNODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    A high-fidelity rental protocol designed for the modern tenant. Synchronizing residential nodes with global efficiency.
                </p>
            </div>
            {['RESOURCES', 'TENANTS', 'LEGAL'].map(col => (
                <div key={col}>
                    <div className="pr-mono" style={{ color: 'white', marginBottom: '2.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Verification', 'Support', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pr-mono" style={{ opacity: 0.3 }}>© 2026 SELLIO_RENTAL_OS // NODE_STABLE</div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                {['X_OS', 'INSTAGRAM', 'LINKEDIN'].map(social => (
                    <span key={social} className="pr-mono" style={{ opacity: 0.3 }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
