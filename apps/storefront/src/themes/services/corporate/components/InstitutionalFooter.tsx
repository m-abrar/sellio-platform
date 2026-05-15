
import React from 'react';

export const InstitutionalFooter = () => (
    <footer className="inst-footer">
        <div className="inst-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_CORP.</h2>
                <p style={{ color: '#4a5568', lineHeight: 2, fontSize: '0.95rem' }}>
                    Standardizing institutional service distribution through global infrastructure.
                </p>
            </div>
            <div>
                <h4>SOLUTIONS</h4>
                <a href="#" className="inst-footer-link">Strategy & Ops</a>
                <a href="#" className="inst-footer-link">Financial Tech</a>
                <a href="#" className="inst-footer-link">Legal Nodes</a>
                <a href="#" className="inst-footer-link">Risk Management</a>
            </div>
            <div>
                <h4>GOVERNANCE</h4>
                <a href="#" className="inst-footer-link">Compliance</a>
                <a href="#" className="inst-footer-link">Verification</a>
                <a href="#" className="inst-footer-link">Data Protocol</a>
                <a href="#" className="inst-footer-link">Ethics</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="inst-footer-link">Research</a>
                <a href="#" className="inst-footer-link">Investor Relations</a>
                <a href="#" className="inst-footer-link">Support</a>
                <a href="#" className="inst-footer-link">Terminal Access</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #2c5282', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#4a5568' }}>
            <span>© 2026 SELLIO_INSTITUTIONAL_HOLDINGS. ALL_RIGHTS_RESERVED.</span>
            <span>SYSTEMS_v4.2</span>
        </div>
    </footer>
);
