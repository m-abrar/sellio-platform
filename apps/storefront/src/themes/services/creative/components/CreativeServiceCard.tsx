
import React from 'react';

interface CreativeServiceCardProps {
    title: string;
    description: string;
    index: string;
    image?: string;
}

export const CreativeServiceCard = ({ title, description, index, image }: CreativeServiceCardProps) => (
    <div className="creative-card">
        <div className="creative-image-wrapper">
            <img src={image || 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2000'} alt={title} />
        </div>
        <span className="creative-card-index">{index} / NETWORK</span>
        <h3 className="creative-card-title">{title}</h3>
        <p style={{ fontWeight: 300, lineHeight: 1.8, fontSize: '1.05rem', color: 'rgba(0,0,0,0.6)' }}>{description}</p>
        <div style={{ marginTop: '3rem', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--atelier-gold)' }}>
            EXPLORE CASE STUDY →
        </div>
    </div>
);
