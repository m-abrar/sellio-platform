
import React from 'react';

interface ProductLookbookCardProps {
    name: string;
    price: string;
    image: string;
}

export const ProductLookbookCard = ({ name, price, image }: ProductLookbookCardProps) => (
    <div className="lookbook-card">
        <div className="lookbook-img-wrapper">
            <img src={image} alt={name} className="fashion-img-fill" />
        </div>
        <div className="lookbook-info">
            <h3 className="lookbook-title">{name}</h3>
            <p className="lookbook-price">{price}</p>
        </div>
    </div>
);
