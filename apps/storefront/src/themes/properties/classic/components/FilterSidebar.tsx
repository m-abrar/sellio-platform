
import React from 'react';
import type { Category, Location } from '@sellio/types';

interface FilterSidebarProps {
  categories?: Category[];
  locations?: Location[];
  selectedLocation?: string | number;
  selectedCategory?: string | number;
  selectedBedrooms?: string | number;
  selectedPriceRange?: string;
  onLocationChange?: (id: string | number) => void;
  onCategoryChange?: (id: string | number) => void;
  onBedroomsChange?: (val: string) => void;
  onPriceRangeChange?: (val: string) => void;
  onRefine?: () => void;
}

export const FilterSidebar = ({
  categories,
  locations,
  selectedLocation,
  selectedCategory,
  selectedBedrooms,
  selectedPriceRange,
  onLocationChange,
  onCategoryChange,
  onBedroomsChange,
  onPriceRangeChange,
  onRefine
}: FilterSidebarProps) => (
    <aside className="pc-sidebar">
        <div style={{ marginBottom: '4rem' }}>
            <div className="pc-caps" style={{ opacity: 0.4, marginBottom: '1rem' }}>Search Registry</div>
            <h3 className="pc-serif" style={{ fontSize: '1.75rem', color: 'var(--pc-teal)', fontWeight: 900 }}>
                Refine <span className="pc-italic" style={{ fontWeight: 400 }}>Registry.</span>
            </h3>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Location</label>
            <select 
              className="pc-filter-input"
              value={selectedLocation || ''}
              onChange={(e) => onLocationChange?.(e.target.value)}
            >
                <option value="">All Global Regions</option>
                {locations && locations.length > 0 ? (
                  locations.map(l => (
                    <option key={l.id} value={l.slug}>{l.title}, {l.country || ''}</option>
                  ))
                ) : (
                  <>
                    <option value="Hertfordshire, UK">Hertfordshire, UK</option>
                    <option value="Florence, Italy">Florence, Italy</option>
                    <option value="Loire Valley, France">Loire Valley, France</option>
                  </>
                )}
            </select>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Estate Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.8rem' }}>
                {categories && categories.length > 0 ? (
                  categories.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', color: 'var(--pc-text-muted)' }}>
                        <input 
                          type="checkbox" 
                          checked={String(selectedCategory) === String(c.id)}
                          onChange={() => onCategoryChange?.(String(selectedCategory) === String(c.id) ? '' : c.id)}
                          style={{ accentColor: 'var(--pc-teal)', width: '16px', height: '16px' }} 
                        /> 
                        <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{c.title.toUpperCase()}</span>
                    </label>
                  ))
                ) : (
                  ['Country Manors', 'Historic Chateaus', 'Colonial Estates', 'Royal Castles'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', color: 'var(--pc-text-muted)' }}>
                        <input type="checkbox" style={{ accentColor: 'var(--pc-teal)', width: '16px', height: '16px' }} /> 
                        <span style={{ fontWeight: 600, letterSpacing: '1px' }}>{t.toUpperCase()}</span>
                    </label>
                  ))
                )}
            </div>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Minimum Bedrooms</label>
            <input 
              type="number" 
              placeholder="Any" 
              className="pc-filter-input"
              value={selectedBedrooms || ''}
              onChange={(e) => onBedroomsChange?.(e.target.value)}
              min="0"
            />
        </div>

        <div className="pc-filter-group" style={{ marginBottom: '4rem' }}>
            <label className="pc-filter-label pc-caps">Valuation Range</label>
            <select 
              className="pc-filter-input"
              value={selectedPriceRange || ''}
              onChange={(e) => onPriceRangeChange?.(e.target.value)}
            >
                <option value="">All Price Points</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m-10m">$5M - $10M</option>
                <option value="10m-plus">$10M+</option>
            </select>
        </div>

        <button 
          className="pc-btn-primary" 
          style={{ width: '100%', padding: '1.5rem' }}
          onClick={() => onRefine?.()}
        >
            REFINE SEARCH
        </button>
        
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.3 }}>
            SECURE ENCRYPTED REGISTRY
        </div>
    </aside>
);
