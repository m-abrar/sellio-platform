
import React from 'react';

export const SunnyFooter = () => (
    <footer className="sunny-footer">
        <div className="sunny-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--vacay-primary)' }}>SELLIO_ESCAPE.</h2>
                <p style={{ color: '#64748b', lineHeight: 2, fontSize: '0.95rem' }}>
                    Distributing the world's most beautiful retreats through the Sellio global node network.
                </p>
            </div>
            <div>
                <h4>DESTINATIONS</h4>
                <a href="#" className="sunny-footer-link">Mediterranean Coast</a>
                <a href="#" className="sunny-footer-link">Alpine Retreats</a>
                <a href="#" className="sunny-footer-link">Tropical Islands</a>
                <a href="#" className="sunny-footer-link">Nordic Cabins</a>
            </div>
            <div>
                <h4>GUEST_SERVICES</h4>
                <a href="#" className="sunny-footer-link">Concierge Protocol</a>
                <a href="#" className="sunny-footer-link">Travel Insurance</a>
                <a href="#" className="sunny-footer-link">Local Guides</a>
                <a href="#" className="sunny-footer-link">Private Chefs</a>
            </div>
            <div>
                <h4>PARTNERSHIPS</h4>
                <a href="#" className="sunny-footer-link">List Your Retreat</a>
                <a href="#" className="sunny-footer-link">Agency Nodes</a>
                <a href="#" className="sunny-footer-link">Developer API</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <span>© 2026 SELLIO_ESCAPE_GLOBAL. ALL_VIBES_RESERVED.</span>
            <span>CLIMATE_NEUTRAL_ESTATE</span>
        </div>
    </footer>
);
