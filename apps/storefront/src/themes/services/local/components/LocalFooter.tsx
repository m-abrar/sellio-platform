
import React from 'react';

export const LocalFooter = () => (
    <footer className="local-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--local-green)', letterSpacing: '-1px' }}>PRO LOCAL.</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 2, fontSize: '0.95rem', fontWeight: 500, maxWidth: '350px' }}>
                    Connecting your neighborhood with verified local professionals. Quality service, just around the corner.
                </p>
            </div>
            <div>
                <h4>Services</h4>
                <a href="#" className="local-footer-link">Home Cleaning</a>
                <a href="#" className="local-footer-link">Maintenance</a>
                <a href="#" className="local-footer-link">Gardening</a>
                <a href="#" className="local-footer-link">Tutoring</a>
            </div>
            <div>
                <h4>For Pros</h4>
                <a href="#" className="local-footer-link">List Your Business</a>
                <a href="#" className="local-footer-link">Pro Standards</a>
                <a href="#" className="local-footer-link">Insurance Node</a>
            </div>
            <div>
                <h4>Support</h4>
                <a href="#" className="local-footer-link">Help Center</a>
                <a href="#" className="local-footer-link">Safety Node</a>
                <a href="#" className="local-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
            <span>© 2026 PRO LOCAL NETWORK. ALL RIGHTS RESERVED.</span>
            <span>TRUSTED BY NEIGHBORS</span>
        </div>
    </footer>
);
