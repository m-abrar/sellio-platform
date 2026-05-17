
import React from 'react';

export const ExclusiveFooter = () => (
    <footer className="lux-footer">
        <span className="lux-footer-logo">OBSIDIAN.</span>
        <div className="lux-footer-grid">
            <div className="lux-footer-col">
                <h4>THE_ESTATE</h4>
                <p style={{ opacity: 0.4, lineHeight: 2, fontSize: '0.9rem' }}>
                    Curating the world's most significant architectural achievements for the discerning collector.
                </p>
            </div>
            <div className="lux-footer-col">
                <h4>COLLECTIONS</h4>
                <a href="#" className="lux-footer-link">Urban Sanctuaries</a>
                <a href="#" className="lux-footer-link">Coastal Retreats</a>
                <a href="#" className="lux-footer-link">Mountain Estates</a>
            </div>
            <div className="lux-footer-col">
                <h4>NODES</h4>
                <a href="#" className="lux-footer-link">Zurich</a>
                <a href="#" className="lux-footer-link">Dubai</a>
                <a href="#" className="lux-footer-link">New York</a>
            </div>
            <div className="lux-footer-col">
                <h4>PROTOCOL</h4>
                <a href="#" className="lux-footer-link">Acquisition</a>
                <a href="#" className="lux-footer-link">Validation</a>
                <a href="#" className="lux-footer-link">Privacy</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', opacity: 0.2, fontSize: '0.7rem', letterSpacing: '2px' }}>
            © 2026 SELLIO_ELITE_PROPERTIES. ALL_RIGHTS_RESERVED.
        </div>
    </footer>
);
