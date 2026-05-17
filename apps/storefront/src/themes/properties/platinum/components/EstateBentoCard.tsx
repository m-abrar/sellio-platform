
import React from 'react';

interface EstateBentoCardProps {
    title: string;
    price: string;
    image: string;
    span?: string;
}

export const EstateBentoCard = ({ title, price, image, span = 'span-4' }: EstateBentoCardProps) => (
    <div className={`lux-bento-card ${span}`}>
        <img src={image} alt={title} className="lux-bento-img" />
        <div className="lux-bento-content">
            <div className="lux-bento-price">{price}</div>
            <div className="lux-bento-title">{title.toUpperCase()}</div>
        </div>
    </div>
);
