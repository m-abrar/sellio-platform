
import React from 'react';

interface FestivalCardProps {
    title: string;
    location: string;
    date: string;
    image: string;
}

export const FestivalCard = ({ title, location, date, image }: FestivalCardProps) => (
    <div className="fest-card">
        <img src={image} alt={title} className="fest-card-img" />
        <div className="fest-card-overlay">
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--fest-pink)', letterSpacing: '4px', marginBottom: '1rem' }}>{date}</div>
            <h3 className="fest-card-title">{title.toUpperCase()}</h3>
            <div style={{ fontSize: '0.9rem', opacity: 0.6, letterSpacing: '2px' }}>📍 {location}</div>
            <button style={{ 
                marginTop: '2rem', 
                background: 'white', 
                color: 'black', 
                border: 'none', 
                padding: '0.8rem 2rem', 
                fontSize: '0.7rem', 
                fontWeight: 900 
            }}>
                VIEW_DETAILS
            </button>
        </div>
    </div>
);
