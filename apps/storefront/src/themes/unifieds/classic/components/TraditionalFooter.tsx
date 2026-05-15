
import React from 'react';

export const TraditionalFooter = () => (
    <footer className="traditional-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--uni-gold)' }}>SELLIO_GAZETTE.</h2>
                <p style={{ color: '#a1a1aa', lineHeight: 2, fontSize: '1rem' }}>
                    Preserving the tradition of high-fidelity distribution. The heritage choice for multi-category exchange.
                </p>
            </div>
            <div>
                <h4>CATEGORIES</h4>
                <a href="#" className="traditional-footer-link">Property Ledger</a>
                <a href="#" className="traditional-footer-link">Motor Registry</a>
                <a href="#" className="traditional-footer-link">Career Notices</a>
                <a href="#" className="traditional-footer-link">General Exchange</a>
            </div>
            <div>
                <h4>INSTITUTION</h4>
                <a href="#" className="traditional-footer-link">Our History</a>
                <a href="#" className="traditional-footer-link">Nodal Standards</a>
                <a href="#" className="traditional-footer-link">Privacy Protocol</a>
            </div>
            <div>
                <h4>SUPPORT</h4>
                <a href="#" className="traditional-footer-link">Help Desk</a>
                <a href="#" className="traditional-footer-link">Safety Registry</a>
                <a href="#" className="traditional-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #312e81', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#312e81', fontFamily: 'var(--font-serif)' }}>
            <span>© 2026 SELLIO_GAZETTE_PUBLICATIONS. ESTABLISHED_FOR_EXCELLENCE.</span>
            <span>v.1.0_HERITAGE</span>
        </div>
    </footer>
);
