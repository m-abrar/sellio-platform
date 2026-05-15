
import React from 'react';

export const LocalFooter = () => (
    <footer className="local-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-friendly)', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--local-green)' }}>SELLIO_LOCAL.</h2>
                <p style={{ color: '#4b5563', lineHeight: 2, fontSize: '1rem' }}>
                    Connecting your neighborhood with verified local professionals. Quality service, just around the corner.
                </p>
            </div>
            <div>
                <h4>SERVICES</h4>
                <a href="#" className="local-footer-link">Home Cleaning</a>
                <a href="#" className="local-footer-link">Maintenance</a>
                <a href="#" className="local-footer-link">Gardening</a>
                <a href="#" className="local-footer-link">Tutoring</a>
            </div>
            <div>
                <h4>FOR_PROS</h4>
                <a href="#" className="local-footer-link">List Your Business</a>
                <a href="#" className="local-footer-link">Pro Protocol</a>
                <a href="#" className="local-footer-link">Insurance Node</a>
            </div>
            <div>
                <h4>SUPPORT</h4>
                <a href="#" className="local-footer-link">Help Center</a>
                <a href="#" className="local-footer-link">Safety Node</a>
                <a href="#" className="local-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155' }}>
            <span>© 2026 SELLIO_LOCAL_NETWORK. TRUSTED_BY_NEIGHBORS.</span>
            <span>v.2.0_COMMUNITY</span>
        </div>
    </footer>
);
