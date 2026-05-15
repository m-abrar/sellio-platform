
import React from 'react';

interface CleanCardProps {
    title: string;
    price: string;
    category: string;
    image: string;
}

export const CleanCard = ({ title, price, category, image }: CleanCardProps) => (
    <div className="min-card">
        <img src={image} alt={title} className="min-card-img" />
        <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.4, marginBottom: '0.5rem' }}>{category.toUpperCase()}</div>
        <h3 className="min-card-title">{title}</h3>
        <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{price}</div>
        <button style={{ 
            marginTop: '2rem', 
            width: '100%', 
            background: 'black', 
            color: 'white', 
            border: 'none', 
            padding: '1rem', 
            fontSize: '0.7rem', 
            fontWeight: 900,
            textTransform: 'uppercase'
        }}>
            ADD_TO_CART
        </button>
    </div>
);
