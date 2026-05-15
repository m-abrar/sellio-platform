
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
        <img src={image} alt={title} className="pro-img" />
        <div className="pro-info">
            <h3 className="pro-title">{title}</h3>
            <div className="pro-rating">★ {rating} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({reviews} reviews)</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Starts at {starting}</div>
                <button style={{ background: 'none', border: '1px solid #ddd', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>BOOK</button>
            </div>
        </div>
    </div>
);
