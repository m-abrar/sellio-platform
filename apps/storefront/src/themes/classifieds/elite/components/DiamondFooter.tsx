
import React from 'react';

export const DiamondFooter = () => (
    <footer className="diamond-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
            <div>
                <div className="elite-logo" style={{ marginBottom: '2rem' }}>SELLIO_ELITE</div>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.8 }}>
                    The world's most exclusive marketplace for high-value assets. Curated by experts, trusted by collectors.
                </p>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', color: '#d4af37', marginBottom: '2rem', letterSpacing: '2px' }}>CATEGORIES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                    <span>Fine Art</span>
                    <span>Luxury Watches</span>
                    <span>Rare Spirits</span>
                    <span>Classic Autos</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', color: '#d4af37', marginBottom: '2rem', letterSpacing: '2px' }}>SERVICES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                    <span>Private Sales</span>
                    <span>Auction House</span>
                    <span>Authentication</span>
                    <span>Valuation</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', color: '#d4af37', marginBottom: '2rem', letterSpacing: '2px' }}>CONNECT</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                    <span>Instagram</span>
                    <span>LinkedIn</span>
                    <span>X.com</span>
                    <span>Concierge</span>
                </div>
            </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '8rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#333' }}>
            <span>© 2026 SELLIO_ELITE_HOLDINGS. ALL RIGHTS RESERVED.</span>
            <span>PRIVACY_PROTECTED_NODE</span>
        </div>
    </footer>
);
