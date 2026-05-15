
import React from 'react';

export const InstitutionalFooter = () => (
    <footer className="institutional-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="origin-logo" style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>SELLIO_CORE</div>
                <p style={{ color: '#94a3b8', lineHeight: 2, fontSize: '1rem' }}>
                    The foundational high-fidelity distribution node for multi-vertical commerce. Precision engineered for the global institutional registry.
                </p>
            </div>
            <div>
                <h4>PLATFORM</h4>
                <a href="#" className="footer-link">Core Engine</a>
                <a href="#" className="footer-link">Distribution</a>
                <a href="#" className="footer-link">High-Fidelity UI</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
            <div>
                <h4>SOLUTIONS</h4>
                <a href="#" className="footer-link">Enterprise</a>
                <a href="#" className="footer-link">Sovereign Island</a>
                <a href="#" className="footer-link">Global Sync</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="footer-link">The Foundation</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', fontWeight: 700, letterSpacing: '2px' }}>
            <span>© 2026 SELLIO_CORE_FOUNDATION. INSTITUTIONAL_GRADE.</span>
            <span>v.1.0_ORIGIN</span>
        </div>
    </footer>
);
