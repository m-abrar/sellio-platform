
import React from 'react';

export const AvantFooter = () => (
    <footer className="avant-footer">
        <div className="avant-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>SELLIO_STUDIO.</h2>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '1rem' }}>
                    A global distribution node for high-design services and creative intellectual property.
                </p>
            </div>
            <div>
                <h4>CRAFT</h4>
                <a href="#" className="avant-footer-link">Brand Identity</a>
                <a href="#" className="avant-footer-link">Digital Nodes</a>
                <a href="#" className="avant-footer-link">Motion Systems</a>
            </div>
            <div>
                <h4>NODES</h4>
                <a href="#" className="avant-footer-link">Zurich</a>
                <a href="#" className="avant-footer-link">Milan</a>
                <a href="#" className="avant-footer-link">Paris</a>
            </div>
            <div>
                <h4>ARCHIVE</h4>
                <a href="#" className="avant-footer-link">Collection 2026</a>
                <a href="#" className="avant-footer-link">Protocol Manual</a>
                <a href="#" className="avant-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#222' }}>
            <span>© 2026 SELLIO_CREATIVE_SYSTEMS. ALL_RIGHTS_RESERVED.</span>
            <span>v.01_AVANT</span>
        </div>
    </footer>
);
