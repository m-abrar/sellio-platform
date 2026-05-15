
import React from 'react';

interface RentCardProps {
    title: string;
    price: string;
    type: string;
    location: string;
    beds: string;
    baths: string;
    image: string;
}

export const RentCard = ({ title, price, type, location, beds, baths, image }: RentCardProps) => (
    <div className="rent-card">
        <div className="rent-img-wrapper">
            <img src={image} alt={title} className="rent-img" />
            <div className="rent-badge">{type.toUpperCase()}</div>
        </div>
        <div className="rent-info">
            <div className="rent-price">{price} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/ mo</span></div>
            <div className="rent-title">{title}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '2rem' }}>📍 {location}</div>
            <div className="rent-meta">
                <span>🛏️ {beds} Beds</span>
                <span>🚿 {baths} Baths</span>
            </div>
            <button style={{ 
                width: '100%', 
                marginTop: '2rem', 
                background: '#f1f5f9', 
                border: 'none', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--rent-dark)',
                transition: 'background 0.3s ease'
            }}>
                SCHEDULE_TOUR
            </button>
        </div>
    </div>
);
