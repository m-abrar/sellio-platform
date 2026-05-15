
import React from 'react';

interface ProductCardProps {
    name: string;
    price: string;
    image: string;
}

const ProductCard = ({ name, price, image }: ProductCardProps) => (
    <div className="product-card-premium">
        <div className="product-img-wrapper">
            <img src={image} alt={name} className="product-img" />
        </div>
        <h3 className="product-title">{name}</h3>
        <div className="product-price">{price}</div>
    </div>
);

export const ProductShowcase = () => {
    const products = [
        { name: "Silk Evening Gown", price: "$4,200", image: "https://images.unsplash.com/photo-1539008835657-9e8e96800057?q=80&w=2070" },
        { name: "Sculptural Leather Bag", price: "$2,850", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2070" },
        { name: "Cashmere Overcoat", price: "$5,400", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2072" },
    ];

    return (
        <section className="product-showcase">
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--atelier-gold)', letterSpacing: '4px' }}>SELECTED_PIECES</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 700, marginTop: '1.5rem' }}>The Autumn Edit.</h2>
            </div>
            <div className="product-grid">
                {products.map((p, i) => <ProductCard key={i} {...p} />)}
            </div>
        </section>
    );
};
