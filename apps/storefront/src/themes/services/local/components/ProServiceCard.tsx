
import React from 'react';

interface ProServiceCardProps {
    title: string;
    rating: string;
    reviews: string;
    image: string;
    starting: string;
}

export const ProServiceCard = ({ title, rating, reviews, image, starting }: ProServiceCardProps) => (
    <div className="pro-card">
        <div style={{ position: 'relative' }}>
            <img src={image} alt={title} className="pro-img" />
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--local-surface)', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--local-navy)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                VERIFIED PRO
            </div>
        </div>
        <div className="pro-info">
            <h3 className="pro-title">{title}</h3>
            <div className="pro-rating">★ {rating} <span style={{ color: 'var(--local-text)', fontWeight: 600, opacity: 0.6 }}>({reviews} reviews)</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--local-border)', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--local-text)' }}>From {starting}</div>
                <button style={{ background: 'var(--local-navy)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', transition: 'var(--local-transition)', cursor: 'pointer' }}>BOOK</button>
            </div>
        </div>
    </div>
);
