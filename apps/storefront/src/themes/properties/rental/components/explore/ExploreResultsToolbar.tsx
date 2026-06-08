'use client';

import React from 'react';
import type { ExploreFilterChip, ExploreSort } from '../../explore-utils';

interface ExploreResultsToolbarProps {
  resultCount: number;
  loading?: boolean;
  sort: ExploreSort;
  chips: ExploreFilterChip[];
  onSortChange: (sort: ExploreSort) => void;
  onClearFilters: () => void;
  onRemoveChip: (chipId: string) => void;
  onOpenFilters?: () => void;
}

export function ExploreResultsToolbar({
  resultCount,
  loading = false,
  sort,
  chips,
  onSortChange,
  onClearFilters,
  onRemoveChip,
  onOpenFilters,
}: ExploreResultsToolbarProps) {
  const countLabel = loading
    ? 'Searching...'
    : `${resultCount} ${resultCount === 1 ? 'rental' : 'rentals'}`;

  return (
    <div className="pr-explore-results-toolbar">
      <div className="pr-explore-results-toolbar__top">
        <div className="pr-explore-results-toolbar__summary">
          <span className="pr-mono pr-explore-results-toolbar__kicker">Results</span>
          <h2 className="pr-explore-results-toolbar__title">{countLabel}</h2>
        </div>

        <div className="pr-explore-results-toolbar__controls">
          <button type="button" className="pr-explore-filters-toggle" onClick={onOpenFilters}>
            Filters
          </button>

          <label className="pr-explore-sort" htmlFor="pr-explore-sort">
            <span className="pr-explore-sort__label">Sort</span>
            <select
              id="pr-explore-sort"
              className="pr-explore-sort__select"
              value={sort}
              disabled={loading}
              onChange={(event) => onSortChange(event.target.value as ExploreSort)}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Rent: low to high</option>
              <option value="price-desc">Rent: high to low</option>
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="pr-explore-active-filters">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="pr-explore-filter-chip"
              onClick={() => onRemoveChip(chip.id)}
              aria-label={`Remove filter: ${chip.label}`}
            >
              <span>{chip.label}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button type="button" className="pr-explore-clear-filters" onClick={onClearFilters}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
