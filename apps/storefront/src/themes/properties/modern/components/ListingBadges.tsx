'use client';

import type { PropertyDetail } from '../property-detail-types';

interface ListingBadgesProps {
  property: PropertyDetail;
}

export function ListingBadges({ property }: ListingBadgesProps) {
  const status =
    typeof property.status === 'object' && property.status !== null
      ? property.status
      : null;

  const badges: string[] = [];
  if (status?.is_featured || property.is_featured) badges.push('Featured');
  if (status?.is_new) badges.push('New listing');
  // Listing type (For rent / For sale) is shown on the hero type pill.
  if (property.rating && property.rating > 0) {
    badges.push(`${property.rating.toFixed(1)} ★`);
  }

  if (!badges.length) return null;

  return (
    <div className="pm-badges" role="list">
      {badges.map((badge) => (
        <span key={badge} className="pm-badge" role="listitem">
          {badge}
        </span>
      ))}
    </div>
  );
}
