'use client';

import type { PropertyNeighborhoodItem } from '../property-detail-types';

interface NeighborhoodListProps {
  neighborhoods: PropertyNeighborhoodItem[];
}

export function NeighborhoodList({ neighborhoods }: NeighborhoodListProps) {
  if (!neighborhoods.length) return null;

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
