
import React from 'react';

export const CircuitFooter = () => (
    <footer className="tech-footer">
        <div className="tech-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-tech)', fontSize: '1.5rem', marginBottom: '2rem' }}>SELLIO_CORE.</h2>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '0.9rem' }}>
                    The world's most advanced hardware distribution network. Direct from manufacturer to workstation.
                </p>
            </div>
            <div>
                <h4>CATEGORIES</h4>
                <a href="#" className="tech-footer-link">Computing</a>
                <a href="#" className="tech-footer-link">Networking</a>
                <a href="#" className="tech-footer-link">Peripheral</a>
            </div>
            <div>
                <h4>SUPPORT</h4>
                <a href="#" className="tech-footer-link">RMA Protocol</a>
                <a href="#" className="tech-footer-link">Drivers</a>
                <a href="#" className="tech-footer-link">Documentation</a>
            </div>
            <div>
                <h4>CONNECT</h4>
                <a href="#" className="tech-footer-link">Terminal</a>
                <a href="#" className="tech-footer-link">Nodes</a>
                <a href="#" className="tech-footer-link">API</a>
            </div>
        </div>
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#444' }}>
            <span>© 2026 SELLIO_TECH_SYSTEMS</span>
            <span style={{ color: 'var(--tech-primary)' }}>STATUS: SYSTEM_OPTIMIZED</span>
        </div>
    </footer>
);
