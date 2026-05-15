'use client';
import React from 'react';

export const InvestmentHeader = () => (
  <header className="pi-header">
    <div className="pi-logo">
      YIELD<span style={{ color: 'var(--pi-emerald)' }}>Node</span>
    </div>
    
    <nav className="pi-nav">
        {['Registry', 'Portfolio_Sync', 'Institutional', 'Master_Auth'].map(link => (
            <a key={link} href="#" className="pi-nav-link">{link}</a>
        ))}
    </nav>

    <div className="pi-mono" style={{ fontSize: '0.6rem', color: 'var(--pi-emerald)' }}>
      NETWORK_STABLE_V8
    </div>
  </header>
);

export const PortfolioAssetCard = ({ title, yield: yieldVal, price, type, status }: any) => (
  <div className="pi-asset-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className="pi-mono" style={{ fontSize: '0.6rem' }}>{type}</div>
        <div style={{ padding: '0.25rem 0.75rem', background: 'var(--pi-bg)', borderRadius: '2px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--pi-slate)' }}>{status}</div>
    </div>
    <div className="pi-asset-yield">{yieldVal}</div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--pi-midnight)' }}>{title}</h3>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pi-border)', paddingTop: '2rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{price}</div>
        <div className="pi-mono" style={{ fontSize: '0.65rem', color: 'var(--pi-emerald)', cursor: 'pointer' }}>EXECUTE →</div>
    </div>
  </div>
);

export const YieldAnalyticsHUD = ({ label, value, color }: { label: string, value: string, color?: string }) => (
    <div>
        <div className="pi-mono" style={{ marginBottom: '0.75rem', fontSize: '0.6rem' }}>{label}</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: color || 'var(--pi-midnight)' }}>{value}</div>
    </div>
);

export const InstitutionalFooter = () => (
    <footer className="pi-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="pi-logo" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem' }}>YIELDNODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The global high-fidelity terminal for institutional real estate investment. Synchronizing capital distribution with verified asset nodes.
                </p>
            </div>
            {['PORTFOLIO', 'INSTITUTIONAL', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="pi-mono" style={{ color: 'var(--pi-emerald)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Analytics', 'Support', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '12rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pi-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 SELLIO_CAPITAL_GRP // SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_CAPITAL'].map(social => (
                    <span key={social} className="pi-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
