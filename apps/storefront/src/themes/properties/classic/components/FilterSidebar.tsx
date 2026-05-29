
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
        <div className="pc-sidebar-header">
            <div className="pc-caps" style={{ opacity: 0.4 }}>Search Registry</div>
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
                {locations?.map((l) => (
                  <option key={l.id} value={l.slug}>
                    {l.title}, {l.country || ''}
                  </option>
                ))}
            </select>
        </div>

        <div className="pc-filter-group">
            <label className="pc-filter-label pc-caps">Estate Category</label>
            <div className="pc-category-list" style={{ fontSize: '0.8rem' }}>
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <label key={c.id} className="pc-category-option">
                      <input
                        type="checkbox"
                        checked={String(selectedCategory) === String(c.id)}
                        onChange={() =>
                          onCategoryChange?.(String(selectedCategory) === String(c.id) ? '' : c.id)
                        }
                      />
                      <span>{c.title.toUpperCase()}</span>
                    </label>
                  ))
                ) : (
                  <p className="pc-sidebar-empty-hint">No categories loaded from the registry yet.</p>
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

        <div className="pc-filter-group">
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

        <div className="pc-filter-actions">
          <button
            type="button"
            className="pc-btn-primary"
            style={{
              width: '100%',
              padding: '1.5rem',
              backgroundColor: 'var(--pc-accent, #8b6b4d)',
              color: '#ffffff',
              border: '1px solid var(--pc-accent, #8b6b4d)',
            }}
            onClick={() => onRefine?.()}
          >
              REFINE SEARCH
          </button>
        </div>
        
        <div className="pc-sidebar-footnote pc-caps" style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.3 }}>
            SECURE ENCRYPTED REGISTRY
        </div>
    </aside>
);
