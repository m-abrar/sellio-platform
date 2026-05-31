'use client';

import React from 'react';
import type { Category, Location } from '@sellio/types';

interface ExploreFiltersProps {
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

export const ExploreFilters = ({
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
  onRefine,
}: ExploreFiltersProps) => (
  <aside className="pm-explore-sidebar">
    <div className="pm-explore-sidebar__header">
      <span className="structure-grid-kicker">Filters</span>
      <h3>Refine your search</h3>
    </div>

    <div className="pm-filter-group">
      <label className="pm-filter-label">Location</label>
      <select
        className="pm-filter-input"
        value={selectedLocation || ''}
        onChange={(e) => onLocationChange?.(e.target.value)}
      >
        <option value="">All locations</option>
        {locations?.map((location) => (
          <option key={location.id} value={location.slug}>
            {location.title}
            {location.country ? `, ${location.country}` : ''}
          </option>
        ))}
      </select>
    </div>

    <div className="pm-filter-group">
      <label className="pm-filter-label">Property type</label>
      <div className="pm-category-list">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <label key={category.id} className="pm-category-option">
              <input
                type="checkbox"
                checked={String(selectedCategory) === String(category.id)}
                onChange={() =>
                  onCategoryChange?.(
                    String(selectedCategory) === String(category.id) ? '' : category.id,
                  )
                }
              />
              <span>{category.title}</span>
            </label>
          ))
        ) : (
          <p className="pm-filter-hint">No property types are available yet.</p>
        )}
      </div>
    </div>

    <div className="pm-filter-group">
      <label className="pm-filter-label">Minimum Bedrooms</label>
      <input
        type="number"
        placeholder="Any"
        className="pm-filter-input"
        value={selectedBedrooms || ''}
        onChange={(e) => onBedroomsChange?.(e.target.value)}
        min={0}
      />
    </div>

    <div className="pm-filter-group">
      <label className="pm-filter-label">Price range</label>
      <select
        className="pm-filter-input"
        value={selectedPriceRange || ''}
        onChange={(e) => onPriceRangeChange?.(e.target.value)}
      >
        <option value="">Any price</option>
        <option value="1m-5m">$1M – $5M</option>
        <option value="5m-10m">$5M – $10M</option>
        <option value="10m-plus">$10M+</option>
      </select>
    </div>

    <button type="button" className="urban-btn-primary pm-filter-submit" onClick={onRefine}>
      Apply Filters
    </button>
  </aside>
);
