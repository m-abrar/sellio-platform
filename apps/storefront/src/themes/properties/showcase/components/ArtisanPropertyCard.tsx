
import React from 'react';

interface ArtisanPropertyCardProps {
    title: string;
    price: string;
    location: string;
    description: string;
    image: string;
}

export const ArtisanPropertyCard = ({ title, price, location, description, image }: ArtisanPropertyCardProps) => (
    <div className="artisan-card">
        <div className="artisan-img-wrapper">
            <img src={image} alt={title} className="artisan-img" />
        </div>
        <div className="artisan-info">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '4px', color: '#444', display: 'block', marginBottom: '2rem' }}>{location.toUpperCase()}</span>
            <h3>{title}</h3>
            <span className="artisan-price">{price}</span>
            <p style={{ color: '#888', lineHeight: 2, marginBottom: '4rem', fontSize: '1.1rem' }}>{description}</p>
            <button style={{ 
                background: 'var(--show-gold)', 
                color: 'black', 
                border: 'none', 
                padding: '1.5rem 4rem', 
                fontFamily: 'var(--font-serif)', 
                fontSize: '0.9rem', 
                fontWeight: 900 
            }}>
                VIEW_DOSSIER
            </button>
        </div>
    </div>
);
