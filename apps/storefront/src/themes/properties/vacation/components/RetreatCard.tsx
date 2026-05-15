
import React from 'react';

interface RetreatCardProps {
    title: string;
    location: string;
    price: string;
    image: string;
    rating: string;
}

export const RetreatCard = ({ title, location, price, image, rating }: RetreatCardProps) => (
    <div className="retreat-card">
        <img src={image} alt={title} className="retreat-img" />
        <div className="retreat-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--vacay-accent)' }}>★ {rating}</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>VERIFIED_ESCAPE</span>
            </div>
            <h3 className="retreat-title">{title}</h3>
            <div className="retreat-location">📍 {location}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="retreat-price">{price} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>/ night</span></div>
                <button style={{ background: 'none', border: '1px solid #ddd', padding: '0.5rem 1.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>EXPLORE</button>
            </div>
        </div>
    </div>
);
