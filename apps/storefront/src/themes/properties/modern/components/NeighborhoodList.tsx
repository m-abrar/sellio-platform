'use client';

import type { PropertyNeighborhoodItem } from '../property-detail-types';

interface NeighborhoodListProps {
  neighborhoods: PropertyNeighborhoodItem[];
}

export function NeighborhoodList({ neighborhoods }: NeighborhoodListProps) {
  if (!neighborhoods.length) {
    return (
      <section className="pm-detail-block pm-neighborhood-empty">
        <span className="structure-grid-kicker">Neighborhood</span>
        <h2 className="pm-detail-block__title">Nearby places</h2>
        <p className="pm-detail-block__copy">
          Neighborhood data is loaded from the property record. Add nearby places in the backend
          to show distances and local context here.
        </p>
      </section>
    );
  }

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Neighborhood</span>
      <h2 className="pm-detail-block__title">Nearby places</h2>
      <ul className="pm-neighborhood-list">
        {neighborhoods.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            {item.distance_miles != null && (
              <span>{item.distance_miles.toFixed(1)} mi</span>
            )}
            {item.description && <p>{item.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
