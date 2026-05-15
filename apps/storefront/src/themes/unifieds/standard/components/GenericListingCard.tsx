
import React from 'react';

interface GenericListingCardProps {
    title: string;
    price: string;
    type: string;
    image: string;
}

export const GenericListingCard = ({ title, price, type, image }: GenericListingCardProps) => (
    <div className="generic-listing-card">
        <img src={image} alt={title} className="gen-img" />
        <div className="gen-info">
            <div className="gen-type">{type}</div>
            <h3 className="gen-title">{title}</h3>
            <div className="gen-price">{price}</div>
        </div>
    </div>
);
