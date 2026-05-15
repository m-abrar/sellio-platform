
import React from 'react';

export const NetworkFooter = () => (
    <footer className="network-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="growth-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>GROWTH_NODE<span>.</span></div>
                <p style={{ color: 'var(--growth-dim)', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most advanced high-fidelity startup distribution node. Synchronizing talent with high-growth capital.
                </p>
            </div>
            <div>
                <h4>VENTURES</h4>
                <a href="#" className="footer-link">Seed Hub</a>
                <a href="#" className="footer-link">Series Alpha</a>
                <a href="#" className="footer-link">Unicorn Registry</a>
                <a href="#" className="footer-link">Exit Protocol</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="footer-link">Equity Logic</a>
                <a href="#" className="footer-link">Funding Map</a>
                <a href="#" className="footer-link">Market Status</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">The Foundation</a>
                <a href="#" className="footer-link">Node Registry</a>
                <a href="#" className="footer-link">Contact Hub</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--growth-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155', fontWeight: 700, letterSpacing: '2px' }}>
            <span>© 2026 GROWTH_NODE_SYSTEMS. ALL_SYSTEMS_GO.</span>
            <span>v.4.2_ELITE_VC</span>
        </div>
    </footer>
);
