
import React from 'react';

export const CommercialFooter = () => (
    <footer className="comm-footer">
        <div className="comm-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_COMMERCIAL.</h2>
                <p style={{ color: '#64748b', lineHeight: 2, fontSize: '0.95rem' }}>
                    Providing the institutional infrastructure for global real estate liquidity.
                </p>
            </div>
            <div>
                <h4>ASSET_CLASSES</h4>
                <a href="#" className="comm-footer-link">Office Complexes</a>
                <a href="#" className="comm-footer-link">Industrial & Logistics</a>
                <a href="#" className="comm-footer-link">Retail Centers</a>
                <a href="#" className="comm-footer-link">Mixed Use</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="comm-footer-link">Market Reports</a>
                <a href="#" className="comm-footer-link">Investor Portal</a>
                <a href="#" className="comm-footer-link">Research</a>
                <a href="#" className="comm-footer-link">Sustainability</a>
            </div>
            <div>
                <h4>LEGAL</h4>
                <a href="#" className="comm-footer-link">Compliance</a>
                <a href="#" className="comm-footer-link">Terms of Access</a>
                <a href="#" className="comm-footer-link">Data Protection</a>
                <a href="#" className="comm-footer-link">Disclosures</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569' }}>
            <span>© 2026 SELLIO_CORE_HOLDINGS. ALL_RIGHTS_RESERVED.</span>
            <span>ESTABLISHED_2018</span>
        </div>
    </footer>
);
