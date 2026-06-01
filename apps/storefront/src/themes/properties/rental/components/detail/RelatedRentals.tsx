'use client';

import type { Property } from '@sellio/types';
import { useRouter } from 'next/navigation';
import { LeaseUnitCard } from '../index';
import { useRentalThemeLink } from '../../hooks/useRentalThemeLink';
import { mapPropertyToLeaseCard } from '../../property-utils';

interface RelatedRentalsProps {
  properties: Property[];
  onNavigate?: () => void;
}

export function RelatedRentals({ properties, onNavigate }: RelatedRentalsProps) {
  const router = useRouter();
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
            <LeaseUnitCard
              key={card.slug}
              {...card}
              rating={4.5 + (property.id % 5) * 0.1}
              reviews={20 + (property.id % 12) * 11}
              onClick={() => {
                onNavigate?.();
                router.push(themeLink(`/product/${card.slug}`));
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
