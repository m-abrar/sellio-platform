
import React from 'react';

export const GeographicFooter = () => (
    <footer className="geographic-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <div className="map-logo" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>MAP.</div>
                <p style={{ color: '#64748b', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most precise high-fidelity geographical distribution node. Mapping the global property registry with spatial logic.
                </p>
            </div>
            <div>
                <h4>SPATIAL</h4>
                <a href="#" className="footer-link">Cartography</a>
                <a href="#" className="footer-link">Spatial Sync</a>
                <a href="#" className="footer-link">Grid Logic</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
            <div>
                <h4>SYSTEMS</h4>
                <a href="#" className="footer-link">Geo Node</a>
                <a href="#" className="footer-link">Distribution</a>
                <a href="#" className="footer-link">Global Sync</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Verification</a>
                <a href="#" className="footer-link">Governance</a>
                <a href="#" className="footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--map-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 800, letterSpacing: '4px' }}>
            <span>© 2026 MAP_NODE_SYSTEMS. SPATIAL_INTEGRITY_VERIFIED.</span>
            <span>v.4.0_CARTOGRAPHIC</span>
        </div>
    </footer>
);
