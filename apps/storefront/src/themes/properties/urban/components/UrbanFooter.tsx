
import React from 'react';

export const UrbanFooter = () => (
    <footer className="urban-footer">
        <div className="urban-footer-grid">
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_URBAN.</h2>
                <p style={{ color: '#475569', lineHeight: 2 }}>
                    Connecting the next generation of city dwellers with the heartbeat of the metropolis.
                </p>
            </div>
            <div>
                <h4>DISTRICTS</h4>
                <a href="#" className="urban-footer-link">Downtown Core</a>
                <a href="#" className="urban-footer-link">West End Lofts</a>
                <a href="#" className="urban-footer-link">Financial District</a>
                <a href="#" className="urban-footer-link">The Heights</a>
            </div>
            <div>
                <h4>LIFESTYLE</h4>
                <a href="#" className="urban-footer-link">Amenities</a>
                <a href="#" className="urban-footer-link">Concierge</a>
                <a href="#" className="urban-footer-link">Sustainability</a>
                <a href="#" className="urban-footer-link">Community</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="urban-footer-link">Apply Now</a>
                <a href="#" className="urban-footer-link">Tenant Portal</a>
                <a href="#" className="urban-footer-link">Neighborhood Guides</a>
                <a href="#" className="urban-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155' }}>
            <span>© 2026 SELLIO_URBAN_NETWORK. ALL_RIGHTS_RESERVED.</span>
            <span>METRO_v1.0</span>
        </div>
    </footer>
);
