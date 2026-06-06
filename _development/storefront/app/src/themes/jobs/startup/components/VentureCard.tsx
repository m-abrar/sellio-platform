
import React from 'react';

interface VentureCardProps {
    title: string;
    company: string;
    equity: string;
    location: string;
    tags: string[];
}

export const VentureCard = ({ title, company, equity, location, tags }: VentureCardProps) => (
    <div className="venture-card">
        <div className="venture-logo">
            <div style={{ color: 'white', fontWeight: 900 }}>{company[0]}</div>
        </div>
        <span className="venture-tag">{company.toUpperCase()}</span>
        <h3 className="venture-title">{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {tags.map((tag, i) => (
                <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '4px', color: '#94a3b8' }}>{tag}</span>
            ))}
        </div>
        <div className="venture-meta">
            <span>📍 {location}</span>
            <span style={{ color: '#ec4899', fontWeight: 800 }}>💰 {equity} EQUITY</span>
        </div>
        <button style={{ 
            width: '100%', 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'transparent', 
            border: '1px solid rgba(255,255,255,0.1)', 
            color: 'white', 
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer'
        }}>APPLY_NOW</button>
    </div>
);
