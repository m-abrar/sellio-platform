
import React from 'react';

interface ClassicAdCardProps {
    title: string;
    price: string;
    location: string;
    category: string;
    image: string;
}

export const ClassicAdCard = ({ title, price, location, category, image }: ClassicAdCardProps) => (
    <div className="classic-ad-card">
        <img src={image} alt={title} className="classic-ad-img" />
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--uni-gold)', letterSpacing: '2px', marginBottom: '1rem' }}>{category.toUpperCase()}</div>
        <h3 className="classic-ad-title">{title}</h3>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem' }}>{price}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #e7e5e4', fontSize: '0.85rem', color: '#666' }}>
            <span>📍 {location}</span>
            <span style={{ fontWeight: 800 }}>READ_MORE</span>
        </div>
    </div>
);
