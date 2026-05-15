'use client';
import React from 'react';

export const VoltHeader = () => (
  <header className="ae-header">
    <div className="ae-logo">
      VOLT<span style={{ color: 'var(--ae-cyan)' }}>Node</span>
    </div>
    
    <nav className="ae-nav">
        {['Fleet', 'Technology', 'Charging', 'Energy_Auth'].map(link => (
            <a key={link} href="#" className="ae-nav-link">{link}</a>
        ))}
    </nav>

    <div className="ae-mono" style={{ fontSize: '0.6rem', color: 'var(--ae-cyan)', padding: '0.5rem 1.5rem', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid var(--ae-cyan)' }}>
      ENERGY_SYNC_ACTIVE
    </div>
  </header>
);

export const ElectricAssetCard = ({ name, price, range, accel, topSpeed, image }: any) => (
  <div className="ae-asset-card">
    <div className="ae-img-frame">
      <img src={image} alt={name} className="ae-img" />
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--ae-cyan)', color: 'black', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 900, fontSize: '0.65rem' }}>
        v10.4_STABLE
      </div>
    </div>
    <div style={{ padding: '0 1rem' }}>
        <div className="ae-mono" style={{ marginBottom: '1rem', opacity: 0.4 }}>NEURAL_FLEET_UNIT</div>
        <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white' }}>{name}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
                <div className="ae-mono" style={{ fontSize: '0.55rem', opacity: 0.3, marginBottom: '0.5rem' }}>RANGE_EST</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--ae-cyan)' }}>{range}</div>
            </div>
            <div>
                <div className="ae-mono" style={{ fontSize: '0.55rem', opacity: 0.3, marginBottom: '0.5rem' }}>ZERO_TO_SIXTY</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{accel}</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ae-border)', paddingTop: '2rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{price}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--ae-cyan)', letterSpacing: '2px' }}>CONFIGURE →</div>
        </div>
    </div>
  </div>
);

export const RangeAnalyticsHUD = ({ value, label }: { value: string, label: string }) => (
    <div className="ae-hud-stat">
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{value}</div>
        <div className="ae-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>{label}</div>
    </div>
);

export const EnergyFooter = () => (
    <footer className="ae-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="ae-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>VOLTNODE</div>
                <p style={{ opacity: 0.3, lineHeight: 2, fontSize: '1rem', maxWidth: '400px' }}>
                    The definitive electric vehicle distribution protocol. Synchronizing high-fidelity energy telemetry with global fleet nodes.
                </p>
            </div>
            {['FLEET', 'TECH', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="ae-mono" style={{ color: 'var(--ae-cyan)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Telemetry', 'Charging', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.95rem', opacity: 0.3, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--ae-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="ae-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 SELLIO_VOLT_NODE // ENERGY_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_VOLT'].map(social => (
                    <span key={social} className="ae-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
