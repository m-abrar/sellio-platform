
import React from 'react';

interface SpecialistCardProps {
    name: string;
    title: string;
    image: string;
    rating: string;
    availability: string;
}

export const SpecialistCard = ({ name, title, image, rating, availability }: SpecialistCardProps) => (
    <div className="specialist-card">
        <div className="specialist-img-circle">
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h3 className="specialist-name">{name}</h3>
        <p className="specialist-title">{title}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', color: '#f59e0b', marginBottom: '1.5rem' }}>
            {"★".repeat(5)}
            <span style={{ color: '#6b7280', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({rating})</span>
        </div>
        <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>AVAILABLE: {availability}</span>
        </div>
        <button style={{ 
            width: '100%', 
            padding: '0.85rem', 
            background: 'transparent', 
            border: '1px solid #e5e7eb', 
            color: '#111827', 
            borderRadius: '8px', 
            fontWeight: 700,
            fontSize: '0.85rem'
        }}>VIEW_PROFILE</button>
    </div>
);
