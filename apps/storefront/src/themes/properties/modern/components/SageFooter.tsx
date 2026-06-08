
import React from 'react';

export const SageFooter = () => (
    <footer className="prop-footer">
        <h2 className="prop-footer-title">Elevating the standard of modern living.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', textAlign: 'left', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
                <div className="prop-logo" style={{ marginBottom: '1.5rem' }}>SELLIO_SAGE</div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>Curating architectural masterpieces across the globe since 2026.</p>
            </div>
            <div>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem' }}>MARKETS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    <span>Los Angeles</span>
                    <span>New York</span>
                    <span>London</span>
                    <span>Tokyo</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem' }}>LEGAL</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Brokerage Disclosure</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem' }}>CONNECT</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    <span>Instagram</span>
                    <span>LinkedIn</span>
                    <span>X.com</span>
                </div>
            </div>
        </div>
        <div style={{ marginTop: '6rem', fontSize: '0.75rem', color: '#9ca3af' }}>
            © 2026 Sellio Sage. An Elite Series Production.
        </div>
    </footer>
);
