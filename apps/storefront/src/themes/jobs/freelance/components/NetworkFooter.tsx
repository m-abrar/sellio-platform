
import React from 'react';

export const NetworkFooter = () => (
    <footer className="network-footer">
        <div className="network-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>SELLIO_FLEX.</h2>
                <p style={{ color: '#718096', lineHeight: 2, fontSize: '0.95rem' }}>
                    A decentralized protocol for independent talent distribution. Direct peer-to-peer task execution.
                </p>
            </div>
            <div>
                <h4>CATEGORIES</h4>
                <a href="#" className="network-footer-link">Frontend Ops</a>
                <a href="#" className="network-footer-link">AI & Logic</a>
                <a href="#" className="network-footer-link">Creative Hub</a>
                <a href="#" className="network-footer-link">Smart Contracts</a>
            </div>
            <div>
                <h4>ECOSYSTEM</h4>
                <a href="#" className="network-footer-link">Network Nodes</a>
                <a href="#" className="network-footer-link">Escrow Protocol</a>
                <a href="#" className="network-footer-link">Governance</a>
                <a href="#" className="network-footer-link">Staking</a>
            </div>
            <div>
                <h4>DEVELOPER</h4>
                <a href="#" className="network-footer-link">Documentation</a>
                <a href="#" className="network-footer-link">GitHub Hub</a>
                <a href="#" className="network-footer-link">CLI Tool</a>
                <a href="#" className="network-footer-link">API Nodes</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #4a5568', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4a5568' }}>
            <span>© 2026 SELLIO_FLEX_PROTOCOL. ALL_PROJECTS_VERIFIED.</span>
            <span style={{ color: 'var(--flex-mint)' }}>NETWORK_STATUS: DECENTRALIZED</span>
        </div>
    </footer>
);
