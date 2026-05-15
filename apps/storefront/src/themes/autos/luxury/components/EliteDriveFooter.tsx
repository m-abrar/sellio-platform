
import React from 'react';

export const EliteDriveFooter = () => (
    <footer className="elite-drive-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="diamond-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>DIAMOND.</div>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '1rem' }}>
                    The world's premier high-fidelity automotive distribution node. Precision engineered for the elite enthusiast.
                </p>
            </div>
            <div>
                <h4>COLLECTIONS</h4>
                <a href="#" className="footer-link">Exotic Registry</a>
                <a href="#" className="footer-link">Track Protocol</a>
                <a href="#" className="footer-link">Heritage Drive</a>
                <a href="#" className="footer-link">Electric Luxe</a>
            </div>
            <div>
                <h4>EXPERIENCE</h4>
                <a href="#" className="footer-link">Test Pilot Hub</a>
                <a href="#" className="footer-link">Bespoke Design</a>
                <a href="#" className="footer-link">Track Days</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Global Nodes</a>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--drive-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#222', fontWeight: 800, letterSpacing: '3px' }}>
            <span>© 2026 DIAMOND_DRIVE_SYSTEMS. PRECISION_GUARANTEED.</span>
            <span>v.2.4_TURBO_ELITE</span>
        </div>
    </footer>
);
