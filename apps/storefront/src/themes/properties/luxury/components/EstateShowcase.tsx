
'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

interface EstateCardProps {
    title: string;
    price: string;
    location: string;
    tag: string;
    image: string;
    slug: string;
}

const EstateCard = ({ title, price, location, tag, image, slug }: EstateCardProps) => {
    const themeLink = usePropertyThemeLink();

    const handleClick = () => {
        window.location.href = themeLink(`/product/${slug}`);
    };

    return (
        <div className="estate-card-premium" onClick={handleClick}>
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
};

const FALLBACK_ESTATES = [
    { title: "The Obsidian Villa", price: "$12,400,000", location: "Beverly Hills", tag: "New Listing", image: "/themes/properties/luxury/3.webp", slug: "pemberley-manor" },
    { title: "Azure Coast Estate", price: "$8,900,000", location: "Malibu", tag: "Featured", image: "/themes/properties/luxury/4.webp", slug: "florentine-palazzo" },
];

export const EstateShowcase = () => {
    const themeLink = usePropertyThemeLink();
    const [estates, setEstates] = useState<EstateCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await api.getProperties({ per_page: 6 });
                if (response && response.data && response.data.length > 0) {
                    const mapped = response.data.map((prop: Property) => ({
                        title: prop.title,
                        price: prop.pricing?.price_formatted || (prop.base_price ? `$${Number(prop.base_price).toLocaleString()}` : ''),
                        location: prop.location?.title || prop.city || 'Exclusive Location',
                        tag: prop.is_featured ? 'Featured' : 'Signature',
                        image: prop.featured_image || prop.primary_image_url || '/themes/properties/luxury/3.webp',
                        slug: prop.slug
                    }));
                    setEstates(mapped);
                } else {
                    setEstates(FALLBACK_ESTATES);
                }
            } catch {
                setEstates(FALLBACK_ESTATES);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <section className="estate-showcase">
            <div style={{ marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>Curated Collection</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 900, marginTop: '1rem' }}>Exceptional Residences.</h2>
            </div>

            {loading ? (
                <div className="showcase-grid">
                    {[1, 2].map((i) => (
                        <div key={i} className="estate-card-premium" style={{ opacity: 0.5 }}>
                            <div style={{ overflow: 'hidden', aspectRatio: '4/5', background: '#f5f5f5' }}></div>
                            <div className="estate-card-info">
                                <div style={{ height: '0.7rem', width: '30%', background: '#e5e5e5', marginBottom: '1rem' }}></div>
                                <div style={{ height: '2.5rem', width: '80%', background: '#e5e5e5', marginBottom: '1rem' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ height: '1.25rem', width: '40%', background: '#e5e5e5' }}></div>
                                    <div style={{ height: '0.8rem', width: '25%', background: '#e5e5e5' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="showcase-grid">
                    {estates.map((e, i) => <EstateCard key={i} {...e} />)}
                </div>
            )}

            {!loading && estates.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6rem' }}>
                    <a
                        href={themeLink('/explore')}
                        className="luxury-btn-primary"
                        style={{
                            background: 'none',
                            color: 'var(--luxury-charcoal)',
                            border: '1px solid var(--luxury-charcoal)',
                            padding: '1.5rem 5rem',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            letterSpacing: '3px',
                            textDecoration: 'none',
                            display: 'inline-block',
                            textTransform: 'uppercase'
                        }}
                    >
                        View Full Portfolio
                    </a>
                </div>
            )}
        </section>
    );
};
