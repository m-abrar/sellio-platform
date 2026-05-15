
import React from 'react';

interface ExperimentalEventCardProps {
    title: string;
    location: string;
    date: string;
    status: string;
}

export const ExperimentalEventCard = ({ title, location, date, status }: ExperimentalEventCardProps) => (
    <div className="exp-card">
        <div className="exp-card-tag">{status.toUpperCase()}</div>
        <h3 className="exp-card-title">{title}</h3>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#52525b', marginBottom: '3rem' }}>
            LOC: {location.toUpperCase()} <br/>
            DAT: {date}
        </div>
        <button style={{ 
            width: '100%', 
            padding: '1.25rem', 
            background: 'none', 
            border: '1px solid #27272a', 
            color: 'white', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.75rem',
            fontWeight: 700,
            transition: 'all 0.3s ease'
        }}>
            ACCESS_KEY_GEN
        </button>
    </div>
);
