
import React from 'react';

export const LegacyFooter = () => (
    <footer className="heritage-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--classic-white)' }}>SELLIO_HERITAGE.</h2>
                <p style={{ color: '#a8a29e', lineHeight: 2, fontSize: '1rem' }}>
                    Preserving architectural legacy through verified institutional distribution. Established for the discerning estate holder.
                </p>
            </div>
            <div>
                <h4>ESTATES</h4>
                <a href="#" className="heritage-footer-link">Country Manors</a>
                <a href="#" className="heritage-footer-link">Historic Palazzos</a>
                <a href="#" className="heritage-footer-link">Colonial Estates</a>
                <a href="#" className="heritage-footer-link">Legacy Castles</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="heritage-footer-link">Registry Node</a>
                <a href="#" className="heritage-footer-link">Preservation Protocol</a>
                <a href="#" className="heritage-footer-link">Archival Logic</a>
            </div>
            <div>
                <h4>PATRONAGE</h4>
                <a href="#" className="heritage-footer-link">Membership</a>
                <a href="#" className="heritage-footer-link">Institutional Grant</a>
                <a href="#" className="heritage-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #521d1d', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#78350f', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            <span>© 2026 SELLIO_HERITAGE_FOUNDATION. PRESERVING_THE_PAST.</span>
            <span>FOUNDED_MCMXCIX</span>
        </div>
    </footer>
);
