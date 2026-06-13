
import React from 'react';

export const LuxuryAmenities = () => (
    <section className="luxury-amenities">
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>White Glove Experience</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 700, marginTop: '1rem' }}>The Platinum Standard.</h2>
        </div>
        <div className="amenity-grid">
            <div className="amenity-item">
                <span className="amenity-icon">🏛️</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Private Concierge</h4>
                <p style={{ color: '#888', lineHeight: 1.8 }}>Dedicated representation for every acquisition, from first inquiry to closing.</p>
            </div>
            <div className="amenity-item">
                <span className="amenity-icon">🚁</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Global Mobility</h4>
                <p style={{ color: '#888', lineHeight: 1.8 }}>Private transportation arranged for viewings at estates worldwide.</p>
            </div>
            <div className="amenity-item">
                <span className="amenity-icon">🛡️</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Asset Verification</h4>
                <p style={{ color: '#888', lineHeight: 1.8 }}>Institutional-grade verification for every luxury listing.</p>
            </div>
            <div className="amenity-item">
                <span className="amenity-icon">🌐</span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Exclusive Network</h4>
                <div style={{ color: '#888', lineHeight: 1.8 }}>Access to off-market listings across global prime markets.</div>
            </div>
        </div>
    </section>
);
