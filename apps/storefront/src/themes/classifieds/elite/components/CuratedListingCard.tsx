
import React from 'react';

interface CuratedListingCardProps {
    title: string;
    price: string;
    category: string;
    image: string;
}

export const CuratedListingCard = ({ title, price, category, image }: CuratedListingCardProps) => (
    <div className="elite-card">
        <div className="elite-card-img-wrapper">
            <img src={image} alt={title} className="elite-card-img" />
        </div>
        <div className="elite-card-content">
            <span className="elite-card-tag">{category.toUpperCase()}</span>
            <h3 className="elite-card-title">{title}</h3>
            <p className="elite-card-price">{price}</p>
        </div>
    </div>
);
