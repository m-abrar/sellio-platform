
import React from 'react';

export const StandardFooter = () => (
    <footer className="standard-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="scale-logo" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>STANDARD.</div>
                <p style={{ color: '#888', lineHeight: 2, fontSize: '0.9rem' }}>
                    The world's most efficient high-fidelity distribution node. Precision engineering for the modern global marketplace.
                </p>
            </div>
            <div>
                <h4>PROTOCOL</h4>
                <a href="#" className="footer-link">Data Layer</a>
                <a href="#" className="footer-link">Sync Engine</a>
                <a href="#" className="footer-link">UI Protocol</a>
                <a href="#" className="footer-link">Auth Node</a>
            </div>
            <div>
                <h4>SYSTEMS</h4>
                <a href="#" className="footer-link">Enterprise Hub</a>
                <a href="#" className="footer-link">Global Registry</a>
                <a href="#" className="footer-link">Distribution</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Privacy</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--scale-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#bbb', fontWeight: 600, letterSpacing: '2px' }}>
            <span>© 2026 SCALE_STANDARD_PROTOCOL. MODULAR_EXCELLENCE.</span>
            <span>v.1.0_SCALE</span>
        </div>
    </footer>
);
