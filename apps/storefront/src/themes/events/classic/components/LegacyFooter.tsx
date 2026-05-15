
import React from 'react';

export const LegacyFooter = () => (
    <footer className="legacy-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--classic-gold)' }}>SELLIO_LEGACY.</h2>
                <p style={{ color: '#444', lineHeight: 2, fontSize: '1rem' }}>
                    Standardizing cultural distribution through institutional nodes. Preserving the heritage of the arts.
                </p>
            </div>
            <div>
                <h4>INSTITUTIONS</h4>
                <a href="#" className="legacy-footer-link">The Grand Opera</a>
                <a href="#" className="legacy-footer-link">Symphonic Node</a>
                <a href="#" className="legacy-footer-link">National Gallery</a>
                <a href="#" className="legacy-footer-link">Theatre Royal</a>
            </div>
            <div>
                <h4>PATRONAGE</h4>
                <a href="#" className="legacy-footer-link">Membership</a>
                <a href="#" className="legacy-footer-link">Institutional Grant</a>
                <a href="#" className="legacy-footer-link">Endowments</a>
            </div>
            <div>
                <h4>PROTOCOLS</h4>
                <a href="#" className="legacy-footer-link">Ticketing Node</a>
                <a href="#" className="legacy-footer-link">Privacy</a>
                <a href="#" className="legacy-footer-link">Archive</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#222' }}>
            <span>© 2026 SELLIO_LEGACY_FOUNDATION. ALL_REPERTOIRE_RESERVED.</span>
            <span>ESTABLISHED_MCMXCVII</span>
        </div>
    </footer>
);
