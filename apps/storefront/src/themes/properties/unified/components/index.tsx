'use client';
import React from 'react';

export const UniversalHeader = () => (
  <header className="uh-header">
    <div className="uh-logo">
      UNIFIED<span style={{ color: 'var(--uh-blue)' }}>Hub</span>
    </div>
    
    <nav className="uh-nav">
        {['All_Assets', 'Intelligence', 'Distribution', 'Master_Auth'].map(link => (
            <a key={link} href="#" className="uh-nav-link">{link}</a>
        ))}
    </nav>

    <div className="uh-mono" style={{ padding: '0.6rem 1.5rem', border: '1px solid var(--uh-border)', borderRadius: '4px' }}>
      SYNC_STABLE
    </div>
  </header>
);

export const UnifiedPropCard = ({ title, price, location, type, image }: any) => (
  <div className="uh-prop-card">
    <img src={image} alt={title} className="uh-card-img" />
    <div className="uh-card-info">
        <div className="uh-mono" style={{ fontSize: '0.6rem', marginBottom: '0.75rem' }}>{type}</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--uh-slate)', marginBottom: '1.5rem' }}>{location}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--uh-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {price}
            <span style={{ fontSize: '0.7rem', color: 'var(--uh-slate)' }}>DETAILS →</span>
        </div>
    </div>
  </div>
);

export const MarketMetricsHUD = () => (
    <div className="uh-metrics-bar">
        {[
            { label: 'ASSETS_MANAGED', value: '$12.5B' },
            { label: 'NODAL_SYNC', value: 'ACTIVE' },
            { label: 'VALUATION_ACCURACY', value: '99.8%' },
            { label: 'COMPLIANCE', value: 'VERIFIED' }
        ].map(metric => (
            <div key={metric.label}>
                <div className="uh-mono" style={{ fontSize: '0.6rem', color: 'var(--uh-slate)', marginBottom: '0.5rem' }}>{metric.label}</div>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--uh-indigo)' }}>{metric.value}</div>
            </div>
        ))}
    </div>
);

export const GlobalFooter = () => (
    <footer className="uh-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="uh-logo" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>UNIFIED</div>
                <p style={{ color: 'var(--uh-slate)', lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The world's most robust universal property protocol. Synchronizing residential, commercial, and industrial nodes with institutional precision.
                </p>
            </div>
            {['NETWORK', 'VALUATION', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="uh-mono" style={{ color: 'var(--uh-indigo)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Insights', 'Support', 'Legal'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', color: 'var(--uh-slate)', cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--uh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="uh-mono" style={{ color: 'var(--uh-slate)', fontSize: '0.65rem' }}>© 2026 SELLIO_UNIFIED_PROTOCOL // GLOBAL_SYNC_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="uh-mono" style={{ color: 'var(--uh-slate)', fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
