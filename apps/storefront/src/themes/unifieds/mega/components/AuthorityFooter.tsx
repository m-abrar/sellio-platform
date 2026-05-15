
import React from 'react';

export const AuthorityFooter = () => (
    <footer className="authority-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <div className="mega-logo" style={{ fontSize: '3rem', marginBottom: '2rem', color: 'white' }}>MEGA.</div>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '1.1rem' }}>
                    The world's most robust high-fidelity distribution node. Precision engineered for high-capacity institutional commerce.
                </p>
            </div>
            <div>
                <h4>STRUCTURE</h4>
                <a href="#" className="footer-link">Capacity Hub</a>
                <a href="#" className="footer-link">Grid Logic</a>
                <a href="#" className="footer-link">Redundancy</a>
                <a href="#" className="footer-link">Throughput</a>
            </div>
            <div>
                <h4>CHANNELS</h4>
                <a href="#" className="footer-link">Automotive</a>
                <a href="#" className="footer-link">Real Estate</a>
                <a href="#" className="footer-link">Marketplace</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Global Nodes</a>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#222', fontWeight: 900, letterSpacing: '4px' }}>
            <span>© 2026 MEGA_GRID_DISTRIBUTION. HEAVY_DUTY_PERFORMANCE.</span>
            <span>v.12.0_INDUSTRIAL</span>
        </div>
    </footer>
);
