'use client';

import React from 'react';
import { useRentalThemeLink } from '../../hooks/useRentalThemeLink';
import type { RentalUnitCard } from '../../property-utils';

interface ExplorePropertyGridProps {
  items: RentalUnitCard[];
  loading?: boolean;
}

export function ExplorePropertyGrid({ items, loading = false }: ExplorePropertyGridProps) {
  const themeLink = useRentalThemeLink();

  if (loading) {
    return (
      <div className="pr-explore-grid" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="pr-explore-card-skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="pr-explore-empty" role="status">
        <span className="pr-mono pr-explore-empty__kicker">No matches</span>
        <h3>No rentals match your search</h3>
        <p>Try clearing filters, choosing a different location, or searching with fewer keywords.</p>
      </div>
    );
  }

  return (
    <div className="pr-explore-grid">
      {items.map((item) => (
        <article key={item.slug} className="pr-explore-card">
          <a className="pr-explore-card__link" href={themeLink(`/product/${item.slug}`)}>
            <div className="pr-explore-card__media">
              <img src={item.image} alt={item.title} loading="lazy" /> 
              <span className="pr-explore-card__badge">{item.type}</span>
              {item.scarcityLabel && (
                <span className="pr-explore-card__scarcity">{item.scarcityLabel}</span>
              )}
            </div>
            <div className="pr-explore-card__body">
              <h3>{item.title}</h3>
              <p className="pr-explore-card__location">{item.location}</p>
              <p className="pr-explore-card__price">
                {item.price}
                <span className="pr-explore-card__price-suffix">/mo</span>
              </p>
              <ul className="pr-explore-card__stats">
                <li>
                  <span className="pr-explore-card__stat-label">Beds</span>
                  <span className="pr-explore-card__stat-value">{item.beds}</span>
                </li>
                <li>
                  <span className="pr-explore-card__stat-label">Baths</span>
                  <span className="pr-explore-card__stat-value">{item.baths}</span>
                </li>
                <li>
                  <span className="pr-explore-card__stat-label">Area</span>
                  <span className="pr-explore-card__stat-value">{item.sqft}</span>
                </li>
              </ul>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
