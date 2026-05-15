
import React from 'react';

export const MarketFooter = () => (
    <footer className="market-footer">
        <div className="market-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--market-purple)' }}>SELLIO_MARKET.</h2>
                <p style={{ color: '#6b7280', lineHeight: 2, fontSize: '1rem' }}>
                    The global distribution node for multi-category exchange. High-fidelity commerce for the decentralized era.
                </p>
            </div>
            <div>
                <h4>CATEGORIES</h4>
                <a href="#" className="market-footer-link">Electronics</a>
                <a href="#" className="market-footer-link">Vehicles</a>
                <a href="#" className="market-footer-link">Real Estate</a>
                <a href="#" className="market-footer-link">Collectibles</a>
            </div>
            <div>
                <h4>ECOSYSTEM</h4>
                <a href="#" className="market-footer-link">Seller Protocol</a>
                <a href="#" className="market-footer-link">Buyer Trust</a>
                <a href="#" className="market-footer-link">Escrow Node</a>
                <a href="#" className="market-footer-link">Verified Shops</a>
            </div>
            <div>
                <h4>SUPPORT</h4>
                <a href="#" className="market-footer-link">Help Center</a>
                <a href="#" className="market-footer-link">Safety Node</a>
                <a href="#" className="market-footer-link">API Access</a>
                <a href="#" className="market-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
            <span>© 2026 SELLIO_GLOBAL_MARKETPLACE. ALL_RIGHTS_RESERVED.</span>
            <span>v.5.0_UNIFIED</span>
        </div>
    </footer>
);
