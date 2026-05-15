
import React from 'react';

interface ClassicEstateCardProps {
    title: string;
    price: string;
    location: string;
    year: string;
    image: string;
}

export const ClassicEstateCard = ({ title, price, location, year, image }: ClassicEstateCardProps) => (
    <div className="estate-card">
        <img src={image} alt={title} className="estate-img" />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a8a29e', letterSpacing: '2px', marginBottom: '1rem', display: 'block' }}>ESTABLISHED_{year}</span>
        <h3 className="estate-title">{title}</h3>
        <span className="estate-price">{price}</span>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '3rem' }}>📍 {location}</p>
        <button style={{ 
            width: '100%', 
            padding: '1.25rem', 
            background: 'none', 
            border: '1px solid var(--classic-mahogany)', 
            color: 'var(--classic-mahogany)', 
            fontFamily: 'var(--font-serif)', 
            fontSize: '0.85rem',
            fontWeight: 700,
            fontStyle: 'italic'
        }}>
            VIEW_HISTORY
        </button>
    </div>
);
