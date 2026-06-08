'use client';

import type { Amenity } from '@sellio/types';

interface AmenityGridProps {
  amenities: Amenity[];
}

export function AmenityGrid({ amenities }: AmenityGridProps) {
  if (!amenities.length) return null;

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Amenities</span>
      <h2 className="pm-detail-block__title">Property amenities</h2>
      <div className="pm-amenity-grid">
        {amenities.map((amenity) => {
          const icon = (amenity as Amenity & { icon?: string }).icon;
          return (
            <div key={amenity.id} className="pm-amenity-chip">
              {icon ? <span className="pm-amenity-chip__icon" aria-hidden="true">{icon}</span> : null}
              <span>{amenity.title}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
