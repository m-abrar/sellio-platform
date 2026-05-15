
import React from 'react';

export const VoltageFooter = () => (
    <footer className="voltage-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="sonic-logo" style={{ fontSize: '3rem', marginBottom: '2rem' }}>SONIC.</div>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '1rem' }}>
                    The world's premier high-fidelity music distribution node. Synchronizing the global sonic pulse through vertical-specific logic.
                </p>
            </div>
            <div>
                <h4>CHANNELS</h4>
                <a href="#" className="footer-link">Techno Node</a>
                <a href="#" className="footer-link">Mainstage</a>
                <a href="#" className="footer-link">Ambient Grid</a>
                <a href="#" className="footer-link">Industrial</a>
            </div>
            <div>
                <h4>ACCESS</h4>
                <a href="#" className="footer-link">Ticket Registry</a>
                <a href="#" className="footer-link">Artist Portal</a>
                <a href="#" className="footer-link">VIP Protocol</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Global Nodes</a>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--sonic-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#222', fontWeight: 800, letterSpacing: '3px' }}>
            <span>© 2026 SONIC_PULSE_DISTRIBUTION. LOUD_AND_CLEAR.</span>
            <span>v.9.0_MEGAWATT</span>
        </div>
    </footer>
);
