
import React from 'react';

interface ListingGridCardProps {
    title: string;
    price: string;
    location: string;
    time: string;
    image: string;
}

export const ListingGridCard = ({ title, price, location, time, image }: ListingGridCardProps) => (
    <div className="listing-card">
        <img src={image} alt={title} className="listing-img" />
        <div className="listing-info">
            <div className="listing-price">{price}</div>
            <div className="listing-title">{title}</div>
            <div className="listing-meta">
                <span>📍 {location}</span>
                <span>{time}</span>
            </div>
        </div>
    </div>
);
