'use client';
import React from 'react';

export const SelectHeader = () => (
  <header className="au-header">
    <div className="au-logo">
      SELECT<span style={{ color: 'var(--au-indigo)', fontWeight: 400 }}>Registry</span>
    </div>
    
    <nav className="au-nav">
        {['Inventory', 'Valuation', 'Certified_Process', 'Support_Node'].map(link => (
            <a key={link} href="#" className="au-nav-link">{link}</a>
        ))}
    </nav>

    <div className="au-mono" style={{ fontSize: '0.65rem', border: '1px solid var(--au-border)', padding: '0.5rem 1.5rem', borderRadius: '4px' }}>
      VERIFICATION_STABLE
    </div>
  </header>
);

export const CertifiedVehicleCard = ({ year, make, model, price, mileage, transmission, image }: any) => (
  <div className="au-vehicle-card">
    <div className="au-img-frame">
      <img src={image} alt={model} className="au-img" />
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 900, fontSize: '0.65rem', color: 'var(--au-indigo)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
        CERTIFIED_SELECT
      </div>
    </div>
    <div style={{ padding: '2rem' }}>
        <div className="au-mono" style={{ marginBottom: '0.75rem', fontSize: '0.6rem', color: 'var(--au-text-muted)' }}>{year} // {make.toUpperCase()}</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--au-slate)' }}>{model}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
                <div className="au-mono" style={{ fontSize: '0.55rem', opacity: 0.5, marginBottom: '0.4rem' }}>MILEAGE</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{mileage}</div>
            </div>
            <div>
                <div className="au-mono" style={{ fontSize: '0.55rem', opacity: 0.5, marginBottom: '0.4rem' }}>TRANSMISSION</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{transmission}</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--au-border)', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--au-indigo)' }}>{price}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--au-slate)', letterSpacing: '1px' }}>DETAILS →</div>
        </div>
    </div>
  </div>
);

export const TrustHUD = ({ icon, label, sub }: { icon: string, label: string, sub: string }) => (
    <div>
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{icon}</div>
        <div style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.75rem' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--au-text-muted)', lineHeight: 1.6 }}>{sub}</div>
    </div>
);

export const RegistryFooter = () => (
    <footer className="au-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="au-logo" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>SELECT</div>
                <p style={{ color: 'var(--au-text-muted)', lineHeight: 2, fontSize: '1rem', maxWidth: '400px' }}>
                    The world's most transparent high-fidelity registry for certified pre-owned vehicles. Synchronizing history with nodal verification.
                </p>
            </div>
            {['INVENTORY', 'CERTIFIED', 'SUPPORT'].map(col => (
                <div key={col}>
                    <div className="au-mono" style={{ marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'History', 'Valuation', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.95rem', color: 'var(--au-text-muted)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--au-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="au-mono" style={{ color: 'var(--au-text-muted)', fontSize: '0.65rem' }}>© 2026 SELLIO_SELECT_REGISTRY // TRUST_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_SELECT'].map(social => (
                    <span key={social} className="au-mono" style={{ color: 'var(--au-text-muted)', fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
