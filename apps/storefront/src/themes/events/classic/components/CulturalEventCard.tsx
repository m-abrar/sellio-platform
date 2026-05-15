
import React from 'react';

interface CulturalEventCardProps {
    title: string;
    location: string;
    date: string;
    category: string;
}

export const CulturalEventCard = ({ title, location, date, category }: CulturalEventCardProps) => (
    <div className="cultural-card">
        <span className="cultural-card-date">{date}</span>
        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '2px', marginBottom: '1rem' }}>{category.toUpperCase()}</div>
        <h3 className="cultural-card-title">{title}</h3>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '3rem' }}>📍 {location}</p>
        <button style={{ 
            background: 'none', 
            border: '1px solid var(--classic-gold)', 
            color: 'var(--classic-gold)', 
            padding: '1rem 3rem', 
            fontFamily: 'var(--font-serif)', 
            fontSize: '0.8rem', 
            fontWeight: 700 
        }}>
            VIEW_PROGRAM
        </button>
    </div>
);
