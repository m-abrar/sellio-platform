
import React from 'react';

export const AtelierFooter = () => (
    <footer className="atelier-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--show-gold)' }}>SELLIO_ATELIER.</h2>
                <p style={{ color: '#333', lineHeight: 2, fontSize: '1.1rem' }}>
                    Distributing the world's most significant architectural achievements through verified institutional nodes.
                </p>
            </div>
            <div>
                <h4>COLLECTIONS</h4>
                <a href="#" className="atelier-footer-link">Historic Estates</a>
                <a href="#" className="atelier-footer-link">Modernist Gems</a>
                <a href="#" className="atelier-footer-link">Island Retreats</a>
                <a href="#" className="atelier-footer-link">Urban Sanctuaries</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="atelier-footer-link">The Foundation</a>
                <a href="#" className="atelier-footer-link">Curation Protocol</a>
                <a href="#" className="atelier-footer-link">Archive Node</a>
            </div>
            <div>
                <h4>LEGACY</h4>
                <a href="#" className="atelier-footer-link">Privacy Policy</a>
                <a href="#" className="atelier-footer-link">Terms of Use</a>
                <a href="#" className="atelier-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '5rem', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#1a1a1a', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            <span>© 2026 SELLIO_COLLECTION_FOUNDATION. PRESERVING_ARCHITECTURE.</span>
            <span>v.1.0_EDITORIAL</span>
        </div>
    </footer>
);
