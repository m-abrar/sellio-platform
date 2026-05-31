'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useMenuContext } from '@/components/menu/MenuProvider';
import { getThemeLinkFromPathname } from '@/lib/links';
import type { ExplorePropertyCard } from '../property-utils';

interface ExplorePropertyGridProps {
  items: ExplorePropertyCard[];
  loading?: boolean;
}

export function ExplorePropertyGrid({ items, loading = false }: ExplorePropertyGridProps) {
  const pathname = usePathname();
  const { themeKey } = useMenuContext();
  const themeLink = (path: string) => getThemeLinkFromPathname(path, pathname, themeKey);

  if (loading) {
    return (
      <div className="pm-explore-grid" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="pm-explore-card-skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="pm-explore-empty" role="status">
        <span className="urban-section-kicker pm-explore-empty__kicker">No matches</span>
        <h3>No properties match your search</h3>
        <p>Try clearing filters, choosing a different location, or searching with fewer keywords.</p>
      </div>
    );
  }

  return (
    <div className="pm-explore-grid">
      {items.map((item) => (
        <article key={item.slug} className="pm-explore-card">
          <a
            className="pm-explore-card__link"
            href={themeLink(`/product/${item.slug}`)}
          >
            <div className="pm-explore-card__media">
              <img src={item.image} alt={item.title} loading="lazy" />
              <span
                className={`pm-explore-card__badge pm-explore-card__badge--${item.listingMode}`}
              >
                {item.listingLabel}
              </span>
            </div>
            <div className="pm-explore-card__body">
              <h3>{item.title}</h3>
              <p className="pm-explore-card__location">{item.location}</p>
              <p className="pm-explore-card__price">{item.price}</p>
              <ul className="pm-explore-card__stats">
                <li>
                  <span className="pm-explore-card__stat-label">Beds</span>
                  <span className="pm-explore-card__stat-value">{item.beds}</span>
                </li>
                <li>
                  <span className="pm-explore-card__stat-label">Baths</span>
                  <span className="pm-explore-card__stat-value">{item.baths}</span>
                </li>
                <li>
                  <span className="pm-explore-card__stat-label">Area</span>
                  <span className="pm-explore-card__stat-value">{item.area}</span>
                </li>
              </ul>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
