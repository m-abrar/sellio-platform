
'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';

interface EstateCardProps {
    title: string;
    price: string;
    location: string;
    tag: string;
    image: string;
    slug: string;
}

const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
        const isPreview = window.location.pathname.startsWith('/preview/');
        if (isPreview) {
            const themeKey = window.location.pathname.split('/')[2];
            return `/preview/${themeKey}${path}`;
        }
    }
    return path;
};

const EstateCard = ({ title, price, location, tag, image, slug }: EstateCardProps) => {
    const handleClick = () => {
        window.location.href = getThemeLink(`/product/${slug}`);
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
    { title: "The Obsidian Villa", price: "$12,400,000", location: "Beverly Hills", tag: "NEW_LISTING", image: "/themes/properties/luxury/3.webp", slug: "pemberley-manor" },
    { title: "Azure Coast Estate", price: "$8,900,000", location: "Malibu", tag: "FEATURED", image: "/themes/properties/luxury/4.webp", slug: "florentine-palazzo" },
];

export const EstateShowcase = () => {
    const [estates, setEstates] = useState<EstateCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [useFallback, setUseFallback] = useState(false);

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
                        tag: prop.is_featured ? 'FEATURED' : 'SIGNATURE',
                        image: prop.featured_image || prop.primary_image_url || '/themes/properties/luxury/3.webp',
                        slug: prop.slug
                    }));
                    setEstates(mapped);
                    setUseFallback(false);
                    setApiError(null);
                } else {
                    console.warn("Properties Luxury: API returned empty list. Falling back to static mock data.");
                    setApiError("Database returned no listings. Ensure seeders have run.");
                    setEstates(FALLBACK_ESTATES);
                    setUseFallback(true);
                }
            } catch (error: any) {
                console.error("Properties Luxury: Failed to fetch active properties:", error);
                setApiError(error instanceof Error ? error.message : String(error));
                setEstates(FALLBACK_ESTATES);
                setUseFallback(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <section className="estate-showcase">
            <div style={{ marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>CURATED_COLLECTION</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 900, marginTop: '1rem' }}>Exceptional Residences.</h2>
            </div>

            {useFallback && apiError && (
                <div style={{
                    padding: '1.5rem',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid var(--luxury-gold)',
                    borderRadius: '4px',
                    marginBottom: '4rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    color: 'var(--luxury-charcoal)',
                    lineHeight: '1.6',
                    maxWidth: '800px'
                }}>
                    <span style={{ fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                        System Connection Diagnostic Warning
                    </span>
                    <p style={{ margin: 0, color: '#666' }}>
                        The storefront is running in <strong>Offline Fallback Mode</strong> because it was unable to establish a connection to the Laravel API database.
                    </p>
                    <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: 'rgba(0,0,0,0.03)', 
                        borderLeft: '3px solid var(--luxury-gold)', 
                        fontFamily: 'monospace', 
                        fontSize: '0.75rem', 
                        color: '#888',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                    }}>
                        {apiError}
                    </div>
                </div>
            )}

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
                    <button 
                        onClick={() => window.location.href = '/preview/properties_luxury/explore'}
                        className="luxury-btn-primary"
                        style={{
                            background: 'none',
                            color: 'var(--luxury-charcoal)',
                            border: '1px solid var(--luxury-charcoal)',
                            padding: '1.5rem 5rem',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            letterSpacing: '3px',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            textTransform: 'uppercase'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--luxury-charcoal)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--luxury-charcoal)';
                        }}
                    >
                        EXPLORE_FULL_PORTFOLIO
                    </button>
                </div>
            )}
        </section>
    );
};

