
'use client';

'use client';

import React from 'react';
import { getThemeLink } from '../utils';

interface StructureItemProps {
    title: string;
    units: string;
    area: string;
    icon: string;
    slug?: string;
    image?: string;
    price?: string;
    location?: string;
}

const StructureItem = ({ title, units, area, icon, slug, image, price, location }: StructureItemProps) => {
    const content = (
        <div className="structure-card-premium">
            <div className="structure-card-image">
                {image ? (
                    <img src={image} alt={title} loading="lazy" />
                ) : (
                    <div className="structure-card-image-fallback" aria-hidden="true">{icon}</div>
                )}
            </div>
            <div className="structure-card-body">
                <h3>{title}</h3>
                {location && <p className="structure-card-location">{location}</p>}
                {price && <div className="structure-card-price">{price}</div>}
                <div className="structure-card-meta">
                    <div>
                        <div className="structure-card-meta-label">AVAILABLE_UNITS</div>
                        <div className="structure-card-meta-value">{units}</div>
                    </div>
                    <div>
                        <div className="structure-card-meta-label">TOTAL_AREA</div>
                        <div className="structure-card-meta-value structure-card-meta-area">{area}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (slug) {
        return (
            <a className="prop-structure-link" href={getThemeLink(`/product/${slug}`)}>
                {content}
            </a>
        );
    }

    return content;
};

interface StructureGridProps {
    items?: StructureItemProps[];
    loading?: boolean;
    error?: string | null;
}

export const StructureGrid = ({ items = [], loading = false, error = null }: StructureGridProps) => (
    <section className="structure-grid-section" id="urban-structure-grid">
        <div className="structure-grid-header">
            <span className="structure-grid-kicker">STRUCTURAL_SCHEMA_V4</span>
            <h2>Urban Assets.</h2>
        </div>
        <div className="structure-grid">
            {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                    <div className="structure-card-premium prop-listing-skeleton" key={index}>
                        <div className="structure-card-image structure-card-skeleton-image" />
                        <div className="structure-card-body">
                            <div className="prop-skeleton-line prop-skeleton-line-title" />
                            <div className="prop-skeleton-line" />
                            <div className="prop-skeleton-line prop-skeleton-line-short" />
                        </div>
                    </div>
                ))
            ) : error ? (
                <div className="prop-listing-state">
                    <div className="prop-listing-kicker">Property Sync Offline</div>
                    <h3>Urban assets could not be loaded.</h3>
                    <p>{error}</p>
                </div>
            ) : items.length === 0 ? (
                <div className="prop-listing-state">
                    <div className="prop-listing-kicker">Empty Property Registry</div>
                    <h3>No live properties are published yet.</h3>
                    <p>Add property records in the backend and this structural grid will hydrate automatically.</p>
                </div>
            ) : (
                items.map((item) => <StructureItem key={item.slug || item.title} {...item} />)
            )}
        </div>
    </section>
);
