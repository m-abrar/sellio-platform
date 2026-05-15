
import React from 'react';

interface CreativeServiceCardProps {
    title: string;
    description: string;
    index: string;
}

export const CreativeServiceCard = ({ title, description, index }: CreativeServiceCardProps) => (
    <div className="creative-card">
        <span className="creative-card-index">{index}</span>
        <h3 className="creative-card-title">{title}</h3>
        <p style={{ opacity: 0.6, lineHeight: 1.8, fontSize: '1.1rem' }}>{description}</p>
        <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            START_PROJECT_PROTOCOL
        </div>
    </div>
);
