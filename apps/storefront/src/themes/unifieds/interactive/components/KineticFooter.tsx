
import React from 'react';

export const KineticFooter = () => (
    <footer className="kinetic-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="motion-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>MOTION.</div>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most responsive high-fidelity distribution node. Precision motion for the elite digital enthusiast.
                </p>
            </div>
            <div>
                <h4>DYNAMICS</h4>
                <a href="#" className="footer-link">Fluid Logic</a>
                <a href="#" className="footer-link">Kinetic Sync</a>
                <a href="#" className="footer-link">Realtime Nodes</a>
                <a href="#" className="footer-link">Interaction Hub</a>
            </div>
            <div>
                <h4>CHANNELS</h4>
                <a href="#" className="footer-link">Marketplace</a>
                <a href="#" className="footer-link">Automotive</a>
                <a href="#" className="footer-link">Real Estate</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--motion-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#222', fontWeight: 800, letterSpacing: '3px' }}>
            <span>© 2026 MOTION_NODE_SYSTEMS. FLUID_DYNAMICS_ENABLED.</span>
            <span>v.4.0_KINETIC</span>
        </div>
    </footer>
);
