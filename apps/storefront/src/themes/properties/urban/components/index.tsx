'use client';
import React from 'react';

export const SkylineHeader = () => (
  <header className="pu-header">
    <div style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-1px' }}>
      SKYLINE<span style={{ color: 'var(--pu-cobalt)' }}>Registry</span>
    </div>
    
    <nav className="pu-nav">
        {['Districts', 'Verticals', 'Intelligence', 'Node_Auth'].map(link => (
            <a key={link} href="#" className="pu-nav-link">{link}</a>
        ))}
    </nav>

    <div className="pu-mono" style={{ padding: '0.5rem 1.5rem', background: 'var(--pu-steel)', color: 'white' }}>
      SYNC_ACTIVE
    </div>
  </header>
);

export const BrutalistUnitCard = ({ title, price, location, beds, sqft, image }: any) => (
  <div className="pu-unit-card">
    <div className="pu-unit-img-wrapper">
      <img src={image} alt={title} className="pu-unit-img" />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>{title}</h3>
            <div className="pu-mono" style={{ marginTop: '0.5rem', opacity: 0.6 }}>{location}</div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--pu-cobalt)' }}>{price}</div>
    </div>
    <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid currentColor', paddingTop: '1.5rem' }}>
        <div className="pu-mono">{beds} BD</div>
        <div className="pu-mono">{sqft} SQFT</div>
        <div className="pu-mono">V8_NODE</div>
    </div>
  </div>
);

export const StructuralStat = ({ value, label }: { value: string, label: string }) => (
  <div className="pu-stat-node">
    <div className="pu-stat-value">{value}</div>
    <div className="pu-mono" style={{ opacity: 0.5 }}>{label}</div>
  </div>
);

export const CityPulseFooter = () => (
    <footer style={{ background: 'var(--pu-steel)', color: 'white', padding: '10rem 6% 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '3rem' }}>SKYLINE</div>
                <p style={{ opacity: 0.5, lineHeight: 1.8, maxWidth: '400px' }}>
                    The world's most advanced high-fidelity urban distribution network. Engineering the future of vertical living.
                </p>
            </div>
            {['DISTRICTS', 'PROTOCOL', 'INSTITUTIONAL'].map(col => (
                <div key={col}>
                    <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Verticals', 'Intelligence', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pu-mono" style={{ opacity: 0.3 }}>© 2026 SELLIO_SKYLINE_OS // VERTICAL_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="pu-mono" style={{ opacity: 0.3 }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
