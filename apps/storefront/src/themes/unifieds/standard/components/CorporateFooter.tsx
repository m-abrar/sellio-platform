
import React from 'react';

export const CorporateFooter = () => (
    <footer className="corporate-footer">
        <div className="corp-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--std-blue)' }}>SELLIO_STANDARD.</h2>
                <p style={{ color: 'var(--std-slate)', lineHeight: 2, fontSize: '0.9rem' }}>
                    The high-fidelity standard for multi-vertical distribution. Reliable, scalable, and verified by the global node network.
                </p>
            </div>
            <div>
                <h4>VERTICALS</h4>
                <a href="#" className="corp-footer-link">Marketplace</a>
                <a href="#" className="corp-footer-link">Properties</a>
                <a href="#" className="corp-footer-link">Autos</a>
                <a href="#" className="corp-footer-link">Jobs</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="corp-footer-link">Help Center</a>
                <a href="#" className="corp-footer-link">Safety Node</a>
                <a href="#" className="corp-footer-link">Privacy</a>
            </div>
            <div>
                <h4>INSTITUTIONAL</h4>
                <a href="#" className="corp-footer-link">Partner Portal</a>
                <a href="#" className="corp-footer-link">API Access</a>
                <a href="#" className="corp-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--std-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--std-slate)' }}>
            <span>© 2026 SELLIO_STANDARD_SYSTEMS. ALL_RIGHTS_RESERVED.</span>
            <span>v.1.0_SCALE</span>
        </div>
    </footer>
);
