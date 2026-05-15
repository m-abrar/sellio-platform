
import React from 'react';

export const NexusFooter = () => (
    <footer className="nexus-footer">
        <div className="nexus-footer-grid">
            <div>
                <div className="nexus-logo" style={{ fontSize: '2rem', marginBottom: '2rem' }}>NEXUS_PRIME</div>
                <p style={{ color: 'var(--nexus-dim)', lineHeight: 2 }}>
                    The world's most versatile high-fidelity distribution protocol. Powering the next generation of vertical-specific commerce.
                </p>
            </div>
            <div>
                <h4>ECOSYSTEM</h4>
                <a href="#" className="footer-link">Marketplace</a>
                <a href="#" className="footer-link">Automotive</a>
                <a href="#" className="footer-link">Real Estate</a>
                <a href="#" className="footer-link">Employment</a>
            </div>
            <div>
                <h4>DEVELOPER</h4>
                <a href="#" className="footer-link">Nexus API</a>
                <a href="#" className="footer-link">Core Logic</a>
                <a href="#" className="footer-link">Node Status</a>
                <a href="#" className="footer-link">Documentation</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="footer-link">The Foundation</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Privacy Protocol</a>
                <a href="#" className="footer-link">Security Node</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--nexus-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--nexus-dim)' }}>
            <span>© 2026 NEXUS_PRIME_DISTRIBUTION. ALL_NODES_ACTIVE.</span>
            <span>v.4.0_ELITE</span>
        </div>
    </footer>
);
