
import React from 'react';

export const FilterSidebar = () => (
    <aside className="pc-sidebar">
        <div style={{ marginBottom: '4rem' }}>
            <div className="pc-caps" style={{ opacity: 0.4, marginBottom: '1rem' }}>Search Registry</div>
            <h3 className="pc-serif" style={{ fontSize: '1.75rem', color: 'var(--pc-teal)', fontWeight: 900 }}>
                Refine <span className="pc-italic" style={{ fontWeight: 400 }}>Registry.</span>
            </h3>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Location</label>
            <select className="pc-filter-input">
                <option>All Global Regions</option>
                <option>Hertfordshire, UK</option>
                <option>Florence, Italy</option>
                <option>Loire Valley, France</option>
            </select>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Estate Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.8rem' }}>
                {['Country Manors', 'Historic Chateaus', 'Colonial Estates', 'Royal Castles'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', color: 'var(--pc-text-muted)' }}>
                        <input type="checkbox" style={{ accentColor: 'var(--pc-teal)', width: '16px', height: '16px' }} /> 
                        <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{t.toUpperCase()}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Minimum Bedrooms</label>
            <input type="number" placeholder="Any" className="pc-filter-input" />
        </div>

        <div className="pc-filter-group" style={{ marginBottom: '4rem' }}>
            <label className="pc-filter-label pc-caps">Valuation Range</label>
            <select className="pc-filter-input">
                <option>All Price Points</option>
                <option>$1M - $5M</option>
                <option>$5M - $10M</option>
                <option>$10M+</option>
            </select>
        </div>

        <button className="pc-btn-primary" style={{ width: '100%', padding: '1.5rem' }}>
            REFINE SEARCH
        </button>
        
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.3 }}>
            SECURE ENCRYPTED REGISTRY
        </div>
    </aside>
);
