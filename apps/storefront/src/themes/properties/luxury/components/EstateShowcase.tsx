
import React from 'react';

interface EstateCardProps {
    title: string;
    price: string;
    location: string;
    tag: string;
    image: string;
}

const EstateCard = ({ title, price, location, tag, image }: EstateCardProps) => (
    <div className="estate-card-premium">
        <div style={{ overflow: 'hidden' }}>
            <img src={image} alt={title} className="estate-card-img" />
        </div>
        <div className="estate-card-info">
            <span className="estate-card-tag">{tag}</span>
            <h3 className="estate-card-title">{title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{price}</span>
                <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{location.toUpperCase()}</span>
            </div>
        </div>
    </div>
);

export const EstateShowcase = () => {
    const estates = [
        { title: "The Obsidian Villa", price: "$12,400,000", location: "Beverly Hills", tag: "NEW_LISTING", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
        { title: "Azure Coast Estate", price: "$8,900,000", location: "Malibu", tag: "FEATURED", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080" },
    ];

    return (
        <section className="estate-showcase">
            <div style={{ marginBottom: '6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>CURATED_COLLECTION</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 900, marginTop: '1rem' }}>Exceptional Residences.</h2>
            </div>
            <div className="showcase-grid">
                {estates.map((e, i) => <EstateCard key={i} {...e} />)}
            </div>
        </section>
    );
};
