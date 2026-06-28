'use client';

import React, { useEffect, useRef } from 'react';
import type { Category, Location } from '@sellio/types';
import type { ListingFilter } from '../listing-mode';
import { getExplorePriceRangeOptions } from '../explore-utils';

interface ExploreFiltersProps {
  categories?: Category[];
  locations?: Location[];
  selectedLocation?: string | number;
  selectedCategory?: string | number;
  selectedBedrooms?: string | number;
  selectedPriceRange?: string;
  listingFilter?: ListingFilter;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onLocationChange?: (id: string | number) => void;
  onCategoryChange?: (id: string | number) => void;
  onBedroomsChange?: (val: string) => void;
  onPriceRangeChange?: (val: string) => void;
  onListingFilterChange?: (filter: ListingFilter) => void;
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
  listingFilter = 'all',
  mobileOpen = false,
  onMobileClose,
  onLocationChange,
  onCategoryChange,
  onBedroomsChange,
  onPriceRangeChange,
  onListingFilterChange,
  onRefine,
  onClear,
}: ExploreFiltersProps) {
  const priceOptions = getExplorePriceRangeOptions(listingFilter);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (mobileOpen) {
      closeButtonRef.current?.focus();
    }
  }, [mobileOpen]);

  const listingModes: { value: ListingFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'rental', label: 'Rent' },
    { value: 'sale', label: 'Buy' },
  ];

  return (
    <>
      <button
        type="button"
        className={`pm-explore-filters-backdrop ${mobileOpen ? 'is-open' : ''}`}
        aria-label="Close filters"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onMobileClose}
      />

      <aside
        className={`pm-explore-sidebar ${mobileOpen ? 'pm-explore-sidebar--open' : ''}`}
        aria-label="Search filters"
        aria-modal={mobileOpen}
      >
        <div className="pm-explore-sidebar__header">
          <div>
            <span className="urban-section-kicker pm-explore-sidebar__kicker">Filters</span>
            <h3>Refine results</h3>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="pm-explore-sidebar__close"
            aria-label="Close filters"
            onClick={onMobileClose}
          >
            ×
          </button>
        </div>

        <div className="pm-filter-group">
          <span className="pm-filter-label">Listing type</span>
          <div className="pm-filter-pills" role="group" aria-label="Listing type">
            {listingModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                className={`pm-filter-pill ${
                  listingFilter === mode.value ? 'pm-filter-pill--active' : ''
                }`}
                onClick={() => onListingFilterChange?.(mode.value)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pm-filter-group">
          <label className="pm-filter-label" htmlFor="pm-filter-location">
            Location
          </label>
          <select
            id="pm-filter-location"
            className="pm-filter-input"
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

        <div className="pm-filter-group">
          <span className="pm-filter-label">Property type</span>
          <div className="pm-category-list">
            {categories && categories.length > 0 ? (
              categories.map((category) => {
                const active = String(selectedCategory) === String(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`pm-category-chip ${active ? 'pm-category-chip--active' : ''}`}
                    onClick={() =>
                      onCategoryChange?.(active ? '' : category.id)
                    }
                  >
                    {category.title}
                  </button>
                );
              })
            ) : (
              <p className="pm-filter-hint">No property types are available yet.</p>
            )}
          </div>
        </div>

        <div className="pm-filter-group">
          <label className="pm-filter-label" htmlFor="pm-filter-bedrooms">
            Minimum bedrooms
          </label>
          <select
            id="pm-filter-bedrooms"
            className="pm-filter-input"
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

        <div className="pm-filter-group">
          <label className="pm-filter-label" htmlFor="pm-filter-price">
            {listingFilter === 'rental'
              ? 'Nightly rate'
              : listingFilter === 'sale'
                ? 'Price'
                : 'Price or nightly rate'}
          </label>
          <select
            id="pm-filter-price"
            className="pm-filter-input"
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

        <div className="pm-explore-sidebar__actions">
          <button type="button" className="urban-btn-primary pm-filter-submit" onClick={onRefine}>
            Apply filters
          </button>
          <button type="button" className="pm-filter-clear" onClick={onClear}>
            Clear all
          </button>
        </div>
      </aside>
    </>
  );
}
