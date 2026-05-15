
import React from 'react';

interface StandardPropCardProps {
    title: string;
    price: string;
    location: string;
    type: string;
    image: string;
}

export const StandardPropCard = ({ title, price, location, type, image }: StandardPropCardProps) => (
    <div className="standard-card">
        <img src={image} alt={title} className="standard-img" />
        <div className="standard-info">
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--uni-blue)', marginBottom: '0.5rem' }}>{type.toUpperCase()}</div>
            <h3 className="standard-title">{title}</h3>
            <div className="standard-price">{price}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--uni-slate)', marginBottom: '1.5rem' }}>📍 {location}</div>
            <div className="standard-meta">
                <span>VIEW_DETAILS</span>
                <span>SAVE</span>
            </div>
        </div>
    </div>
);
