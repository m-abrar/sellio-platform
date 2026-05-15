
import React from 'react';

export const AncestralFooter = () => (
    <footer className="ancestral-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="legacy-logo" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'white' }}>LEGACY.</div>
                <p style={{ color: '#57534e', lineHeight: 2, fontSize: '1.1rem' }}>
                    The foundational high-fidelity distribution node for multi-vertical heritage. Precision engineered for the global institutional registry.
                </p>
            </div>
            <div>
                <h4>CHRONICLES</h4>
                <a href="#" className="footer-link">The Archive</a>
                <a href="#" className="footer-link">Provenance</a>
                <a href="#" className="footer-link">Heritage Map</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
            <div>
                <h4>SYSTEMS</h4>
                <a href="#" className="footer-link">Legacy Hub</a>
                <a href="#" className="footer-link">Distribution</a>
                <a href="#" className="footer-link">Global Sync</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">The Foundation</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #292524', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#444', fontWeight: 800, letterSpacing: '4px' }}>
            <span>© 2026 LEGACY_FOUNDATION. TIMELESS_AUTHORITY.</span>
            <span>v.1.0_CLASSIC</span>
        </div>
    </footer>
);
