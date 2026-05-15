
import React from 'react';

export const YieldFooter = () => (
    <footer className="yield-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--inv-gold)' }}>SELLIO_CAPITAL.</h2>
                <p style={{ color: '#4b5563', lineHeight: 2, fontSize: '1rem' }}>
                    Authoritative distribution of high-yield real estate assets. Verified by institutional nodes and financial logic.
                </p>
            </div>
            <div>
                <h4>ASSET_CLASSES</h4>
                <a href="#" className="yield-footer-link">Multi-Family</a>
                <a href="#" className="yield-footer-link">Retail Centers</a>
                <a href="#" className="yield-footer-link">Industrial REITs</a>
                <a href="#" className="yield-footer-link">Debt Nodes</a>
            </div>
            <div>
                <h4>ANALYTICS</h4>
                <a href="#" className="yield-footer-link">Market Logic</a>
                <a href="#" className="yield-footer-link">Yield Projection</a>
                <a href="#" className="yield-footer-link">Risk Index</a>
            </div>
            <div>
                <h4>INSTITUTIONAL</h4>
                <a href="#" className="yield-footer-link">Capital Node</a>
                <a href="#" className="yield-footer-link">API Access</a>
                <a href="#" className="yield-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#374151', fontFamily: 'var(--font-data)' }}>
            <span>© 2026 SELLIO_CAPITAL_GROUP. ALL_ASSETS_AUTHENTICATED.</span>
            <span>DATA_SYNC: REALTIME</span>
        </div>
    </footer>
);
