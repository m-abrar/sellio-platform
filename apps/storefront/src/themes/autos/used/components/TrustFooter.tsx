
import React from 'react';

export const TrustFooter = () => (
    <footer className="used-footer">
        <div className="used-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_CERTIFIED.</h2>
                <p style={{ color: '#64748b', lineHeight: 2, fontSize: '0.9rem' }}>
                    Transparent pre-owned vehicle distribution. Every listing verified by our 150-point inspection protocol.
                </p>
            </div>
            <div>
                <h4>BUYING</h4>
                <a href="#" className="used-footer-link">Search Inventory</a>
                <a href="#" className="used-footer-link">Certified Pre-Owned</a>
                <a href="#" className="used-footer-link">Online Purchase</a>
                <a href="#" className="used-footer-link">Delivery Nodes</a>
            </div>
            <div>
                <h4>SELLING</h4>
                <a href="#" className="used-footer-link">Instant Offer</a>
                <a href="#" className="used-footer-link">Trade-In Value</a>
                <a href="#" className="used-footer-link">Seller Protocol</a>
            </div>
            <div>
                <h4>SUPPORT</h4>
                <a href="#" className="used-footer-link">Protection Plans</a>
                <a href="#" className="used-footer-link">Roadside Assist</a>
                <a href="#" className="used-footer-link">Maintenance</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span>© 2026 SELLIO_AUTO_GROUP. ALL_RIGHTS_RESERVED.</span>
            <span style={{ color: 'var(--auto-accent)' }}>TRUST_SCORE: 4.9/5.0</span>
        </div>
    </footer>
);
