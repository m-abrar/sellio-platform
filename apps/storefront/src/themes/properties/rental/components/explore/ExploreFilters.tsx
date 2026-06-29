'use client';

import React from 'react';
import type { Category, Location } from '@/types';
import { getMonthlyRentPriceRangeOptions } from '../../explore-utils';

interface ExploreFiltersProps {
  categories?: Category[];
  locations?: Location[];
  selectedLocation?: string | number;
  selectedCategory?: string | number;
  selectedBedrooms?: string | number;
  selectedPriceRange?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onLocationChange?: (id: string | number) => void;
  onCategoryChange?: (id: string | number) => void;
  onBedroomsChange?: (val: string) => void;
  onPriceRangeChange?: (val: string) => void;
  onRefine?: () => void;
  onClear?: () => void;
}

export function ExploreFilters({
  categories,
  locations,
  selectedLocation,
  selectedCategory,
  selectedBedrooms,
  selectedPriceRange,
  mobileOpen = false,
  onMobileClose,
  onLocationChange,
  onCategoryChange,
  onBedroomsChange,
  onPriceRangeChange,
  onRefine,
  onClear,
}: ExploreFiltersProps) {
  const priceOptions = getMonthlyRentPriceRangeOptions();

  return (
    <>
      <button
        type="button"
        className={`pr-explore-filters-backdrop ${mobileOpen ? 'is-open' : ''}`}
        aria-label="Close filters"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onMobileClose}
      />

      <aside
        className={`pr-explore-sidebar ${mobileOpen ? 'pr-explore-sidebar--open' : ''}`}
        aria-label="Search filters"
      >
        <div className="pr-explore-sidebar__header">
          <div>
            <span className="pr-mono pr-explore-sidebar__kicker">Filters</span>
            <h3>Refine results</h3>
          </div>
          <button
            type="button"
            className="pr-explore-sidebar__close"
            aria-label="Close filters"
            onClick={onMobileClose}
          >
            ×
          </button>
        </div>

        <div className="pr-filter-group">
          <label className="pr-filter-label" htmlFor="pr-filter-location">
            Location
          </label>
          <select
            id="pr-filter-location"
            className="pr-filter-input"
            value={selectedLocation || ''}
            onChange={(event) => onLocationChange?.(event.target.value)}
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

        <div className="pr-filter-group">
          <span className="pr-filter-label">Property type</span>
          <div className="pr-category-list">
            {categories && categories.length > 0 ? (
              categories.map((category) => {
                const active = String(selectedCategory) === String(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`pr-category-chip ${active ? 'pr-category-chip--active' : ''}`}
                    onClick={() => onCategoryChange?.(active ? '' : category.id)}
                  >
                    {category.title}
                  </button>
                );
              })
            ) : (
              <p className="pr-filter-hint">No property types are available yet.</p>
            )}
          </div>
        </div>

        <div className="pr-filter-group">
          <label className="pr-filter-label" htmlFor="pr-filter-bedrooms">
            Minimum bedrooms
          </label>
          <select
            id="pr-filter-bedrooms"
            className="pr-filter-input"
            value={selectedBedrooms || ''}
            onChange={(event) => onBedroomsChange?.(event.target.value)}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={String(count)}>
                {count}+ bedrooms
              </option>
            ))}
          </select>
        </div>

        <div className="pr-filter-group">
          <label className="pr-filter-label" htmlFor="pr-filter-price">
            Monthly rent
          </label>
          <select
            id="pr-filter-price"
            className="pr-filter-input"
            value={selectedPriceRange || ''}
            onChange={(event) => onPriceRangeChange?.(event.target.value)}
          >
            {priceOptions.map((option) => (
              <option key={option.value || 'any'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pr-explore-sidebar__actions">
          <button type="button" className="pr-btn-primary pr-filter-submit" onClick={onRefine}>
            Apply filters
          </button>
          <button type="button" className="pr-filter-clear" onClick={onClear}>
            Clear all
          </button>
        </div>
      </aside>
    </>
  );
}
