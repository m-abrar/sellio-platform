
import React from 'react';

export const ConciergeFooter = () => (
    <footer className="concierge-footer">
        <div className="concierge-footer-grid">
            <div>
                <div className="platinum-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>PLATINUM.</div>
                <p style={{ color: '#888', lineHeight: 2 }}>
                    The world's most exclusive high-fidelity luxury distribution network. Tailored for the discerning estate holder.
                </p>
            </div>
            <div>
                <h4>COLLECTION</h4>
                <a href="#" className="footer-link">The Residences</a>
                <a href="#" className="footer-link">Off-Market Nodes</a>
                <a href="#" className="footer-link">New Developments</a>
                <a href="#" className="footer-link">Island Portfolio</a>
            </div>
            <div>
                <h4>SERVICES</h4>
                <a href="#" className="footer-link">Private Concierge</a>
                <a href="#" className="footer-link">Asset Management</a>
                <a href="#" className="footer-link">Global Logistics</a>
                <a href="#" className="footer-link">Legal Protocol</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="footer-link">The Registry</a>
                <a href="#" className="footer-link">Partnerships</a>
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">Privacy</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--luxury-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', fontWeight: 600, letterSpacing: '2px' }}>
            <span>© 2026 PLATINUM_ESTATE_GROUP. ALL_ASSETS_VERIFIED.</span>
            <span>v.1.0_LUXURY_ELITE</span>
        </div>
    </footer>
);
