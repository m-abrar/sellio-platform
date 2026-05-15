
import React from 'react';

export const UnifiedFooter = () => (
    <footer className="unified-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--uni-blue)' }}>SELLIO_PROPERTIES.</h2>
                <p style={{ color: 'var(--uni-slate)', lineHeight: 2, fontSize: '0.95rem' }}>
                    The universal standard for real estate distribution. Authoritative data, verified by the global Sellio node network.
                </p>
            </div>
            <div>
                <h4>CATEGORIES</h4>
                <a href="#" className="unified-footer-link">Residential</a>
                <a href="#" className="unified-footer-link">Commercial</a>
                <a href="#" className="unified-footer-link">Industrial</a>
                <a href="#" className="unified-footer-link">Agricultural</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="unified-footer-link">Valuation Hub</a>
                <a href="#" className="unified-footer-link">Legal Protocol</a>
                <a href="#" className="unified-footer-link">Investment Node</a>
            </div>
            <div>
                <h4>INSTITUTIONAL</h4>
                <a href="#" className="unified-footer-link">Partner Portal</a>
                <a href="#" className="unified-footer-link">API Access</a>
                <a href="#" className="unified-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid var(--uni-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--uni-slate)' }}>
            <span>© 2026 SELLIO_PROPERTIES_NETWORK. ALL_ASSETS_VERIFIED.</span>
            <span>v.4.2_MASTER</span>
        </div>
    </footer>
);
