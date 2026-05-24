
import React from 'react';

interface StructureItemProps {
    title: string;
    units: string;
    area: string;
    icon: string;
    slug?: string;
}

const StructureItem = ({ title, units, area, icon, slug }: StructureItemProps) => {
    const content = (
        <div className="structure-card-premium">
            <div style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{icon}</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--urban-border)' }}>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--urban-concrete)', letterSpacing: '2px' }}>AVAILABLE_UNITS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--urban-skyline)' }}>{units}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--urban-concrete)', letterSpacing: '2px' }}>TOTAL_AREA</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{area}</div>
                </div>
            </div>
        </div>
    );

    if (slug) {
        return (
            <a className="prop-structure-link" href={`/product/${slug}`}>
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
    <section className="structure-grid-section">
        <div style={{ marginBottom: '6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--urban-skyline)', letterSpacing: '6px' }}>STRUCTURAL_SCHEMA_V4</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-2px' }}>Urban Assets.</h2>
        </div>
        <div className="structure-grid">
            {loading ? (
                [1, 2, 3].map((item) => (
                    <div className="structure-card-premium prop-listing-skeleton" key={item}>
                        <div className="prop-skeleton-line prop-skeleton-line-title" />
                        <div className="prop-skeleton-line" />
                        <div className="prop-skeleton-line prop-skeleton-line-short" />
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
