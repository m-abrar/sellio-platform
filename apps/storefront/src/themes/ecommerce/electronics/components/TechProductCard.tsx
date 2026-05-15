
import React from 'react';

interface TechProductCardProps {
    title: string;
    price: string;
    category: string;
    image: string;
}

export const TechProductCard = ({ title, price, category, image }: TechProductCardProps) => (
    <div className="tech-product-card">
        <div className="tech-product-img">
            <img src={image} alt={title} style={{ width: '70%', height: 'auto', mixBlendMode: 'multiply' }} />
        </div>
        <div className="tech-product-info">
            <div className="tech-product-category">{category}</div>
            <h3 className="tech-product-title">{title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="tech-product-price">{price}</div>
                <button style={{ 
                    background: 'black', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.7rem', 
                    fontWeight: 900 
                }}>
                    UPGRADE
                </button>
            </div>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--tech-primary)' }}></div>
    </div>
);
