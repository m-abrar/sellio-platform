
import React from 'react';

interface HomeCardProps {
    title: string;
    price: string;
    location: string;
    status: string;
    image: string;
}

export const HomeCard = ({ title, price, location, status, image }: HomeCardProps) => (
    <div className="home-card">
        <div className="home-img-wrapper">
            <img src={image} alt={title} className="home-img" />
            <div className="home-badge">{status.toUpperCase()}</div>
        </div>
        <div className="home-info">
            <h3 className="home-title">{title}</h3>
            <div className="home-price">{price}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>📍 {location}</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ flex: 1, padding: '1rem', background: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem' }}>DETAILS</button>
                <button style={{ padding: '1rem 2rem', background: 'var(--hood-green)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem' }}>TOUR</button>
            </div>
        </div>
    </div>
);
