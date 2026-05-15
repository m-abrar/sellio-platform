
import React from 'react';

interface UnitCardProps {
    title: string;
    price: string;
    location: string;
    beds: string;
    sqft: string;
    image: string;
}

export const UnitCard = ({ title, price, location, beds, sqft, image }: UnitCardProps) => (
    <div className="unit-card">
        <img src={image} alt={title} className="unit-img" />
        <div className="unit-info">
            <div className="unit-price">{price}</div>
            <div className="unit-title">{title}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📍 {location}
            </div>
            <div className="unit-meta">
                <span>🛏️ {beds} Beds</span>
                <span>📐 {sqft} SQFT</span>
            </div>
        </div>
    </div>
);
