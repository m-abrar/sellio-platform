
import React from 'react';

export const ExchangeFooter = () => (
    <footer className="exchange-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="trade-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'white' }}>TRADE.</div>
                <p style={{ color: '#475569', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most liquid high-fidelity distribution node. Precision transactional engineering for the modern global marketplace.
                </p>
            </div>
            <div>
                <h4>EXCHANGE</h4>
                <a href="#" className="footer-link">Marketplace</a>
                <a href="#" className="footer-link">Liquid Sync</a>
                <a href="#" className="footer-link">Trade Logic</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
            <div>
                <h4>SYSTEMS</h4>
                <a href="#" className="footer-link">Peer Node</a>
                <a href="#" className="footer-link">Distribution</a>
                <a href="#" className="footer-link">Global Sync</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155', fontWeight: 800, letterSpacing: '3px' }}>
            <span>© 2026 TRADE_NODE_EXCHANGE. LIQUID_COMMERCE.</span>
            <span>v.5.0_TRADE</span>
        </div>
    </footer>
);
