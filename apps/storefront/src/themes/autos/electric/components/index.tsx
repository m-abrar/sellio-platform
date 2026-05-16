
'use client';
import React from 'react';

export const EvolveHeader = () => (
  <header className="ae-header">
    <div className="ae-logo">
      EV<span style={{ color: 'var(--ae-cyan)' }}>OLVE</span>
    </div>
    
    <nav className="ae-nav" style={{ display: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 1024px) {
                .ae-nav { display: flex !important; gap: 4rem; }
            }
        ` }} />
        {['Registry', 'Network', 'Charging', 'Provenance'].map(link => (
            <a key={link} href="#" className="ae-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ae-mono" style={{ fontSize: '0.65rem', color: 'var(--ae-green)', padding: '0.6rem 1.5rem', border: '1px solid var(--ae-green)', boxShadow: 'var(--ae-glow-green)' }}>
      NODE_SYNC_ACTIVE
    </div>
  </header>
);

export const ElectricAssetCard = ({ name, price, range, accel, topSpeed, image }: any) => (
  <div className="ae-asset-card">
    <div className="ae-img-frame">
      <img src={image} alt={name} className="ae-img" />
    </div>
    <div style={{ padding: '0 0.5rem' }}>
        <div className="ae-mono" style={{ marginBottom: '1.25rem', opacity: 0.4, fontSize: '0.6rem' }}>HIGH_FIDELITY_ASSET</div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white', letterSpacing: '-0.5px' }}>{name}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3.5rem' }}>
            <div>
                <div className="ae-mono" style={{ fontSize: '0.55rem', opacity: 0.3, marginBottom: '0.5rem' }}>MAX_RANGE</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--ae-cyan)' }}>{range}</div>
            </div>
            <div>
                <div className="ae-mono" style={{ fontSize: '0.55rem', opacity: 0.3, marginBottom: '0.5rem' }}>0-60_MPH</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>{accel}</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--ae-green)' }}>{price}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--ae-cyan)', letterSpacing: '2px', cursor: 'pointer' }}>CONFIGURE →</div>
        </div>
    </div>
  </div>
);

export const RangeAnalyticsHUD = ({ value, label }: { value: string, label: string }) => (
    <div className="ae-hud-stat" style={{ borderLeft: '2px solid var(--ae-green)', paddingLeft: '2.5rem' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{value}</div>
        <div className="ae-mono" style={{ opacity: 0.4, fontSize: '0.6rem', color: 'var(--ae-cyan)' }}>{label}</div>
    </div>
);

export const EvolveFooter = () => (
    <footer className="ae-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6rem' }}>
            <div>
                <div className="ae-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>EVOLVE</div>
                <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The definitive electric asset distribution protocol. Synchronizing high-fidelity energy telemetry with global fleet nodes.
                </p>
            </div>
            {['COLLECTION', 'PROTOCOL', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ae-mono" style={{ color: 'var(--ae-green)', marginBottom: '3.5rem', opacity: 0.8 }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Telemetry', 'Charging', 'Provenance'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div className="ae-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 EVOLVE // NEURAL_ASSET_HUB</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_SYSTEM'].map(social => (
                    <span key={social} className="ae-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
