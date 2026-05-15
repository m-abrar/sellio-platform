
import React from 'react';

export const CivicFooter = () => (
    <footer className="civic-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="urban-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--urban-midnight)' }}>URBAN.</div>
                <p style={{ color: 'var(--urban-concrete)', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most advanced high-fidelity urban distribution node. Precision architectural engineering for the modern global skyline.
                </p>
            </div>
            <div>
                <h4>DISTRICTS</h4>
                <a href="#" className="footer-link">Downtown Node</a>
                <a href="#" className="footer-link">Skyline Grid</a>
                <a href="#" className="footer-link">Structural Hub</a>
                <a href="#" className="footer-link">Civic Logic</a>
            </div>
            <div>
                <h4>SYSTEMS</h4>
                <a href="#" className="footer-link">Unit Registry</a>
                <a href="#" className="footer-link">Distribution</a>
                <a href="#" className="footer-link">Global Sync</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Contact Hub</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--urban-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 800, letterSpacing: '3px' }}>
            <span>© 2026 URBAN_NODE_SYSTEMS. STRUCTURAL_AUTHORITY.</span>
            <span>v.8.0_SKYLINE</span>
        </div>
    </footer>
);
