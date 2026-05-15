'use client';
import React from 'react';

export const CommercialHeader = () => (
  <header className="pc-header">
    <div className="pc-logo">
      CORP<span style={{ color: 'var(--pc-blue)' }}>Portfolio</span>
    </div>
    
    <nav className="pc-nav">
        {['Registry', 'Yield_Sync', 'Institutional', 'Master_Auth'].map(link => (
            <a key={link} href="#" className="pc-nav-link">{link}</a>
        ))}
    </nav>

    <div className="pc-mono" style={{ padding: '0.6rem 1.5rem', background: 'var(--pc-bg)', borderRadius: '4px' }}>
      AUDIT_STABLE
    </div>
  </header>
);

export const AssetRegistryCard = ({ title, type, area, status, id }: any) => (
  <div className="pc-asset-card">
    <div className="pc-mono" style={{ marginBottom: '1.5rem', fontSize: '0.65rem' }}>{id} // {type}</div>
    <h3 className="pc-asset-title" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', transition: 'var(--pc-transition)' }}>{title}</h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div>
            <div className="pc-mono" style={{ fontSize: '0.6rem', color: 'var(--pc-slate)', marginBottom: '0.5rem' }}>TOTAL_AREA</div>
            <div style={{ fontWeight: 800 }}>{area}</div>
        </div>
        <div>
            <div className="pc-mono" style={{ fontSize: '0.6rem', color: 'var(--pc-slate)', marginBottom: '0.5rem' }}>STATUS</div>
            <div style={{ fontWeight: 800, color: status === 'AVAILABLE' ? 'var(--pc-blue)' : 'inherit' }}>{status}</div>
        </div>
    </div>
    
    <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', borderTop: '1px solid var(--pc-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>REQUEST_AUDIT</span>
        <span style={{ color: 'var(--pc-blue)' }}>VIEW_YIELD →</span>
    </div>
  </div>
);

export const IntelligenceHUD = ({ label, value }: { label: string, value: string }) => (
    <div style={{ borderBottom: '1px solid var(--pc-border)', paddingBottom: '2.5rem' }}>
        <div className="pc-mono" style={{ marginBottom: '1rem', color: 'var(--pc-slate)' }}>{label}</div>
        <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>{value}</div>
    </div>
);

export const InstitutionalFooter = () => (
    <footer className="pc-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="pc-logo" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>CORP</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The global authoritative registry for institutional-grade commercial assets. Synchronizing yield and structural metadata.
                </p>
            </div>
            {['ACQUISITION', 'AUDIT', 'GOVERNANCE'].map(col => (
                <div key={col}>
                    <div className="pc-mono" style={{ color: 'var(--pc-blue)', marginBottom: '3.5rem' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry', 'Verification', 'Support', 'Auth'].map(link => (
                            <span key={link} style={{ fontSize: '0.9rem', opacity: 0.4, cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="pc-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>© 2026 SELLIO_COMMERCIAL_GRP // NODE_STABLE</div>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {['INSTAGRAM', 'LINKEDIN', 'X_OS'].map(social => (
                    <span key={social} className="pc-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
