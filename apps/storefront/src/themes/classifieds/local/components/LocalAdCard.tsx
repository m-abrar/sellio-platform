
import React from 'react';

interface LocalAdCardProps {
    title: string;
    price: string;
    location: string;
    category: string;
    image: string;
}

export const LocalAdCard = ({ title, price, location, category, image }: LocalAdCardProps) => (
    <div className="ad-card">
        <div className="ad-img-wrapper">
            <img src={image} alt={title} className="ad-img" />
            <div className="ad-price">{price}</div>
        </div>
        <div className="ad-info">
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--local-orange)', marginBottom: '0.5rem' }}>{category.toUpperCase()}</div>
            <h3 className="ad-title">{title}</h3>
            <div className="ad-meta">
                <span>📍 {location}</span>
                <span>Active</span>
            </div>
        </div>
    </div>
);
