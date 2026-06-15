'use client';

import React from 'react';
import { useModernThemeLink } from '../hooks/useModernThemeLink';

interface StructureItemProps {
    title: string;
    units: string;
    area: string;
    icon: string;
    slug?: string;
    image?: string;
    price?: string;
    location?: string;
    listingLabel?: string;
    beds?: string;
    baths?: string;
}

const StructureItem = ({
    title,
    units,
    area,
    icon,
    slug,
    image,
    price,
    location,
    listingLabel,
    beds,
    baths,
    themeLink,
}: StructureItemProps & { themeLink: (path: string) => string }) => {
    const content = (
        <div className="structure-card-premium">
            <div className="structure-card-image">
                {image ? (
                    <img src={image} alt={title} loading="lazy" />
                ) : (
                    <div className="structure-card-image-fallback" aria-hidden="true">{icon}</div>
                )}
                {listingLabel && <span className="structure-card-badge">{listingLabel}</span>}
            </div>
            <div className="structure-card-body">
                <h3>{title}</h3>
                {location && <p className="structure-card-location">{location}</p>}
                {price && <div className="structure-card-price">{price}</div>}
                <div className="structure-card-meta">
                    <div>
                        <div className="structure-card-meta-label">Beds</div>
                        <div className="structure-card-meta-value">{beds || units}</div>
                    </div>
                    <div>
                        <div className="structure-card-meta-label">Baths</div>
                        <div className="structure-card-meta-value">{baths || 'TBA'}</div>
                    </div>
                    <div>
                        <div className="structure-card-meta-label">Floor area</div>
                        <div className="structure-card-meta-value structure-card-meta-area">{area}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (slug) {
        return (
            <a className="prop-structure-link" href={themeLink(`/product/${slug}`)}>
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
    showExploreLink?: boolean;
}

export const StructureGrid = ({
    items = [],
    loading = false,
    error = null,
    showExploreLink = true,
}: StructureGridProps) => {
    const themeLink = useModernThemeLink();

    return (
    <section className="structure-grid-section" id="urban-structure-grid">
        <div className="structure-grid-header">
            <span className="structure-grid-kicker">Featured listings</span>
            <div className="structure-grid-header-row">
              <h2>Properties</h2>
              {showExploreLink && (
                <a href={themeLink('/explore')} className="urban-btn-secondary structure-grid-explore-link">
                  View all properties
                </a>
              )}
            </div>
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
                    <div className="prop-listing-kicker">Unable to load</div>
                    <h3>Properties could not be loaded.</h3>
                    <p>{error}</p>
                </div>
            ) : items.length === 0 ? (
                <div className="prop-listing-state">
                    <div className="prop-listing-kicker">No listings yet</div>
                    <h3>No properties are published yet.</h3>
                    <p>Add and publish properties in the admin panel to show them here.</p>
                </div>
            ) : (
                items.map((item) => (
                    <StructureItem key={item.slug || item.title} {...item} themeLink={themeLink} />
                ))
            )}
        </div>
    </section>
    );
};
