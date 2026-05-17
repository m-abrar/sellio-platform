
import React from 'react';

export const StudioFooter = () => (
    <footer className="avant-footer">
        <div className="avant-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', fontStyle: 'italic' }}>THE ATELIER.</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 2, fontSize: '0.95rem', fontWeight: 300, maxWidth: '350px' }}>
                    A global standard for high-design services and creative intellectual property. Defining the aesthetic future since 2026.
                </p>
            </div>
            <div>
                <h4>COLLECTIONS</h4>
                <a href="#" className="avant-footer-link">Brand Identities</a>
                <a href="#" className="avant-footer-link">Digital Product</a>
                <a href="#" className="avant-footer-link">Spatial Motion</a>
                <a href="#" className="avant-footer-link">The Lab</a>
            </div>
            <div>
                <h4>STUDIOS</h4>
                <a href="#" className="avant-footer-link">Antwerp</a>
                <a href="#" className="avant-footer-link">Stockholm</a>
                <a href="#" className="avant-footer-link">New York</a>
                <a href="#" className="avant-footer-link">Tokyo</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="avant-footer-link">The Archive</a>
                <a href="#" className="avant-footer-link">Design Protocol</a>
                <a href="#" className="avant-footer-link">Journal</a>
                <a href="#" className="avant-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>
            <span>© 2026 THE ATELIER // DESIGN SYSTEMS</span>
            <span>PRIVACY & TERMS</span>
        </div>
    </footer>
);
