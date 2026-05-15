
import React from 'react';

export const NeighborhoodFooter = () => (
    <footer className="neighborhood-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '5rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--hood-yellow)' }}>SELLIO_HOOD.</h2>
                <p style={{ color: '#475569', lineHeight: 2, fontSize: '1rem' }}>
                    Strengthening neighborhoods through verified property distribution and community integration nodes.
                </p>
            </div>
            <div>
                <h4>NEIGHBORHOODS</h4>
                <a href="#" className="hood-footer-link">Maplewood</a>
                <a href="#" className="hood-footer-link">Green Valley</a>
                <a href="#" className="hood-footer-link">Silver Springs</a>
                <a href="#" className="hood-footer-link">Oak Ridge</a>
            </div>
            <div>
                <h4>COMMUNITY</h4>
                <a href="#" className="hood-footer-link">Local News</a>
                <a href="#" className="hood-footer-link">School Node</a>
                <a href="#" className="hood-footer-link">Safety Index</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="hood-footer-link">Homeowners Hub</a>
                <a href="#" className="hood-footer-link">HOA Protocol</a>
                <a href="#" className="hood-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155' }}>
            <span>© 2026 SELLIO_HOOD_NETWORK. BETTER_TOGETHER.</span>
            <span>v.1.2_RESIDENTIAL</span>
        </div>
    </footer>
);
