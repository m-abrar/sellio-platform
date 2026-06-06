'use client';

import React from 'react';
import type { ExploreFilterChip, ExploreSort } from '../explore-utils';

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
    : `${resultCount} ${resultCount === 1 ? 'property' : 'properties'}`;

  return (
    <div className="pm-explore-results-toolbar">
      <div className="pm-explore-results-toolbar__top">
        <div className="pm-explore-results-toolbar__summary">
          <span className="urban-section-kicker pm-explore-results-toolbar__kicker">Results</span>
          <h2 className="pm-explore-results-toolbar__title">{countLabel}</h2>
        </div>

        <div className="pm-explore-results-toolbar__controls">
          <button
            type="button"
            className="pm-explore-filters-toggle"
            onClick={onOpenFilters}
          >
            Filters
          </button>

          <label className="pm-explore-sort" htmlFor="pm-explore-sort">
            <span className="pm-explore-sort__label">Sort</span>
            <select
              id="pm-explore-sort"
              className="pm-explore-sort__select"
              value={sort}
              disabled={loading}
              onChange={(event) => onSortChange(event.target.value as ExploreSort)}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="pm-explore-active-filters">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="pm-explore-filter-chip"
              onClick={() => onRemoveChip(chip.id)}
              aria-label={`Remove filter: ${chip.label}`}
            >
              <span>{chip.label}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button type="button" className="pm-explore-clear-filters" onClick={onClearFilters}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
