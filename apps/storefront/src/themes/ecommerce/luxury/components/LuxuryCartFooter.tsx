
import React from 'react';

export const LuxuryCartFooter = () => (
    <footer className="luxury-cart-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="atelier-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>ATELIER.</div>
                <p style={{ color: '#999', lineHeight: 2, fontSize: '0.95rem' }}>
                    The high-fidelity standard for luxury boutique distribution. Precision in every thread, verified by the global Sellio network.
                </p>
            </div>
            <div>
                <h4>COLLECTIONS</h4>
                <a href="#" className="footer-link">Autumn Edit</a>
                <a href="#" className="footer-link">Winter Archive</a>
                <a href="#" className="footer-link">The Essentials</a>
                <a href="#" className="footer-link">Bespoke Nodes</a>
            </div>
            <div>
                <h4>SERVICES</h4>
                <a href="#" className="footer-link">Private Fitting</a>
                <a href="#" className="footer-link">Global Logistics</a>
                <a href="#" className="footer-link">Care Protocol</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="footer-link">The Foundation</a>
                <a href="#" className="footer-link">Registry</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--atelier-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#ccc', fontWeight: 600, letterSpacing: '2px' }}>
            <span>© 2026 THE_ATELIER_GROUP. ALL_PIECES_AUTHENTICATED.</span>
            <span>v.1.2_BOUTIQUE</span>
        </div>
    </footer>
);
