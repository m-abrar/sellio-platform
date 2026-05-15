
import React from 'react';

export const LuxuryAmenities = () => (
    <section className="luxury-amenities">
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>WHITE_GLOVE_EXPERIENCE</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 700, marginTop: '1rem' }}>The Platinum Standard.</h2>
        </div>
        <div className="amenity-grid">
            <div className="amenity-item">
                <span className="amenity-icon">🏛️</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Private Concierge</h4>
                <p style={{ color: '#888', lineHeight: 1.8 }}>Dedicated nodal representation for all asset acquisitions.</p>
            </div>
            <div className="amenity-item">
                <span className="amenity-icon">🚁</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Global Mobility</h4>
                <p style={{ color: '#888', lineHeight: 1.8 }}>Private transportation nodes integrated with every estate.</p>
            </div>
            <div className="amenity-item">
                <span className="amenity-icon">🛡️</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Asset Verification</h4>
                <p style={{ color: '#888', lineHeight: 1.8 }}>Institutional-grade verification for every luxury listing.</p>
            </div>
            <div className="amenity-item">
                <span className="amenity-icon">🌐</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Exclusive Network</h4>
                <div style={{ color: '#888', lineHeight: 1.8 }}>Access to off-market distribution nodes globally.</div>
            </div>
        </div>
    </section>
);
