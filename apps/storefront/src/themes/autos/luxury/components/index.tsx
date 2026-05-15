'use client';
import React from 'react';

export const PlatinumHeader = () => (
  <header className="al-header">
    <div className="al-logo">
      PLATINUM<span style={{ color: 'var(--al-cyan)' }}>Drive</span>
    </div>
    
    <nav className="al-nav">
        {['The_Registry', 'Performance', 'Concierge', 'Pilot_Auth'].map(link => (
            <a key={link} href="#" className="al-nav-link">{link}</a>
        ))}
    </nav>

    <div className="al-mono" style={{ fontSize: '0.65rem', color: 'var(--al-cyan)', padding: '0.5rem 2rem', border: '1px solid var(--al-border)' }}>
      CONCIERGE_ACTIVE
    </div>
  </header>
);

export const LuxuryAssetCard = ({ title, price, hp, acceleration, image }: any) => (
  <div className="al-asset-card">
    <div className="al-img-frame">
      <img src={image} alt={title} className="al-img" />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'var(--al-cyan)', color: 'black', padding: '0.5rem 1.5rem', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px' }}>
        EXOTIC_NODE
      </div>
    </div>
    <div style={{ padding: '4rem' }}>
        <div className="al-mono" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>ULTRA_HIGH_PERFORMANCE</div>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', color: 'white' }}>{title}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            <div>
                <div className="al-mono" style={{ fontSize: '0.55rem', opacity: 0.3, marginBottom: '0.5rem' }}>OUTPUT_POWER</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--al-cyan)' }}>{hp} HP</div>
            </div>
            <div>
                <div className="al-mono" style={{ fontSize: '0.55rem', opacity: 0.3, marginBottom: '0.5rem' }}>ZERO_TO_SIXTY</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white' }}>{acceleration}S</div>
            </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--al-border)', paddingTop: '2.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>{price}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--al-cyan)', letterSpacing: '3px' }}>REQUEST_PILOT →</div>
        </div>
    </div>
  </div>
);

export const ConciergeHUD = ({ value, label }: { value: string, label: string }) => (
    <div>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '1.5rem' }}>{value}</div>
        <div className="al-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>{label}</div>
    </div>
);

export const PilotFooter = () => (
    <footer className="al-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '10rem' }}>
            <div>
                <div className="al-logo" style={{ fontSize: '3rem', marginBottom: '3.5rem' }}>PLATINUM</div>
                <p style={{ color: 'rgba(226, 232, 240, 0.4)', lineHeight: 2, fontSize: '1rem', maxWidth: '500px' }}>
                    The world's most advanced high-fidelity automotive distribution node. Synchronizing exotic assets with global concierge intelligence.
                </p>
            </div>
            {['REGISTRY', 'CONCIERGE', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="al-mono" style={{ marginBottom: '4rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Inventory', 'Performance', 'Authentication', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.95rem', color: 'rgba(226, 232, 240, 0.3)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid var(--al-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="al-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>© 2026 SELLIO_PLATINUM_DRIVE // PILOT_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '5rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_PILOT'].map(social => (
                    <span key={social} className="al-mono" style={{ opacity: 0.2, fontSize: '0.6rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
