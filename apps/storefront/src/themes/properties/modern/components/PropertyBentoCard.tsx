
import React from 'react';

interface PropertyBentoCardProps {
    title: string;
    price: string;
    tag: string;
    image: string;
    span?: string;
}

export const PropertyBentoCard = ({ title, price, tag, image, span = 'col-span-4' }: PropertyBentoCardProps) => (
    <div className={`prop-card ${span}`}>
        <div className="prop-card-img-wrapper">
            <img src={image} alt={title} className="prop-card-img" />
        </div>
        <div className="prop-card-info">
            <span className="prop-card-tag">{tag}</span>
            <h3 className="prop-card-title">{title}</h3>
            <p className="prop-card-price">{price}</p>
        </div>
    </div>
);
