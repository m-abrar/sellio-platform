
import React from 'react';

export const DeepFooter = () => (
    <footer className="deep-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--event-lime)' }}>SELLIO_EXP.</h2>
                <p style={{ color: '#52525b', lineHeight: 2, fontSize: '1rem' }}>
                    Standardizing experimental distribution through high-fidelity event nodes. The future of interaction is decentralized.
                </p>
            </div>
            <div>
                <h4>CHANNELS</h4>
                <a href="#" className="deep-footer-link">Virtual Hub</a>
                <a href="#" className="deep-footer-link">Physical Nodes</a>
                <a href="#" className="deep-footer-link">Hybrid Sync</a>
            </div>
            <div>
                <h4>PROTOCOLS</h4>
                <a href="#" className="deep-footer-link">Access Keys</a>
                <a href="#" className="deep-footer-link">Nodal Logic</a>
                <a href="#" className="deep-footer-link">Security v4</a>
            </div>
            <div>
                <h4>DEVELOPER</h4>
                <a href="#" className="deep-footer-link">API Docs</a>
                <a href="#" className="deep-footer-link">CLI Tools</a>
                <a href="#" className="deep-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #18181b', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#27272a', fontFamily: 'var(--font-mono)' }}>
            <span>© 2026 SELLIO_CREATIVE_SYSTEMS. ALL_NODES_ACTIVE.</span>
            <span>ENCRYPTED_SESSION: AES_256</span>
        </div>
    </footer>
);
