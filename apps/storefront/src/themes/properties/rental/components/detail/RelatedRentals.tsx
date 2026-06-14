'use client';

import type { Property } from '@sellio/types';
import { LeaseUnitCard } from '../index';
import { useRentalThemeLink } from '../../hooks/useRentalThemeLink';
import { mapPropertyToLeaseCard } from '../../property-utils';

interface RelatedRentalsProps {
  properties: Property[];
  onNavigate?: () => void;
}

export function RelatedRentals({ properties, onNavigate }: RelatedRentalsProps) {
  const themeLink = useRentalThemeLink();

  if (!properties.length) return null;

  return (
    <section className="pr-grid-section pr-related-section">
      <h2 className="pr-section-title">Similar rentals</h2>
      <p className="pr-section-lead">Other homes you may want to compare before applying.</p>
      <div className="pr-rent-grid">
        {properties.map((property, index) => {
          const card = mapPropertyToLeaseCard(property, index);
          return (
            <a key={card.slug} href={themeLink(`/product/${card.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={onNavigate}>
              <LeaseUnitCard
                {...card}
                rating={4.5 + (property.id % 5) * 0.1}
                reviews={20 + (property.id % 12) * 11}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
